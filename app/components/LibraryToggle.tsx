"use client";

import type { UserLibrary } from "../hooks/useUserLibrary";
import type { Supplement } from "../lib/types";

interface GridToggleProps {
  pressed: boolean;
  onClick: () => void;
  emoji: string;
  title: string;
  phrase: string;
  name: string;
}

// Compact icon toggle for favoriting or adding a supplement to a stack slot.
// Blue #2F5580 on #CFE0F7 is the AA-safe active pairing (docs/CONVENTIONS.md).
export function GridToggle({ pressed, onClick, emoji, title, phrase, name }: GridToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={pressed ? `Remove ${name} from ${phrase}` : `Add ${name} to ${phrase}`}
      title={title}
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm border transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2"
      style={{
        background: pressed ? "#CFE0F7" : "#FFFFFF",
        borderColor: pressed ? "#2F5580" : "rgba(17,17,17,0.15)",
        color: pressed ? "#2F5580" : "#6B6558",
      }}
    >
      <span aria-hidden="true">{emoji}</span>
    </button>
  );
}

// The ♥ / ☀️ / 🌙 row shared between the supplement catalog cards and the quiz
// results cards, so both save into the same favorites/morning/evening state.
export function LibraryToggleRow({ supp, library }: { supp: Supplement; library: UserLibrary }) {
  return (
    <div className="flex items-center gap-2">
      <GridToggle
        pressed={library.favorites.has(supp.key)}
        onClick={() => library.toggleFavorite(supp.key)}
        emoji="♥"
        title="Favorite"
        phrase="favorites"
        name={supp.name}
      />
      <GridToggle
        pressed={library.morning.has(supp.key)}
        onClick={() => library.toggleStack(supp.key, "morning")}
        emoji="☀️"
        title="Morning stack"
        phrase="your morning stack"
        name={supp.name}
      />
      <GridToggle
        pressed={library.evening.has(supp.key)}
        onClick={() => library.toggleStack(supp.key, "evening")}
        emoji="🌙"
        title="Evening stack"
        phrase="your evening stack"
        name={supp.name}
      />
    </div>
  );
}

// Placeholder shown in the same footprint while auth state is still resolving,
// so the card doesn't reflow once it's known whether to show the row above.
export function LibraryToggleRowSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="w-9 h-9 rounded-full" style={{ background: "rgba(17,17,17,0.06)" }} />
      ))}
    </div>
  );
}
