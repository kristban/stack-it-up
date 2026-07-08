"use client";

interface NavbarProps {
  onLogoClick: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 h-16 flex items-center justify-between border-b"
      style={{
        background: "rgba(246,240,228,0.88)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(38,32,25,0.08)",
      }}
    >
      <button
        onClick={onLogoClick}
        className="text-xl tracking-tight transition-opacity hover:opacity-70"
        style={{ color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 }}
        aria-label="Go to home"
      >
        StackItUp
      </button>

      <div className="flex items-center gap-1.5 text-sm" style={{ color: "#6E6153" }}>
        <span className="hidden sm:inline">A calmer way to supplement</span>
      </div>
    </nav>
  );
}
