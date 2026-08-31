import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, SectionHeading } from "../components/PageCard";
import JsonLd from "../components/JsonLd";
import { pageMetadata } from "../lib/seo";
import { webPageJsonLd } from "../lib/structuredData";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How StackItUp handles your data: what we collect, the cookies we use, and your privacy rights under GDPR.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/privacy",
});

const LAST_UPDATED = "August 31, 2026";

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd({ name: TITLE, description: DESCRIPTION, path: "/privacy" })} />
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
                You can use StackItUp's quiz without an account — your answers and
                results are calculated in your browser and aren't sent to our
                servers. If you choose to sign in with Google, we store a small
                account record (name, email, avatar, and anything you save to your
                library) so it's there next time you visit. We don't sell your data
                to anyone.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="📋">What we collect</SectionHeading>
              <div className="space-y-3">
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  <strong>Quiz answers &amp; results.</strong> Processed entirely in
                  your browser to generate your supplement routine. We do not receive
                  or log your answers. While you're mid-quiz, your in-progress
                  answers are saved to your browser's local storage so a refresh
                  doesn't lose your progress — this never leaves your device.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  <strong>Account information.</strong> If you sign in with Google,
                  we receive your name, email address, and profile photo from
                  Google, and create an account record with our hosting provider,
                  Supabase. You can replace your photo with an emoji or upload your
                  own image instead, edit your name, or change your email at any
                  time from your account page.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  <strong>Saved library data.</strong> If you're signed in, the
                  supplements you favorite and add to your morning or evening stack
                  (including their order) are saved to your account so they're there
                  next time you visit.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  <strong>Shared results links.</strong> The "Copy link" button on
                  your results encodes your quiz answers directly into the URL — we
                  don't store shared links on our servers, but anyone you send the
                  link to will be able to see the answers and routine it contains.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  <strong>Newsletter signup.</strong> If you subscribe to our
                  newsletter, we store the first name and email address you provide
                  so we can send it to you.
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
              <SectionHeading emoji="🍪">Cookies &amp; analytics</SectionHeading>
              <div className="space-y-3">
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  We use local storage to remember your cookie consent choice and,
                  if you're signed in, a strictly-necessary session cookie (set by
                  Supabase) that keeps you logged in. We don't use advertising
                  cookies.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  We use Umami, a privacy-focused analytics tool, to understand
                  aggregate traffic to the site (pages visited, referrers, general
                  device/browser type). Umami doesn't use cookies and doesn't build
                  an individual profile of you.
                </p>
                <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                  You can clear your cookie preference at any time through your
                  browser's site settings — the consent banner will simply reappear
                  on your next visit.
                </p>
              </div>
            </Card>

            <Card>
              <SectionHeading emoji="🔗">Third parties</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                We use a small number of service providers to run StackItUp:{" "}
                <strong>Google</strong> (for sign-in, if you choose to use it),{" "}
                <strong>Supabase</strong> (our database, authentication, and file
                storage provider — this is where account, library, and uploaded
                avatar data lives), and <strong>Umami</strong> (privacy-focused
                analytics, described above). We don't sell your data, and we don't
                share it with anyone else beyond what's needed to run the site.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="🗄️">Data retention</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                We keep your account and library data for as long as your account
                exists. Newsletter details are kept until you unsubscribe. We don't
                currently offer self-service account deletion — email us and we'll
                delete your account and associated data promptly.
              </p>
            </Card>

            <Card>
              <SectionHeading emoji="⚖️">Your rights</SectionHeading>
              <p className="text-base leading-relaxed" style={{ color: "#3A362E" }}>
                If you're in the EU/EEA or UK, GDPR gives you rights to access,
                correct, delete, or export any personal data we hold about you. If
                you don't have an account, there's typically nothing to request
                beyond server logs and cookies — but if you do have an account or
                have subscribed to our newsletter, email us and we'll action your
                request.
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
