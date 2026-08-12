import { createClient } from "./supabase/server";
import { Supplement } from "./types";

// Every column the app renders. Kept as one constant so the public reads and the
// admin reads stay in sync as the schema grows.
export const SUPPLEMENT_COLUMNS =
  "key, name, emoji, why, timing, dose, tags, category, evidence, warnings, sort_order, is_active";

export async function getSupplements(): Promise<Supplement[]> {
  const supabase = await createClient();
  // Public library: hide soft-hidden rows and present them in curated order.
  const { data, error } = await supabase
    .from("supplements")
    .select(SUPPLEMENT_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;

  return data as Supplement[];
}

export async function getSupplement(key: string): Promise<Supplement | null> {
  const supabase = await createClient();
  // A soft-hidden supplement should 404 publicly, so filter is_active here too.
  const { data, error } = await supabase
    .from("supplements")
    .select(SUPPLEMENT_COLUMNS)
    .eq("key", key)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;

  return data as Supplement | null;
}
