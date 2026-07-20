import "server-only";
import { createAdminClient } from "../supabase/admin";
import { Subscriber } from "../types";

export async function adminListSubscribers(): Promise<Subscriber[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, first_name, email, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function adminGetSubscriber(id: string): Promise<Subscriber | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, first_name, email, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function adminCreateSubscriber(input: {
  first_name: string;
  email: string;
}): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").insert(input);
  if (error) throw error;
}

export async function adminUpdateSubscriber(
  id: string,
  input: { first_name: string; email: string },
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").update(input).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteSubscriber(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
  if (error) throw error;
}
