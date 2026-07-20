import Link from "next/link";
import { createSupplementAction } from "../../../lib/actions/admin";
import { Field, TextArea } from "../../../components/admin/FormField";

export default async function NewSupplementPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/supplements"
        className="text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: "#6B6558" }}
      >
        ← Supplements
      </Link>
      <h1
        className="text-3xl mt-2 mb-6 tracking-tight"
        style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
      >
        New supplement
      </h1>

      {error && (
        <p
          className="text-sm font-medium mb-4 px-4 py-3 rounded-xl"
          style={{ background: "rgba(178,59,59,0.08)", color: "#8A2E2E" }}
          role="alert"
        >
          {error}
        </p>
      )}

      <form
        action={createSupplementAction}
        className="rounded-3xl border p-6 sm:p-8 space-y-4"
        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
      >
        <Field label="Key (unique id, e.g. vitd3)" name="key" required />
        <Field label="Name" name="name" required />
        <Field label="Emoji" name="emoji" required />
        <TextArea label="Why it matters" name="why" required />
        <Field label="Timing" name="timing" required />
        <Field label="Dose" name="dose" required />
        <Field label="Tags (comma-separated)" name="tags" />
        <button
          type="submit"
          className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "#111111", color: "#FFFFFF" }}
        >
          Create supplement
        </button>
      </form>
    </div>
  );
}
