import "server-only";

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

// Carries the HTTP status Gemini responded with (e.g. 429 for rate-limit/quota)
// so callers can distinguish "try again later" from "something's actually
// broken" without parsing response text themselves.
export class GeminiError extends Error {
  status: number;

  constructor(status: number, body: string) {
    super(`Gemini API error ${status}: ${body}`);
    this.name = "GeminiError";
    this.status = status;
  }
}

// Flash-Lite: cheapest Gemini model still free on the unpaid tier, which is
// all this feature needs for short supplement/fitness Q&A. gemini-3.1-flash-lite
// is nominally cheaper but was consistently 503 UNAVAILABLE (high demand) when
// tested 2026-11-02 — 3.5-flash-lite responded reliably, so that's used instead.
const MODEL = "gemini-3.5-flash-lite";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export async function askGemini(
  systemPrompt: string,
  history: ChatTurn[],
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: history.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      })),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 400,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini API returned no text");
  }

  return text;
}

// Single-shot structured-output call (no chat history): used by the quiz's
// stack generation, which needs a strictly-typed JSON pick from a fixed set
// of valid values rather than a conversational reply. responseSchema makes
// the API itself reject anything outside the given enum, so the caller still
// validates the result but can't get an invented value back.
export async function generateStructured(
  prompt: string,
  schema: Record<string, unknown>,
): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new GeminiError(res.status, body);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini API returned no text");
  }

  return JSON.parse(text);
}
