import { Answers, Supplement } from "./types";

// Life-stage screening (the "life_stage" question) adjusts the stack beyond
// normal tag scoring: some supplements are actively unsuitable for pregnancy,
// and some needs (folate, calcium) are specific enough that ordinary tag
// matching would never surface them.
const LIFE_STAGE_FORCE_INCLUDE: Record<string, string[]> = {
  pregnancy: ["folate", "iodine", "algal_oil"],
  over_65: ["calcium", "b12", "creatine"],
  menstrual: ["inositol"],
};

const LIFE_STAGE_SUPPRESS: Record<string, string[]> = {
  // Suppressed in pregnancy: contraindicated or insufficiently studied adaptogens/herbs,
  // plus fish-oil omega-3 (algal oil is force-included above as the mercury-free source).
  pregnancy: ["berberine", "saffron", "ashwagandha", "rhodiola", "melatonin", "omega3"],
};

const LIFE_STAGE_BOOST: Record<string, string[]> = {
  // Higher iron needs from menstrual blood loss — boosted, not forced, since
  // iron should only ever be a "get tested" suggestion, never an automatic add.
  menstrual: ["iron"],
};

// Supplements that supply enough of the same nutrient that stacking more than
// one risks exceeding a safe daily ceiling (e.g. a multivitamin plus ZMA plus
// zinc lozenges can together clear the 40mg/day zinc upper limit). Only one
// supplement per group is kept in a generated stack; getStackWarnings below
// re-checks the same grouping for stacks users assemble by hand.
export const NUTRIENT_GROUP: Record<string, string> = {
  multivitamin: "zinc",
  zinc_mag: "zinc",
  zinc_lozenge: "zinc",
};

const NUTRIENT_GROUP_LABEL: Record<string, string> = {
  zinc: "zinc",
};

function score(supp: Supplement, answers: Answers): number {
  let pts = 0;
  const goal = answers.goal?.[0] ?? "";
  const activity = answers.activity?.[0] ?? "";
  const diet = answers.diet?.[0] ?? "";
  const concerns = answers.concerns ?? [];
  const lifeStage = answers.life_stage?.[0] ?? "none";

  if (supp.tags.includes(goal)) pts += 3;
  if (supp.tags.includes(activity)) pts += 1;
  if (supp.tags.includes(diet)) pts += 2;
  concerns.forEach((c) => { if (supp.tags.includes(c)) pts += 2; });
  if (LIFE_STAGE_BOOST[lifeStage]?.includes(supp.key)) pts += 4;

  return pts;
}

function budgetLimit(budget: string): number {
  if (budget === "low") return 3;
  if (budget === "mid") return 6;
  return 10;
}

export function generateStack(answers: Answers, supplements: Supplement[]): Supplement[] {
  const budget = answers.budget?.[0] ?? "mid";
  const limit = budgetLimit(budget);
  const diet = answers.diet?.[0] ?? "";
  const lifeStage = answers.life_stage?.[0] ?? "none";

  // Always include D3 and Omega-3 (foundational)
  const foundations = ["vitd3", "omega3"];
  // For vegan/vegetarian, swap fish oil for algae and add B12
  const veganAdjustments = diet === "vegan" || diet === "vegetarian"
    ? ["b12", "algal_oil"]
    : [];
  const lifeStageForced = LIFE_STAGE_FORCE_INCLUDE[lifeStage] ?? [];
  const lifeStageSuppressed = LIFE_STAGE_SUPPRESS[lifeStage] ?? [];
  const forced = new Set([...foundations, ...veganAdjustments, ...lifeStageForced]);

  const scored = supplements
    .filter((supp) => {
      // Remove fish oil for vegans (algal oil covers it via veganAdjustments)
      if ((diet === "vegan" || diet === "vegetarian") && supp.key === "omega3") return false;
      // Remove whey for vegans
      if (diet === "vegan" && supp.key === "protein") return false;
      // Life-stage contraindications/suppressions
      if (lifeStageSuppressed.includes(supp.key)) return false;
      return true;
    })
    .map((supp) => ({
      supp,
      pts: score(supp, answers) + (forced.has(supp.key) ? 10 : 0),
    }))
    .sort((a, b) => b.pts - a.pts);

  // Walk the ranked list, skipping any candidate that would push a nutrient
  // group (e.g. zinc) over its ceiling by duplicating one already selected.
  const seenNutrientGroups = new Set<string>();
  const result: Supplement[] = [];
  for (const { supp } of scored) {
    if (result.length >= limit) break;
    const group = NUTRIENT_GROUP[supp.key];
    if (group) {
      if (seenNutrientGroups.has(group)) continue;
      seenNutrientGroups.add(group);
    }
    result.push(supp);
  }

  return result;
}

// Flags supplements in a stack that supply overlapping nutrients past a safe
// daily ceiling when combined (see NUTRIENT_GROUP). generateStack already
// avoids this by construction; this is for /account, where a signed-in user
// assembles their morning/evening stack from the catalog unconstrained.
export function getStackWarnings(supplements: Supplement[]): string[] {
  const byGroup = new Map<string, Supplement[]>();
  for (const supp of supplements) {
    const group = NUTRIENT_GROUP[supp.key];
    if (!group) continue;
    const list = byGroup.get(group) ?? [];
    list.push(supp);
    byGroup.set(group, list);
  }

  const warnings: string[] = [];
  for (const [group, members] of byGroup) {
    // The same supplement can appear in both morning and evening; that's not
    // a nutrient overlap, so dedupe by key before counting distinct sources.
    const distinct = Array.from(new Map(members.map((s) => [s.key, s])).values());
    if (distinct.length < 2) continue;
    const names = distinct.map((s) => s.name).join(" and ");
    const nutrient = NUTRIENT_GROUP_LABEL[group] ?? group;
    warnings.push(
      `${names} are both in your stack and both supply ${nutrient} — together they may push you past the recommended daily amount. Consider keeping just one.`,
    );
  }
  return warnings;
}
