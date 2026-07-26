import Link from "next/link";
import { requireSuperAdmin } from "../../lib/auth/dal";
import { adminListUsers } from "../../lib/admin/admins";
import { setAdminStatusAction } from "../../lib/actions/admins";

function fullName(first: string | null, last: string | null): string {
  return [first, last].filter(Boolean).join(" ").trim();
}

function userLabel(u: { first_name: string | null; last_name: string | null; email: string | null; id: string }): string {
  const name = fullName(u.first_name, u.last_name);
  if (name && u.email) return `${name} — ${u.email}`;
  return name || u.email || u.id;
}

const badgeBase =
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap";

const selectClass =
  "w-full rounded-2xl border px-4 py-2.5 text-sm transition-shadow focus:outline-none focus-visible:ring-2";
const selectStyle = { background: "#FFFFFF", borderColor: "rgba(17,17,17,0.15)", color: "#14130F" };

function ToggleButton({
  userId,
  field,
  value,
  label,
  variant,
}: {
  userId: string;
  field: "is_admin" | "is_super_admin";
  value: boolean;
  label: string;
  variant: "grant" | "revoke";
}) {
  const style =
    variant === "grant"
      ? { background: "#111111", color: "#FFFFFF" }
      : { background: "#DCD8CB", color: "#3A362E" };
  return (
    <form action={setAdminStatusAction}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(value)} />
      <button
        type="submit"
        className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2"
        style={style}
      >
        {label}
      </button>
    </form>
  );
}

export default async function AdminAdminsPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const { updated, error } = await searchParams;
  const { user } = await requireSuperAdmin();
  const users = await adminListUsers();

  // People who've signed in but don't have any access yet — the candidates to add.
  const eligible = users.filter((u) => !u.is_admin && !u.is_super_admin && u.id !== user.id);

  return (
    <div>
      <div className="mb-6">
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
          Admins
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B6558" }}>
          Grant or revoke access. <strong>Admins</strong> can open this panel;{" "}
          <strong>super admins</strong> can also manage access here.
        </p>
      </div>

      {updated && (
        <div
          className="mb-5 rounded-2xl px-4 py-3 text-sm"
          style={{ background: "rgba(40,140,70,0.10)", color: "#2E6B3E" }}
          role="status"
        >
          Access updated.
        </div>
      )}
      {error && (
        <div
          className="mb-5 rounded-2xl px-4 py-3 text-sm"
          style={{ background: "rgba(180,40,40,0.08)", color: "#9A2A2A" }}
          role="alert"
        >
          {error}
        </div>
      )}

      {eligible.length > 0 ? (
        <div
          className="rounded-3xl border p-5 sm:p-6 mb-5"
          style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
        >
          <h2
            className="text-lg mb-1 tracking-tight"
            style={{ color: "#111111", fontFamily: "var(--font-heading)", fontWeight: 700 }}
          >
            Add an admin
          </h2>
          <p className="text-sm mb-4" style={{ color: "#6B6558" }}>
            Grant access to someone who has signed in but doesn&apos;t have admin yet.
          </p>
          <form action={setAdminStatusAction} className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <input type="hidden" name="value" value="true" />
            <label className="flex-1 min-w-0">
              <span className="block text-xs font-medium mb-1.5" style={{ color: "#3A362E" }}>
                Person
              </span>
              <select name="userId" required className={selectClass} style={selectStyle}>
                {eligible.map((u) => (
                  <option key={u.id} value={u.id}>
                    {userLabel(u)}
                  </option>
                ))}
              </select>
            </label>
            <label className="sm:w-44">
              <span className="block text-xs font-medium mb-1.5" style={{ color: "#3A362E" }}>
                Role
              </span>
              <select name="field" defaultValue="is_admin" className={selectClass} style={selectStyle}>
                <option value="is_admin">Admin</option>
                <option value="is_super_admin">Super admin</option>
              </select>
            </label>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2"
              style={{ background: "#111111", color: "#FFFFFF" }}
            >
              Add
            </button>
          </form>
        </div>
      ) : (
        <div
          className="rounded-2xl px-4 py-3 mb-5 text-sm"
          style={{ background: "rgba(17,17,17,0.04)", color: "#6B6558" }}
        >
          Everyone who&apos;s signed in already has access. New people show up here once they log in
          with Google.
        </div>
      )}

      <div
        className="rounded-3xl border overflow-hidden"
        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(17,17,17,0.08)" }}>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#8A8172" }}>
                  User
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#8A8172" }}>
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-right" style={{ color: "#8A8172" }}>
                  Access
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === user.id;
                const name = fullName(u.first_name, u.last_name);
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(17,17,17,0.06)" }}>
                    <td className="px-5 py-4 align-top">
                      <div className="text-sm font-medium" style={{ color: "#14130F" }}>
                        {name || u.email || u.id}
                      </div>
                      {name && u.email && (
                        <div className="text-xs mt-0.5" style={{ color: "#8A8172" }}>
                          {u.email}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {u.is_super_admin && (
                          <span className={badgeBase} style={{ background: "#F4E14F", color: "#8A6F0E" }}>
                            Super admin
                          </span>
                        )}
                        {u.is_admin && (
                          <span className={badgeBase} style={{ background: "#CFE0F7", color: "#2F5580" }}>
                            Admin
                          </span>
                        )}
                        {!u.is_admin && !u.is_super_admin && (
                          <span className={badgeBase} style={{ background: "rgba(17,17,17,0.05)", color: "#6B6558" }}>
                            User
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      {isSelf ? (
                        <div className="flex justify-end">
                          <span className={badgeBase} style={{ background: "rgba(17,17,17,0.05)", color: "#6B6558" }}>
                            You
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 justify-end">
                          <ToggleButton
                            userId={u.id}
                            field="is_admin"
                            value={!u.is_admin}
                            label={u.is_admin ? "Remove admin" : "Make admin"}
                            variant={u.is_admin ? "revoke" : "grant"}
                          />
                          <ToggleButton
                            userId={u.id}
                            field="is_super_admin"
                            value={!u.is_super_admin}
                            label={u.is_super_admin ? "Remove super" : "Make super"}
                            variant={u.is_super_admin ? "revoke" : "grant"}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <p className="text-sm mt-4" style={{ color: "#6B6558" }}>
          No users yet.
        </p>
      )}
    </div>
  );
}
