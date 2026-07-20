import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin — StackItUp",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#F5F3EC" }}>
      <header
        className="border-b px-4 sm:px-6 py-4"
        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg tracking-tight transition-opacity hover:opacity-70"
            style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
          >
            <span
              className="w-6 h-6 rounded-full flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #CFE0F7 50%, #F4E14F 50%)" }}
            />
            StackItUp
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full ml-1"
              style={{ background: "#111111", color: "#FFFFFF" }}
            >
              Admin
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#6B6558" }}
          >
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">{children}</main>
    </div>
  );
}
