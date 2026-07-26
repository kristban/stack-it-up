import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  is_super_admin: boolean;
}

// getUser() validates the session against the Supabase auth server — this is the
// secure check, unlike reading the cookie directly. Memoized per render pass.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return { user: null, profile: null as Profile | null };

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, is_admin, is_super_admin")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (data as Profile | null) ?? null };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login");
  // Super admins implicitly have panel access.
  if (!profile?.is_admin && !profile?.is_super_admin) redirect("/");
  return { user, profile };
}

export async function requireSuperAdmin() {
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect("/login");
  if (!profile?.is_super_admin) redirect("/");
  return { user, profile };
}
