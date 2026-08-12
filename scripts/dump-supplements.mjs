// Re-export the supplement library from the live database into
// docs/supabase-supplements-seed.sql as an idempotent (upsert-by-key) seed.
//
// Run with:  npm run db:dump-supplements
// (which loads .env.local via --env-file, so NEXT_PUBLIC_SUPABASE_URL and
//  SUPABASE_SERVICE_ROLE_KEY are available).
//
// Uses the service-role key so hidden (is_active=false) rows are captured too —
// the seed is meant to be a faithful mirror of every row, not just public ones.

import { writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run via `npm run db:dump-supplements` so .env.local is loaded.",
  );
  process.exit(1);
}

const OUT = new URL("../docs/supabase-supplements-seed.sql", import.meta.url);

// Columns to export, in the order they appear in each INSERT.
const COLUMNS = [
  "key",
  "name",
  "emoji",
  "why",
  "timing",
  "dose",
  "tags",
  "category",
  "evidence",
  "warnings",
  "sort_order",
  "is_active",
];

// Postgres %L-equivalent for a text value: wrap in quotes, double any quote,
// NULL stays unquoted. (standard_conforming_strings is on, so backslashes are
// literal — doubling single quotes is all that's needed.)
function lit(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

// Render a text[] as a Postgres array literal, e.g. '{muscle,recovery}'::text[].
// Elements that are plain tokens need no quoting; anything else is double-quoted
// and escaped exactly as Postgres would output it.
function tagArray(tags) {
  const elements = (tags ?? []).map((tag) => {
    if (/^[A-Za-z0-9_]+$/.test(tag)) return tag;
    return `"${String(tag).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  });
  return `'{${elements.join(",")}}'::text[]`;
}

function valueFor(column, row) {
  if (column === "tags") return tagArray(row.tags);
  if (column === "sort_order") return String(row.sort_order);
  if (column === "is_active") return row.is_active ? "true" : "false";
  return lit(row[column]);
}

function statementFor(row) {
  const values = COLUMNS.map((c) => valueFor(c, row)).join(", ");
  const updates = COLUMNS.filter((c) => c !== "key")
    .map((c) => `${c}=excluded.${c}`)
    .join(", ");
  return (
    `insert into public.supplements (${COLUMNS.join(", ")}) values (${values})\n` +
    `  on conflict (key) do update set ${updates};`
  );
}

const HEADER = `-- StackItUp — supplement library seed data
-- Snapshot exported from the live database via \`npm run db:dump-supplements\`.
--
-- Idempotent: each row upserts by \`key\` (on conflict do update), so this file is
-- safe to run repeatedly. On a fresh database it populates the library; on an
-- existing one it brings every row in line with this snapshot.
--
-- Prereq: the \`supplements\` table and its metadata columns must exist first —
-- run docs/supabase-auth-setup.sql (through section 9) before this file.
--
-- DO NOT hand-edit rows here — re-run the dump command after admin edits so this
-- stays a faithful mirror.
`;

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.from("supplements").select(COLUMNS.join(","));

if (error) {
  console.error("Failed to read supplements:", error.message);
  process.exit(1);
}

// Deterministic order (category, then sort_order, then name) for clean diffs.
const rows = [...data].sort(
  (a, b) =>
    a.category.localeCompare(b.category) ||
    a.sort_order - b.sort_order ||
    a.name.localeCompare(b.name),
);

const body = rows.map(statementFor).join("\n\n");
const file = `${HEADER}\nbegin;\n\n${body}\n\ncommit;\n`;

await writeFile(OUT, file, "utf8");
console.log(`Wrote ${rows.length} supplements to docs/supabase-supplements-seed.sql`);
