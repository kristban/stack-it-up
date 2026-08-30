import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFeaturedStacks } from "../lib/featuredStacks";
import JsonLd from "../components/JsonLd";
import { accentFor } from "../lib/theme";
import { pageMetadata, absoluteUrl } from "../lib/seo";
import { collectionPageJsonLd } from "../lib/structuredData";

const TITLE = "Featured Supplement Stacks";
const DESCRIPTION =
  "Curated supplement combinations for sleep, recovery, longevity, and more — see what's included and why.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/stacks",
});

export default async function StacksPage() {
  const stacks = await getFeaturedStacks();

  return (
    <>
      <JsonLd
        data={collectionPageJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          path: "/stacks",
          items: stacks.map((s) => ({ name: s.name, url: absoluteUrl(`/stacks/${s.key}`) })),
        })}
      />
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
                Featured Stacks
              </h1>
              <p className="text-lg" style={{ color: "#6B6558" }}>
                Ready-made combinations built around a single goal. Skip the quiz
                and jump straight to one that fits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-14">
              {stacks.map((stack) => {
                const accent = accentFor(stack.key);
                return (
                  <Link
                    key={stack.key}
                    href={`/stacks/${stack.key}`}
                    className="group block h-full rounded-3xl p-5 sm:p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                    style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
                  >
                    <div
                      aria-hidden="true"
                      className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center text-xl"
                      style={{ background: accent.bg }}
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
                      style={{ color: "#111111" }}
                    >
                      View stack →
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
                None of these quite fit?
              </h2>
              <p className="text-base mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                Answer six gentle questions and get a routine built specifically for you.
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
