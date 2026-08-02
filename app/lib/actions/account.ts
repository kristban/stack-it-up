"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { requireUser } from "@/app/lib/auth/dal";
import { isAvatarEmoji } from "@/app/lib/avatarEmojis";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function avatarError(message: string): never {
  redirect(`/account?error=${encodeURIComponent(message)}`);
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const firstName = field(formData, "firstName");
  const lastName = field(formData, "lastName");

  const supabase = await createClient();
  // RLS + column grants ensure the user can only touch their own name fields.
  const { error } = await supabase
    .from("profiles")
    .update({ first_name: firstName || null, last_name: lastName || null })
    .eq("id", user.id);

  if (error) {
    redirect(`/account?error=${encodeURIComponent("Couldn't save your name. Please try again.")}`);
  }

  revalidatePath("/account");
  redirect("/account?updated=profile");
}

export async function updateAvatarEmojiAction(formData: FormData) {
  const user = await requireUser();
  const emoji = field(formData, "emoji");

  if (!isAvatarEmoji(emoji)) {
    avatarError("That emoji isn't one of the available choices.");
  }

  const supabase = await createClient();
  // Choosing an emoji clears any uploaded photo so the current avatar is unambiguous.
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_emoji: emoji, avatar_url: null })
    .eq("id", user.id);

  if (error) {
    avatarError("Couldn't save your avatar. Please try again.");
  }

  revalidatePath("/account");
  revalidatePath("/", "layout");
  redirect("/account?updated=avatar");
}

export async function uploadAvatarAction(formData: FormData) {
  const user = await requireUser();
  const file = formData.get("avatar");

  if (!(file instanceof File) || file.size === 0) {
    avatarError("Please choose an image to upload.");
  }
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    avatarError("Please upload a PNG, JPEG, WebP, or GIF image.");
  }
  if (file.size > MAX_AVATAR_BYTES) {
    avatarError("That image is over 2 MB. Please choose a smaller one.");
  }

  const supabase = await createClient();
  // Stable per-user path + upsert, so a new upload overwrites the old file
  // (no orphaned objects). Storage RLS scopes writes to the user's own folder.
  const path = `${user.id}/avatar`;
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    avatarError("Couldn't upload your photo. Please try again.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  // Cache-bust so the overwritten file shows immediately instead of a stale copy.
  const versionedUrl = `${publicUrl}?v=${Date.now()}`;

  // Uploading a photo clears any chosen emoji.
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: versionedUrl, avatar_emoji: null })
    .eq("id", user.id);

  if (error) {
    avatarError("Couldn't save your photo. Please try again.");
  }

  revalidatePath("/account");
  revalidatePath("/", "layout");
  redirect("/account?updated=avatar");
}

export async function removeAvatarAction() {
  const user = await requireUser();
  const supabase = await createClient();

  // Remove the stored file (ignore errors — it may be an emoji-only avatar).
  await supabase.storage.from(AVATAR_BUCKET).remove([`${user.id}/avatar`]);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null, avatar_emoji: null })
    .eq("id", user.id);

  if (error) {
    avatarError("Couldn't remove your avatar. Please try again.");
  }

  revalidatePath("/account");
  revalidatePath("/", "layout");
  redirect("/account?updated=avatar");
}

export async function updateEmailAction(formData: FormData) {
  const user = await requireUser();
  const email = field(formData, "email");

  if (!email) {
    redirect(`/account?error=${encodeURIComponent("Please enter an email address.")}`);
  }
  if (email === user.email) {
    redirect(`/account?error=${encodeURIComponent("That's already your email address.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    redirect(`/account?error=${encodeURIComponent("Couldn't update your email. Please try again.")}`);
  }

  // Supabase sends a confirmation link; the change only takes effect once confirmed.
  redirect("/account?updated=email");
}
