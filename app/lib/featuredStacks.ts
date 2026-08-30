import { createClient } from "./supabase/server";
import { Supplement } from "./types";

export interface FeaturedStack {
  key: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

const STACK_COLUMNS = "key,name,emoji,tagline,description,sort_order,is_active";

export async function getFeaturedStacks(): Promise<FeaturedStack[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("featured_stacks")
    .select(STACK_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load featured stacks: ${error.message}`);
  return (data ?? []) as FeaturedStack[];
}

export async function getFeaturedStack(key: string): Promise<FeaturedStack | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("featured_stacks")
    .select(STACK_COLUMNS)
    .eq("key", key)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load featured stack "${key}": ${error.message}`);
  return (data as FeaturedStack | null) ?? undefined;
}

// Ordered supplement keys for a stack, per featured_stack_items.sort_order.
export async function getFeaturedStackSupplementKeys(key: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("featured_stack_items")
    .select("supplement_key")
    .eq("stack_key", key)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load items for stack "${key}": ${error.message}`);
  return ((data ?? []) as { supplement_key: string }[]).map((row) => row.supplement_key);
}

// Resolves a stack's ordered supplement keys against the full supplement
// list (already fetched elsewhere), the same cross-reference pattern
// optimizeContent.ts uses for topic pages — mirrored here by key instead of
// by name.
export function resolveStackSupplements(supplements: Supplement[], keys: string[]): Supplement[] {
  return keys
    .map((key) => supplements.find((s) => s.key === key))
    .filter((s): s is Supplement => Boolean(s));
}
