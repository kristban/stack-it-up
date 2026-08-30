"use client";

import Link from "next/link";
import { useInView } from "../hooks/useInView";
import { FeaturedStack } from "../lib/featuredStacks";
import { accentFor, BLUE_ACCENT, YELLOW_ACCENT } from "../lib/theme";

const GRID_COLS = 3;

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

interface FeaturedStacksProps {
  stacks: FeaturedStack[];
}

export default function FeaturedStacks({ stacks }: FeaturedStacksProps) {
  if (stacks.length === 0) return null;

  return (
    <section className="px-4 py-20 sm:py-28" style={{ background: "#F5F3EC" }}>
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <FadeInSection>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5 border"
              style={{
                background: "#CFE0F7",
                borderColor: "rgba(17,17,17,0.1)",
                color: "#2F5580",
              }}
            >
              <span aria-hidden="true">✦</span>
              <span>Curated for you</span>
            </div>
          </FadeInSection>

          <FadeInSection delay={80}>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight"
              style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
            >
              Featured stacks
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "#6B6558" }}>
              Ready-made combinations built around a single goal — skip the quiz
              and jump straight to one that fits.
            </p>
          </FadeInSection>
        </div>

        {/* Stack cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {stacks.map((stack, i) => {
            const col = i % GRID_COLS;
            const featuredAccent = col % 2 === 0 ? BLUE_ACCENT : YELLOW_ACCENT;
            const iconAccent = accentFor(stack.key);
            return (
              <FadeInSection key={stack.key} delay={(i % 6) * 80}>
                <Link
                  href={`/stacks/${stack.key}`}
                  className="group block h-full rounded-3xl p-5 sm:p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2"
                  style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
                >
                  <div
                    aria-hidden="true"
                    className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center text-xl"
                    style={{ background: iconAccent.bg }}
                  >
                    {stack.emoji}
                  </div>

                  <h3
                    className="text-base sm:text-lg mb-1 leading-snug tracking-tight"
                    style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
                  >
                    {stack.name}
                  </h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#6B6558" }}>
                    {stack.tagline}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: featuredAccent.text }}
                  >
                    View stack →
                  </span>
                </Link>
              </FadeInSection>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/stacks"
            className="inline-flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: "#111111" }}
          >
            See all stacks →
          </Link>
        </div>
      </div>
    </section>
  );
}
