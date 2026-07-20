import { Answers, Supplement } from "./types";

function score(supp: Supplement, answers: Answers): number {
  let pts = 0;
  const goal = answers.goal?.[0] ?? "";
  const activity = answers.activity?.[0] ?? "";
  const diet = answers.diet?.[0] ?? "";
  const concerns = answers.concerns ?? [];

  if (supp.tags.includes(goal)) pts += 3;
  if (supp.tags.includes(activity)) pts += 1;
  if (supp.tags.includes(diet)) pts += 2;
  concerns.forEach((c) => { if (supp.tags.includes(c)) pts += 2; });

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

  // Always include D3 and Omega-3 (foundational)
  const foundations = ["vitd3", "omega3"];
  // For vegan/vegetarian, swap fish oil for algae and add B12
  const veganAdjustments = diet === "vegan" || diet === "vegetarian"
    ? ["b12"]
    : [];

  const scored = supplements
    .filter((supp) => {
      // Remove fish oil for vegans
      if ((diet === "vegan" || diet === "vegetarian") && supp.key === "omega3") return false;
      // Remove whey for vegans
      if (diet === "vegan" && supp.key === "protein") return false;
      return true;
    })
    .map((supp) => ({
      supp,
      pts: score(supp, answers) + (foundations.includes(supp.key) ? 10 : 0) + (veganAdjustments.includes(supp.key) ? 10 : 0),
    }))
    .sort((a, b) => b.pts - a.pts)
    .slice(0, limit)
    .map((s) => s.supp);

  return scored;
}
