import { Answers, Supplement } from "./types";

const ALL_SUPPLEMENTS: Record<string, Supplement> = {
  creatine: {
    name: "Creatine Monohydrate",
    emoji: "⚡",
    why: "The most well-researched supplement for muscle strength and power output. Proven to increase lean mass and performance.",
    timing: "Any time of day — consistency matters more than timing.",
    dose: "3–5g daily",
    tags: ["muscle", "strength", "performance"],
  },
  protein: {
    name: "Whey Protein",
    emoji: "🥛",
    why: "Ensures you hit daily protein targets to support muscle repair and growth, especially after training.",
    timing: "Post-workout or between meals.",
    dose: "25–40g per serving",
    tags: ["muscle", "recovery", "fat_loss"],
  },
  vitd3: {
    name: "Vitamin D3 + K2",
    emoji: "☀️",
    why: "Most people are deficient. Supports immune function, bone density, mood, and testosterone levels.",
    timing: "Morning with a fatty meal.",
    dose: "2,000–5,000 IU D3 / 100mcg K2",
    tags: ["health", "immune", "muscle"],
  },
  magnesium: {
    name: "Magnesium Glycinate",
    emoji: "🌙",
    why: "Deficient in 70%+ of people. Improves sleep quality, reduces muscle cramps, and calms the nervous system.",
    timing: "30–60 minutes before bed.",
    dose: "300–400mg",
    tags: ["sleep", "stress", "joints", "recovery"],
  },
  omega3: {
    name: "Omega-3 Fish Oil",
    emoji: "🐟",
    why: "Reduces systemic inflammation, supports heart health, brain function, and joint lubrication.",
    timing: "With meals to reduce fishy aftertaste.",
    dose: "2–3g EPA+DHA daily",
    tags: ["health", "joints", "brain", "fat_loss"],
  },
  ashwagandha: {
    name: "Ashwagandha KSM-66",
    emoji: "🌿",
    why: "Clinically proven adaptogen that lowers cortisol, reduces stress and anxiety, and may boost testosterone.",
    timing: "Morning or evening — take consistently.",
    dose: "300–600mg",
    tags: ["stress", "sleep", "health", "recovery"],
  },
  caffeine_ltheanine: {
    name: "Caffeine + L-Theanine",
    emoji: "☕",
    why: "The perfect combo for clean, focused energy without jitteriness. L-theanine smooths out caffeine's edge.",
    timing: "Morning or pre-workout. Avoid after 2pm.",
    dose: "100–200mg caffeine / 200mg L-theanine",
    tags: ["energy", "brain", "fat_loss"],
  },
  b12: {
    name: "Vitamin B12",
    emoji: "💊",
    why: "Essential for energy production and nerve health. Critical for vegans and vegetarians who can't get it from food.",
    timing: "Morning with breakfast.",
    dose: "500–1000mcg methylcobalamin",
    tags: ["vegan", "vegetarian", "energy", "health"],
  },
  iron: {
    name: "Iron (Bisglycinate)",
    emoji: "🔩",
    why: "Plant-based diets are lower in bioavailable iron, leading to fatigue. Bisglycinate is gentle on the stomach.",
    timing: "On an empty stomach or with vitamin C.",
    dose: "18–25mg",
    tags: ["vegan", "vegetarian", "energy"],
  },
  probiotic: {
    name: "Probiotic (Multi-Strain)",
    emoji: "🦠",
    why: "Supports gut microbiome diversity, improves digestion, reduces bloating, and strengthens immune response.",
    timing: "Morning on an empty stomach.",
    dose: "10–50 billion CFU",
    tags: ["gut", "immune", "health"],
  },
  zinc_mag: {
    name: "ZMA (Zinc + Magnesium + B6)",
    emoji: "🏆",
    why: "Supports testosterone levels, deep sleep, and immune function. Popular for athletes training hard.",
    timing: "30–60 minutes before bed on an empty stomach.",
    dose: "As directed (typically 30mg zinc / 450mg Mg)",
    tags: ["muscle", "sleep", "intense", "immune"],
  },
  collagen: {
    name: "Collagen Peptides",
    emoji: "🦷",
    why: "Supports joint cartilage, tendons, skin elasticity, and gut lining integrity.",
    timing: "Pre-workout or with morning coffee.",
    dose: "10–15g",
    tags: ["joints", "gut", "health", "recovery"],
  },
  lions_mane: {
    name: "Lion's Mane Mushroom",
    emoji: "🍄",
    why: "Promotes nerve growth factor (NGF) production, supporting memory, focus, and cognitive function.",
    timing: "Morning or early afternoon.",
    dose: "500–1000mg extract",
    tags: ["brain", "energy", "health"],
  },
  electrolytes: {
    name: "Electrolytes",
    emoji: "💧",
    why: "Replenishes sodium, potassium, and magnesium lost through sweat. Prevents cramps and sustains performance.",
    timing: "During or after intense workouts.",
    dose: "1 packet or serving",
    tags: ["intense", "moderate", "recovery", "keto"],
  },
};

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

export function generateStack(answers: Answers): Supplement[] {
  const budget = answers.budget?.[0] ?? "mid";
  const limit = budgetLimit(budget);
  const diet = answers.diet?.[0] ?? "";

  // Always include D3 and Omega-3 (foundational)
  const foundations = ["vitd3", "omega3"];
  // For vegan/vegetarian, swap fish oil for algae and add B12
  const veganAdjustments = diet === "vegan" || diet === "vegetarian"
    ? ["b12"]
    : [];

  const scored = Object.entries(ALL_SUPPLEMENTS)
    .filter(([key]) => {
      // Remove fish oil for vegans
      if ((diet === "vegan" || diet === "vegetarian") && key === "omega3") return false;
      // Remove whey for vegans
      if (diet === "vegan" && key === "protein") return false;
      return true;
    })
    .map(([key, supp]) => ({
      key,
      supp,
      pts: score(supp, answers) + (foundations.includes(key) ? 10 : 0) + (veganAdjustments.includes(key) ? 10 : 0),
    }))
    .sort((a, b) => b.pts - a.pts)
    .slice(0, limit)
    .map((s) => s.supp);

  return scored;
}
