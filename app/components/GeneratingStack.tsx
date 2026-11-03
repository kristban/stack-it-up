"use client";

import { useEffect, useState } from "react";

// Fake determinate progress: the Gemini call has no real progress events, but
// a stalled-looking spinner reads as broken for a ~20s wait. Ease toward 90%
// over that window and let the caller's unmount (on response) be the signal
// that it's "done" rather than snapping this bar to 100% itself.
const EASE_DURATION_MS = 20_000;
const EASE_TARGET = 90;

export default function GeneratingStack() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / EASE_DURATION_MS, 1);
      // Ease-out: fast at first, slowing as it approaches the target.
      const eased = 1 - Math.pow(1 - t, 2);
      setProgress(eased * EASE_TARGET);
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <p
          className="text-2xl sm:text-3xl mb-8 leading-tight tracking-tight"
          style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
        >
          Generating your stack…
        </p>
        <div
          className="w-full h-2.5 rounded-full overflow-hidden"
          style={{ background: "rgba(17,17,17,0.08)" }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Generating your personalized routine"
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%`, background: "#111111" }}
          />
        </div>
        <p className="text-sm mt-4" style={{ color: "#6B6558" }}>
          Matching your answers to our supplement library — this takes about 20 seconds.
        </p>
      </div>
    </section>
  );
}
