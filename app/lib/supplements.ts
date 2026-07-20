import { createClient } from "./supabase/server";
import { Supplement } from "./types";

export async function getSupplements(): Promise<Supplement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("supplements")
    .select("key, name, emoji, why, timing, dose, tags");

  if (error) throw error;

  return data;
}

export async function getSupplement(key: string): Promise<Supplement | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("supplements")
    .select("key, name, emoji, why, timing, dose, tags")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;

  return data;
}
