import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, SectionHeading } from "../components/PageCard";

export const metadata: Metadata = {
  title: "Privacy Policy — StackItUp",
  description: "What data StackItUp collects, why, and how you can control it.",
};

const LAST_UPDATED = "July 11, 2026";

export default function PrivacyPage() {
  return (
    <>
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
                Privacy Policy
              </h1>
              <p className="text-sm" style={{ color: "#8A8172" }}>Last updated {LAST_UPDATED}</p>
            </div>

            <Card>
              <SectionHeading emoji="🔍">The short version</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                StackItUp doesn't require an account, doesn't ask for your email, and
                doesn't sell data to anyone. Your quiz answers and results are
                calculated in your browser and are not sent to or stored on our
                servers. The only thing we store is a cookie preference, described
                below.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="📋">What we collect</SectionHeading>
              <div className="space-y-3">
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  <strong>Quiz answers &amp; results.</strong> Processed entirely in
                  your browser to generate your supplement routine. We do not receive
                  or log your answers.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  <strong>Cookie preference.</strong> When you accept or decline our
                  cookie banner, we save that choice in your browser's local storage
                  (key <code className="text-sm">stackitup-cookie-consent</code>) so we
                  don't ask again. This stays on your device.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  <strong>Standard server logs.</strong> Like most websites, our
                  hosting provider automatically logs basic technical data (IP
                  address, browser type, pages requested) for security and
                  reliability. We don't use this to identify individual visitors.
                </p>
              </div>
            </Card>

            <Card>
              <SectionHeading emoji="🍪">Cookies</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                We use a single piece of local storage to remember your cookie
                consent choice. We don't use tracking or advertising cookies. You can
                clear this at any time through your browser's site settings — the
                consent banner will simply reappear on your next visit.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="🔗">Third parties</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                We don't share data with third parties because we don't collect any
                to share. If that ever changes — for example, if we add optional
                analytics — we'll update this page and, where required, ask for your
                consent first.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="⚖️">Your rights</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                If you're in the EU/EEA or UK, GDPR gives you rights to access,
                correct, delete, or export any personal data we hold about you. Since
                we don't store quiz data or accounts on our servers, there's typically
                nothing to request — but if you have questions about server logs or
                cookies, reach out and we'll help.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="✉️">Contact us</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                Questions about this policy? Email us at{" "}
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
