import { Answers } from "./types";

// URL-safe base64 encode/decode of quiz answers, used to build a shareable
// link for a generated routine (see Results.tsx "Copy link") without
// requiring an account. Client-only — callers guard on `window` themselves.

export function encodeAnswers(answers: Answers): string {
  if (typeof window === "undefined") return "";
  const json = JSON.stringify(answers);
  return window
    .btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeAnswers(encoded: string): Answers | null {
  if (typeof window === "undefined") return null;
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
    const json = decodeURIComponent(escape(window.atob(base64 + pad)));
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" ? (parsed as Answers) : null;
  } catch {
    return null;
  }
}
