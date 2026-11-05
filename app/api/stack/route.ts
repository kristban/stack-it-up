import { NextRequest, NextResponse } from "next/server";
import { getSupplements } from "@/app/lib/supplements";
import { buildStackPrompt, buildStackSchema, sanitizeAnswers } from "@/app/lib/stackPrompt";
import { generateStructured, GeminiError } from "@/app/lib/gemini";
import { generateStack, budgetLimit, LIFE_STAGE_SUPPRESS, NUTRIENT_GROUP } from "@/app/lib/engine";
import { Supplement } from "@/app/lib/types";
import { attachVisitorCookie, checkAiRateLimit } from "@/app/lib/aiRateLimit";

const GEMINI_TIMEOUT_MS = 30_000;

const GENERIC_MESSAGE = "Something went wrong — please try again.";

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

// Logged for us only — never sent to the client — so we can tell a quota
// exhaustion apart from a genuine bug without exposing either to visitors.
function describeFailure(err: unknown): string {
  if (err instanceof GeminiError) return `Gemini API error ${err.status}`;
  if (err instanceof Error && err.name === "AbortError") return `Gemini request timed out after ${GEMINI_TIMEOUT_MS}ms`;
  return "Unknown error";
}

async function generateWithGemini(
  answers: ReturnType<typeof sanitizeAnswers>,
  supplements: Supplement[],
): Promise<Supplement[]> {
  const validKeys = supplements.map((s) => s.key);
  const prompt = buildStackPrompt(answers, supplements);
  const schema = buildStackSchema(validKeys);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  let result: { keys?: unknown };
  try {
    result = (await generateStructured(prompt, schema, controller.signal)) as { keys?: unknown };
  } finally {
    clearTimeout(timeout);
  }

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

  return applySafetyFilters(hydrated, answers);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const answers = sanitizeAnswers(body?.answers);

  if (Object.keys(answers).length === 0) {
    return NextResponse.json(
      { error: "invalid_request", message: "Invalid request." },
      { status: 400 },
    );
  }

  let supplements: Supplement[];
  try {
    supplements = await getSupplements();
  } catch (err) {
    // No catalog means no stack at all — rule-based or AI — so this is the
    // one genuine dead end, surfaced as an error rather than a silent fallback.
    console.error("Could not load the supplement catalog:", err);
    return NextResponse.json(
      { error: "generation_failed", message: GENERIC_MESSAGE },
      { status: 502 },
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set — serving the rule-based stack instead");
    return NextResponse.json({ stack: generateStack(answers, supplements), aiGenerated: false });
  }

  const rateLimit = await checkAiRateLimit(req, "quiz");
  // Every response that reached this point carries the (possibly newly
  // created) visitor cookie, so the rate limit keeps tracking the same
  // visitor on their next request.
  const respond = (responseBody: Record<string, unknown>, status = 200) => {
    const res = NextResponse.json(responseBody, { status });
    attachVisitorCookie(res, rateLimit.visitorId, rateLimit.isNewVisitor);
    return res;
  };

  if (!rateLimit.allowed) {
    // Rate-limited: same UX as any other Gemini failure — the visitor still
    // gets a result, just the deterministic one, marked as such, never a
    // block message.
    console.warn(`Quiz AI rate limit hit (${rateLimit.reason}) — serving the rule-based stack instead`);
    return respond({ stack: generateStack(answers, supplements), aiGenerated: false });
  }

  try {
    const stack = await generateWithGemini(answers, supplements);
    return respond({ stack, aiGenerated: true });
  } catch (err) {
    // The AI pick failed or timed out — the visitor still gets a result,
    // just the deterministic one; the client marks it as non-AI so it's
    // never presented as something it isn't.
    console.error(`Gemini stack generation failed (${describeFailure(err)}), falling back to the rule-based stack:`, err);
    return respond({ stack: generateStack(answers, supplements), aiGenerated: false });
  }
}
