export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-6 sm:p-8 border mb-6"
      style={{ background: "#FFFFFF", borderColor: "rgba(38,32,25,0.08)" }}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ emoji, children }: { emoji: string; children: React.ReactNode }) {
  return (
    <h2
      className="text-xl mb-4 flex items-center gap-2"
      style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
    >
      <span className="text-lg">{emoji}</span>
      {children}
    </h2>
  );
}
