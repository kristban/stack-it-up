import { SupplementCategory, EvidenceLevel } from "./types";

// Display metadata for the supplement `category` column (grouping on the public
// library) and the `evidence` column (a strength badge). Single source of truth
// reused by the public pages and the admin panel. The slugs + allowed values
// mirror the CHECK constraints on public.supplements — keep them in sync.

interface CategoryMeta {
  slug: SupplementCategory;
  label: string;
  emoji: string;
}

// Order here is the display order of the sections on /supplements.
export const SUPPLEMENT_CATEGORIES: CategoryMeta[] = [
  { slug: "foundational", label: "Foundational", emoji: "🧱" },
  { slug: "performance", label: "Performance", emoji: "💪" },
  { slug: "cognitive", label: "Cognitive", emoji: "🧠" },
  { slug: "sleep_stress", label: "Sleep & Stress", emoji: "😴" },
  { slug: "gut_digestion", label: "Gut & Digestion", emoji: "🌿" },
  { slug: "joints_skin", label: "Joints & Skin", emoji: "✨" },
];

export const CATEGORY_LABELS: Record<SupplementCategory, string> = Object.fromEntries(
  SUPPLEMENT_CATEGORIES.map((c) => [c.slug, c.label]),
) as Record<SupplementCategory, string>;

interface EvidenceMeta {
  level: EvidenceLevel;
  label: string;
  bg: string;
  text: string;
}

// Palette-safe pairings (see docs/CONVENTIONS.md): #2F5580 on #CFE0F7 and
// #8A6F0E on #F4E14F both pass AA; moderate uses the neutral muted pairing.
export const EVIDENCE_LEVELS: Record<EvidenceLevel, EvidenceMeta> = {
  strong: { level: "strong", label: "Strong evidence", bg: "#CFE0F7", text: "#2F5580" },
  moderate: { level: "moderate", label: "Moderate evidence", bg: "rgba(17,17,17,0.06)", text: "#6B6558" },
  emerging: { level: "emerging", label: "Emerging evidence", bg: "#F4E14F", text: "#8A6F0E" },
};

export const EVIDENCE_ORDER: EvidenceLevel[] = ["strong", "moderate", "emerging"];

// Amber caution styling for the `warnings` notice. globals.css has no amber
// token yet; #8A5A00 on this tint reads as a clear, accessible caution.
export const WARNING_STYLE = {
  bg: "rgba(200,140,20,0.12)",
  border: "rgba(200,140,20,0.35)",
  text: "#8A5A00",
};

// Dropdown options for the admin create/edit forms.
export const CATEGORY_OPTIONS = SUPPLEMENT_CATEGORIES.map((c) => ({
  value: c.slug,
  label: c.label,
}));

export const EVIDENCE_OPTIONS = EVIDENCE_ORDER.map((level) => ({
  value: level,
  label: EVIDENCE_LEVELS[level].label,
}));

// Runtime guards used by the server actions to validate form input against the
// DB CHECK constraints.
export const CATEGORY_SLUGS = SUPPLEMENT_CATEGORIES.map((c) => c.slug);

export function isCategory(value: string): value is SupplementCategory {
  return (CATEGORY_SLUGS as string[]).includes(value);
}

export function isEvidence(value: string): value is EvidenceLevel {
  return (EVIDENCE_ORDER as string[]).includes(value);
}
