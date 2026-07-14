import { accentFor } from "../lib/theme";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-6 sm:p-8 border mb-6"
      style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ emoji, children }: { emoji: string; children: React.ReactNode }) {
  const accent = accentFor(emoji);
  return (
    <h2
      className="text-xl mb-4 flex items-center gap-3 tracking-tight"
      style={{ color: "#14130F", fontFamily: "var(--font-heading)", fontWeight: 700 }}
    >
      <span
        aria-hidden="true"
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ background: accent.bg }}
      >
        {emoji}
      </span>
      {children}
    </h2>
  );
}
