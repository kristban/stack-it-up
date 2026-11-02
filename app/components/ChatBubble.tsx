"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

interface Message {
  role: "user" | "model";
  text: string;
}

const GREETING: Message = {
  role: "model",
  text: "Hi! I'm here to help with supplement and fitness questions. What's on your mind?",
};

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isOpen]);

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
        body: JSON.stringify({ messages: nextMessages }),
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
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span
              className="font-bold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--foreground)",
              }}
            >
              <span aria-hidden="true">🌿</span> Ask about supplements
            </span>
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
                {m.text}
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
