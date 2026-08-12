import "server-only";
import { createClient } from "./supabase/server";
import { getCurrentUser } from "./auth/dal";
import { getSupplements } from "./supplements";
import { Supplement } from "./types";

export interface UserStacks {
  favorites: Supplement[];
  morning: Supplement[];
  evening: Supplement[];
}

const EMPTY: UserStacks = { favorites: [], morning: [], evening: [] };

// The current user's favorites + morning/evening stacks, resolved to full
// Supplement objects for display on /account. Rows store only the supplement
// key; we map them against the (small) supplement library in JS rather than
// leaning on a PostgREST embedded join. RLS scopes every row to the owner.
export async function getUserStacks(): Promise<UserStacks> {
  const user = await getCurrentUser();
  if (!user) return EMPTY;

  const supabase = await createClient();

  const [favResult, stackResult, supplements] = await Promise.all([
    supabase
      .from("favorites")
      .select("supplement_key")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("stack_items")
      .select("slot, supplement_key")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    getSupplements(),
  ]);

  if (favResult.error || stackResult.error) return EMPTY;

  const byKey = new Map(supplements.map((s) => [s.key, s]));
  // Resolve keys to supplements in stored order, dropping any that no longer
  // exist (defensive — the FK cascade should already keep these in sync).
  const resolve = (keys: string[]): Supplement[] =>
    keys.map((key) => byKey.get(key)).filter((s): s is Supplement => Boolean(s));

  const favorites = resolve((favResult.data ?? []).map((r) => r.supplement_key));
  const morning = resolve(
    (stackResult.data ?? []).filter((r) => r.slot === "morning").map((r) => r.supplement_key),
  );
  const evening = resolve(
    (stackResult.data ?? []).filter((r) => r.slot === "evening").map((r) => r.supplement_key),
  );

  return { favorites, morning, evening };
}
