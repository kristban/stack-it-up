import { useMemo, useState } from "react";

// Describes one filterable column: a stable `key`, a display `label`, and a
// `value` accessor that returns the text this column is matched against. Define
// the column list at module scope so its identity stays stable across renders.
export interface FilterColumn<T> {
  key: string;
  label: string;
  value: (row: T) => string;
}

// Generic per-column filtering for admin tables. Each column has its own text
// filter; a row is kept only if it matches every active filter (AND), matching
// is case-insensitive substring. Returns the filtered rows plus helpers to read
// and update each column's filter.
export function useColumnFilters<T>(rows: T[], columns: FilterColumn<T>[]) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const active = columns
      .map((column) => ({ column, term: (filters[column.key] ?? "").trim().toLowerCase() }))
      .filter((entry) => entry.term.length > 0);

    if (active.length === 0) return rows;

    return rows.filter((row) =>
      active.every(({ column, term }) => column.value(row).toLowerCase().includes(term)),
    );
  }, [rows, columns, filters]);

  const activeCount = columns.reduce(
    (count, column) => ((filters[column.key] ?? "").trim() ? count + 1 : count),
    0,
  );

  function setFilter(key: string, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setFilters({});
  }

  return { filters, setFilter, clearFilters, filtered, activeCount };
}
