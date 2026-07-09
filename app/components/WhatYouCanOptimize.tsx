"use client";

import { useInView } from "../hooks/useInView";

const BENEFITS = [
  { emoji: "⚡", title: "Energy & Focus", description: "Steadier days, less afternoon slump.", blob: "#E3C39C" },
  { emoji: "😴", title: "Sleep Quality", description: "Fall asleep easier, wake up rested.", blob: "#8B9174" },
  { emoji: "💪", title: "Muscle & Strength", description: "Support training gains over time.", blob: "#C4744A" },
  { emoji: "🔄", title: "Recovery", description: "Bounce back faster between sessions.", blob: "#262B30" },
  { emoji: "🧘", title: "Stress & Calm", description: "Take the edge off a long day.", blob: "#8B9174" },
  { emoji: "🫀", title: "Gut Health", description: "Ease digestion, feel less bloated.", blob: "#C4744A" },
  { emoji: "🛡️", title: "Immune Support", description: "Stay resilient through the seasons.", blob: "#E3C39C" },
  { emoji: "🦴", title: "Joint Comfort", description: "Move easier, ache less.", blob: "#262B30" },
];

function FadeInSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`fade-in-up${inView ? " visible" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function WhatYouCanOptimize() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <FadeInSection>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5 border"
              style={{
                background: "rgba(196,116,74,0.1)",
                borderColor: "rgba(38,32,25,0.1)",
                color: "#A85F39",
              }}
            >
              <span>◡</span>
              <span>Tailored to you</span>
            </div>
          </FadeInSection>

          <FadeInSection delay={80}>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-tight"
              style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
            >
              What you can optimize
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "#6E6153" }}>
              Every routine is built around the areas that matter most to you.
            </p>
          </FadeInSection>
        </div>

        {/* Benefit tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {BENEFITS.map((b, i) => (
            <FadeInSection key={b.title} delay={(i % 4) * 100}>
              <div
                className="h-full rounded-3xl p-5 sm:p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  background: "#FFFFFF",
                  borderColor: "rgba(38,32,25,0.08)",
                }}
              >
                <div className="relative w-12 h-12 mb-4">
                  <div
                    className="blob absolute inset-0"
                    style={{ background: `${b.blob}33` }}
                  />
                  <div className="relative w-full h-full flex items-center justify-center text-xl">
                    {b.emoji}
                  </div>
                </div>

                <h3
                  className="text-base sm:text-lg mb-1 leading-snug"
                  style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
                >
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6E6153" }}>
                  {b.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
