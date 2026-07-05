"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "stackitup-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-5 sm:py-6 border-t"
      style={{
        background: "rgba(255,251,235,0.97)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(28,25,23,0.1)",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <p className="text-sm leading-relaxed text-center sm:text-left flex-1" style={{ color: "#1C1917" }}>
          <span className="mr-1.5">🍪</span>
          We use cookies to improve your experience and keep StackItUp running
          smoothly. By continuing, you agree to our use of cookies. Read more in
          our{" "}
          <a href="#" className="underline font-semibold" style={{ color: "#7C3AED" }}>
            Privacy Policy
          </a>
          .
        </p>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ borderColor: "rgba(28,25,23,0.2)", color: "#57534E" }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #E11D48, #7C3AED)" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
