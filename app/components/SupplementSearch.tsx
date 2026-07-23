"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Supplement } from "../lib/types";
import { searchSupplements } from "../lib/fuzzySearch";
import { accentFor } from "../lib/theme";

interface SupplementSearchProps {
  supplements: Supplement[];
}

export default function SupplementSearch({ supplements }: SupplementSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => searchSupplements(query, supplements),
    [query, supplements],
  );

  const trimmed = query.trim();
  const countLabel = !trimmed
    ? `${supplements.length} supplement${supplements.length === 1 ? "" : "s"}`
    : `${results.length} result${results.length === 1 ? "" : "s"} for “${trimmed}”`;

  function clear() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="mb-14">
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

      <p className="text-sm mb-6" style={{ color: "#8A8172" }} aria-live="polite" role="status">
        {countLabel}
      </p>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {results.map((supp) => {
            const accent = accentFor(supp.key);
            return (
              <Link
                key={supp.key}
                href={`/supplements/${supp.key}`}
                className="group block h-full rounded-3xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2"
                style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
              >
                <div
                  aria-hidden="true"
                  className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-2xl"
                  style={{ background: accent.bg }}
                >
                  {supp.emoji}
                </div>
                <h2
                  className="text-lg mb-1 leading-snug tracking-tight"
                  style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
                >
                  {supp.name}
                </h2>
                <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#6B6558" }}>
                  {supp.why}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "#111111" }}
                >
                  Learn more →
                </span>
              </Link>
            );
          })}
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
      )}
    </div>
  );
}
