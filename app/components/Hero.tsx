"use client";

import Image from "next/image";

interface HeroProps {
  onStart: () => void;
}

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      {/* Organic blob shapes */}
      <div
        className="blob absolute -top-24 -left-24 w-80 h-80 opacity-90 pointer-events-none"
        style={{ background: "#E3C39C" }}
      />
      <div
        className="blob-2 absolute top-1/3 -right-32 w-96 h-96 opacity-80 pointer-events-none"
        style={{ background: "#262B30" }}
      />
      <div
        className="blob-3 absolute -bottom-20 left-1/4 w-72 h-72 opacity-90 pointer-events-none"
        style={{ background: "#C4744A" }}
      />

      {/* Badge */}
      <div
        className="fade-in-up visible relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 border"
        style={{
          background: "rgba(255,255,255,0.85)",
          borderColor: "rgba(38,32,25,0.12)",
          color: "#6E6153",
          ...delay(0),
        }}
      >
        <span>🌿</span>
        <span>A calmer way to supplement</span>
      </div>

      <h1
        className="fade-in-up visible relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6"
        style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700, ...delay(80) }}
      >
        Your Personalized
        <span className="block" style={{ color: "#C4744A" }}>
          Supplement Routine
        </span>
      </h1>

      <p
        className="fade-in-up visible relative text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
        style={{ color: "#6E6153", ...delay(160) }}
      >
        Answer five gentle questions and get a routine grounded in your
        goals, your body, and your day.
      </p>

      <p className="fade-in-up visible relative text-sm mb-12" style={{ color: "#8B7E6E", ...delay(220) }}>
        No account. No pressure. Just clarity, in under a minute.
      </p>

      <div className="fade-in-up visible relative" style={delay(300)}>
        <button
          onClick={onStart}
          className="px-10 py-5 rounded-full text-lg font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm hover:shadow-md"
          style={{ background: "#C4744A", color: "#FFFFFF" }}
        >
          Find My Routine →
        </button>
      </div>

      {/* Hero photo (hidden on mobile) */}
      <div
        className="fade-in-up visible relative mt-14 w-full max-w-xl mx-auto rounded-[2.5rem] overflow-hidden shadow-xl border-4 hidden sm:block"
        style={{ borderColor: "rgba(255,255,255,0.7)", ...delay(360) }}
      >
        <div className="relative w-full aspect-[16/10]">
          <Image
            src="https://images.unsplash.com/photo-1664956618021-73c47736845e?auto=format&fit=crop&w=1200&q=80"
            alt="Natural supplement capsules spilling from a jar beside fresh greenery"
            fill
            sizes="576px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Soft trust row */}
      <div
        className="fade-in-up visible relative mt-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-12"
        style={delay(440)}
      >
        {[
          { stat: "5", label: "minutes, start to finish" },
          { stat: "0", label: "accounts or email required" },
          { stat: "100%", label: "free, always" },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div
              className="text-2xl"
              style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
            >
              {item.stat}
            </div>
            <div className="text-sm" style={{ color: "#8B7E6E" }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
