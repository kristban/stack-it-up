import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/app/lib/chatPrompt";
import { askGemini, ChatTurn } from "@/app/lib/gemini";
import { attachVisitorCookie, checkAiRateLimit } from "@/app/lib/aiRateLimit";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 10;

export async function POST(req: NextRequest) {
  const rateLimit = await checkAiRateLimit(req, "chat");
  // Every response carries the (possibly newly-created) visitor cookie, so
  // the rate limit keeps tracking the same visitor on their next request.
  const respond = (body: Record<string, unknown>, status = 200) => {
    const res = NextResponse.json(body, { status });
    attachVisitorCookie(res, rateLimit.visitorId, rateLimit.isNewVisitor);
    return res;
  };

  if (!rateLimit.allowed) {
    return respond({ error: "Too many messages — please wait a minute and try again." }, 429);
  }

  const body = await req.json().catch(() => null);
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return respond({ error: "Invalid request" }, 400);
  }

  const history: ChatTurn[] = [];
  for (const m of messages.slice(-MAX_HISTORY_TURNS)) {
    if (
      (m?.role !== "user" && m?.role !== "model") ||
      typeof m?.text !== "string" ||
      m.text.length === 0 ||
      m.text.length > MAX_MESSAGE_LENGTH
    ) {
      return respond({ error: "Invalid message" }, 400);
    }
    history.push({ role: m.role, text: m.text });
  }

  if (!process.env.GEMINI_API_KEY) {
    return respond({ error: "Chat is not configured yet (missing GEMINI_API_KEY)." }, 500);
  }

  try {
    const systemPrompt = await buildSystemPrompt();
    const reply = await askGemini(systemPrompt, history);
    return respond({ reply });
  } catch (err) {
    console.error("Chat request failed:", err);
    return respond({ error: "Something went wrong — please try again." }, 502);
  }
}
