"use client";

import { useInView } from "../hooks/useInView";

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
    emoji: "⚙️",
    title: "We build your stack",
    description:
      "Our engine scores 14+ supplements against your answers and picks the best match — no filler, no fluff.",
  },
  {
    number: "03",
    emoji: "💊",
    title: "Get your routine",
    description:
      "Each supplement comes with an explanation of why it was chosen, the right dose, and exactly when to take it.",
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
    <section className="px-4 py-20 sm:py-28">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <FadeInSection>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 border"
              style={{
                background: "rgba(245,158,11,0.08)",
                borderColor: "rgba(245,158,11,0.3)",
                color: "#D97706",
              }}
            >
              <span>⚡</span>
              <span>Simple by design</span>
            </div>
          </FadeInSection>

          <FadeInSection delay={80}>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight"
              style={{ color: "#1C1917" }}
            >
              How it works
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "#78716C" }}>
              From zero to a personalised supplement routine in under 60 seconds.
            </p>
          </FadeInSection>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <FadeInSection key={step.number} delay={i * 120}>
              <div
                className="relative h-full rounded-3xl p-8 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  borderColor: "rgba(28,25,23,0.08)",
                }}
              >
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-12 left-full w-6 h-0.5 z-10"
                    style={{ background: "linear-gradient(90deg, #E11D48, #7C3AED)", opacity: 0.3 }}
                  />
                )}

                <span
                  className="text-xs font-black tracking-widest uppercase mb-4 block"
                  style={{
                    background: "linear-gradient(135deg, #E11D48, #7C3AED)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {step.number}
                </span>

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: "rgba(225,29,72,0.07)" }}
                >
                  {step.emoji}
                </div>

                <h3 className="text-xl font-black mb-2" style={{ color: "#1C1917" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
                  {step.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>

        {/* Bottom note */}
        <FadeInSection delay={360}>
          <p className="text-center text-sm mt-10" style={{ color: "#A8A29E" }}>
            No account required &middot; No email &middot; 100% free &middot; Results stay in your browser
          </p>
        </FadeInSection>
      </div>
    </section>
  );
}
