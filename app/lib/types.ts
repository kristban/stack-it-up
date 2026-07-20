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

export interface Supplement {
  key: string;
  name: string;
  emoji: string;
  why: string;
  timing: string;
  dose: string;
  tags: string[];
}

export type Answers = Record<string, string[]>;
