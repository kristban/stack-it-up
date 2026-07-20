import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetSupplement } from "../../../lib/admin/supplements";
import { updateSupplementAction, deleteSupplementAction } from "../../../lib/actions/admin";
import { Field, TextArea } from "../../../components/admin/FormField";
import ConfirmSubmitButton from "../../../components/ConfirmSubmitButton";

export default async function EditSupplementPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { key } = await params;
  const { error } = await searchParams;
  const supplement = await adminGetSupplement(key);

  if (!supplement) notFound();

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
        {supplement.emoji} {supplement.name}
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
        action={updateSupplementAction}
        className="rounded-3xl border p-6 sm:p-8 space-y-4 mb-6"
        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
      >
        <input type="hidden" name="key" value={supplement.key} />
        <Field label="Key" name="key_display" defaultValue={supplement.key} readOnly />
        <Field label="Name" name="name" defaultValue={supplement.name} required />
        <Field label="Emoji" name="emoji" defaultValue={supplement.emoji} required />
        <TextArea label="Why it matters" name="why" defaultValue={supplement.why} required />
        <Field label="Timing" name="timing" defaultValue={supplement.timing} required />
        <Field label="Dose" name="dose" defaultValue={supplement.dose} required />
        <Field label="Tags (comma-separated)" name="tags" defaultValue={supplement.tags.join(", ")} />
        <button
          type="submit"
          className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "#111111", color: "#FFFFFF" }}
        >
          Save changes
        </button>
      </form>

      <form action={deleteSupplementAction}>
        <input type="hidden" name="key" value={supplement.key} />
        <ConfirmSubmitButton confirmMessage={`Delete "${supplement.name}"? This can't be undone.`}>
          Delete supplement
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
