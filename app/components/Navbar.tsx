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

  const logoClass = "flex items-center gap-2 text-lg tracking-tight transition-opacity hover:opacity-70";
  const logoStyle = { color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 };
  const quizButtonClass =
    "flex items-center gap-2 pl-5 pr-2 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95";
  const quizButtonStyle = { background: "#111111", color: "#FFFFFF" };

  function handleStartQuizClick() {
    setMobileOpen(false);
    onStartQuiz?.();
  }

  const logoMark = (
    <span
      className="w-6 h-6 rounded-full flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #CFE0F7 50%, #F4E14F 50%)" }}
    />
  );

  const arrowChip = (
    <span
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.16)" }}
    >
      →
    </span>
  );

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      <div
        className="mx-auto max-w-5xl flex items-center justify-between rounded-full px-4 sm:px-5 h-14 border shadow-sm"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(17,17,17,0.08)",
        }}
      >
      {onLogoClick ? (
        <button onClick={onLogoClick} className={logoClass} style={logoStyle} aria-label="Go to home">
          {logoMark}
          StackItUp
        </button>
      ) : (
        <Link href="/" className={logoClass} style={logoStyle} aria-label="Go to home">
          {logoMark}
          StackItUp
        </Link>
      )}

      {/* Desktop nav */}
      <div className="hidden sm:flex items-center gap-1">
        <div className="relative" ref={exploreRef}>
          <button
            onClick={() => setExploreOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={exploreOpen}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#111111" }}
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
              <path d="M1 3L5 7L9 3" stroke="#6B6558" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {exploreOpen && (
            <div
              className="absolute right-0 top-full mt-3 w-64 rounded-2xl border shadow-lg py-2 max-h-[70vh] overflow-y-auto"
              style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
            >
              {OPTIMIZE_TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/optimize/${topic.slug}`}
                  onClick={() => setExploreOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-[rgba(207,224,247,0.4)]"
                  style={{ color: "#3A362E" }}
                >
                  <span aria-hidden="true">{topic.emoji}</span>
                  <span className="font-medium">{topic.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/supplements"
          className="px-3 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#111111" }}
        >
          Supplements
        </Link>

        <Link
          href="/faq"
          className="px-3 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#111111" }}
        >
          FAQ
        </Link>

        <a
          href="#newsletter"
          className="px-3 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#111111" }}
        >
          Newsletter
        </a>

        <Link
          href="/supplements?focus=search"
          aria-label="Search supplements"
          className="w-9 h-9 ml-1 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(17,17,17,0.06)] focus:outline-none focus-visible:ring-2"
          style={{ color: "#111111" }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M14 14L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </Link>

        {onStartQuiz ? (
          <button onClick={handleStartQuizClick} className={`${quizButtonClass} ml-2`} style={quizButtonStyle}>
            Start Quiz
            {arrowChip}
          </button>
        ) : (
          <Link href="/?start=quiz" className={`${quizButtonClass} ml-2`} style={quizButtonStyle}>
            Start Quiz
            {arrowChip}
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
            background: "#111111",
            transform: mobileOpen ? "rotate(45deg)" : "translateY(-4px)",
          }}
        />
        <span
          className="absolute block w-5 h-[1.5px] rounded-full transition-all duration-200"
          style={{
            background: "#111111",
            opacity: mobileOpen ? 0 : 1,
          }}
        />
        <span
          className="absolute block w-5 h-[1.5px] rounded-full transition-all duration-200"
          style={{
            background: "#111111",
            transform: mobileOpen ? "rotate(-45deg)" : "translateY(4px)",
          }}
        />
      </button>
      </div>
    </nav>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed top-[4.5rem] left-0 right-0 bottom-0 z-40 border-t overflow-y-auto"
          style={{ background: "#F5F3EC", borderColor: "rgba(17,17,17,0.08)" }}
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
              style={{ color: "#6B6558" }}
            >
              Explore
            </h3>
            <div className="flex flex-col gap-1">
              {OPTIMIZE_TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/optimize/${topic.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-base transition-colors duration-150 active:bg-[rgba(207,224,247,0.4)]"
                  style={{ color: "#111111" }}
                >
                  <span aria-hidden="true" className="text-lg">{topic.emoji}</span>
                  <span className="font-medium">{topic.title}</span>
                </Link>
              ))}
            </div>

            <Link
              href="/supplements"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-3 py-3 mt-4 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(207,224,247,0.4)]"
              style={{ color: "#111111" }}
            >
              Supplements
            </Link>

            <Link
              href="/supplements?focus=search"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(207,224,247,0.4)]"
              style={{ color: "#111111" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
                <path d="M14 14L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Search supplements
            </Link>

            <Link
              href="/faq"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-3 py-3 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(207,224,247,0.4)]"
              style={{ color: "#111111" }}
            >
              FAQ
            </Link>

            <a
              href="#newsletter"
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-3 py-3 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(207,224,247,0.4)]"
              style={{ color: "#111111" }}
            >
              Newsletter
            </a>
          </div>
        </div>
      )}
    </>
  );
}
