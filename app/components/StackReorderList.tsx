"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, SectionHeading } from "./PageCard";
import { accentFor } from "../lib/theme";
import { reorderStackAction, setStackItemAction } from "../lib/actions/library";
import { StackSlot, Supplement } from "../lib/types";

interface StackReorderListProps {
  slot: StackSlot;
  emoji: string;
  title: string;
  items: Supplement[];
}

// The morning/evening stack on the account page. Rows can be dragged to reorder
// (persisted via reorderStackAction) with keyboard-accessible up/down buttons as
// the non-pointer path. Renders its own Card so it can vanish once emptied.
export default function StackReorderList({ slot, emoji, title, items }: StackReorderListProps) {
  // The server page is force-dynamic, so `items` is always fresh on mount; local
  // state is the source of truth for the session's optimistic edits.
  const [order, setOrder] = useState<Supplement[]>(items);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function persist(next: Supplement[]) {
    startTransition(() => {
      reorderStackAction(
        slot,
        next.map((s) => s.key),
      );
    });
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next);
    persist(next);
  }

  function onDragEnterRow(key: string) {
    if (dragKey === null || dragKey === key) return;
    const from = order.findIndex((s) => s.key === dragKey);
    const to = order.findIndex((s) => s.key === key);
    if (from < 0 || to < 0) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next); // live visual reorder; persisted on drag end
  }

  function onDragEnd() {
    if (dragKey !== null) {
      persist(order);
      setDragKey(null);
    }
  }

  function remove(key: string) {
    const next = order.filter((s) => s.key !== key);
    setOrder(next);
    startTransition(() => {
      setStackItemAction(key, slot, false);
    });
  }

  if (order.length === 0) return null;

  return (
    <Card>
      <SectionHeading emoji={emoji}>{title}</SectionHeading>
      <p className="text-xs mb-3" style={{ color: "#8A8172" }}>
        Drag to reorder, or use the arrows.
      </p>
      <ul className="space-y-2" aria-busy={isPending}>
        {order.map((supp, index) => {
          const accent = accentFor(supp.key);
          const dragging = dragKey === supp.key;
          return (
            <li
              key={supp.key}
              draggable
              onDragStart={(e) => {
                setDragKey(supp.key);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragEnter={() => onDragEnterRow(supp.key)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={onDragEnd}
              className="flex items-center gap-2 rounded-2xl border p-3 transition-opacity"
              style={{
                background: "#FFFFFF",
                borderColor: dragging ? "#2F5580" : "rgba(17,17,17,0.08)",
                opacity: dragging ? 0.6 : 1,
              }}
            >
              <span
                aria-hidden="true"
                className="flex-shrink-0 cursor-grab active:cursor-grabbing text-base leading-none select-none"
                style={{ color: "#8A8172" }}
                title="Drag to reorder"
              >
                ⠿
              </span>

              <Link
                href={`/supplements/${supp.key}`}
                className="group flex items-center gap-3 flex-1 min-w-0 transition-opacity hover:opacity-70"
              >
                <span
                  aria-hidden="true"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: accent.bg }}
                >
                  {supp.emoji}
                </span>
                <span className="text-sm font-medium truncate" style={{ color: "#111111" }}>
                  {supp.name}
                </span>
              </Link>

              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Move ${supp.name} up`}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(17,17,17,0.06)] focus:outline-none focus-visible:ring-2 disabled:opacity-30 disabled:pointer-events-none"
                  style={{ color: "#6B6558" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === order.length - 1}
                  aria-label={`Move ${supp.name} down`}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(17,17,17,0.06)] focus:outline-none focus-visible:ring-2 disabled:opacity-30 disabled:pointer-events-none"
                  style={{ color: "#6B6558" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => remove(supp.key)}
                  aria-label={`Remove ${supp.name}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-[rgba(17,17,17,0.06)] focus:outline-none focus-visible:ring-2"
                  style={{ color: "#9A2A2A" }}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
