import "server-only";
import { createAdminClient } from "../supabase/admin";
import { requireSuperAdmin } from "../auth/dal";

export interface AdminUserRow {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
  created_at: string;
}

// Thrown for expected validation failures (e.g. editing your own status) so the
// action can surface a friendly message instead of a generic error.
export class AdminActionError extends Error {}

export type AdminField = "is_admin" | "is_super_admin";

// Lists every user (from auth.users, for email) merged with their profile flags.
// Super-admin only.
export async function adminListUsers(): Promise<AdminUserRow[]> {
  await requireSuperAdmin();
  const supabase = createAdminClient();

  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (usersError) throw usersError;

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, is_admin, is_super_admin");
  if (profilesError) throw profilesError;

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  return usersData.users
    .map((u) => {
      const p = byId.get(u.id);
      return {
        id: u.id,
        email: u.email ?? null,
        first_name: p?.first_name ?? null,
        last_name: p?.last_name ?? null,
        is_admin: Boolean(p?.is_admin),
        is_super_admin: Boolean(p?.is_super_admin),
        created_at: u.created_at,
      };
    })
    .sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
}

// Grants or revokes an admin flag on another user. Super-admin only.
export async function adminSetAdminStatus(
  targetId: string,
  field: AdminField,
  value: boolean,
): Promise<void> {
  const { user } = await requireSuperAdmin();

  // Self-lockout guard: a super admin can never change their own flags, which
  // guarantees at least one super admin always remains.
  if (targetId === user.id) {
    throw new AdminActionError("You can't change your own admin status.");
  }

  const supabase = createAdminClient();
  const update: Partial<Record<AdminField, boolean>> = { [field]: value };
  // Super admin implies panel access — granting one grants the other.
  if (field === "is_super_admin" && value) update.is_admin = true;

  const { error } = await supabase.from("profiles").update(update).eq("id", targetId);
  if (error) throw error;
}
