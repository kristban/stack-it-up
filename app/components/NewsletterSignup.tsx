"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitted");
  }

  return (
    <div
      id="newsletter"
      className="rounded-3xl border px-6 py-10 sm:px-10 sm:py-12 mb-10 scroll-mt-24"
      style={{ background: "#F4E14F", borderColor: "rgba(17,17,17,0.08)" }}
    >
      <div className="max-w-md mx-auto text-center">
        <h3
          className="text-2xl mb-2 tracking-tight"
          style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
        >
          Join the newsletter
        </h3>
        <p className="text-sm mb-6" style={{ color: "#5C512A" }}>
          Occasional tips on supplements and gut health. No spam, unsubscribe anytime.
        </p>

        {status === "submitted" ? (
          <p className="text-sm font-medium" style={{ color: "#111111" }}>
            Thanks for subscribing! Check your inbox soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="newsletter-first-name" className="sr-only">
              First name
            </label>
            <input
              id="newsletter-first-name"
              name="firstName"
              type="text"
              required
              placeholder="First name"
              autoComplete="given-name"
              className="flex-1 min-w-0 px-4 py-2.5 rounded-full border text-sm outline-none transition-colors focus:border-[#111111]"
              style={{ borderColor: "rgba(17,17,17,0.15)", background: "#FFFFFF", color: "#111111" }}
            />

            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              autoComplete="email"
              className="flex-1 min-w-0 px-4 py-2.5 rounded-full border text-sm outline-none transition-colors focus:border-[#111111]"
              style={{ borderColor: "rgba(17,17,17,0.15)", background: "#FFFFFF", color: "#111111" }}
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ background: "#111111", color: "#FFFFFF" }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
