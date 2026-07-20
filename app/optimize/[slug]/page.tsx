import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  OPTIMIZE_TOPICS,
  getOptimizeTopic,
  getSupplementDetails,
  getRelatedTopics,
} from "../../lib/optimizeContent";
import { getSupplements } from "../../lib/supplements";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Card, SectionHeading } from "../../components/PageCard";
import { accentFor } from "../../lib/theme";

export function generateStaticParams() {
  return OPTIMIZE_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getOptimizeTopic(slug);
  if (!topic) return { title: "StackItUp" };
  return {
    title: `${topic.title} — StackItUp`,
    description: topic.tagline,
  };
}

export default async function OptimizeTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getOptimizeTopic(slug);

  if (!topic) notFound();

  const allSupplements = await getSupplements();
  const supplements = getSupplementDetails(allSupplements, topic.canHelp);
  const relatedTopics = getRelatedTopics(topic);
  const accent = accentFor(topic.slug);

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="px-4 py-16 sm:py-24 relative overflow-hidden">
          {/* Decorative panel */}
          <div
            className="absolute -top-16 -right-24 w-72 h-72 rounded-[3rem] opacity-60 pointer-events-none rotate-6"
            style={{ background: accent.bg }}
          />

          <div className="max-w-2xl mx-auto relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
              style={{ color: "#6B6558" }}
            >
              ← Back to StackItUp
            </Link>

            {/* Header */}
            <div className="mb-10">
              <div
                aria-hidden="true"
                className="w-16 h-16 mb-5 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: accent.bg }}
              >
                {topic.emoji}
              </div>

              <h1
                className="text-4xl sm:text-5xl mb-3 leading-tight tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                {topic.title}
              </h1>
              <p className="text-lg" style={{ color: "#6B6558" }}>
                {topic.tagline}
              </p>
            </div>

            {/* Why it matters */}
            <Card>
              <SectionHeading emoji="💡">Why it matters</SectionHeading>
              <div className="space-y-3">
                {topic.whyItMatters.map((paragraph, i) => (
                  <p key={i} className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>

            {/* Signs */}
            <Card>
              <SectionHeading emoji="🔍">Signs you might benefit</SectionHeading>
              <ul className="space-y-3">
                {topic.signs.map((sign) => (
                  <li key={sign} className="flex items-start gap-3">
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#4A6FA5" }}
                    />
                    <span className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                      {sign}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* What can help */}
            <Card>
              <SectionHeading emoji="🧪">What can help</SectionHeading>
              <div className="space-y-4">
                {supplements.map((supp) => (
                  <div
                    key={supp.name}
                    className="flex items-start gap-4 rounded-2xl p-4"
                    style={{ background: "#F5F3EC" }}
                  >
                    <span aria-hidden="true" className="text-2xl flex-shrink-0">{supp.emoji}</span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base mb-0.5" style={{ color: "#111111" }}>
                        {supp.name}
                      </h3>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: "#6B6558" }}>
                        {supp.why}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
                        <span style={{ color: "#4A6FA5" }}>Dose: {supp.dose}</span>
                        <span style={{ color: "#8A6F0E" }}>{supp.timing}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Simple daily habits */}
            <Card>
              <SectionHeading emoji="✅">Simple daily habits</SectionHeading>
              <ul className="space-y-3">
                {topic.dailyHabits.map((habit) => (
                  <li key={habit} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ background: "#CFE0F7", color: "#2F5580" }}
                    >
                      ✓
                    </span>
                    <span className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                      {habit}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* FAQ */}
            <Card>
              <SectionHeading emoji="❓">Common questions</SectionHeading>
              <div className="space-y-2">
                {topic.faq.map((item) => (
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

            {/* CTA */}
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
                Answer five gentle questions and get a personalized routine —
                including picks for {topic.title.toLowerCase()}.
              </p>
              <Link
                href="/?start=quiz"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: "#F4E14F", color: "#111111" }}
              >
                Find My Routine →
              </Link>
            </div>

            {/* Related topics */}
            <div>
              <h2
                className="text-lg mb-4 tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
              >
                Explore related topics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedTopics.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/optimize/${related.slug}`}
                    className="group flex items-center gap-3 rounded-2xl p-4 border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                    style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
                  >
                    <span aria-hidden="true" className="text-xl flex-shrink-0">{related.emoji}</span>
                    <span className="text-sm font-medium" style={{ color: "#111111" }}>
                      {related.title}
                    </span>
                    <span
                      className="ml-auto text-sm transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: "#111111" }}
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
