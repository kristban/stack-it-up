"use client";

import { Supplement } from "../lib/types";

interface ResultsProps {
  stack: Supplement[];
  onReset: () => void;
}

const TAG_PALETTE = [
  { bg: "rgba(196,116,74,0.1)", text: "#C4744A" }, // terracotta
  { bg: "rgba(38,43,48,0.08)", text: "#3D444B" }, // charcoal
  { bg: "rgba(139,145,116,0.15)", text: "#5F6753" }, // olive
  { bg: "rgba(227,195,156,0.35)", text: "#8A6A3E" }, // tan
];

const BLOBS = ["#E3C39C", "#8B9174", "#C4744A", "#262B30"];

function tagColor(label: string) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  return TAG_PALETTE[hash % TAG_PALETTE.length];
}

function blobColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return BLOBS[hash % BLOBS.length];
}

function Tag({ label }: { label: string }) {
  const color = tagColor(label);
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border"
            style={{
              background: "rgba(139,145,116,0.12)",
              borderColor: "rgba(38,32,25,0.1)",
              color: "#5F6753",
            }}
          >
            <span>✨</span>
            <span>Your personalized routine is ready</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl mb-4 leading-tight"
            style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
          >
            Your Daily Essentials
          </h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: "#6E6153" }}>
            {stack.length} supplement{stack.length !== 1 ? "s" : ""}, chosen for
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
                background: "#FFFFFF",
                borderColor: "rgba(38,32,25,0.08)",
              }}
            >
              <div className="flex items-start gap-5">
                {/* Icon on blob */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <div
                    className="blob absolute inset-0"
                    style={{ background: `${blobColor(supp.name)}30` }}
                  />
                  <div className="relative w-full h-full flex items-center justify-center text-3xl">
                    {supp.emoji}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#E3C39C", color: "#262019" }}
                    >
                      {i + 1}
                    </span>
                    <h3
                      className="text-xl sm:text-2xl"
                      style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
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

                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#4A4038" }}>
                    {supp.why}
                  </p>

                  {/* Dose + Timing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      className="rounded-xl p-3"
                      style={{ background: "rgba(196,116,74,0.07)" }}
                    >
                      <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: "#C4744A" }}>
                        Dose
                      </p>
                      <p className="text-sm font-medium" style={{ color: "#262019" }}>
                        {supp.dose}
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-3"
                      style={{ background: "rgba(139,145,116,0.1)" }}
                    >
                      <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: "#5F6753" }}>
                        When to take
                      </p>
                      <p className="text-sm font-medium" style={{ color: "#262019" }}>
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
            background: "rgba(227,195,156,0.2)",
            borderColor: "rgba(227,195,156,0.5)",
            color: "#6E6153",
          }}
        >
          <strong style={{ color: "#8A6A3E" }}>A gentle note:</strong> This is for
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
              borderColor: "#C4744A",
              color: "#C4744A",
              background: "transparent",
            }}
          >
            ← Start Over
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 rounded-full font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "#C4744A", color: "#FFFFFF" }}
          >
            Print / Save
          </button>
        </div>
      </div>
    </section>
  );
}
