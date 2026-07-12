"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OPTIMIZE_TOPICS } from "../lib/optimizeContent";

interface NavbarProps {
  onLogoClick?: () => void;
  onStartQuiz?: () => void;
}

export default function Navbar({ onLogoClick, onStartQuiz }: NavbarProps) {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setExploreOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 640) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logoClass = "text-xl tracking-tight transition-opacity hover:opacity-70";
  const logoStyle = { color: "#262019", fontFamily: "var(--font-serif)", fontWeight: 700 };
  const quizButtonClass =
    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95";
  const quizButtonStyle = { background: "#C4744A", color: "#FFFFFF" };

  function handleStartQuizClick() {
    setMobileOpen(false);
    onStartQuiz?.();
  }

  return (
    <>
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 h-16 flex items-center justify-between border-b"
      style={{
        background: "rgba(246,240,228,0.88)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(38,32,25,0.08)",
      }}
    >
      {onLogoClick ? (
        <button onClick={onLogoClick} className={logoClass} style={logoStyle} aria-label="Go to home">
          StackItUp
        </button>
      ) : (
        <Link href="/" className={logoClass} style={logoStyle} aria-label="Go to home">
          StackItUp
        </Link>
      )}

      {/* Desktop nav */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="relative" ref={exploreRef}>
          <button
            onClick={() => setExploreOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={exploreOpen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#262019" }}
          >
            Explore
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-transform duration-200"
              style={{ transform: exploreOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M1 3L5 7L9 3" stroke="#6E6153" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {exploreOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-lg py-2 max-h-[70vh] overflow-y-auto"
              style={{ background: "#FFFFFF", borderColor: "rgba(38,32,25,0.08)" }}
            >
              {OPTIMIZE_TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/optimize/${topic.slug}`}
                  onClick={() => setExploreOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-[rgba(196,116,74,0.08)]"
                  style={{ color: "#4A4038" }}
                >
                  <span>{topic.emoji}</span>
                  <span className="font-medium">{topic.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/faq"
          className="px-3 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#262019" }}
        >
          FAQ
        </Link>

        <a
          href="#newsletter"
          className="px-3 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#262019" }}
        >
          Newsletter
        </a>

        {onStartQuiz ? (
          <button onClick={handleStartQuizClick} className={quizButtonClass} style={quizButtonStyle}>
            Start Quiz
          </button>
        ) : (
          <Link href="/?start=quiz" className={quizButtonClass} style={quizButtonStyle}>
            Start Quiz
          </Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((open) => !open)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        className="sm:hidden relative w-9 h-9 flex items-center justify-center"
      >
        <span
          className="absolute block w-5 h-[1.5px] rounded-full transition-all duration-200"
          style={{
            background: "#262019",
            transform: mobileOpen ? "rotate(45deg)" : "translateY(-4px)",
          }}
        />
        <span
          className="absolute block w-5 h-[1.5px] rounded-full transition-all duration-200"
          style={{
            background: "#262019",
            opacity: mobileOpen ? 0 : 1,
          }}
        />
        <span
          className="absolute block w-5 h-[1.5px] rounded-full transition-all duration-200"
          style={{
            background: "#262019",
            transform: mobileOpen ? "rotate(-45deg)" : "translateY(4px)",
          }}
        />
      </button>
    </nav>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed top-16 left-0 right-0 bottom-0 z-40 border-t overflow-y-auto"
          style={{ background: "#F6F0E4", borderColor: "rgba(38,32,25,0.08)" }}
        >
          <div className="px-4 py-6">
            {onStartQuiz ? (
              <button
                onClick={handleStartQuizClick}
                className="w-full px-5 py-3.5 rounded-full text-base font-medium transition-all duration-200 active:scale-95 mb-8"
                style={quizButtonStyle}
              >
                Start Quiz
              </button>
            ) : (
              <Link
                href="/?start=quiz"
                onClick={() => setMobileOpen(false)}
                className="block text-center w-full px-5 py-3.5 rounded-full text-base font-medium transition-all duration-200 active:scale-95 mb-8"
                style={quizButtonStyle}
              >
                Start Quiz
              </Link>
            )}

            <h3
              className="text-xs font-semibold uppercase tracking-wide mb-3 px-1"
              style={{ color: "#8B7E6E" }}
            >
              Explore
            </h3>
            <div className="flex flex-col gap-1">
              {OPTIMIZE_TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/optimize/${topic.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-base transition-colors duration-150 active:bg-[rgba(196,116,74,0.08)]"
                  style={{ color: "#262019" }}
                >
                  <span className="text-lg">{topic.emoji}</span>
                  <span className="font-medium">{topic.title}</span>
                </Link>
              ))}
            </div>

            <Link
              href="/faq"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-3 py-3 mt-4 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(196,116,74,0.08)]"
              style={{ color: "#262019" }}
            >
              FAQ
            </Link>

            <a
              href="#newsletter"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-3 py-3 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(196,116,74,0.08)]"
              style={{ color: "#262019" }}
            >
              Newsletter
            </a>
          </div>
        </div>
      )}
    </>
  );
}
