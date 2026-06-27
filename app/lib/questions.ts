import { Question } from "./types";

export const questions: Question[] = [
  {
    id: "goal",
    question: "What's your main goal?",
    subtitle: "Pick the one that matters most to you right now.",
    type: "single",
    options: [
      { id: "muscle", label: "Build muscle & strength", emoji: "💪" },
      { id: "energy", label: "Boost energy & focus", emoji: "⚡" },
      { id: "recovery", label: "Faster recovery", emoji: "🔄" },
      { id: "health", label: "General health & longevity", emoji: "❤️" },
      { id: "sleep", label: "Better sleep", emoji: "😴" },
      { id: "fat_loss", label: "Fat loss & body composition", emoji: "🔥" },
    ],
  },
  {
    id: "activity",
    question: "How active are you?",
    subtitle: "Be honest — this shapes your stack.",
    type: "single",
    options: [
      { id: "sedentary", label: "Mostly sedentary", emoji: "🪑" },
      { id: "light", label: "Light exercise 1–2x/week", emoji: "🚶" },
      { id: "moderate", label: "Moderate exercise 3–4x/week", emoji: "🏃" },
      { id: "intense", label: "Intense training 5+x/week", emoji: "🏋️" },
    ],
  },
  {
    id: "concerns",
    question: "Any specific concerns?",
    subtitle: "Select all that apply.",
    type: "multi",
    options: [
      { id: "stress", label: "High stress or anxiety", emoji: "😤" },
      { id: "gut", label: "Gut health / digestion", emoji: "🫀" },
      { id: "immune", label: "Immune support", emoji: "🛡️" },
      { id: "joints", label: "Joint or muscle pain", emoji: "🦴" },
      { id: "brain", label: "Brain fog / memory", emoji: "🧠" },
      { id: "none", label: "None of the above", emoji: "✅" },
    ],
  },
  {
    id: "diet",
    question: "How would you describe your diet?",
    type: "single",
    options: [
      { id: "omnivore", label: "Omnivore (eat everything)", emoji: "🍗" },
      { id: "vegetarian", label: "Vegetarian", emoji: "🥗" },
      { id: "vegan", label: "Vegan", emoji: "🌱" },
      { id: "keto", label: "Keto / low-carb", emoji: "🥑" },
    ],
  },
  {
    id: "budget",
    question: "What's your monthly supplement budget?",
    type: "single",
    options: [
      { id: "low", label: "Under $30 — keep it lean", emoji: "💵" },
      { id: "mid", label: "$30–$80 — balanced stack", emoji: "💰" },
      { id: "high", label: "$80+ — go all in", emoji: "💎" },
    ],
  },
];
