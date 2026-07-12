"use client";

import { Supplement } from "../lib/types";
import { accentFor } from "../lib/theme";

interface ResultsProps {
  stack: Supplement[];
  onReset: () => void;
}

function Tag({ label }: { label: string }) {
  const accent = accentFor(label);
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
      style={{ background: accent.soft, color: accent.text }}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border"
            style={{
              background: "#F4E14F",
              borderColor: "rgba(17,17,17,0.1)",
              color: "#8A6F0E",
            }}
          >
            <span>✨</span>
            <span>Your personalized routine is ready</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl mb-4 leading-tight tracking-tight"
            style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
          >
            Your Daily Essentials
          </h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: "#6B6558" }}>
            {stack.length} supplement{stack.length !== 1 ? "s" : ""}, chosen for
            your goals, activity level, and diet.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4 mb-14">
          {stack.map((supp, i) => {
            const accent = accentFor(supp.name);
            return (
              <article
                key={supp.name}
                className="rounded-3xl p-6 sm:p-8 border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{
                  background: "#FFFFFF",
                  borderColor: "rgba(17,17,17,0.08)",
                }}
              >
                <div className="flex items-start gap-5">
                  {/* Icon tile */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: accent.bg }}
                  >
                    {supp.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "#111111", color: "#FFFFFF" }}
                      >
                        {i + 1}
                      </span>
                      <h3
                        className="text-xl sm:text-2xl tracking-tight"
                        style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
                      >
                        {supp.name}
                      </h3>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {supp.tags.slice(0, 3).map((t) => (
                        <Tag key={t} label={t} />
                      ))}
                    </div>

                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#3A362E" }}>
                      {supp.why}
                    </p>

                    {/* Dose + Timing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        className="rounded-xl p-3"
                        style={{ background: "#CFE0F7" }}
                      >
                        <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: "#4A6FA5" }}>
                          Dose
                        </p>
                        <p className="text-sm font-medium" style={{ color: "#111111" }}>
                          {supp.dose}
                        </p>
                      </div>
                      <div
                        className="rounded-xl p-3"
                        style={{ background: "#F4E14F" }}
                      >
                        <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: "#8A6F0E" }}>
                          When to take
                        </p>
                        <p className="text-sm font-medium" style={{ color: "#111111" }}>
                          {supp.timing}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-2xl p-5 mb-10 border text-sm leading-relaxed"
          style={{
            background: "#F5F3EC",
            borderColor: "rgba(17,17,17,0.1)",
            color: "#6B6558",
          }}
        >
          <strong style={{ color: "#111111" }}>A gentle note:</strong> This is for
          informational purposes only. Always consult your doctor or a registered
          dietitian before starting any new supplement regimen, especially if you
          take medications or have a medical condition.
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-8 py-4 rounded-full font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95 border-2"
            style={{
              borderColor: "#111111",
              color: "#111111",
              background: "transparent",
            }}
          >
            ← Start Over
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 rounded-full font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "#111111", color: "#FFFFFF" }}
          >
            Print / Save
          </button>
        </div>
      </div>
    </section>
  );
}
