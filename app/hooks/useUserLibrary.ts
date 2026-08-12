"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { setFavoriteAction, setStackItemAction } from "../lib/actions/library";
import { StackSlot } from "../lib/types";

export interface UserLibrary {
  authReady: boolean;
  signedIn: boolean;
  favorites: Set<string>;
  morning: Set<string>;
  evening: Set<string>;
  toggleFavorite: (key: string) => void;
  toggleStack: (key: string, slot: StackSlot) => void;
}

// Loads the signed-in user's favorites + stack membership in one pass (mirrors
// Navbar's client-side auth read) and exposes optimistic toggles backed by the
// same server actions the detail page uses. Fetching once here keeps the search
// grid to a single query instead of one per card.
export function useUserLibrary(): UserLibrary {
  const [authReady, setAuthReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [morning, setMorning] = useState<Set<string>>(new Set());
  const [evening, setEvening] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function apply(user: { id: string } | null) {
      if (!mounted) return;
      if (!user) {
        setSignedIn(false);
        setFavorites(new Set());
        setMorning(new Set());
        setEvening(new Set());
        setAuthReady(true);
        return;
      }
      setSignedIn(true);
      const [{ data: favs }, { data: stack }] = await Promise.all([
        supabase.from("favorites").select("supplement_key").eq("user_id", user.id),
        supabase.from("stack_items").select("slot, supplement_key").eq("user_id", user.id),
      ]);
      if (!mounted) return;
      setFavorites(new Set((favs ?? []).map((r) => r.supplement_key)));
      setMorning(
        new Set(
          (stack ?? []).filter((r) => r.slot === "morning").map((r) => r.supplement_key),
        ),
      );
      setEvening(
        new Set(
          (stack ?? []).filter((r) => r.slot === "evening").map((r) => r.supplement_key),
        ),
      );
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
  }, []);

  // Handlers close over the current-render sets, so `willAdd` reads live
  // membership without a ref. Optimistic add/remove via a pure functional
  // updater; the server action call and its revert-on-failure sit outside it.
  const apply = (
    setState: React.Dispatch<React.SetStateAction<Set<string>>>,
    key: string,
    add: boolean,
  ) => {
    setState((prev) => {
      const next = new Set(prev);
      if (add) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const toggleFavorite = (key: string) => {
    const willAdd = !favorites.has(key);
    apply(setFavorites, key, willAdd);
    setFavoriteAction(key, willAdd).then((res) => {
      if (!res.ok) apply(setFavorites, key, !willAdd);
    });
  };

  const toggleStack = (key: string, slot: StackSlot) => {
    const setState = slot === "morning" ? setMorning : setEvening;
    const current = slot === "morning" ? morning : evening;
    const willAdd = !current.has(key);
    apply(setState, key, willAdd);
    setStackItemAction(key, slot, willAdd).then((res) => {
      if (!res.ok) apply(setState, key, !willAdd);
    });
  };

  return { authReady, signedIn, favorites, morning, evening, toggleFavorite, toggleStack };
}
