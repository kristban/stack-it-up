import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/app/lib/chatPrompt";
import { askGemini, ChatTurn } from "@/app/lib/gemini";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;

// Per-IP sliding window, held in memory. Good enough to blunt a single abusive
// visitor on this low-traffic site; it resets on every cold start/deploy and
// isn't shared across serverless instances, so it's not a hard cap — a real
// one would need shared state (e.g. a Supabase table) instead.
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages — please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const history: ChatTurn[] = [];
  for (const m of messages.slice(-MAX_HISTORY_TURNS)) {
    if (
      (m?.role !== "user" && m?.role !== "model") ||
      typeof m?.text !== "string" ||
      m.text.length === 0 ||
      m.text.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    history.push({ role: m.role, text: m.text });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Chat is not configured yet (missing GEMINI_API_KEY)." },
      { status: 500 },
    );
  }

  try {
    const systemPrompt = await buildSystemPrompt();
    const reply = await askGemini(systemPrompt, history);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat request failed:", err);
    return NextResponse.json(
      { error: "Something went wrong — please try again." },
      { status: 502 },
    );
  }
}
