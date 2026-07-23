"use client";

import Link from "next/link";
import { Supplement } from "../../lib/types";
import { deleteSupplementAction } from "../../lib/actions/admin";
import ConfirmSubmitButton from "../ConfirmSubmitButton";
import { useColumnFilters, FilterColumn } from "../../hooks/useColumnFilters";

const COLUMNS: FilterColumn<Supplement>[] = [
  { key: "key", label: "Key", value: (s) => s.key },
  { key: "name", label: "Name", value: (s) => s.name },
  { key: "dose", label: "Dose", value: (s) => s.dose },
  { key: "timing", label: "Timing", value: (s) => s.timing },
];

export default function SupplementsTable({ supplements }: { supplements: Supplement[] }) {
  const { filters, setFilter, clearFilters, filtered, activeCount } = useColumnFilters(
    supplements,
    COLUMNS,
  );

  return (
    <div>
      <p
        className="text-xs mb-3"
        style={{ color: "#8A8172" }}
        aria-live="polite"
        role="status"
      >
        {activeCount > 0
          ? `Showing ${filtered.length} of ${supplements.length} supplements`
          : `${supplements.length} supplement${supplements.length === 1 ? "" : "s"}`}
      </p>

      <div
        className="rounded-3xl border overflow-hidden"
        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(17,17,17,0.08)" }}>
                {COLUMNS.map((col) => (
                  <th key={col.key} scope="col" className="px-5 py-3 align-top">
                    <span className="block font-semibold mb-2" style={{ color: "#8A8172" }}>
                      {col.label}
                    </span>
                    <input
                      type="text"
                      value={filters[col.key] ?? ""}
                      onChange={(e) => setFilter(col.key, e.target.value)}
                      placeholder="Filter…"
                      aria-label={`Filter by ${col.label}`}
                      className="w-full min-w-[7rem] px-2.5 py-1.5 rounded-lg border text-xs font-normal outline-none transition-colors focus:border-[#111111]"
                      style={{ borderColor: "rgba(17,17,17,0.15)", background: "#FFFFFF", color: "#111111" }}
                    />
                  </th>
                ))}
                <th scope="col" className="px-5 py-3 text-right align-top">
                  <span className="block font-semibold mb-2" style={{ color: "#8A8172" }}>
                    Actions
                  </span>
                  {activeCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-medium transition-opacity hover:opacity-70"
                      style={{ color: "#4A6FA5" }}
                    >
                      Clear filters
                    </button>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.key} style={{ borderBottom: "1px solid rgba(17,17,17,0.06)" }}>
                  <td className="px-5 py-3 font-mono text-xs" style={{ color: "#6B6558" }}>{s.key}</td>
                  <td className="px-5 py-3 font-medium whitespace-nowrap" style={{ color: "#111111" }}>
                    <span aria-hidden="true" className="mr-2">{s.emoji}</span>
                    {s.name}
                  </td>
                  <td className="px-5 py-3" style={{ color: "#3A362E" }}>{s.dose}</td>
                  <td className="px-5 py-3" style={{ color: "#3A362E" }}>{s.timing}</td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/supplements/${s.key}`}
                      className="text-sm font-medium mr-4 transition-opacity hover:opacity-70"
                      style={{ color: "#4A6FA5" }}
                    >
                      Edit
                    </Link>
                    <form action={deleteSupplementAction} className="inline">
                      <input type="hidden" name="key" value={s.key} />
                      <ConfirmSubmitButton confirmMessage={`Delete "${s.name}"? This can't be undone.`}>
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
              {supplements.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-5 py-8 text-center" style={{ color: "#8A8172" }}>
                    No supplements yet.
                  </td>
                </tr>
              )}
              {supplements.length > 0 && filtered.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-5 py-8 text-center" style={{ color: "#8A8172" }}>
                    No supplements match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
