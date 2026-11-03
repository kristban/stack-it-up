import { NextRequest, NextResponse } from "next/server";
import { getSupplements } from "@/app/lib/supplements";
import { buildStackPrompt, buildStackSchema, sanitizeAnswers } from "@/app/lib/stackPrompt";
import { generateStructured, GeminiError } from "@/app/lib/gemini";
import { budgetLimit, LIFE_STAGE_SUPPRESS, NUTRIENT_GROUP } from "@/app/lib/engine";
import { Supplement } from "@/app/lib/types";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;

const QUOTA_MESSAGE = "We've reached today's free AI limit — please try again tomorrow.";
const GENERIC_MESSAGE = "Something went wrong — please try again.";

// Per-IP sliding window, held in memory — same simple pattern as /api/chat;
// good enough to blunt a single abusive visitor on this low-traffic site.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

// Deterministic safety net applied on top of whatever Gemini picked, so the
// pregnancy-contraindication list and the zinc-overlap ceiling are guaranteed
// regardless of how well the model followed the prompt's guidance.
function applySafetyFilters(stack: Supplement[], answers: ReturnType<typeof sanitizeAnswers>): Supplement[] {
  const budget = answers.budget?.[0] ?? "mid";
  const lifeStage = answers.life_stage?.[0] ?? "none";
  const suppressed = new Set(LIFE_STAGE_SUPPRESS[lifeStage] ?? []);
  const limit = budgetLimit(budget);

  const seenNutrientGroups = new Set<string>();
  const result: Supplement[] = [];
  for (const supp of stack) {
    if (result.length >= limit) break;
    if (suppressed.has(supp.key)) continue;
    const group = NUTRIENT_GROUP[supp.key];
    if (group) {
      if (seenNutrientGroups.has(group)) continue;
      seenNutrientGroups.add(group);
    }
    result.push(supp);
  }
  return result;
}

// Never leak the underlying Gemini error (status text, response body, key
// hints) to the client — log it here for us, and hand the visitor only a
// safe, friendly message plus an error code the UI can branch on.
function failureResponse(err: unknown) {
  console.error("Stack generation failed:", err);
  if (err instanceof GeminiError && err.status === 429) {
    return NextResponse.json(
      { error: "quota_exceeded", message: QUOTA_MESSAGE },
      { status: 429 },
    );
  }
  return NextResponse.json(
    { error: "generation_failed", message: GENERIC_MESSAGE },
    { status: 502 },
  );
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: "too_many_requests",
        message: "Too many requests — please wait a minute and try again.",
      },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const answers = sanitizeAnswers(body?.answers);

  if (Object.keys(answers).length === 0) {
    return NextResponse.json(
      { error: "invalid_request", message: "Invalid request." },
      { status: 400 },
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return failureResponse(new Error("GEMINI_API_KEY is not set"));
  }

  try {
    const supplements = await getSupplements();
    const validKeys = supplements.map((s) => s.key);
    const prompt = buildStackPrompt(answers, supplements);
    const schema = buildStackSchema(validKeys);
    const result = (await generateStructured(prompt, schema)) as { keys?: unknown };

    if (!Array.isArray(result?.keys) || result.keys.length === 0) {
      throw new Error("Gemini returned no keys");
    }

    const byKey = new Map(supplements.map((s) => [s.key, s]));
    const hydrated = result.keys
      .filter((k): k is string => typeof k === "string" && byKey.has(k))
      .map((k) => byKey.get(k) as Supplement);

    if (hydrated.length === 0) {
      throw new Error("Gemini returned no valid keys");
    }

    const stack = applySafetyFilters(hydrated, answers);
    return NextResponse.json({ stack });
  } catch (err) {
    return failureResponse(err);
  }
}
