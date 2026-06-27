"use client";

interface NavbarProps {
  onLogoClick: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 h-16 flex items-center justify-between border-b"
      style={{
        background: "rgba(255,251,235,0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(28,25,23,0.08)",
      }}
    >
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2 font-black text-xl tracking-tight transition-opacity hover:opacity-75"
        style={{ color: "#1C1917" }}
        aria-label="Go to home"
      >
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
          style={{ background: "linear-gradient(135deg, #E11D48, #7C3AED)" }}
        >
          S
        </span>
        StackItUp
      </button>

      <div className="flex items-center gap-1 text-sm font-medium" style={{ color: "#78716C" }}>
        <span>💊</span>
        <span className="hidden sm:inline">Free supplement planner</span>
      </div>
    </nav>
  );
}
