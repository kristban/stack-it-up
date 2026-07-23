import type { Supplement } from "./types";

// A small, dependency-free fuzzy matcher tuned for short strings like
// supplement names. It tolerates typos (via bounded Levenshtein distance) on
// top of the usual prefix / substring / subsequence matching, so "magnez" or
// "ashwaganda" still find their supplement. Kept in lib/ (not the component)
// so the scoring is pure and easy to reason about in isolation.

// Lowercase, strip diacritics, and collapse whitespace so "Açaí" and "acai"
// compare equal and extra spaces don't break matching.
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Classic Levenshtein edit distance with two rolling rows (O(n) memory).
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

// True if every char of `query` appears in `target` in order (not necessarily
// contiguous) — e.g. "vitd" is a subsequence of "vitamin d3".
function isSubsequence(query: string, target: string): boolean {
  let qi = 0;
  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (query[qi] === target[ti]) qi++;
  }
  return qi === query.length;
}

// How many typos to forgive, scaled to query length so short queries stay
// strict (few chars, little room for error) and longer ones stay flexible.
function editBudget(length: number): number {
  if (length <= 4) return 1;
  if (length <= 7) return 2;
  return 3;
}

// Score how well `rawQuery` matches `rawTarget`. Returns 0 for no match and a
// value in (0, 1] otherwise — higher is a tighter match. The tiers are ordered
// so exact/prefix/substring always outrank typo-corrected or subsequence hits.
export function fuzzyScore(rawQuery: string, rawTarget: string): number {
  const query = normalize(rawQuery);
  const target = normalize(rawTarget);
  if (!query || !target) return 0;

  if (query === target) return 1;
  if (target.startsWith(query)) return 0.95;

  const words = target.split(" ").filter(Boolean);
  if (words.some((w) => w.startsWith(query))) return 0.9;
  if (target.includes(query)) return 0.8;
  if (words.some((w) => w.includes(query))) return 0.75;

  // Typo tolerance: allow a few edits against the whole string or any single
  // word. For words longer than the query we also compare against the word's
  // leading slice, so a typo early in a long name ("magnez" -> "magnesium")
  // still registers without the trailing chars inflating the distance.
  if (query.length >= 3) {
    const budget = editBudget(query.length);
    let best = Infinity;
    for (const candidate of [target, ...words]) {
      best = Math.min(best, levenshtein(query, candidate));
      if (candidate.length > query.length) {
        best = Math.min(best, levenshtein(query, candidate.slice(0, query.length)));
      }
      if (best === 0) break;
    }
    if (best <= budget) {
      // Map into a 0.5–0.7 band; fewer edits rank higher.
      return 0.7 - (best / (budget + 1)) * 0.2;
    }

    // Loose fallback: characters in order but not contiguous.
    if (isSubsequence(query, target)) return 0.4;
  }

  return 0;
}

// Rank supplements against a query. Matches on name (primary) and tags
// (secondary, weighted lower) so a query like "sleep" can surface a supplement
// tagged for sleep, while name matches always win. Empty query returns the list
// unchanged so the page renders its full grid.
export function searchSupplements(query: string, supplements: Supplement[]): Supplement[] {
  if (!normalize(query)) return supplements;

  const MATCH_FLOOR = 0.4;

  return supplements
    .map((supplement) => {
      const nameScore = fuzzyScore(query, supplement.name);
      const tagScore = supplement.tags.reduce(
        (best, tag) => Math.max(best, fuzzyScore(query, tag)),
        0,
      );
      return { supplement, score: Math.max(nameScore, tagScore * 0.7) };
    })
    .filter((entry) => entry.score >= MATCH_FLOOR)
    .sort(
      (a, b) => b.score - a.score || a.supplement.name.localeCompare(b.supplement.name),
    )
    .map((entry) => entry.supplement);
}
