import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Page Not Found — StackItUp",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
          <div
            className="absolute -top-24 -left-24 w-80 h-80 rounded-[4rem] opacity-60 pointer-events-none rotate-12"
            style={{ background: "#CFE0F7" }}
          />
          <div
            className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-[4rem] opacity-70 pointer-events-none -rotate-6"
            style={{ background: "#F4E14F" }}
          />

          <div
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 border"
            style={{
              background: "rgba(255,255,255,0.85)",
              borderColor: "rgba(17,17,17,0.12)",
              color: "#6B6558",
            }}
          >
            <span aria-hidden="true">🌿</span>
            <span>Lost your way?</span>
          </div>

          <h1
            className="relative text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95] mb-6"
            style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
          >
            404
          </h1>

          <p
            className="relative text-lg sm:text-xl max-w-xl mx-auto mb-4 leading-relaxed"
            style={{ color: "#6B6558" }}
          >
            We couldn&apos;t find the page you were looking for.
          </p>

          <p className="relative text-sm mb-12" style={{ color: "#8A8172" }}>
            It may have moved, or never existed in the first place.
          </p>

          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-3 pl-8 pr-2 py-2 rounded-full text-lg font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "#111111", color: "#FFFFFF" }}
            >
              Back to Home
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-base"
                style={{ background: "rgba(255,255,255,0.16)" }}
              >
                →
              </span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
