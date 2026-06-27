"use client";

import { Supplement } from "../lib/types";

interface ResultsProps {
  stack: Supplement[];
  onReset: () => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  muscle: { bg: "rgba(225,29,72,0.1)", text: "#E11D48" },
  energy: { bg: "rgba(245,158,11,0.1)", text: "#D97706" },
  recovery: { bg: "rgba(124,58,237,0.1)", text: "#7C3AED" },
  health: { bg: "rgba(16,185,129,0.1)", text: "#059669" },
  sleep: { bg: "rgba(99,102,241,0.1)", text: "#4F46E5" },
  fat_loss: { bg: "rgba(239,68,68,0.1)", text: "#DC2626" },
  stress: { bg: "rgba(245,158,11,0.1)", text: "#B45309" },
  gut: { bg: "rgba(16,185,129,0.1)", text: "#047857" },
  immune: { bg: "rgba(59,130,246,0.1)", text: "#2563EB" },
  joints: { bg: "rgba(168,85,247,0.1)", text: "#7C3AED" },
  brain: { bg: "rgba(6,182,212,0.1)", text: "#0891B2" },
  performance: { bg: "rgba(225,29,72,0.1)", text: "#E11D48" },
  strength: { bg: "rgba(225,29,72,0.12)", text: "#BE123C" },
  vegan: { bg: "rgba(16,185,129,0.1)", text: "#047857" },
  vegetarian: { bg: "rgba(16,185,129,0.1)", text: "#059669" },
  keto: { bg: "rgba(245,158,11,0.1)", text: "#B45309" },
  intense: { bg: "rgba(225,29,72,0.1)", text: "#E11D48" },
  moderate: { bg: "rgba(124,58,237,0.08)", text: "#7C3AED" },
};

function Tag({ label }: { label: string }) {
  const color = TAG_COLORS[label] ?? { bg: "rgba(28,25,23,0.08)", text: "#78716C" };
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
      style={{ background: color.bg, color: color.text }}
    >
      {label.replace("_", " ")}
    </span>
  );
}

export default function Results({ stack, onReset }: ResultsProps) {
  return (
    <section className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
            style={{
              background: "rgba(124,58,237,0.08)",
              borderColor: "rgba(124,58,237,0.2)",
              color: "#7C3AED",
            }}
          >
            <span>✨</span>
            <span>Your personalized stack is ready</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black mb-4 leading-tight"
            style={{ color: "#1C1917" }}
          >
            Your Stack
          </h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: "#78716C" }}>
            {stack.length} supplement{stack.length !== 1 ? "s" : ""} chosen for
            your goals, activity level, and diet.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4 mb-14">
          {stack.map((supp, i) => (
            <article
              key={supp.name}
              className="rounded-3xl p-6 sm:p-8 border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.85)",
                borderColor: "rgba(28,25,23,0.08)",
              }}
            >
              <div className="flex items-start gap-4">
                {/* Number + emoji */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span
                    className="text-xs font-black w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg, #E11D48, #7C3AED)" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-3xl">{supp.emoji}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xl sm:text-2xl font-black mb-1"
                    style={{ color: "#1C1917" }}
                  >
                    {supp.name}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {supp.tags.slice(0, 3).map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                  </div>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#57534E" }}>
                    {supp.why}
                  </p>

                  {/* Dose + Timing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      className="rounded-xl p-3"
                      style={{ background: "rgba(225,29,72,0.05)" }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "#E11D48" }}>
                        Dose
                      </p>
                      <p className="text-sm font-semibold" style={{ color: "#1C1917" }}>
                        {supp.dose}
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-3"
                      style={{ background: "rgba(124,58,237,0.05)" }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "#7C3AED" }}>
                        When to take
                      </p>
                      <p className="text-sm font-semibold" style={{ color: "#1C1917" }}>
                        {supp.timing}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-2xl p-5 mb-10 border text-sm leading-relaxed"
          style={{
            background: "rgba(245,158,11,0.06)",
            borderColor: "rgba(245,158,11,0.25)",
            color: "#78716C",
          }}
        >
          <strong style={{ color: "#D97706" }}>⚠️ Heads up:</strong> This is for
          informational purposes only. Always consult your doctor or a registered
          dietitian before starting any new supplement regimen, especially if you
          take medications or have a medical condition.
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-105 active:scale-95 border-2"
            style={{
              borderColor: "#E11D48",
              color: "#E11D48",
              background: "transparent",
            }}
          >
            ← Start Over
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 rounded-2xl font-bold text-base text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #E11D48, #7C3AED)" }}
          >
            🖨️ Print / Save
          </button>
        </div>
      </div>
    </section>
  );
}
