import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, SectionHeading } from "../components/PageCard";
import JsonLd from "../components/JsonLd";
import { pageMetadata } from "../lib/seo";
import { webPageJsonLd } from "../lib/structuredData";

const TITLE = "Terms of Service";
const DESCRIPTION = "The terms and conditions for using StackItUp's free supplement recommendation quiz and content.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/terms",
});

const LAST_UPDATED = "August 31, 2026";

export default function TermsPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/terms" })} />
      <Navbar />
      <main className="pt-24">
        <section className="px-4 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto">
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
                Terms of Service
              </h1>
              <p className="text-sm" style={{ color: "#8A8172" }}>Last updated {LAST_UPDATED}</p>
            </div>

            <Card>
              <SectionHeading emoji="🤝">Acceptance of terms</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                By using StackItUp, you agree to these terms. If you don't agree,
                please don't use the site. We may update these terms occasionally;
                continued use after changes means you accept the updated version.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="🩺">Not medical advice</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                StackItUp provides general, educational information about
                supplements based on the answers you give — it is not medical advice
                and is not a substitute for consulting a doctor, pharmacist, or
                qualified healthcare provider. Always check with a healthcare
                professional before starting any new supplement, especially if you
                are pregnant, nursing, have a medical condition, or take medication.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="🧾">Using the service</SectionHeading>
              <div className="space-y-3">
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  StackItUp is free to use and doesn't require an account to take
                  the quiz. You agree not to misuse the service — for example, by
                  attempting to disrupt it, scrape it at scale, or use it in a way
                  that violates applicable law.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  The "Copy link" feature encodes your quiz answers into a URL you
                  can share. Anything you copy a link to is visible to anyone you
                  give that link to — don't share a link if you'd rather keep your
                  answers private.
                </p>
              </div>
            </Card>

            <Card>
              <SectionHeading emoji="👤">Accounts</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                Signing in is optional and currently done through Google. You're
                responsible for keeping your Google account secure, since that's
                how access to your StackItUp account is controlled. Don't upload a
                profile photo you don't have the rights to use, or content that's
                unlawful, abusive, or infringes on someone else's rights — we may
                remove it and suspend or terminate accounts that misuse the
                service.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="©️">Intellectual property</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                The StackItUp name, design, and content are owned by us or our
                licensors. You're welcome to use the site for personal, non-commercial
                purposes, but please don't copy or republish our content without
                permission. Anything you upload (like a profile photo) remains
                yours — you're just granting us the license needed to store and
                display it back to you as part of the service.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="🛡️">Limitation of liability</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                StackItUp is provided "as is," without warranties of any kind. We do
                our best to keep recommendations accurate and up to date, but we
                can't guarantee any particular outcome from following a suggested
                routine, and we aren't liable for decisions made based on the site's
                content.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="✉️">Contact us</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                Questions about these terms? Email us at{" "}
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
