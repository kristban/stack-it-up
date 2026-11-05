import "server-only";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";

export type AiFeature = "chat" | "quiz";

// Starting points for a low-traffic site — tune freely, nothing else depends
// on these values. "visitor" limits are the real per-visitor budget (keyed on
// the anon cookie below); "ipDay" is a looser backstop that only kicks in for
// someone clearly hammering one IP (cookie-clearing, shared-IP abuse);
// "globalDay" is a circuit breaker on total spend regardless of how many
// distinct visitors/IPs show up (e.g. a botnet rotating IPs).
const LIMITS: Record<AiFeature, { visitorHour: number; visitorDay: number; ipDay: number; globalDay: number }> = {
  chat: { visitorHour: 20, visitorDay: 60, ipDay: 200, globalDay: 1500 },
  quiz: { visitorHour: 8, visitorDay: 20, ipDay: 80, globalDay: 500 },
};

const VISITOR_COOKIE = "siu_vid";
const VISITOR_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

export function getVisitorId(req: NextRequest): { id: string; isNew: boolean } {
  const existing = req.cookies.get(VISITOR_COOKIE)?.value;
  if (existing) return { id: existing, isNew: false };
  return { id: randomUUID(), isNew: true };
}

export function attachVisitorCookie(res: NextResponse, id: string, isNew: boolean): void {
  if (!isNew) return;
  res.cookies.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: VISITOR_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
}

export function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// Atomically increments the visitor-hour, visitor-day, ip-backstop-day, and
// global-day counters in Supabase (one round trip, race-free — see the
// rl_check_and_increment migration) and reports whether this request is
// still under every one of those limits. Checked server-side before any
// Gemini call so a limited visitor never reaches the paid API.
export async function checkAiRateLimit(
  req: NextRequest,
  feature: AiFeature,
): Promise<{ allowed: boolean; visitorId: string; isNewVisitor: boolean; reason?: string }> {
  const { id: visitorId, isNew: isNewVisitor } = getVisitorId(req);
  const ip = getClientIp(req);
  const limits = LIMITS[feature];

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("rl_check_and_increment", {
    p_visitor_key: visitorId,
    p_ip_key: ip,
    p_feature: feature,
    p_now: new Date().toISOString(),
    p_visitor_hour_limit: limits.visitorHour,
    p_visitor_day_limit: limits.visitorDay,
    p_ip_day_limit: limits.ipDay,
    p_global_day_limit: limits.globalDay,
  });

  if (error) {
    // Fail closed: the whole point of this check is bill protection, so a
    // transient Supabase error should block the Gemini call rather than let
    // it through unchecked. Logged loudly so a real outage is visible rather
    // than silently degrading every request to the rule-based fallback.
    console.error(`AI rate limit check failed (${feature}), failing closed:`, error);
    return { allowed: false, visitorId, isNewVisitor, reason: "rate_limit_check_failed" };
  }

  const result = data?.[0] as { allowed: boolean; reason: string | null } | undefined;
  return { allowed: result?.allowed ?? false, visitorId, isNewVisitor, reason: result?.reason ?? undefined };
}
