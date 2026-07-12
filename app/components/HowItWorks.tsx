"use client";

import { useInView } from "../hooks/useInView";
import { accentFor } from "../lib/theme";

const STEPS = [
  {
    number: "01",
    emoji: "📋",
    title: "Answer 5 questions",
    description:
      "Tell us your main goal, how active you are, your diet, any specific concerns, and your monthly budget.",
  },
  {
    number: "02",
    emoji: "🌤️",
    title: "We build your routine",
    description:
      "Our engine weighs your answers against a curated set of well-researched supplements — no filler, no fluff.",
  },
  {
    number: "03",
    emoji: "🌿",
    title: "Get your routine",
    description:
      "Each supplement comes with a plain-language reason, the right dose, and exactly when to take it.",
  },
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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:py-28 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <FadeInSection>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5 border"
              style={{
                background: "#CFE0F7",
                borderColor: "rgba(17,17,17,0.1)",
                color: "#4A6FA5",
              }}
            >
              <span>◡</span>
              <span>Simple, on purpose</span>
            </div>
          </FadeInSection>

          <FadeInSection delay={80}>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight"
              style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
            >
              How it works
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "#6B6558" }}>
              From zero to a personalized supplement routine, without the overwhelm.
            </p>
          </FadeInSection>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => {
            const accent = accentFor(step.number);
            return (
              <FadeInSection key={step.number} delay={i * 120}>
                <div
                  className="relative h-full rounded-3xl p-8 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                  style={{
                    background: "#FFFFFF",
                    borderColor: "rgba(17,17,17,0.08)",
                  }}
                >
                  <span
                    className="inline-block text-xs tracking-widest uppercase mb-4 px-2.5 py-1 rounded-full"
                    style={{ background: accent.soft, color: accent.text, fontFamily: "var(--font-heading)", fontWeight: 700 }}
                  >
                    {step.number}
                  </span>

                  <div
                    className="w-14 h-14 rounded-2xl mb-5 flex items-center justify-center text-2xl"
                    style={{ background: accent.bg }}
                  >
                    {step.emoji}
                  </div>

                  <h3
                    className="text-xl mb-2 tracking-tight"
                    style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B6558" }}>
                    {step.description}
                  </p>
                </div>
              </FadeInSection>
            );
          })}
        </div>

        {/* Bottom note */}
        <FadeInSection delay={360}>
          <p className="text-center text-sm mt-10" style={{ color: "#8A8172" }}>
            No account required &middot; No email &middot; 100% free &middot; Results stay in your browser
          </p>
        </FadeInSection>
      </div>
    </section>
  );
}
