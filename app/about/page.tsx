import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, SectionHeading } from "../components/PageCard";

export const metadata: Metadata = {
  title: "About — StackItUp",
  description: "Why we built StackItUp and how we think about supplements.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="px-4 py-16 sm:py-24 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-24 w-72 h-72 rounded-[3rem] opacity-60 pointer-events-none rotate-12"
            style={{ background: "#CFE0F7" }}
          />

          <div className="max-w-2xl mx-auto relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
              style={{ color: "#6B6558" }}
            >
              ← Back to StackItUp
            </Link>

            <div className="mb-10">
              <div
                aria-hidden="true"
                className="w-16 h-16 mb-5 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "#CFE0F7" }}
              >
                🌿
              </div>

              <h1
                className="text-4xl sm:text-5xl mb-3 leading-tight tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                About StackItUp
              </h1>
              <p className="text-lg" style={{ color: "#6B6558" }}>
                Personalized supplement routines, built without the noise.
              </p>
            </div>

            <Card>
              <SectionHeading emoji="💭">Why we built this</SectionHeading>
              <div className="space-y-3">
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  Supplement aisles and shopping sites are overwhelming — hundreds of
                  products, most making similar promises, few explaining why they'd
                  actually help you. We built StackItUp to cut through that: answer a
                  few honest questions about your goals and your day, and get a short,
                  specific routine instead of a wall of options.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  We're not a supplement brand and we don't sell anything here. The
                  recommendations are grounded in well-studied ingredients with clear,
                  plain-language reasoning — not trends.
                </p>
              </div>
            </Card>

            <Card>
              <SectionHeading emoji="🧭">How we think about it</SectionHeading>
              <ul className="space-y-3">
                {[
                  "No account, no email, no dark patterns — your answers stay in your browser.",
                  "Fewer, better supplements over a long list of maybes.",
                  "Habits and supplements work together — we always point out the free stuff too.",
                  "If a supplement isn't well-studied for your goal, it doesn't make the list.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#4A6FA5" }}
                    />
                    <span className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <SectionHeading emoji="✉️">Get in touch</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                Questions, feedback, or found something that seems off in a
                recommendation? We'd like to hear about it at{" "}
                <a
                  href="mailto:hello@stackitup.app"
                  className="font-medium underline"
                  style={{ color: "#111111" }}
                >
                  hello@stackitup.app
                </a>
                .
              </p>
            </Card>

            <div
              className="rounded-3xl p-8 sm:p-10 text-center mb-10"
              style={{ background: "#111111" }}
            >
              <h2
                className="text-2xl sm:text-3xl mb-3 tracking-tight"
                style={{ color: "#FFFFFF", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                Ready to build your routine?
              </h2>
              <p className="text-base mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                Answer five gentle questions and get a personalized routine, free.
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
