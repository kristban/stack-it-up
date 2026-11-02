"use client";

import { useState, useRef, useEffect, FormEvent, ReactNode } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "model";
  text: string;
}

const GREETING: Message = {
  role: "model",
  text: "Hi! I'm here to help with supplement and fitness questions. What's on your mind?",
};

const STORAGE_KEY = "stackitup-chat-history";
// Caps localStorage growth across many sessions — well above what a single
// conversation needs, just a backstop against unbounded growth.
const MAX_STORED_MESSAGES = 40;
// Caps what's sent to Gemini per request so a long-running conversation
// doesn't keep growing the token cost of every new message.
const MAX_HISTORY_TO_SEND = 10;

// Read once, synchronously, so the first render already shows a returning
// visitor's history instead of flashing the greeting before an effect
// restores it (same pattern as Quiz.tsx's quiz-progress persistence). Safe
// here because the panel starts closed, so this never renders into the
// server-sent HTML regardless of what's in storage.
function loadSaved(): Message[] {
  if (typeof window === "undefined") return [GREETING];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [GREETING];
    const parsed = JSON.parse(raw);
    const isValid =
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.every(
        (m) => (m?.role === "user" || m?.role === "model") && typeof m?.text === "string",
      );
    return isValid ? (parsed as Message[]) : [GREETING];
  } catch {
    return [GREETING];
  }
}

// Matches the [Name](/path) links the chat system prompt instructs the model
// to use. Only /supplements/ and /stacks/ paths are turned into real links —
// a defense-in-depth backstop alongside the prompt instructions, in case the
// model ever emits something else.
const LINK_PATTERN = /\[([^\]]+)\]\((\/(?:supplements|stacks)\/[a-zA-Z0-9_-]+)\)/g;

function renderWithLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, label, href] = match;
    parts.push(
      <Link
        key={key++}
        href={href}
        className="underline focus-visible:ring-2"
        style={{ color: "#2F5580" }}
      >
        {label}
      </Link>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadSaved);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isOpen]);

  // Persist on every change so a refresh or a different page resumes the
  // same conversation, trimmed so storage can't grow without bound.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
      );
    } catch {
      // Storage unavailable (private mode, quota) — chat just won't survive a refresh.
    }
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const nextMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-MAX_HISTORY_TO_SEND) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Chat request failed");
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch {
      setError("Couldn't get a reply — please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setMessages([GREETING]);
    setError(null);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable — nothing to clear.
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Supplement & fitness chat"
          className="flex h-[480px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl shadow-xl"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="flex items-center justify-between gap-2 px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="truncate font-bold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--foreground)",
              }}
            >
              <span aria-hidden="true">🌿</span> Ask about supplements
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleClear}
                disabled={messages.length <= 1}
                aria-label="Clear chat"
                className="whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium focus-visible:ring-2 disabled:opacity-40"
                style={{ color: "var(--foreground-muted)" }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-full px-2 py-1 focus-visible:ring-2"
                style={{ color: "var(--foreground-muted)" }}
              >
                ✕
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className="max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap"
                style={
                  m.role === "user"
                    ? {
                        marginLeft: "auto",
                        backgroundColor: "var(--ink)",
                        color: "var(--surface)",
                      }
                    : {
                        backgroundColor: "var(--blue)",
                        color: "var(--foreground)",
                      }
                }
              >
                {m.role === "model" ? renderWithLinks(m.text) : m.text}
              </div>
            ))}
            {isLoading && (
              <div
                className="max-w-[85%] rounded-xl px-3 py-2 text-sm"
                style={{ backgroundColor: "var(--blue)", color: "var(--foreground-muted)" }}
              >
                Thinking…
              </div>
            )}
            {error && (
              <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-2 p-3"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={500}
              disabled={isLoading}
              className="flex-1 rounded-full px-4 py-2 text-sm focus-visible:ring-2"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="rounded-full px-4 py-2 text-sm font-bold focus-visible:ring-2 disabled:opacity-50"
              style={{ backgroundColor: "var(--ink)", color: "var(--surface)" }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Chat with our supplement & fitness expert"}
        aria-expanded={isOpen}
        className="flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg focus-visible:ring-2"
        style={{ backgroundColor: "var(--ink)", color: "var(--surface)" }}
      >
        <span aria-hidden="true">{isOpen ? "✕" : "💬"}</span>
      </button>
    </div>
  );
}
