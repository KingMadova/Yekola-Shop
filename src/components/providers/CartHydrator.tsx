"use client";

import { useEffect } from "react";
import { HOUSE_PARTNER_SLUG } from "@/lib/config";
import { useCartStore } from "@/store/useCartStore";

/** Charge un panier distinct pour chaque boutique, après l'hydratation React. */
export function CartHydrator({ partnerSlug }: { partnerSlug: string }): null {
  useEffect(() => {
    const storageKey = `forever-cart-v1:${partnerSlug}`;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(storageKey);
      if (saved === null && partnerSlug === HOUSE_PARTNER_SLUG) {
        saved = localStorage.getItem("forever-cart-v1");
      }
    } catch {
      // Le panier reste utilisable en mémoire si le stockage est indisponible.
    }

    useCartStore.persist.setOptions({ name: storageKey });
    useCartStore.setState({ lines: [], isOpen: false, hydrated: false });
    try {
      if (saved !== null) localStorage.setItem(storageKey, saved);
    } catch {
      // Le stockage peut être désactivé par le navigateur.
    }
    void useCartStore.persist.rehydrate();
  }, [partnerSlug]);

  return null;
}
