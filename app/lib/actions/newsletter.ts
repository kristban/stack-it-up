"use server";

import { createClient } from "@/app/lib/supabase/server";

export async function subscribeToNewsletter(formData: FormData) {
  const firstName = formData.get("firstName");
  const email = formData.get("email");

  if (typeof firstName !== "string" || typeof email !== "string" || !firstName || !email) {
    return { error: "Please fill in both fields." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ first_name: firstName, email });

  if (error) {
    if (error.code === "23505") {
      return { error: "You're already subscribed with that email." };
    }
    return { error: "Something went wrong. Please try again." };
  }

  return { error: null };
}
