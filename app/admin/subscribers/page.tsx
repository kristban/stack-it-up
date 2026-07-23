import Link from "next/link";
import { adminListSubscribers } from "../../lib/admin/subscribers";
import SubscribersTable from "../../components/admin/SubscribersTable";

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

      <SubscribersTable subscribers={subscribers} />
    </div>
  );
}
