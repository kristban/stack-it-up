import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getSupplements } from "../lib/supplements";
import { accentFor } from "../lib/theme";

export const metadata: Metadata = {
  title: "Supplements — StackItUp",
  description: "Browse every supplement in our library — what it does, the dose, and when to take it.",
};

export default async function SupplementsPage() {
  const supplements = await getSupplements();

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="px-4 py-16 sm:py-24 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-24 w-72 h-72 rounded-[3rem] opacity-60 pointer-events-none rotate-6"
            style={{ background: "#CFE0F7" }}
          />

          <div className="max-w-5xl mx-auto relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
              style={{ color: "#6B6558" }}
            >
              ← Back to StackItUp
            </Link>

            <div className="mb-12 max-w-2xl">
              <h1
                className="text-4xl sm:text-5xl mb-3 leading-tight tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                Supplements
              </h1>
              <p className="text-lg" style={{ color: "#6B6558" }}>
                Every supplement in our library — what it does, the dose, and when to take it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-14">
              {supplements.map((supp) => {
                const accent = accentFor(supp.key);
                return (
                  <Link
                    key={supp.key}
                    href={`/supplements/${supp.key}`}
                    className="group block h-full rounded-3xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2"
                    style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
                  >
                    <div
                      aria-hidden="true"
                      className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-2xl"
                      style={{ background: accent.bg }}
                    >
                      {supp.emoji}
                    </div>
                    <h2
                      className="text-lg mb-1 leading-snug tracking-tight"
                      style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
                    >
                      {supp.name}
                    </h2>
                    <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#6B6558" }}>
                      {supp.why}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: "#111111" }}
                    >
                      Learn more →
                    </span>
                  </Link>
                );
              })}
            </div>

            <div
              className="rounded-3xl p-8 sm:p-10 text-center mb-10"
              style={{ background: "#111111" }}
            >
              <h2
                className="text-2xl sm:text-3xl mb-3 tracking-tight"
                style={{ color: "#FFFFFF", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                Not sure where to start?
              </h2>
              <p className="text-base mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                Answer five gentle questions and get a personalized routine pulled from this library.
              </p>
              <Link
                href="/?start=quiz"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: "#F4E14F", color: "#111111" }}
              >
                Find My Routine →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
