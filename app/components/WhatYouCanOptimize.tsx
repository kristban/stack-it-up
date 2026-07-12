"use client";

import Link from "next/link";
import { useInView } from "../hooks/useInView";
import { OPTIMIZE_TOPICS } from "../lib/optimizeContent";
import { accentFor, BLUE_ACCENT, YELLOW_ACCENT } from "../lib/theme";

const GRID_COLS = 4;

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
                background: "#F4E14F",
                borderColor: "rgba(17,17,17,0.1)",
                color: "#8A6F0E",
              }}
            >
              <span>◡</span>
              <span>Tailored to you</span>
            </div>
          </FadeInSection>

          <FadeInSection delay={80}>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight"
              style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
            >
              What you can optimize
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "#6B6558" }}>
              Every routine is built around the areas that matter most to you.
              Tap a card to learn more.
            </p>
          </FadeInSection>
        </div>

        {/* Benefit tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {OPTIMIZE_TOPICS.map((b, i) => {
            const col = i % GRID_COLS;
            const row = Math.floor(i / GRID_COLS);
            const featured = (row + col) % 2 === 1;
            const featuredAccent = col < GRID_COLS / 2 ? BLUE_ACCENT : YELLOW_ACCENT;
            const iconAccent = accentFor(b.slug);
            return (
              <FadeInSection key={b.slug} delay={(i % 4) * 100}>
                <Link
                  href={`/optimize/${b.slug}`}
                  className="group block h-full rounded-3xl p-5 sm:p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2"
                  style={{
                    background: featured ? featuredAccent.bg : "#FFFFFF",
                    borderColor: featured ? "transparent" : "rgba(17,17,17,0.08)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center text-xl"
                    style={{ background: featured ? "rgba(255,255,255,0.6)" : iconAccent.bg }}
                  >
                    {b.emoji}
                  </div>

                  <h3
                    className="text-base sm:text-lg mb-1 leading-snug tracking-tight"
                    style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
                  >
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: featured ? "#3A362E" : "#6B6558" }}>
                    {b.tagline}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: "#111111" }}
                  >
                    Learn more →
                  </span>
                </Link>
              </FadeInSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
