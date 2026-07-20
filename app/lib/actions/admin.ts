"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminCreateSupplement,
  adminUpdateSupplement,
  adminDeleteSupplement,
} from "../admin/supplements";
import {
  adminCreateSubscriber,
  adminUpdateSubscriber,
  adminDeleteSubscriber,
} from "../admin/subscribers";

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function slugifyKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "23505";
}

export async function createSupplementAction(formData: FormData) {
  const key = slugifyKey(field(formData, "key"));
  const name = field(formData, "name");
  const emoji = field(formData, "emoji");
  const why = field(formData, "why");
  const timing = field(formData, "timing");
  const dose = field(formData, "dose");
  const tags = parseTags(field(formData, "tags"));

  if (!key || !name || !emoji || !why || !timing || !dose) {
    redirect(`/admin/supplements/new?error=${encodeURIComponent("All fields except tags are required.")}`);
  }

  try {
    await adminCreateSupplement({ key, name, emoji, why, timing, dose, tags });
  } catch (err) {
    const message = isUniqueViolation(err)
      ? `A supplement with the key "${key}" already exists.`
      : "Something went wrong creating the supplement.";
    redirect(`/admin/supplements/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/supplements");
  revalidatePath("/supplements");
  redirect("/admin/supplements");
}

export async function updateSupplementAction(formData: FormData) {
  const key = field(formData, "key");
  const name = field(formData, "name");
  const emoji = field(formData, "emoji");
  const why = field(formData, "why");
  const timing = field(formData, "timing");
  const dose = field(formData, "dose");
  const tags = parseTags(field(formData, "tags"));

  if (!name || !emoji || !why || !timing || !dose) {
    redirect(`/admin/supplements/${key}?error=${encodeURIComponent("All fields except tags are required.")}`);
  }

  try {
    await adminUpdateSupplement(key, { name, emoji, why, timing, dose, tags });
  } catch {
    redirect(`/admin/supplements/${key}?error=${encodeURIComponent("Something went wrong saving changes.")}`);
  }

  revalidatePath("/admin/supplements");
  revalidatePath("/supplements");
  revalidatePath(`/supplements/${key}`);
  revalidatePath("/");
  redirect("/admin/supplements");
}

export async function deleteSupplementAction(formData: FormData) {
  const key = field(formData, "key");

  await adminDeleteSupplement(key);

  revalidatePath("/admin/supplements");
  revalidatePath("/supplements");
  revalidatePath("/");
  redirect("/admin/supplements");
}

export async function createSubscriberAction(formData: FormData) {
  const firstName = field(formData, "firstName");
  const email = field(formData, "email");

  if (!firstName || !email) {
    redirect(`/admin/subscribers/new?error=${encodeURIComponent("First name and email are required.")}`);
  }

  try {
    await adminCreateSubscriber({ first_name: firstName, email });
  } catch (err) {
    const message = isUniqueViolation(err)
      ? `A subscriber with the email "${email}" already exists.`
      : "Something went wrong creating the subscriber.";
    redirect(`/admin/subscribers/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/subscribers");
  redirect("/admin/subscribers");
}

export async function updateSubscriberAction(formData: FormData) {
  const id = field(formData, "id");
  const firstName = field(formData, "firstName");
  const email = field(formData, "email");

  if (!firstName || !email) {
    redirect(`/admin/subscribers/${id}?error=${encodeURIComponent("First name and email are required.")}`);
  }

  try {
    await adminUpdateSubscriber(id, { first_name: firstName, email });
  } catch (err) {
    const message = isUniqueViolation(err)
      ? `A subscriber with the email "${email}" already exists.`
      : "Something went wrong saving changes.";
    redirect(`/admin/subscribers/${id}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/subscribers");
  redirect("/admin/subscribers");
}

export async function deleteSubscriberAction(formData: FormData) {
  const id = field(formData, "id");

  await adminDeleteSubscriber(id);

  revalidatePath("/admin/subscribers");
  redirect("/admin/subscribers");
}
