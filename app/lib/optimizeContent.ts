import { ALL_SUPPLEMENTS } from "./engine";
import { Supplement } from "./types";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface OptimizeTopic {
  slug: string;
  emoji: string;
  title: string;
  tagline: string;
  blob: string;
  whyItMatters: string[];
  signs: string[];
  canHelp: string[];
  dailyHabits: string[];
  faq: FaqItem[];
}

export const OPTIMIZE_TOPICS: OptimizeTopic[] = [
  {
    slug: "energy",
    emoji: "⚡",
    title: "Energy & Focus",
    tagline: "Steadier energy, sharper focus, without the crash.",
    blob: "#E3C39C",
    whyItMatters: [
      "Low energy and brain fog rarely come from one place — sleep debt, blood sugar swings, and micronutrient gaps all play a role. The right supplements can smooth out your energy curve instead of just spiking it.",
      "The goal isn't more stimulants, it's a steadier baseline. That usually means closing nutrient gaps (like B12) alongside smarter stimulant use — pairing caffeine with L-theanine — rather than just drinking more coffee.",
    ],
    signs: [
      "You reach for coffee before noon just to function",
      "Afternoon slumps hit hard around 2–3pm",
      "Trouble concentrating during focused work",
      "Energy feels inconsistent day to day",
    ],
    canHelp: ["Caffeine + L-Theanine", "Vitamin B12", "Lion's Mane Mushroom"],
    dailyHabits: [
      "Get natural light within 30 minutes of waking — it helps set your circadian rhythm for the day.",
      "Keep a water bottle nearby; mild dehydration is one of the most common causes of afternoon fatigue.",
      "Take a 5-minute walk after lunch instead of reaching for a second coffee.",
    ],
    faq: [
      {
        question: "Will supplements fix energy issues caused by poor sleep?",
        answer:
          "Not on their own. Supplements can support energy production, but if you're sleeping five hours a night, no supplement fully compensates. Pair this with the habits on our Sleep Quality page.",
      },
      {
        question: "Is it safe to take caffeine and L-theanine every day?",
        answer:
          "For most healthy adults, yes — L-theanine smooths out caffeine's jittery edge. Just avoid taking it within eight hours of bedtime.",
      },
    ],
  },
  {
    slug: "sleep",
    emoji: "😴",
    title: "Sleep Quality",
    tagline: "Fall asleep easier, stay asleep longer, wake up rested.",
    blob: "#8B9174",
    whyItMatters: [
      "Sleep is the foundation everything else builds on. Magnesium and calming adaptogens like ashwagandha can help settle an overactive nervous system so your body can actually wind down at night.",
      "Supplements work best as part of a wind-down routine, not a replacement for one. Think of magnesium as lowering the barrier to falling asleep — the habits below are what get you there consistently.",
    ],
    signs: [
      "Lying awake with a racing mind",
      "Waking up still feeling tired",
      "Restless or interrupted sleep",
      "Relying on your phone to unwind before bed",
    ],
    canHelp: ["Magnesium Glycinate", "Ashwagandha KSM-66", "ZMA (Zinc + Magnesium + B6)"],
    dailyHabits: [
      "Dim the lights and put screens away 60 minutes before bed — blue light suppresses melatonin production.",
      "Keep a consistent wake-up time, even on weekends; it anchors your whole sleep cycle.",
      "Keep your bedroom cool, around 65–68°F — a lower body temperature helps trigger sleep.",
    ],
    faq: [
      {
        question: "When should I take magnesium for sleep?",
        answer:
          "30–60 minutes before bed is typical. Glycinate is the gentlest form on digestion of the common varieties.",
      },
      {
        question: "Can I take ashwagandha and magnesium together?",
        answer:
          "Yes — they're commonly stacked together and target different parts of the stress-sleep cycle.",
      },
    ],
  },
  {
    slug: "muscle",
    emoji: "💪",
    title: "Muscle & Strength",
    tagline: "Support the gains you're already working for.",
    blob: "#C4744A",
    whyItMatters: [
      "Training builds the stimulus, but recovery and raw materials build the muscle. Creatine and protein are two of the most well-researched supplements for strength and lean mass.",
      "Consistency matters more than timing here — creatine works by saturating your muscles over weeks, not by taking it right before a workout.",
    ],
    signs: [
      "Strength plateaus despite consistent training",
      "Struggling to hit your daily protein target",
      "Slow progress on your main lifts",
      "Training three or more times a week",
    ],
    canHelp: ["Creatine Monohydrate", "Whey Protein", "Vitamin D3 + K2"],
    dailyHabits: [
      "Prioritize protein at each meal, not just post-workout — aim for 20–40g per sitting.",
      "Track your lifts; progressive overload drives strength gains more than any supplement stack.",
      "Sleep seven or more hours — most muscle repair happens overnight.",
    ],
    faq: [
      {
        question: "Does creatine cause bloating?",
        answer:
          "Some people notice water retention in the muscle (not bloating) during the first couple of weeks. It levels out and is part of how creatine works.",
      },
      {
        question: "Do I need protein powder if I already eat enough protein from food?",
        answer:
          "No — whey is just a convenient way to hit your target. If your diet already covers it, you don't need the supplement.",
      },
    ],
  },
  {
    slug: "recovery",
    emoji: "🔄",
    title: "Recovery",
    tagline: "Bounce back faster between sessions.",
    blob: "#262B30",
    whyItMatters: [
      "Recovery is where the actual adaptation happens. Replenishing electrolytes, magnesium, and omega-3s helps reduce soreness and inflammation so you can train again sooner.",
      "Recovery supplements work best alongside adequate rest days — no supplement can fully offset chronic under-recovery from training too hard, too often.",
    ],
    signs: [
      "Sore for days after training",
      "Feeling run down between sessions",
      "Frequent muscle cramps",
      "Training intensely four or more times a week",
    ],
    canHelp: ["Electrolytes", "Omega-3 Fish Oil", "Magnesium Glycinate"],
    dailyHabits: [
      "Build at least one full rest day into your week, even during a hard training block.",
      "Rehydrate with electrolytes, not just water, after heavy sweating sessions.",
      "Gentle movement on rest days — walking, stretching — speeds recovery more than doing nothing.",
    ],
    faq: [
      {
        question: "Are electrolytes only for endurance athletes?",
        answer:
          "No — anyone training hard or sweating a lot, including in hot climates, benefits from replacing sodium and potassium, not just marathoners.",
      },
      {
        question: "How is recovery different from sleep?",
        answer:
          "Sleep is one input to recovery, but recovery also includes nutrition, hydration, and rest days. If sleep is covered but you still feel run down, focus on the habits above.",
      },
    ],
  },
  {
    slug: "stress",
    emoji: "🧘",
    title: "Stress & Calm",
    tagline: "Take the edge off a long day.",
    blob: "#8B9174",
    whyItMatters: [
      "Chronic stress keeps cortisol elevated, which quietly affects sleep, digestion, and mood. Ashwagandha is a clinically studied adaptogen shown to lower stress markers over time.",
      "Adaptogens work gradually, over weeks, not minutes. They're not a substitute for addressing the source of stress, but they can lower your baseline reactivity to it.",
    ],
    signs: [
      "Feeling wired but tired",
      "Trouble relaxing even when you have the time",
      "Tension headaches or a tight jaw",
      "Stress spilling over into your sleep",
    ],
    canHelp: ["Ashwagandha KSM-66", "Magnesium Glycinate", "Vitamin D3 + K2"],
    dailyHabits: [
      "Try five minutes of slow breathing — four seconds in, six seconds out — when tension builds.",
      "Step outside for a short walk without your phone; even ten minutes resets your nervous system.",
      "Keep a consistent sleep schedule — poor sleep and high stress reinforce each other.",
    ],
    faq: [
      {
        question: "How long does ashwagandha take to work?",
        answer:
          "Most studies show measurable effects on stress markers after four to eight weeks of consistent use, not immediately.",
      },
      {
        question: "Can I take ashwagandha if I'm on medication?",
        answer:
          "Talk to your doctor first, especially with thyroid medication or sedatives, since ashwagandha can interact with both.",
      },
    ],
  },
  {
    slug: "gut",
    emoji: "🫀",
    title: "Gut Health",
    tagline: "Ease digestion, feel less bloated.",
    blob: "#C4744A",
    whyItMatters: [
      "Your gut microbiome affects digestion, immunity, and even mood. A quality probiotic and collagen can support a healthier gut lining and more comfortable digestion day to day.",
      "Probiotics work best paired with a fiber-rich diet — fiber is the food your good bacteria actually need to thrive.",
    ],
    signs: [
      "Regular bloating after meals",
      "Inconsistent digestion",
      "Recently finished a course of antibiotics",
      "A diet that's light on fiber",
    ],
    canHelp: ["Probiotic (Multi-Strain)", "Collagen Peptides", "Omega-3 Fish Oil"],
    dailyHabits: [
      "Add one fiber-rich food to a meal today — oats, beans, or leafy greens all feed a healthy gut microbiome.",
      "Eat slowly and chew thoroughly; digestion starts in your mouth, not your stomach.",
      "Stay consistent with a probiotic for at least three to four weeks — gut flora shifts gradually.",
    ],
    faq: [
      {
        question: "Do I need to refrigerate probiotics?",
        answer:
          "It depends on the strain — check the label. Many modern shelf-stable probiotics don't require refrigeration.",
      },
      {
        question: "Can probiotics cause bloating at first?",
        answer:
          "Some people notice mild bloating in the first week as gut flora shifts. It typically settles down after that.",
      },
    ],
  },
  {
    slug: "immune",
    emoji: "🛡️",
    title: "Immune Support",
    tagline: "Stay resilient through the seasons.",
    blob: "#E3C39C",
    whyItMatters: [
      "Vitamin D deficiency is extremely common and directly tied to immune function. Pairing it with zinc and a healthy gut gives your body a stronger baseline defense.",
      "Immune support is a long game — think of these as lowering your susceptibility over months, not a same-day fix once you're already sick.",
    ],
    signs: [
      "Catching colds more often than you'd like",
      "Limited sun exposure most days",
      "High stress wearing down your resilience",
      "Slow to bounce back when you do get sick",
    ],
    canHelp: ["Vitamin D3 + K2", "ZMA (Zinc + Magnesium + B6)", "Probiotic (Multi-Strain)"],
    dailyHabits: [
      "Get 10–15 minutes of midday sun on bare skin a few times a week, if your climate allows it.",
      "Prioritize sleep during cold and flu season — sleep deprivation measurably weakens immune response.",
      "Wash your hands regularly — it still outperforms most supplements for reducing illness frequency.",
    ],
    faq: [
      {
        question: "Should I only take vitamin D in winter?",
        answer:
          "Many people are deficient year-round, especially with more time indoors. A blood test can confirm your levels, but daily supplementation is reasonable in most climates.",
      },
      {
        question: "Can I take zinc every day long-term?",
        answer:
          "Short courses are safest — follow the label rather than taking high doses indefinitely, since excess zinc can interfere with copper absorption.",
      },
    ],
  },
  {
    slug: "joints",
    emoji: "🦴",
    title: "Joint Comfort",
    tagline: "Move easier, ache less.",
    blob: "#262B30",
    whyItMatters: [
      "Joint discomfort often comes down to inflammation and connective tissue support. Omega-3s and collagen are two of the best-studied options for comfortable, mobile joints.",
      "These supplements support the building blocks of healthy joints, but they work over months, alongside movement, not as a substitute for it.",
    ],
    signs: [
      "Stiffness first thing in the morning",
      "Achy joints after activity",
      "Reduced range of motion",
      "Long hours on your feet or at a desk",
    ],
    canHelp: ["Omega-3 Fish Oil", "Collagen Peptides", "Magnesium Glycinate"],
    dailyHabits: [
      "Keep moving — gentle daily mobility work keeps joints lubricated better than rest alone.",
      "Warm up before activity, especially in colder weather when joints feel stiffer.",
      "Maintain a healthy weight where possible — every extra pound adds load to your knees and hips.",
    ],
    faq: [
      {
        question: "How long before I notice a difference from collagen or omega-3s?",
        answer:
          "Most people report changes after eight to twelve weeks of consistent use — these aren't fast-acting like a painkiller.",
      },
      {
        question: "Are joint supplements only for older adults or athletes?",
        answer:
          "No — anyone doing repetitive movement, from running to desk work to manual labor, can benefit from extra joint support.",
      },
    ],
  },
];

export function getOptimizeTopic(slug: string): OptimizeTopic | undefined {
  return OPTIMIZE_TOPICS.find((t) => t.slug === slug);
}

export function getSupplementDetails(names: string[]): Supplement[] {
  const byName = Object.values(ALL_SUPPLEMENTS);
  return names
    .map((name) => byName.find((s) => s.name === name))
    .filter((s): s is Supplement => Boolean(s));
}

export function getRelatedTopics(topic: OptimizeTopic, count = 3): OptimizeTopic[] {
  const others = OPTIMIZE_TOPICS.filter((t) => t.slug !== topic.slug);
  const scored = others.map((t) => ({
    topic: t,
    overlap: t.canHelp.filter((name) => topic.canHelp.includes(name)).length,
  }));
  scored.sort((a, b) => b.overlap - a.overlap);
  return scored.slice(0, count).map((s) => s.topic);
}
