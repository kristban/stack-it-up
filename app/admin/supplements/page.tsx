import Link from "next/link";
import { adminListSupplements } from "../../lib/admin/supplements";
import SupplementsTable from "../../components/admin/SupplementsTable";

export default async function AdminSupplementsPage() {
  const supplements = await adminListSupplements();

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
            Supplements
          </h1>
        </div>
        <Link
          href="/admin/supplements/new"
          className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "#111111", color: "#FFFFFF" }}
        >
          + New supplement
        </Link>
      </div>

      <SupplementsTable supplements={supplements} />
    </div>
  );
}
