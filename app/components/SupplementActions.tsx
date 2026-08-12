"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "../lib/supabase/client";
import { setFavoriteAction, setStackItemAction } from "../lib/actions/library";
import { StackSlot } from "../lib/types";

interface SupplementActionsProps {
  supplementKey: string;
  supplementName: string;
}

// Toggle controls shown on a supplement's detail page. Auth + membership are
// read client-side (mirroring Navbar) so the page itself stays static/cacheable.
// Writes go through server actions; local state updates optimistically.
export default function SupplementActions({
  supplementKey,
  supplementName,
}: SupplementActionsProps) {
  const [authReady, setAuthReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inMorning, setInMorning] = useState(false);
  const [inEvening, setInEvening] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function apply(user: { id: string } | null) {
      if (!mounted) return;
      if (!user) {
        setSignedIn(false);
        setIsFavorite(false);
        setInMorning(false);
        setInEvening(false);
        setAuthReady(true);
        return;
      }
      setSignedIn(true);
      // RLS lets a user read only their own rows.
      const [{ data: fav }, { data: stack }] = await Promise.all([
        supabase
          .from("favorites")
          .select("supplement_key")
          .eq("user_id", user.id)
          .eq("supplement_key", supplementKey)
          .maybeSingle(),
        supabase
          .from("stack_items")
          .select("slot")
          .eq("user_id", user.id)
          .eq("supplement_key", supplementKey),
      ]);
      if (!mounted) return;
      setIsFavorite(Boolean(fav));
      const slots = new Set((stack ?? []).map((r) => r.slot as StackSlot));
      setInMorning(slots.has("morning"));
      setInEvening(slots.has("evening"));
      setAuthReady(true);
    }

    supabase.auth.getUser().then(({ data }) => apply(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      apply(session?.user ?? null),
    );

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supplementKey]);

  function toggleFavorite() {
    const next = !isFavorite;
    setIsFavorite(next); // optimistic
    startTransition(async () => {
      const res = await setFavoriteAction(supplementKey, next);
      if (!res.ok) setIsFavorite(!next); // revert on failure
    });
  }

  function toggleStack(slot: StackSlot) {
    const current = slot === "morning" ? inMorning : inEvening;
    const setter = slot === "morning" ? setInMorning : setInEvening;
    const next = !current;
    setter(next); // optimistic
    startTransition(async () => {
      const res = await setStackItemAction(supplementKey, slot, next);
      if (!res.ok) setter(!next); // revert on failure
    });
  }

  // Reserve the space until auth resolves to avoid a layout jump.
  if (!authReady) {
    return <div className="mt-6 h-[52px]" aria-hidden="true" />;
  }

  if (!signedIn) {
    return (
      <div
        className="mt-6 rounded-2xl border px-4 py-3 text-sm flex flex-wrap items-center gap-x-2 gap-y-1"
        style={{ background: "#FFFFFF", borderColor: "rgba(17,17,17,0.08)", color: "#6B6558" }}
      >
        <span aria-hidden="true">♥</span>
        <span>
          <Link
            href="/login"
            className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "#111111" }}
          >
            Log in
          </Link>{" "}
          to favorite this or add it to your morning or evening stack.
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <ToggleButton
        pressed={isFavorite}
        onClick={toggleFavorite}
        emoji="♥"
        label="Favorite"
        ariaLabel={
          isFavorite
            ? `Remove ${supplementName} from favorites`
            : `Add ${supplementName} to favorites`
        }
      />
      <ToggleButton
        pressed={inMorning}
        onClick={() => toggleStack("morning")}
        emoji="☀️"
        label="Morning stack"
        ariaLabel={
          inMorning
            ? `Remove ${supplementName} from your morning stack`
            : `Add ${supplementName} to your morning stack`
        }
      />
      <ToggleButton
        pressed={inEvening}
        onClick={() => toggleStack("evening")}
        emoji="🌙"
        label="Evening stack"
        ariaLabel={
          inEvening
            ? `Remove ${supplementName} from your evening stack`
            : `Add ${supplementName} to your evening stack`
        }
      />
    </div>
  );
}

interface ToggleButtonProps {
  pressed: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  ariaLabel: string;
}

// Blue #2F5580 ink on the #CFE0F7 tile is the AA-safe pairing (docs/CONVENTIONS.md).
function ToggleButton({ pressed, onClick, emoji, label, ariaLabel }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2"
      style={{
        background: pressed ? "#CFE0F7" : "#FFFFFF",
        borderColor: pressed ? "#2F5580" : "rgba(17,17,17,0.15)",
        color: pressed ? "#2F5580" : "#111111",
      }}
    >
      <span aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}
