import type { NextRequest } from "next/server";
import { updateSession } from "@/app/lib/supabase/proxy";

// Next.js 16 renamed Middleware to Proxy. This refreshes the Supabase auth
// session cookie on every matched request and gates /admin and /account.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on everything except Next internals and static asset files. Notably it
  // DOES run on /auth/callback so the session cookie is refreshed there too.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
