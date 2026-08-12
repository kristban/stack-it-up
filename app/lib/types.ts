export interface Question {
  id: string;
  question: string;
  subtitle?: string;
  type: "single" | "multi";
  options: Option[];
}

export interface Option {
  id: string;
  label: string;
  emoji: string;
}

export type SupplementCategory =
  | "foundational"
  | "performance"
  | "cognitive"
  | "sleep_stress"
  | "gut_digestion"
  | "joints_skin";

export type EvidenceLevel = "strong" | "moderate" | "emerging";

export interface Supplement {
  key: string;
  name: string;
  emoji: string;
  why: string;
  timing: string;
  dose: string;
  tags: string[];
  category: SupplementCategory;
  evidence: EvidenceLevel;
  warnings: string | null;
  sort_order: number;
  is_active: boolean;
}

export type Answers = Record<string, string[]>;

export type StackSlot = "morning" | "evening";

export interface Subscriber {
  id: string;
  first_name: string;
  email: string;
  created_at: string;
}
