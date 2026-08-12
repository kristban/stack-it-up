"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { requireUser } from "@/app/lib/auth/dal";
import { StackSlot } from "@/app/lib/types";

export interface LibraryResult {
  ok: boolean;
  error?: string;
}

const SLOTS: StackSlot[] = ["morning", "evening"];

// Confirm the supplement exists before writing a membership row. The FK would
// reject an unknown key anyway, but this gives a clean message and avoids a
// wasted round trip on obviously bad input.
async function supplementExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  key: string,
): Promise<boolean> {
  const { data } = await supabase.from("supplements").select("key").eq("key", key).maybeSingle();
  return Boolean(data);
}

// Favorite / unfavorite a supplement. Idempotent: adding an existing favorite
// is a no-op, so double-clicks are safe. Called from the client toggle via a
// transition, so it returns a status rather than redirecting.
export async function setFavoriteAction(
  supplementKey: string,
  shouldFavorite: boolean,
): Promise<LibraryResult> {
  const user = await requireUser();
  const key = supplementKey.trim();
  if (!key) return { ok: false, error: "Missing supplement." };

  const supabase = await createClient();
  if (shouldFavorite && !(await supplementExists(supabase, key))) {
    return { ok: false, error: "That supplement doesn't exist." };
  }

  const { error } = shouldFavorite
    ? await supabase
        .from("favorites")
        .upsert(
          { user_id: user.id, supplement_key: key },
          { onConflict: "user_id,supplement_key", ignoreDuplicates: true },
        )
    : await supabase.from("favorites").delete().eq("user_id", user.id).eq("supplement_key", key);

  if (error) return { ok: false, error: "Couldn't save that. Please try again." };

  revalidatePath("/account");
  return { ok: true };
}

// Add/remove a supplement to/from the morning or evening stack. Idempotent for
// the same reasons as favorites.
export async function setStackItemAction(
  supplementKey: string,
  slot: StackSlot,
  shouldAdd: boolean,
): Promise<LibraryResult> {
  const user = await requireUser();
  const key = supplementKey.trim();
  if (!key) return { ok: false, error: "Missing supplement." };
  if (!SLOTS.includes(slot)) return { ok: false, error: "Unknown stack." };

  const supabase = await createClient();
  if (shouldAdd && !(await supplementExists(supabase, key))) {
    return { ok: false, error: "That supplement doesn't exist." };
  }

  let error;
  if (shouldAdd) {
    // Append to the end of the slot: one past the current highest position.
    const { data: last } = await supabase
      .from("stack_items")
      .select("position")
      .eq("user_id", user.id)
      .eq("slot", slot)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextPosition = (last?.position ?? -1) + 1;
    ({ error } = await supabase.from("stack_items").upsert(
      { user_id: user.id, slot, supplement_key: key, position: nextPosition },
      { onConflict: "user_id,slot,supplement_key", ignoreDuplicates: true },
    ));
  } else {
    ({ error } = await supabase
      .from("stack_items")
      .delete()
      .eq("user_id", user.id)
      .eq("slot", slot)
      .eq("supplement_key", key));
  }

  if (error) return { ok: false, error: "Couldn't save that. Please try again." };

  revalidatePath("/account");
  return { ok: true };
}

// Persist a new drag order for a slot. Writes each row's position to its index
// in the given key list. Keys not owned by the user (or not in the slot) simply
// match no rows — RLS + the eq filters keep it scoped to the caller.
export async function reorderStackAction(
  slot: StackSlot,
  orderedKeys: string[],
): Promise<LibraryResult> {
  const user = await requireUser();
  if (!SLOTS.includes(slot)) return { ok: false, error: "Unknown stack." };

  const supabase = await createClient();
  const results = await Promise.all(
    orderedKeys.map((key, index) =>
      supabase
        .from("stack_items")
        .update({ position: index })
        .eq("user_id", user.id)
        .eq("slot", slot)
        .eq("supplement_key", key),
    ),
  );

  if (results.some((r) => r.error)) {
    return { ok: false, error: "Couldn't save the new order. Please try again." };
  }

  revalidatePath("/account");
  return { ok: true };
}

// Form-action wrappers for the "Remove" buttons on the account page. These post
// a plain form (like removeAvatarAction) and revalidate so the list re-renders.
export async function removeFavoriteAction(formData: FormData) {
  const key = String(formData.get("supplementKey") ?? "").trim();
  if (key) await setFavoriteAction(key, false);
  revalidatePath("/account");
}

export async function removeStackItemAction(formData: FormData) {
  const key = String(formData.get("supplementKey") ?? "").trim();
  const slot = String(formData.get("slot") ?? "").trim() as StackSlot;
  if (key && SLOTS.includes(slot)) await setStackItemAction(key, slot, false);
  revalidatePath("/account");
}
