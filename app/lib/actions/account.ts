"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { requireUser } from "@/app/lib/auth/dal";

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
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
