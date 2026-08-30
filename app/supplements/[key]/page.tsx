import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupplement, getSupplements } from "../../lib/supplements";
import { OPTIMIZE_TOPICS } from "../../lib/optimizeContent";
import { getSupplementContent } from "../../lib/supplementContent";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Card, SectionHeading } from "../../components/PageCard";
import SupplementActions from "../../components/SupplementActions";
import JsonLd from "../../components/JsonLd";
import { accentFor } from "../../lib/theme";
import { EVIDENCE_LEVELS, WARNING_STYLE } from "../../lib/categories";
import { pageMetadata } from "../../lib/seo";
import { supplementJsonLd } from "../../lib/structuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const supplement = await getSupplement(key);
  if (!supplement) return { title: "Supplement Not Found" };
  return pageMetadata({
    title: supplement.name,
    description: supplement.why.slice(0, 157) + (supplement.why.length > 157 ? "…" : ""),
    path: `/supplements/${supplement.key}`,
  });
}

export default async function SupplementDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const supplement = await getSupplement(key);

  if (!supplement) notFound();

  const relatedTopics = OPTIMIZE_TOPICS.filter((topic) => topic.canHelp.includes(supplement.name));
  const accent = accentFor(supplement.key);
  const evidence = EVIDENCE_LEVELS[supplement.evidence];
  const content = getSupplementContent(supplement.key);

  const relatedSupplements = content?.relatedSupplements.length
    ? (await getSupplements()).filter((s) => content.relatedSupplements.includes(s.key))
    : [];

  return (
    <>
      {supplementJsonLd(supplement, content).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Navbar />
      <main className="pt-24">
        <section className="px-4 py-16 sm:py-24 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-24 w-72 h-72 rounded-[3rem] opacity-60 pointer-events-none rotate-6"
            style={{ background: accent.bg }}
          />

          <div className="max-w-2xl mx-auto relative">
            <Link
              href="/supplements"
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
              style={{ color: "#6B6558" }}
            >
              ← Back to Supplements
            </Link>

            {/* Header */}
            <div className="mb-10">
              <div
                aria-hidden="true"
                className="w-16 h-16 mb-5 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: accent.bg }}
              >
                {supplement.emoji}
              </div>

              <h1
                className="text-4xl sm:text-5xl mb-4 leading-tight tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                {supplement.name}
              </h1>

              <div className="mb-3">
                <span
                  className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: evidence.bg, color: evidence.text }}
                >
                  {evidence.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {supplement.tags.map((tag) => {
                  const tagAccent = accentFor(tag);
                  return (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                      style={{ background: tagAccent.soft, color: tagAccent.text }}
                    >
                      {tag.replace("_", " ")}
                    </span>
                  );
                })}
              </div>

              <SupplementActions
                supplementKey={supplement.key}
                supplementName={supplement.name}
              />
            </div>

            {/* Safety warning — supplement-specific, rendered as a visible amber
                notice per the data model, not fine print. */}
            {supplement.warnings && (
              <div
                role="note"
                className="rounded-2xl p-5 mb-6 border flex gap-3"
                style={{ background: WARNING_STYLE.bg, borderColor: WARNING_STYLE.border }}
              >
                <span aria-hidden="true" className="text-lg leading-none flex-shrink-0">
                  ⚠️
                </span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: WARNING_STYLE.text }}>
                    Important safety note
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: WARNING_STYLE.text }}>
                    {supplement.warnings}
                  </p>
                </div>
              </div>
            )}

            {/* Why it matters */}
            <Card>
              <SectionHeading emoji="💡">Why it matters</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                {supplement.why}
              </p>
            </Card>

            {/* How it works */}
            {content?.howItWorks && (
              <Card>
                <SectionHeading emoji="⚙️">How it works</SectionHeading>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  {content.howItWorks}
                </p>
              </Card>
            )}

            {/* Who might benefit */}
            {content?.whoMightBenefit && (
              <Card>
                <SectionHeading emoji="🎯">Who might benefit</SectionHeading>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  {content.whoMightBenefit}
                </p>
              </Card>
            )}

            {/* Dose + Timing */}
            <Card>
              <SectionHeading emoji="🧪">Dose & timing</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl p-4" style={{ background: "#CFE0F7" }}>
                  <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: "#2F5580" }}>
                    Dose
                  </p>
                  <p className="text-sm font-medium" style={{ color: "#111111" }}>
                    {supplement.dose}
                  </p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "#F4E14F" }}>
                  <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: "#8A6F0E" }}>
                    When to take
                  </p>
                  <p className="text-sm font-medium" style={{ color: "#111111" }}>
                    {supplement.timing}
                  </p>
                </div>
              </div>
            </Card>

            {/* Safety & interactions — general tolerability context. Complements,
                doesn't replace, the admin-managed warning callout above, which
                stays the authoritative supplement-specific notice. */}
            {content?.safetyNotes && (
              <Card>
                <SectionHeading emoji="🛡️">Safety & interactions</SectionHeading>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  {content.safetyNotes}
                </p>
              </Card>
            )}

            {/* Common questions */}
            {content?.faq && content.faq.length > 0 && (
              <Card>
                <SectionHeading emoji="❓">Common questions</SectionHeading>
                <div className="space-y-2">
                  {content.faq.map((item) => (
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
            )}

            {/* Featured in */}
            {relatedTopics.length > 0 && (
              <Card>
                <SectionHeading emoji="🔗">Featured in</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedTopics.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={`/optimize/${topic.slug}`}
                      className="group flex items-center gap-3 rounded-2xl p-4 border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                      style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
                    >
                      <span aria-hidden="true" className="text-xl flex-shrink-0">{topic.emoji}</span>
                      <span className="text-sm font-medium" style={{ color: "#111111" }}>
                        {topic.title}
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
              </Card>
            )}

            {/* Related supplements */}
            {relatedSupplements.length > 0 && (
              <Card>
                <SectionHeading emoji="🧩">Related supplements</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedSupplements.map((related) => {
                    const relatedAccent = accentFor(related.key);
                    return (
                      <Link
                        key={related.key}
                        href={`/supplements/${related.key}`}
                        className="group flex items-center gap-3 rounded-2xl p-4 border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
                      >
                        <span
                          aria-hidden="true"
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: relatedAccent.bg }}
                        >
                          {related.emoji}
                        </span>
                        <span className="text-sm font-medium" style={{ color: "#111111" }}>
                          {related.name}
                        </span>
                        <span
                          className="ml-auto text-sm transition-transform duration-200 group-hover:translate-x-1"
                          style={{ color: "#111111" }}
                        >
                          →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Disclaimer */}
            <div
              className="rounded-2xl p-5 mb-10 border text-sm leading-relaxed"
              style={{
                background: "#F5F3EC",
                borderColor: "rgba(17,17,17,0.1)",
                color: "#6B6558",
              }}
            >
              <strong style={{ color: "#111111" }}>A gentle note:</strong> This is for
              informational purposes only. Always consult your doctor or a registered
              dietitian before starting any new supplement, especially if you take
              medications or have a medical condition.
            </div>

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
                Answer six gentle questions and see if {supplement.name.toLowerCase()} fits your stack.
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
