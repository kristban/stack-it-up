import { unstable_cache } from "next/cache";
import { createPublicClient } from "./supabase/public";
import { Supplement } from "./types";

// Every column the app renders. Kept as one constant so the public reads and the
// admin reads stay in sync as the schema grows.
export const SUPPLEMENT_COLUMNS =
  "key, name, emoji, why, timing, dose, tags, category, evidence, warnings, sort_order, is_active";

// Cached: this is the same public library data for every anonymous visitor,
// so there's no reason to hit Supabase on every request. Invalidated
// on-demand by revalidateTag("supplements") in lib/actions/admin.ts, with a
// time-based revalidation as a fallback.
export const getSupplements = unstable_cache(
  async (): Promise<Supplement[]> => {
    const supabase = createPublicClient();
    // Public library: hide soft-hidden rows and present them in curated order.
    const { data, error } = await supabase
      .from("supplements")
      .select(SUPPLEMENT_COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    return data as Supplement[];
  },
  ["supplements"],
  { tags: ["supplements"], revalidate: 300 },
);

export const getSupplement = unstable_cache(
  async (key: string): Promise<Supplement | null> => {
    const supabase = createPublicClient();
    // A soft-hidden supplement should 404 publicly, so filter is_active here too.
    const { data, error } = await supabase
      .from("supplements")
      .select(SUPPLEMENT_COLUMNS)
      .eq("key", key)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;

    return data as Supplement | null;
  },
  ["supplement"],
  { tags: ["supplements"], revalidate: 300 },
);
