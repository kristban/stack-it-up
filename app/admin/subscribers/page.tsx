import Link from "next/link";
import { adminListSubscribers } from "../../lib/admin/subscribers";
import { deleteSubscriberAction } from "../../lib/actions/admin";
import ConfirmSubmitButton from "../../components/ConfirmSubmitButton";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminSubscribersPage() {
  const subscribers = await adminListSubscribers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <Link
            href="/admin"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#6B6558" }}
          >
            ← Admin
          </Link>
          <h1
            className="text-3xl mt-2 tracking-tight"
            style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 800 }}
          >
            Subscribers
          </h1>
        </div>
        <Link
          href="/admin/subscribers/new"
          className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "#111111", color: "#FFFFFF" }}
        >
          + New subscriber
        </Link>
      </div>

      <div
        className="rounded-3xl border overflow-hidden"
        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(17,17,17,0.08)" }}>
                <th className="px-5 py-3 font-semibold" style={{ color: "#8A8172" }}>First name</th>
                <th className="px-5 py-3 font-semibold" style={{ color: "#8A8172" }}>Email</th>
                <th className="px-5 py-3 font-semibold" style={{ color: "#8A8172" }}>Subscribed</th>
                <th className="px-5 py-3 font-semibold text-right" style={{ color: "#8A8172" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
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
                  <td colSpan={4} className="px-5 py-8 text-center" style={{ color: "#8A8172" }}>
                    No subscribers yet.
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
