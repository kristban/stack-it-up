"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Supplement, EvidenceLevel } from "../lib/types";
import { searchSupplements } from "../lib/fuzzySearch";
import { accentFor } from "../lib/theme";
import { SUPPLEMENT_CATEGORIES, EVIDENCE_LEVELS, EVIDENCE_ORDER } from "../lib/categories";
import { useUserLibrary, type UserLibrary } from "../hooks/useUserLibrary";
import { LibraryToggleRow, LibraryToggleRowSkeleton } from "./LibraryToggle";

interface SupplementSearchProps {
  supplements: Supplement[];
}

const EVIDENCE_HINT_KEY = "stackitup-library-hint-dismissed";
const EVIDENCE_FILTERS: Array<EvidenceLevel | "all"> = ["all", ...EVIDENCE_ORDER];

export default function SupplementSearch({ supplements }: SupplementSearchProps) {
  const [query, setQuery] = useState("");
  const [evidenceFilter, setEvidenceFilter] = useState<EvidenceLevel | "all">("all");
  const [hintDismissed, setHintDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return Boolean(window.localStorage.getItem(EVIDENCE_HINT_KEY));
    } catch {
      // Storage unavailable (private mode, etc.) — just skip the one-time tip.
      return true;
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const library = useUserLibrary();

  function dismissHint() {
    setHintDismissed(true);
    try {
      window.localStorage.setItem(EVIDENCE_HINT_KEY, "1");
    } catch {
      // Nothing to do if storage isn't available — it'll just show again next visit.
    }
  }

  const pool = useMemo(
    () => (evidenceFilter === "all" ? supplements : supplements.filter((s) => s.evidence === evidenceFilter)),
    [supplements, evidenceFilter],
  );

  const results = useMemo(
    () => searchSupplements(query, pool),
    [query, pool],
  );

  // When arriving from the navbar search entry (/supplements?focus=search),
  // drop the cursor into the box so the visitor can type right away, then strip
  // the param so a refresh or shared link doesn't re-trigger it. Mirrors the
  // ?start=quiz handling in HomeClient.
  //
  // Also seeds the query from ?q=, which is the target the sitewide SearchAction
  // JSON-LD (structuredData.ts) points a Google sitelinks search box at — that
  // markup is only honest if the URL it promises actually runs the search.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);

    if (params.get("focus") !== "search") return;

    const input = inputRef.current;
    if (input) {
      input.focus({ preventScroll: true });
      input.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    params.delete("focus");
    const qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
  }, []);

  const trimmed = query.trim();
  const countLabel = !trimmed
    ? `${pool.length} supplement${pool.length === 1 ? "" : "s"}`
    : `${results.length} result${results.length === 1 ? "" : "s"} for “${trimmed}”`;

  function clear() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="mb-14">
      {library.authReady && library.signedIn && !hintDismissed && (
        <div
          className="mb-6 rounded-2xl p-4 border flex items-start justify-between gap-3 text-sm"
          style={{ background: "#CFE0F7", borderColor: "rgba(17,17,17,0.08)", color: "#2F5580" }}
        >
          <p className="leading-relaxed">
            <strong>Tip:</strong> tap ♥ favorite, ☀️ morning, or 🌙 evening on any supplement below to save
            it to your account.
          </p>
          <button
            type="button"
            onClick={dismissHint}
            aria-label="Dismiss tip"
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(255,255,255,0.4)] focus:outline-none focus-visible:ring-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="mb-4"
      >
        <label htmlFor="supplement-search" className="sr-only">
          Search supplements by name
        </label>
        <div className="relative max-w-md">
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="#8A8172" strokeWidth="1.6" />
              <path d="M14 14L17 17" stroke="#8A8172" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <input
            id="supplement-search"
            ref={inputRef}
            type="text"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search supplements — try “magnez” or “sleep”"
            autoComplete="off"
            className="w-full pl-11 pr-11 py-3 rounded-full border text-sm outline-none transition-colors focus:border-[#111111]"
            style={{ borderColor: "rgba(17,17,17,0.15)", background: "#FFFFFF", color: "#111111" }}
          />
          {trimmed && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-[rgba(17,17,17,0.06)] focus:outline-none focus-visible:ring-2"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2L12 12M12 2L2 12" stroke="#6B6558" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter by evidence level">
        {EVIDENCE_FILTERS.map((level) => {
          const active = evidenceFilter === level;
          const meta = level === "all" ? null : EVIDENCE_LEVELS[level];
          return (
            <button
              key={level}
              type="button"
              onClick={() => setEvidenceFilter(level)}
              aria-pressed={active}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border focus:outline-none focus-visible:ring-2"
              style={{
                background: active ? (meta?.bg ?? "#111111") : "#FFFFFF",
                borderColor: active ? "transparent" : "rgba(17,17,17,0.15)",
                color: active ? (meta?.text ?? "#FFFFFF") : "#6B6558",
              }}
            >
              {level === "all" ? "All evidence levels" : meta!.label}
            </button>
          );
        })}
      </div>

      <p className="text-sm mb-6" style={{ color: "#8A8172" }} aria-live="polite" role="status">
        {countLabel}
      </p>

      {trimmed ? (
        // Searching: one flat, relevance-ranked grid (grouping would be noise).
        results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {results.map((supp) => (
              <SupplementCard key={supp.key} supp={supp} library={library} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-3xl border p-10 text-center"
            style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
          >
            <p className="text-base mb-1" style={{ color: "#111111", fontWeight: 600 }}>
              No supplements match “{trimmed}”.
            </p>
            <p className="text-sm mb-5" style={{ color: "#6B6558" }}>
              Check the spelling, or clear the search to browse the full library.
            </p>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: "#111111", color: "#FFFFFF" }}
            >
              Clear search
            </button>
          </div>
        )
      ) : pool.length === 0 ? (
        <div
          className="rounded-3xl border p-10 text-center"
          style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
        >
          <p className="text-base mb-1" style={{ color: "#111111", fontWeight: 600 }}>
            No supplements match this filter.
          </p>
          <p className="text-sm mb-5" style={{ color: "#6B6558" }}>
            Try a different evidence level, or clear the filter to browse everything.
          </p>
          <button
            type="button"
            onClick={() => setEvidenceFilter("all")}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "#111111", color: "#FFFFFF" }}
          >
            Clear filter
          </button>
        </div>
      ) : (
        // Browsing: grouped into category sections, in curated order.
        <div className="space-y-12">
          {SUPPLEMENT_CATEGORIES.map((cat) => {
            const items = pool.filter((s) => s.category === cat.slug);
            if (items.length === 0) return null;
            return (
              <section key={cat.slug}>
                <h2
                  className="text-xl mb-4 flex items-center gap-3 tracking-tight"
                  style={{ color: "#14130F", fontFamily: "var(--font-heading)", fontWeight: 700 }}
                >
                  <span
                    aria-hidden="true"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: accentFor(cat.slug).bg }}
                  >
                    {cat.emoji}
                  </span>
                  {cat.label}
                  <span className="text-sm font-normal" style={{ color: "#8A8172" }}>
                    {items.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {items.map((supp) => (
                    <SupplementCard key={supp.key} supp={supp} library={library} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SupplementCard({ supp, library }: { supp: Supplement; library: UserLibrary }) {
  const accent = accentFor(supp.key);
  const evidence = EVIDENCE_LEVELS[supp.evidence];
  return (
    <div
      className="relative flex flex-col h-full rounded-3xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
    >
      <Link
        href={`/supplements/${supp.key}`}
        className="group flex flex-col flex-1 rounded-2xl focus:outline-none focus-visible:ring-2"
      >
        <div
          aria-hidden="true"
          className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-2xl"
          style={{ background: accent.bg }}
        >
          {supp.emoji}
        </div>
        <h3
          className="text-lg mb-1 leading-snug tracking-tight"
          style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
        >
          {supp.name}
        </h3>
        <span
          className="self-start inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2"
          style={{ background: evidence.bg, color: evidence.text }}
        >
          {evidence.label}
        </span>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#6B6558" }}>
          {supp.why}
        </p>
        <span
          className="mt-auto inline-flex items-center gap-1 text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1"
          style={{ color: "#111111" }}
        >
          Learn more →
        </span>
      </Link>

      {library.authReady && library.signedIn && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(17,17,17,0.08)" }}>
          <LibraryToggleRow supp={supp} library={library} />
        </div>
      )}
      {!library.authReady && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(17,17,17,0.08)" }}>
          <LibraryToggleRowSkeleton />
        </div>
      )}
    </div>
  );
}
