const LINK_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Build my stack", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t px-4 py-12 sm:py-16"
      style={{ borderColor: "rgba(28,25,23,0.08)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-black text-xl tracking-tight mb-3" style={{ color: "#1C1917" }}>
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
                style={{ background: "linear-gradient(135deg, #E11D48, #7C3AED)" }}
              >
                S
              </span>
              StackItUp
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
              Personalized supplement routines in 60 seconds. No account, no
              spam, no upsells.
            </p>
          </div>

          {/* Link columns */}
          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3
                className="text-xs font-bold uppercase tracking-wide mb-4"
                style={{ color: "#A8A29E" }}
              >
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-medium transition-colors duration-150 hover:opacity-70"
                      style={{ color: "#57534E" }}
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
          style={{ borderColor: "rgba(28,25,23,0.08)" }}
        >
          <p className="text-sm" style={{ color: "#A8A29E" }}>
            &copy; {year} StackItUp. All rights reserved.
          </p>
          <a
            href="mailto:hello@stackitup.app"
            className="text-sm font-semibold transition-colors duration-150 hover:opacity-70"
            style={{ color: "#E11D48" }}
          >
            hello@stackitup.app
          </a>
        </div>
      </div>
    </footer>
  );
}
