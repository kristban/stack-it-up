"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/app/lib/supabase/server";

export async function signInWithGoogle(formData: FormData) {
  const nextParam = String(formData.get("next") ?? "/") || "/";
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextParam)}`,
    },
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent("Could not start Google sign-in. Please try again.")}`);
  }

  // Hand off to Google's consent screen.
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
