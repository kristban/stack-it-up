"use client";

import Image from "next/image";
import Link from "next/link";
import { OPTIMIZE_TOPICS } from "../lib/optimizeContent";

interface HeroProps {
  onStart: () => void;
}

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

const CHIP_TOPICS = OPTIMIZE_TOPICS.slice(0, 6);
const CHIP_ROTATIONS = ["-3deg", "2deg", "-1.5deg", "2.5deg", "-2deg", "1.5deg"];

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="px-4 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Badge */}
          <div className="lg:col-span-12 fade-in-up visible" style={delay(0)}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
              style={{
                background: "#FFFFFF",
                borderColor: "rgba(17,17,17,0.1)",
                color: "#6B6558",
              }}
            >
              <span>🌿</span>
              <span>A calmer way to supplement</span>
            </div>
          </div>

          {/* Headline */}
          <div className="lg:col-span-7 fade-in-up visible" style={delay(80)}>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95]"
              style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
            >
              Your Personalized
              <span className="block" style={{ color: "#4A6FA5" }}>
                Supplement Routine
              </span>
            </h1>
          </div>

          {/* Trust stats card */}
          <div
            className="lg:col-span-5 rounded-3xl p-6 flex items-center justify-around fade-in-up visible"
            style={{ background: "#F4E14F", ...delay(160) }}
          >
            {[
              { stat: "5", label: "minutes" },
              { stat: "0", label: "signup" },
              { stat: "100%", label: "free" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="text-3xl tracking-tight"
                  style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
                >
                  {item.stat}
                </div>
                <div className="text-xs font-medium" style={{ color: "#5C512A" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Subtext + CTA */}
          <div
            className="lg:col-span-7 rounded-3xl bg-white p-6 sm:p-8 flex flex-col justify-between gap-6 border fade-in-up visible"
            style={{ borderColor: "rgba(17,17,17,0.08)", ...delay(240) }}
          >
            <div>
              <p className="text-lg sm:text-xl leading-relaxed mb-3" style={{ color: "#14130F" }}>
                Answer five gentle questions and get a routine grounded in your
                goals, your body, and your day.
              </p>
              <p className="text-sm" style={{ color: "#6B6558" }}>
                No account. No pressure. Just clarity, in under a minute.
              </p>
            </div>

            <button
              onClick={onStart}
              className="self-start flex items-center gap-3 pl-7 pr-2 py-2 rounded-full text-lg font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "#111111", color: "#FFFFFF" }}
            >
              Find My Routine
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-base"
                style={{ background: "rgba(255,255,255,0.16)" }}
              >
                →
              </span>
            </button>
          </div>

          {/* Explore chip stack */}
          <div
            className="lg:col-span-5 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 fade-in-up visible"
            style={{ background: "#CFE0F7", ...delay(320) }}
          >
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#4A6FA5" }}>
              Explore
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {CHIP_TOPICS.map((topic, i) => (
                <Link
                  key={topic.slug}
                  href={`/optimize/${topic.slug}`}
                  className="px-4 py-2 rounded-full bg-white text-sm font-medium shadow-sm transition-transform duration-200 hover:scale-105"
                  style={{ color: "#14130F", transform: `rotate(${CHIP_ROTATIONS[i]})` }}
                >
                  {topic.emoji} {topic.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Hero photo */}
          <div
            className="lg:col-span-12 rounded-[2.5rem] overflow-hidden hidden sm:block fade-in-up visible"
            style={delay(400)}
          >
            <div className="relative w-full aspect-[21/9]">
              <Image
                src="https://images.unsplash.com/photo-1664956618021-73c47736845e?auto=format&fit=crop&w=1600&q=80"
                alt="Natural supplement capsules spilling from a jar beside fresh greenery"
                fill
                sizes="1152px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
