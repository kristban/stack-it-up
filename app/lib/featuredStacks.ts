import { unstable_cache } from "next/cache";
import { createPublicClient } from "./supabase/public";
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

// Cached: same reasoning as getSupplements in lib/supplements.ts. These
// tables have no admin UI (edited directly in Supabase), so there's no
// on-demand revalidateTag trigger — the time-based revalidate is the only
// invalidation path, so edits take up to that long to appear publicly.
export const getFeaturedStacks = unstable_cache(
  async (): Promise<FeaturedStack[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("featured_stacks")
      .select(STACK_COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to load featured stacks: ${error.message}`);
    return (data ?? []) as FeaturedStack[];
  },
  ["featured-stacks"],
  { tags: ["featured-stacks"], revalidate: 300 },
);

export const getFeaturedStack = unstable_cache(
  async (key: string): Promise<FeaturedStack | undefined> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("featured_stacks")
      .select(STACK_COLUMNS)
      .eq("key", key)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw new Error(`Failed to load featured stack "${key}": ${error.message}`);
    return (data as FeaturedStack | null) ?? undefined;
  },
  ["featured-stack"],
  { tags: ["featured-stacks"], revalidate: 300 },
);

// Ordered supplement keys for a stack, per featured_stack_items.sort_order.
export const getFeaturedStackSupplementKeys = unstable_cache(
  async (key: string): Promise<string[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("featured_stack_items")
      .select("supplement_key")
      .eq("stack_key", key)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to load items for stack "${key}": ${error.message}`);
    return ((data ?? []) as { supplement_key: string }[]).map((row) => row.supplement_key);
  },
  ["featured-stack-items"],
  { tags: ["featured-stacks"], revalidate: 300 },
);

// Resolves a stack's ordered supplement keys against the full supplement
// list (already fetched elsewhere), the same cross-reference pattern
// optimizeContent.ts uses for topic pages — mirrored here by key instead of
// by name.
export function resolveStackSupplements(supplements: Supplement[], keys: string[]): Supplement[] {
  return keys
    .map((key) => supplements.find((s) => s.key === key))
    .filter((s): s is Supplement => Boolean(s));
}
