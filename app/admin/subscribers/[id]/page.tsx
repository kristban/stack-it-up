import Link from "next/link";
import { notFound } from "next/navigation";
import { adminGetSubscriber } from "../../../lib/admin/subscribers";
import { updateSubscriberAction, deleteSubscriberAction } from "../../../lib/actions/admin";
import { Field } from "../../../components/admin/FormField";
import ConfirmSubmitButton from "../../../components/ConfirmSubmitButton";

export default async function EditSubscriberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const subscriber = await adminGetSubscriber(id);

  if (!subscriber) notFound();

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/subscribers"
        className="text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: "#6B6558" }}
      >
        ← Subscribers
      </Link>
      <h1
        className="text-3xl mt-2 mb-6 tracking-tight"
        style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
      >
        {subscriber.first_name}
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
        action={updateSubscriberAction}
        className="rounded-3xl border p-6 sm:p-8 space-y-4 mb-6"
        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
      >
        <input type="hidden" name="id" value={subscriber.id} />
        <Field label="First name" name="firstName" defaultValue={subscriber.first_name} required />
        <Field label="Email" name="email" type="email" defaultValue={subscriber.email} required />
        <Field
          label="Subscribed"
          name="created_at_display"
          defaultValue={new Date(subscriber.created_at).toLocaleString()}
          readOnly
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "#111111", color: "#FFFFFF" }}
        >
          Save changes
        </button>
      </form>

      <form action={deleteSubscriberAction}>
        <input type="hidden" name="id" value={subscriber.id} />
        <ConfirmSubmitButton confirmMessage={`Delete subscriber "${subscriber.email}"? This can't be undone.`}>
          Delete subscriber
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
