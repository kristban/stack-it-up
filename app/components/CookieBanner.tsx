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
        background: "rgba(245,243,236,0.97)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(17,17,17,0.1)",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <p className="text-sm leading-relaxed text-center sm:text-left flex-1" style={{ color: "#14130F" }}>
          <span aria-hidden="true" className="mr-1.5">🍪</span>
          We use cookies to improve your experience and keep StackItUp running
          smoothly. By continuing, you agree to our use of cookies. Read more in
          our{" "}
          <a href="/privacy" className="underline font-medium" style={{ color: "#111111" }}>
            Privacy Policy
          </a>
          .
        </p>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="px-5 py-2.5 rounded-full font-medium text-sm border-2 transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ borderColor: "rgba(17,17,17,0.2)", color: "#14130F" }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ background: "#111111", color: "#FFFFFF" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
