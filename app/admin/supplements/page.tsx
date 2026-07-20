import Link from "next/link";
import { adminListSupplements } from "../../lib/admin/supplements";
import { deleteSupplementAction } from "../../lib/actions/admin";
import ConfirmSubmitButton from "../../components/ConfirmSubmitButton";

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

      <div
        className="rounded-3xl border overflow-hidden"
        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(17,17,17,0.08)" }}>
                <th className="px-5 py-3 font-semibold" style={{ color: "#8A8172" }}>Key</th>
                <th className="px-5 py-3 font-semibold" style={{ color: "#8A8172" }}>Name</th>
                <th className="px-5 py-3 font-semibold" style={{ color: "#8A8172" }}>Dose</th>
                <th className="px-5 py-3 font-semibold" style={{ color: "#8A8172" }}>Timing</th>
                <th className="px-5 py-3 font-semibold text-right" style={{ color: "#8A8172" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplements.map((s) => (
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
                  <td colSpan={5} className="px-5 py-8 text-center" style={{ color: "#8A8172" }}>
                    No supplements yet.
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
