import "server-only";
import { createAdminClient } from "../supabase/admin";
import { requireAdmin } from "../auth/dal";
import { Supplement } from "../types";
import { SUPPLEMENT_COLUMNS } from "../supplements";

export async function adminListSupplements(): Promise<Supplement[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  // Admins manage hidden supplements too, so do NOT filter is_active here.
  const { data, error } = await supabase
    .from("supplements")
    .select(SUPPLEMENT_COLUMNS)
    .order("category")
    .order("sort_order")
    .order("name");

  if (error) throw error;
  return data as Supplement[];
}

export async function adminGetSupplement(key: string): Promise<Supplement | null> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("supplements")
    .select(SUPPLEMENT_COLUMNS)
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return data as Supplement | null;
}

export async function adminCreateSupplement(input: Supplement): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("supplements").insert(input);
  if (error) throw error;
}

export async function adminUpdateSupplement(
  key: string,
  input: Omit<Supplement, "key">,
): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("supplements").update(input).eq("key", key);
  if (error) throw error;
}

// Soft-hide / restore. Preferred over delete: favorites and stack_items
// reference supplements(key), so a hard delete would cascade and wipe users'
// saved items. Hiding keeps the row (and those references) intact.
export async function adminSetSupplementActive(key: string, isActive: boolean): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("supplements")
    .update({ is_active: isActive })
    .eq("key", key);
  if (error) throw error;
}
