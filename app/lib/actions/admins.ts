"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "../auth/dal";
import { adminSetAdminStatus, AdminActionError, type AdminField } from "../admin/admins";

export async function setAdminStatusAction(formData: FormData) {
  // Redirects cleanly (outside the try) if the caller isn't a super admin.
  await requireSuperAdmin();

  const targetId = String(formData.get("userId") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = String(formData.get("value") ?? "") === "true";

  if (!targetId || (field !== "is_admin" && field !== "is_super_admin")) {
    redirect(`/admin/admins?error=${encodeURIComponent("Invalid request.")}`);
  }

  try {
    await adminSetAdminStatus(targetId, field as AdminField, value);
  } catch (err) {
    // Let Next's redirect/notFound signals propagate; only handle real failures.
    unstable_rethrow(err);
    const message =
      err instanceof AdminActionError ? err.message : "Something went wrong updating access.";
    redirect(`/admin/admins?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/admins");
  redirect("/admin/admins?updated=1");
}
