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
      <main className="pt-16">
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
          <div
            className="blob absolute -top-24 -left-24 w-80 h-80 opacity-90 pointer-events-none"
            style={{ background: "#E3C39C" }}
          />
          <div
            className="blob-2 absolute top-1/3 -right-32 w-96 h-96 opacity-80 pointer-events-none"
            style={{ background: "#262B30" }}
          />
          <div
            className="blob-3 absolute -bottom-20 left-1/4 w-72 h-72 opacity-90 pointer-events-none"
            style={{ background: "#C4744A" }}
          />

          <div
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 border"
            style={{
              background: "rgba(255,255,255,0.85)",
              borderColor: "rgba(38,32,25,0.12)",
              color: "#6E6153",
            }}
          >
            <span>🌿</span>
            <span>Lost your way?</span>
          </div>

          <h1
            className="relative text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95] mb-6"
            style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
          >
            404
          </h1>

          <p
            className="relative text-lg sm:text-xl max-w-xl mx-auto mb-4 leading-relaxed"
            style={{ color: "#6E6153" }}
          >
            We couldn&apos;t find the page you were looking for.
          </p>

          <p className="relative text-sm mb-12" style={{ color: "#8B7E6E" }}>
            It may have moved, or never existed in the first place.
          </p>

          <div className="relative">
            <Link
              href="/"
              className="inline-block px-10 py-5 rounded-full text-lg font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm hover:shadow-md"
              style={{ background: "#C4744A", color: "#FFFFFF" }}
            >
              Back to Home →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
