import "server-only";
import { questions } from "./questions";
import { Answers, Supplement } from "./types";

// Keeps the request body honest: only known question ids and known option ids
// make it into the prompt, so a hand-crafted API call can't inject arbitrary
// text into Gemini's context by abusing the answers payload.
export function sanitizeAnswers(raw: unknown): Answers {
  const clean: Answers = {};
  if (typeof raw !== "object" || raw === null) return clean;
  const input = raw as Record<string, unknown>;

  for (const q of questions) {
    const value = input[q.id];
    if (!Array.isArray(value)) continue;
    const validIds = new Set(q.options.map((o) => o.id));
    const picked = value.filter((v): v is string => typeof v === "string" && validIds.has(v));
    if (picked.length > 0) clean[q.id] = picked;
  }

  return clean;
}

function describeAnswers(answers: Answers): string {
  return questions
    .map((q) => {
      const picked = answers[q.id] ?? [];
      if (picked.length === 0) return null;
      const labels = picked
        .map((id) => q.options.find((o) => o.id === id)?.label ?? id)
        .join(", ");
      return `${q.question} ${labels}`;
    })
    .filter((line): line is string => line !== null)
    .join("\n");
}

function buildCatalogReference(supplements: Supplement[]): string {
  return supplements
    .map((s) => {
      const warning = s.warnings ? ` Warnings: ${s.warnings}` : "";
      return `- key="${s.key}" ${s.name} (${s.category}, tags: ${s.tags.join(", ")}): ${s.why} Timing: ${s.timing}. Dose: ${s.dose}.${warning}`;
    })
    .join("\n");
}

export function buildStackPrompt(answers: Answers, supplements: Supplement[]): string {
  const budget = answers.budget?.[0] ?? "mid";
  const diet = answers.diet?.[0] ?? "omnivore";
  const lifeStage = answers.life_stage?.[0] ?? "none";

  return `You are choosing a personalized daily supplement stack for a visitor on StackItUp, a site that builds routines from a short quiz. Pick supplements ONLY from the catalog below, by their exact "key" — never invent a supplement or a key that isn't listed.

Visitor's answers:
${describeAnswers(answers)}

Guidance (apply these as hard rules, not suggestions):
- Budget tiers cap the stack size: "low" = at most 3 items, "mid" = at most 6, "high" = at most 10. This visitor's budget tier is "${budget}".
- Vitamin D3 and Omega-3 are generally good foundational picks for most people, unless diet or another rule below says otherwise.
- If diet is vegan or vegetarian: do not include fish-oil omega-3 (key "omega3") — use algal oil (key "algal_oil") instead, and include B12 (key "b12").
- If diet is vegan: do not include whey protein (key "protein").
- If life stage is "pregnancy, trying to conceive, or postpartum": strongly prefer including folate, iodine, and algal_oil; never include berberine, saffron, ashwagandha, rhodiola, melatonin, or fish-oil omega-3 (key "omega3") — these are contraindicated or unstudied in pregnancy.
- If life stage is "over 65": strongly prefer including calcium, b12, and creatine.
- If life stage is "regular periods or perimenopause": strongly prefer including inositol. Iron can be included too, but only ever as a "get a ferritin test first" suggestion, never as a certainty.
- Never include more than one supplement that supplies zinc (e.g. a multivitamin, a zinc/magnesium combo, and a zinc lozenge all count as zinc sources) — pick at most one.
- Order the result from most important/foundational to most situational — the UI numbers and displays them in the order you return.

Supplement catalog (the only valid keys):
${buildCatalogReference(supplements)}

Diet: ${diet}. Life stage: ${lifeStage}.

Return the chosen supplements as an ordered list of their "key" values.`;
}

export function buildStackSchema(validKeys: string[]): Record<string, unknown> {
  return {
    type: "object",
    properties: {
      keys: {
        type: "array",
        items: { type: "string", enum: validKeys },
      },
    },
    required: ["keys"],
  };
}
