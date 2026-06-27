"use client";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#E11D48" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#7C3AED" }}
      />

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border"
        style={{
          background: "rgba(225, 29, 72, 0.08)",
          borderColor: "rgba(225, 29, 72, 0.2)",
          color: "#E11D48",
        }}
      >
        <span>💊</span>
        <span>AI-Powered Supplement Stacks</span>
      </div>

      <h1
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6"
        style={{ color: "#1C1917" }}
      >
        Stack
        <span
          className="block"
          style={{
            background: "linear-gradient(135deg, #E11D48, #7C3AED)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          It Up.
        </span>
      </h1>

      <p
        className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-4 leading-relaxed"
        style={{ color: "#78716C" }}
      >
        Answer 5 quick questions. Get a personalized supplement routine built
        for your goals, activity level, and diet.
      </p>

      <p className="text-sm mb-12" style={{ color: "#A8A29E" }}>
        No account needed. Free forever. Results in 60 seconds.
      </p>

      <button
        onClick={onStart}
        className="group relative px-10 py-5 rounded-2xl text-white font-bold text-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        style={{
          background: "linear-gradient(135deg, #E11D48, #7C3AED)",
        }}
      >
        <span className="relative z-10 flex items-center gap-3">
          Build My Stack
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background: "linear-gradient(135deg, #BE123C, #6D28D9)",
          }}
        />
      </button>

      {/* Social proof */}
      <div className="mt-16 flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
        {[
          { stat: "10,000+", label: "stacks built" },
          { stat: "5 questions", label: "that's all it takes" },
          { stat: "100% free", label: "no upsells" },
        ].map((item) => (
          <div key={item.stat} className="text-center">
            <div className="text-2xl font-black" style={{ color: "#1C1917" }}>
              {item.stat}
            </div>
            <div className="text-sm" style={{ color: "#A8A29E" }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
