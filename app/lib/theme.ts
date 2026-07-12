export interface Accent {
  bg: string;
  soft: string;
  text: string;
}

export const BLUE_ACCENT: Accent = { bg: "#CFE0F7", soft: "rgba(79,111,165,0.1)", text: "#4A6FA5" };
export const YELLOW_ACCENT: Accent = { bg: "#F4E14F", soft: "rgba(138,111,14,0.12)", text: "#8A6F0E" };
export const INK_ACCENT: Accent = { bg: "#111111", soft: "rgba(17,17,17,0.06)", text: "#111111" };

const ACCENTS: Accent[] = [BLUE_ACCENT, YELLOW_ACCENT];

export function accentFor(key: string): Accent {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
}
