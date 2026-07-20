import "server-only";
import { createAdminClient } from "../supabase/admin";
import { Supplement } from "../types";

export async function adminListSupplements(): Promise<Supplement[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("supplements")
    .select("key, name, emoji, why, timing, dose, tags")
    .order("name");

  if (error) throw error;
  return data;
}

export async function adminGetSupplement(key: string): Promise<Supplement | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("supplements")
    .select("key, name, emoji, why, timing, dose, tags")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function adminCreateSupplement(input: Supplement): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("supplements").insert(input);
  if (error) throw error;
}

export async function adminUpdateSupplement(
  key: string,
  input: Omit<Supplement, "key">,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("supplements").update(input).eq("key", key);
  if (error) throw error;
}

export async function adminDeleteSupplement(key: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("supplements").delete().eq("key", key);
  if (error) throw error;
}
