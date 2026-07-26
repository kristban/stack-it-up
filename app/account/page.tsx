import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, SectionHeading } from "../components/PageCard";
import { getCurrentProfile } from "../lib/auth/dal";
import { updateProfileAction, updateEmailAction } from "../lib/actions/account";
import { signOut } from "../lib/actions/auth";

export const metadata: Metadata = {
  title: "Your account — StackItUp",
  robots: { index: false, follow: false },
};

// requireUser runs in the proxy + the update actions; getCurrentProfile here
// gives us the row to prefill. force-dynamic so it never prerenders.
export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-2xl border px-4 py-3 text-base transition-shadow focus:outline-none focus-visible:ring-2";
const inputStyle = { background: "#FFFFFF", borderColor: "rgba(17,17,17,0.15)", color: "#14130F" };
const labelClass = "block text-sm font-medium mb-1.5";
const labelStyle = { color: "#3A362E" };
const saveButtonClass =
  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2";
const saveButtonStyle = { background: "#111111", color: "#FFFFFF" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const { updated, error } = await searchParams;
  // The proxy already redirects logged-out users away, but guard defensively.
  const { user, profile } = await getCurrentProfile();
  if (!user) {
    // Should be unreachable via the proxy; render nothing rather than leak.
    return null;
  }

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
                ⚙️
              </div>
              <h1
                className="text-4xl sm:text-5xl mb-3 leading-tight tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                Your account
              </h1>
              <p className="text-lg" style={{ color: "#6B6558" }}>
                Update your name and email address.
              </p>
            </div>

            {updated === "profile" && (
              <div
                className="mb-6 rounded-2xl px-4 py-3 text-sm"
                style={{ background: "rgba(40,140,70,0.10)", color: "#2E6B3E" }}
                role="status"
              >
                Your name has been saved.
              </div>
            )}
            {updated === "email" && (
              <div
                className="mb-6 rounded-2xl px-4 py-3 text-sm"
                style={{ background: "rgba(40,140,70,0.10)", color: "#2E6B3E" }}
                role="status"
              >
                Check your inbox — we sent a confirmation link to finish changing your email. Your
                current email stays active until you confirm.
              </div>
            )}
            {error && (
              <div
                className="mb-6 rounded-2xl px-4 py-3 text-sm"
                style={{ background: "rgba(180,40,40,0.08)", color: "#9A2A2A" }}
                role="alert"
              >
                {error}
              </div>
            )}

            <Card>
              <SectionHeading emoji="🧑">Name</SectionHeading>
              <form action={updateProfileAction} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className={labelClass} style={labelStyle}>
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    defaultValue={profile?.first_name ?? ""}
                    className={inputClass}
                    style={inputStyle}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass} style={labelStyle}>
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    defaultValue={profile?.last_name ?? ""}
                    className={inputClass}
                    style={inputStyle}
                    autoComplete="family-name"
                  />
                </div>
                <button type="submit" className={saveButtonClass} style={saveButtonStyle}>
                  Save name
                </button>
              </form>
            </Card>

            <Card>
              <SectionHeading emoji="✉️">Email</SectionHeading>
              <form action={updateEmailAction} className="space-y-4">
                <div>
                  <label htmlFor="email" className={labelClass} style={labelStyle}>
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email ?? ""}
                    className={inputClass}
                    style={inputStyle}
                    autoComplete="email"
                    required
                  />
                  <p className="mt-1.5 text-xs" style={{ color: "#8A8172" }}>
                    Changing this sends a confirmation link to the new address.
                  </p>
                </div>
                <button type="submit" className={saveButtonClass} style={saveButtonStyle}>
                  Update email
                </button>
              </form>
            </Card>

            <div className="pt-2">
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm font-medium transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 rounded-full px-2 py-1"
                  style={{ color: "#9A2A2A" }}
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
