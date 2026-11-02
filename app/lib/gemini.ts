import "server-only";

export interface ChatTurn {
  role: "user" | "model";
  text: string;
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
