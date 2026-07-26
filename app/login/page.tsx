import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card } from "../components/PageCard";
import { signInWithGoogle } from "../lib/actions/auth";
import { getCurrentUser } from "../lib/auth/dal";

export const metadata: Metadata = {
  title: "Log in — StackItUp",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith("/") ? next : "/";

  // Already signed in — no reason to show the login page.
  const user = await getCurrentUser();
  if (user) redirect(safeNext);

  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="px-4 py-16 sm:py-24 relative overflow-hidden">
          <div
            className="absolute -top-16 -right-24 w-72 h-72 rounded-[3rem] opacity-60 pointer-events-none rotate-12"
            style={{ background: "#CFE0F7" }}
          />

          <div className="max-w-md mx-auto relative">
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
                style={{ background: "#F4E14F" }}
              >
                🔑
              </div>
              <h1
                className="text-4xl sm:text-5xl mb-3 leading-tight tracking-tight"
                style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
              >
                Log in
              </h1>
              <p className="text-lg" style={{ color: "#6B6558" }}>
                Sign in with Google to manage your account.
              </p>
            </div>

            <Card>
              {error && (
                <div
                  className="mb-5 rounded-2xl px-4 py-3 text-sm"
                  style={{ background: "rgba(180,40,40,0.08)", color: "#9A2A2A" }}
                  role="alert"
                >
                  {error}
                </div>
              )}

              <form action={signInWithGoogle}>
                <input type="hidden" name="next" value={safeNext} />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-full text-base font-medium border transition-all duration-200 hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2"
                  style={{ background: "#FFFFFF", color: "#14130F", borderColor: "rgba(17,17,17,0.15)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.32Z" fill="#4285F4" />
                    <path d="M10 20c2.7 0 4.97-.9 6.63-2.42l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.6-4.12H1.06v2.58A10 10 0 0 0 10 20Z" fill="#34A853" />
                    <path d="M4.4 11.92a6 6 0 0 1 0-3.84V5.5H1.06a10 10 0 0 0 0 9l3.34-2.58Z" fill="#FBBC05" />
                    <path d="M10 3.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.96 9.96 0 0 0 10 0 10 10 0 0 0 1.06 5.5L4.4 8.08C5.2 5.72 7.4 3.96 10 3.96Z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </form>

              <p className="mt-5 text-xs leading-relaxed text-center" style={{ color: "#8A8172" }}>
                By continuing you agree to our{" "}
                <Link href="/terms" className="underline" style={{ color: "#6B6558" }}>
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline" style={{ color: "#6B6558" }}>
                  Privacy Policy
                </Link>
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
