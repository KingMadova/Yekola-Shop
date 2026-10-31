"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

/** À monter une seule fois dans app/layout.tsx : relit le panier depuis localStorage après l'hydratation. */
export function CartHydrator(): null {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
  return null;
}
