import "server-only";
import { createClient } from "@supabase/supabase-js";

// Anon-key client with no cookie/session handling, for the public,
// unauthenticated reads in supplements.ts / featuredStacks.ts that get
// wrapped in unstable_cache. Those reads don't depend on who's signed in
// (RLS just checks is_active), and avoiding cookies() here is what makes
// them cacheable — unstable_cache can't see request-time APIs like cookies().
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
