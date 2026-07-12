import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, SectionHeading } from "../components/PageCard";

export const metadata: Metadata = {
  title: "FAQ — StackItUp",
  description: "Common questions about how StackItUp works, your data, and our recommendations.",
};

interface FaqGroup {
  emoji: string;
  title: string;
  items: { question: string; answer: string }[];
}

const FAQ_GROUPS: FaqGroup[] = [
  {
    emoji: "🧭",
    title: "Getting started",
    items: [
      {
        question: "Is StackItUp free?",
        answer:
          "Yes, completely. No account, no email, no hidden paywall — answer the quiz and get your routine.",
      },
      {
        question: "Do I need to create an account?",
        answer:
          "No. There are no accounts on StackItUp. Your answers are processed in your browser and your results aren't saved anywhere unless you choose to write them down.",
      },
      {
        question: "How long does the quiz take?",
        answer: "About a minute — five questions covering your goal, activity level, diet, and any specific concerns.",
      },
      {
        question: "Can I retake the quiz?",
        answer:
          "Yes, any time. Click \"Start Quiz\" in the navigation and go through it again — nothing is saved between sessions, so feel free to experiment.",
      },
    ],
  },
  {
    emoji: "🧪",
    title: "The recommendations",
    items: [
      {
        question: "Where do the recommendations come from?",
        answer:
          "We match your answers against a curated set of well-studied supplements. Each pick comes with plain-language reasoning, a suggested dose, and timing.",
      },
      {
        question: "Is this medical advice?",
        answer:
          "No. StackItUp is educational, not medical advice. Always check with a doctor or pharmacist before starting a new supplement, especially if you're pregnant, nursing, on medication, or managing a health condition. See our Terms of Service for details.",
      },
      {
        question: "Do you sell the supplements you recommend?",
        answer:
          "No. We're not a supplement brand and don't sell anything on this site. Recommendations are ingredient- and brand-agnostic.",
      },
      {
        question: "Why does the routine include daily habits, not just supplements?",
        answer:
          "Because supplements work best alongside the basics — sleep, hydration, movement. We'd rather tell you when a free habit change matters more than another pill.",
      },
    ],
  },
  {
    emoji: "🔒",
    title: "Privacy & data",
    items: [
      {
        question: "Do you store my quiz answers?",
        answer:
          "No. Your answers and results are calculated entirely in your browser and are never sent to our servers.",
      },
      {
        question: "What does the cookie banner track?",
        answer:
          "Just your accept/decline choice, saved locally in your browser so we don't ask again. See our Privacy Policy for the full breakdown.",
      },
    ],
  },
  {
    emoji: "✉️",
    title: "Still have questions?",
    items: [
      {
        question: "How do I get in touch?",
        answer: "Email us any time at hello@stackitup.app — we read everything.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="px-4 py-16 sm:py-24 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-24 w-72 h-72 rounded-[3rem] opacity-60 pointer-events-none -rotate-6"
            style={{ background: "#F4E14F" }}
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
              <h1
                className="text-4xl sm:text-5xl mb-3 leading-tight tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                Frequently Asked Questions
              </h1>
              <p className="text-lg" style={{ color: "#6B6558" }}>
                Everything you might want to know before, during, or after the quiz.
              </p>
            </div>

            {FAQ_GROUPS.map((group) => (
              <Card key={group.title}>
                <SectionHeading emoji={group.emoji}>{group.title}</SectionHeading>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-2xl p-4"
                      style={{ background: "rgba(17,17,17,0.03)" }}
                    >
                      <summary
                        className="font-semibold text-base cursor-pointer list-none flex items-center justify-between gap-3"
                        style={{ color: "#111111" }}
                      >
                        {item.question}
                        <span
                          className="flex-shrink-0 transition-transform duration-200 group-open:rotate-45 text-lg"
                          style={{ color: "#4A6FA5" }}
                        >
                          +
                        </span>
                      </summary>
                      <p className="text-sm leading-relaxed mt-3" style={{ color: "#6B6558" }}>
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </Card>
            ))}

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
