import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFeaturedStack,
  getFeaturedStacks,
  getFeaturedStackSupplementKeys,
  resolveStackSupplements,
} from "../../lib/featuredStacks";
import { getSupplements } from "../../lib/supplements";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Card, SectionHeading } from "../../components/PageCard";
import JsonLd from "../../components/JsonLd";
import { accentFor } from "../../lib/theme";
import { pageMetadata, absoluteUrl } from "../../lib/seo";
import { breadcrumbJsonLd, collectionPageJsonLd, webPageJsonLd } from "../../lib/structuredData";

export async function generateStaticParams() {
  const stacks = await getFeaturedStacks();
  return stacks.map((stack) => ({ key: stack.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const stack = await getFeaturedStack(key);
  if (!stack) return { title: "Stack Not Found" };
  return pageMetadata({
    title: stack.name,
    description: `${stack.tagline} See the full stack and why each supplement is included.`.slice(0, 160),
    path: `/stacks/${stack.key}`,
  });
}

export default async function StackDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const stack = await getFeaturedStack(key);

  if (!stack) notFound();

  const [allSupplements, itemKeys, otherStacks] = await Promise.all([
    getSupplements(),
    getFeaturedStackSupplementKeys(stack.key),
    getFeaturedStacks(),
  ]);
  const supplements = resolveStackSupplements(allSupplements, itemKeys);
  const related = otherStacks.filter((s) => s.key !== stack.key).slice(0, 3);
  const accent = accentFor(stack.key);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: stack.name,
          description: stack.tagline,
          path: `/stacks/${stack.key}`,
        })}
      />
      <JsonLd
        data={collectionPageJsonLd({
          name: stack.name,
          description: stack.tagline,
          path: `/stacks/${stack.key}`,
          items: supplements.map((s) => ({ name: s.name, url: absoluteUrl(`/supplements/${s.key}`) })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Stacks", path: "/stacks" },
          { name: stack.name, path: `/stacks/${stack.key}` },
        ])}
      />
      <Navbar />
      <main className="pt-24">
        <section className="px-4 py-16 sm:py-24 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-24 w-72 h-72 rounded-[3rem] opacity-60 pointer-events-none rotate-6"
            style={{ background: accent.bg }}
          />

          <div className="max-w-2xl mx-auto relative">
            <Link
              href="/stacks"
              className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
              style={{ color: "#6B6558" }}
            >
              ← Back to Stacks
            </Link>

            {/* Header */}
            <div className="mb-10">
              <div
                aria-hidden="true"
                className="w-16 h-16 mb-5 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: accent.bg }}
              >
                {stack.emoji}
              </div>

              <h1
                className="text-4xl sm:text-5xl mb-3 leading-tight tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                {stack.name}
              </h1>
              <p className="text-lg" style={{ color: "#6B6558" }}>
                {stack.tagline}
              </p>
            </div>

            {/* Description */}
            <Card>
              <SectionHeading emoji="💡">About this stack</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                {stack.description}
              </p>
            </Card>

            {/* What's included */}
            <Card>
              <SectionHeading emoji="🧪">What's included</SectionHeading>
              <div className="space-y-4">
                {supplements.map((supp) => (
                  <Link
                    key={supp.key}
                    href={`/supplements/${supp.key}`}
                    className="flex items-start gap-4 rounded-2xl p-4 transition-colors duration-150 hover:bg-[rgba(207,224,247,0.3)]"
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
                  </Link>
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
                Want a routine built just for you?
              </h2>
              <p className="text-base mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                This stack is a starting point — answer six gentle questions for
                picks matched to your goals, diet, and life stage.
              </p>
              <Link
                href="/?start=quiz"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-medium text-base transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: "#F4E14F", color: "#111111" }}
              >
                Find My Routine →
              </Link>
            </div>

            {/* Related stacks */}
            {related.length > 0 && (
              <div>
                <h2
                  className="text-lg mb-4 tracking-tight"
                  style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
                >
                  Explore other stacks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.key}
                      href={`/stacks/${r.key}`}
                      className="group flex items-center gap-3 rounded-2xl p-4 border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                      style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
                    >
                      <span aria-hidden="true" className="text-xl flex-shrink-0">{r.emoji}</span>
                      <span className="text-sm font-medium" style={{ color: "#111111" }}>
                        {r.name}
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
