import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup";

const LINK_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Build my stack", href: "/?start=quiz" },
      { label: "FAQ", href: "/faq" },
      { label: "Newsletter", href: "#newsletter" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t px-4 py-12 sm:py-16"
      style={{ borderColor: "rgba(17,17,17,0.08)" }}
    >
      <div className="max-w-4xl mx-auto">
        <NewsletterSignup />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div
              className="flex items-center gap-2 text-xl tracking-tight mb-3"
              style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
            >
              <span
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #CFE0F7 50%, #F4E14F 50%)" }}
              />
              StackItUp
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#6B6558" }}>
              Personalized supplement routines in under a minute. No account, no
              spam, no upsells.
            </p>
          </div>

          {/* Link columns */}
          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3
                className="text-xs font-semibold uppercase tracking-wide mb-4"
                style={{ color: "#8A8172" }}
              >
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => {
                  const linkClass = "text-sm font-medium transition-colors duration-150 hover:opacity-70";
                  const linkStyle = { color: "#14130F" };
                  return (
                    <li key={link.label}>
                      {link.href.startsWith("#") ? (
                        <a href={link.href} className={linkClass} style={linkStyle}>
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClass} style={linkStyle}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(17,17,17,0.08)" }}
        >
          <p className="text-sm" style={{ color: "#8A8172" }}>
            &copy; {year} StackItUp. All rights reserved.
          </p>
          <a
            href="mailto:hello@stackitup.app"
            className="text-sm font-medium transition-colors duration-150 hover:opacity-70"
            style={{ color: "#111111" }}
          >
            hello@stackitup.app
          </a>
        </div>
      </div>
    </footer>
  );
}
