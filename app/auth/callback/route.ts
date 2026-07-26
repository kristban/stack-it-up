import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

// Supabase redirects here after Google auth with a one-time ?code. We exchange
// it for a session (which sets the auth cookies) and forward the user on.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/";
  // Only allow same-origin relative redirects.
  const next = nextParam.startsWith("/") ? nextParam : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Sign-in failed. Please try again.")}`,
  );
}
