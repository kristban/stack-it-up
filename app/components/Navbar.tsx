"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OPTIMIZE_TOPICS } from "../lib/optimizeContent";
import { createClient } from "../lib/supabase/client";
import { signOut } from "../lib/actions/auth";

interface NavbarProps {
  onLogoClick?: () => void;
  onStartQuiz?: () => void;
}

export default function Navbar({ onLogoClick, onStartQuiz }: NavbarProps) {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Auth state for nav display ONLY — all access control is enforced server-side
  // (proxy + data access layer + server actions). A brief flash before this
  // resolves is harmless because none of it gates anything.
  const [authReady, setAuthReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarEmoji, setAvatarEmoji] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function apply(user: { id: string; email?: string } | null) {
      if (!mounted) return;
      if (!user) {
        setSignedIn(false);
        setIsAdmin(false);
        setDisplayName("");
        setAvatarUrl(null);
        setAvatarEmoji(null);
        setAuthReady(true);
        return;
      }
      setSignedIn(true);
      // RLS lets a user read only their own profile row.
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, avatar_emoji, is_admin, is_super_admin")
        .eq("id", user.id)
        .maybeSingle();
      if (!mounted) return;
      // Super admins have panel access too (see requireAdmin in lib/auth/dal).
      setIsAdmin(Boolean(data?.is_admin) || Boolean(data?.is_super_admin));
      const firstName = data?.first_name?.trim();
      setDisplayName(firstName || user.email || "Account");
      setAvatarUrl(data?.avatar_url ?? null);
      setAvatarEmoji(data?.avatar_emoji ?? null);
      setAuthReady(true);
    }

    supabase.auth.getUser().then(({ data }) => apply(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      apply(session?.user ?? null),
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setExploreOpen(false);
        setAccountOpen(false);
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
  // Shared glassy surface used by the nav pill and the standalone user chip.
  const glassStyle = {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    borderColor: "rgba(17,17,17,0.08)",
  };

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

  // Blue #2F5580 is the contrast-safe ink for text/icons on the #CFE0F7 tile
  // (see docs/CONVENTIONS.md — #4A6FA5 fails AA on this background).
  const avatarMark = (
    <span
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "#CFE0F7" }}
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="6.5" r="3.2" stroke="#2F5580" strokeWidth="1.6" />
        <path
          d="M4 16c0-3 2.7-4.8 6-4.8s6 1.8 6 4.8"
          stroke="#2F5580"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );

  // The signed-in user's avatar: uploaded photo, then chosen emoji, then the
  // default person icon. avatarMark stays the generic icon used for "Log in".
  const userAvatar = avatarUrl ? (
    <span
      className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0"
      style={{ background: "#CFE0F7" }}
    >
      <Image
        src={avatarUrl}
        alt=""
        width={24}
        height={24}
        className="w-full h-full object-cover"
        unoptimized
      />
    </span>
  ) : avatarEmoji ? (
    <span
      aria-hidden="true"
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
      style={{ background: "#CFE0F7" }}
    >
      {avatarEmoji}
    </span>
  ) : (
    avatarMark
  );

  const chevron = (open: boolean) => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className="transition-transform duration-200"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M1 3L5 7L9 3" stroke="#6B6558" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      <div className="mx-auto max-w-5xl flex items-center gap-3">
      <div
        className="flex-1 min-w-0 flex items-center justify-between rounded-full px-4 sm:px-5 h-14 border shadow-sm"
        style={glassStyle}
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

      {/* User — outside the nav pill, to the right of Start Quiz (desktop only;
          on mobile the account links live in the hamburger panel below). */}
      {authReady && (
        <div className="hidden sm:block relative flex-shrink-0" ref={accountRef}>
          {signedIn ? (
            <>
              <button
                onClick={() => setAccountOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={accountOpen}
                className="flex items-center gap-2 h-14 pl-2 pr-4 rounded-full border shadow-sm text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2"
                style={{ ...glassStyle, color: "#111111" }}
              >
                {userAvatar}
                <span className="max-w-[9rem] truncate">{displayName}</span>
                {chevron(accountOpen)}
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-52 rounded-2xl border shadow-lg py-2"
                  style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
                >
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[rgba(207,224,247,0.4)]"
                      style={{ color: "#3A362E" }}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/account"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[rgba(207,224,247,0.4)]"
                    style={{ color: "#3A362E" }}
                  >
                    Account
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="w-full text-left flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[rgba(207,224,247,0.4)] focus:outline-none focus-visible:ring-2"
                      style={{ color: "#9A2A2A" }}
                    >
                      Log out
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 h-14 pl-2 pr-5 rounded-full border shadow-sm text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2"
              style={{ ...glassStyle, color: "#111111" }}
            >
              {avatarMark}
              Log in
            </Link>
          )}
        </div>
      )}
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

            {authReady && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: "rgba(17,17,17,0.08)" }}
              >
                {signedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-3">
                      {userAvatar}
                      <span
                        className="font-medium text-base truncate"
                        style={{ color: "#111111" }}
                      >
                        {displayName}
                      </span>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-3 py-3 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(207,224,247,0.4)]"
                        style={{ color: "#111111" }}
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-3 py-3 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(207,224,247,0.4)]"
                      style={{ color: "#111111" }}
                    >
                      Account
                    </Link>
                    <form action={signOut}>
                      <button
                        type="submit"
                        onClick={() => setMobileOpen(false)}
                        className="w-full text-left flex items-center px-3 py-3 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(207,224,247,0.4)]"
                        style={{ color: "#9A2A2A" }}
                      >
                        Log out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors duration-150 active:bg-[rgba(207,224,247,0.4)]"
                    style={{ color: "#111111" }}
                  >
                    {avatarMark}
                    Log in
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
