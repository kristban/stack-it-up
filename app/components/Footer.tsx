import NewsletterSignup from "./NewsletterSignup";

const LINK_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Build my stack", href: "#" },
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
      style={{ borderColor: "rgba(38,32,25,0.08)" }}
    >
      <div className="max-w-4xl mx-auto">
        <NewsletterSignup />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div
              className="text-xl tracking-tight mb-3"
              style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
            >
              StackItUp
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#6E6153" }}>
              Personalized supplement routines in under a minute. No account, no
              spam, no upsells.
            </p>
          </div>

          {/* Link columns */}
          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3
                className="text-xs font-semibold uppercase tracking-wide mb-4"
                style={{ color: "#8B7E6E" }}
              >
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-medium transition-colors duration-150 hover:opacity-70"
                      style={{ color: "#4A4038" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(38,32,25,0.08)" }}
        >
          <p className="text-sm" style={{ color: "#8B7E6E" }}>
            &copy; {year} StackItUp. All rights reserved.
          </p>
          <a
            href="mailto:hello@stackitup.app"
            className="text-sm font-medium transition-colors duration-150 hover:opacity-70"
            style={{ color: "#C4744A" }}
          >
            hello@stackitup.app
          </a>
        </div>
      </div>
    </footer>
  );
}
