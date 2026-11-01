"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useCatalog } from "@/components/providers/CatalogContext";
import { clampQuantity, computeCartTotals } from "@/lib/pricing";
import type { CartItem, CartLine, CartTotals, Product } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  /** Vrai une fois le panier relu depuis localStorage (évite les erreurs d'hydratation). */
  hydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (code: string, quantity: number) => void;
  removeItem: (code: string) => void;
  /** Retire les lignes dont le produit n'existe plus au catalogue. */
  prune: (validCodes: readonly string[]) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  setHydrated: () => void;
}

interface PersistedCart {
  lines: CartLine[];
}

/** Relecture défensive : ignore les données corrompues. Les produits disparus sont retirés par `prune`. */
function sanitizeLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const lines: CartLine[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const { code, quantity } = entry as Record<string, unknown>;
    if (typeof code !== "string" || typeof quantity !== "number") continue;
    lines.push({ code, quantity: clampQuantity(quantity) });
  }
  return lines;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      hydrated: false,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((line) => line.code === product.code);
          const lines = existing
            ? state.lines.map((line) =>
                line.code === product.code
                  ? { ...line, quantity: clampQuantity(line.quantity + quantity) }
                  : line,
              )
            : [...state.lines, { code: product.code, quantity: clampQuantity(quantity) }];
          return { lines, isOpen: true };
        }),

      setQuantity: (code, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((line) => line.code !== code)
              : state.lines.map((line) =>
                  line.code === code ? { ...line, quantity: clampQuantity(quantity) } : line,
                ),
        })),

      removeItem: (code) =>
        set((state) => ({ lines: state.lines.filter((line) => line.code !== code) })),

      prune: (validCodes) =>
        set((state) => {
          const lines = state.lines.filter((line) => validCodes.includes(line.code));
          return lines.length === state.lines.length ? state : { lines };
        }),

      clear: () => set({ lines: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "forever-cart-v1",
      version: 1,
      storage: createJSONStorage<PersistedCart>(() => localStorage),
      // Hydratation manuelle (voir CartHydrator) : le rendu serveur et le premier rendu client restent identiques.
      skipHydration: true,
      partialize: (state): PersistedCart => ({ lines: state.lines }),
      merge: (persisted, current) => ({
        ...current,
        lines: sanitizeLines((persisted as Partial<PersistedCart> | undefined)?.lines),
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

/** Lignes du panier avec les prix courants du catalogue (promos comprises). */
export function useCartItems(): CartItem[] {
  const lines = useCartStore((state) => state.lines);
  const { getProductByCode } = useCatalog();
  return useMemo(
    () =>
      lines.flatMap((line) => {
        const product = getProductByCode(line.code);
        return product ? [{ product, quantity: line.quantity }] : [];
      }),
    [lines, getProductByCode],
  );
}

/** Totaux avec la règle stricte du palier de 65 000 F. */
export function useCartTotals(): CartTotals {
  const items = useCartItems();
  return useMemo(() => computeCartTotals(items), [items]);
}

export function useCartHydrated(): boolean {
  return useCartStore((state) => state.hydrated);
}
