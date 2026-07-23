"use client";

import Link from "next/link";
import { Subscriber } from "../../lib/types";
import { deleteSubscriberAction } from "../../lib/actions/admin";
import ConfirmSubmitButton from "../ConfirmSubmitButton";
import { useColumnFilters, FilterColumn } from "../../hooks/useColumnFilters";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Filter on what the admin actually sees, so typing "Jul" narrows by the
// formatted Subscribed date just like it narrows by name or email.
const COLUMNS: FilterColumn<Subscriber>[] = [
  { key: "first_name", label: "First name", value: (s) => s.first_name },
  { key: "email", label: "Email", value: (s) => s.email },
  { key: "created_at", label: "Subscribed", value: (s) => formatDate(s.created_at) },
];

export default function SubscribersTable({ subscribers }: { subscribers: Subscriber[] }) {
  const { filters, setFilter, clearFilters, filtered, activeCount } = useColumnFilters(
    subscribers,
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
          ? `Showing ${filtered.length} of ${subscribers.length} subscribers`
          : `${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"}`}
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
              {filtered.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: "1px solid rgba(17,17,17,0.06)" }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "#111111" }}>{sub.first_name}</td>
                  <td className="px-5 py-3" style={{ color: "#3A362E" }}>{sub.email}</td>
                  <td className="px-5 py-3" style={{ color: "#6B6558" }}>{formatDate(sub.created_at)}</td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/subscribers/${sub.id}`}
                      className="text-sm font-medium mr-4 transition-opacity hover:opacity-70"
                      style={{ color: "#4A6FA5" }}
                    >
                      Edit
                    </Link>
                    <form action={deleteSubscriberAction} className="inline">
                      <input type="hidden" name="id" value={sub.id} />
                      <ConfirmSubmitButton confirmMessage={`Delete subscriber "${sub.email}"? This can't be undone.`}>
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-5 py-8 text-center" style={{ color: "#8A8172" }}>
                    No subscribers yet.
                  </td>
                </tr>
              )}
              {subscribers.length > 0 && filtered.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-5 py-8 text-center" style={{ color: "#8A8172" }}>
                    No subscribers match your filters.
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
