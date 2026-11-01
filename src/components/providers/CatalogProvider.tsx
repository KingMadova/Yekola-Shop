"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import type { Product } from "@/lib/types";
import { useCartHydrated, useCartStore } from "@/store/useCartStore";
import { CatalogContext } from "./CatalogContext";

/** Reçoit le catalogue du serveur ; retire du panier les produits qui n'existent plus. */
export function CatalogProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  const hydrated = useCartHydrated();
  const prune = useCartStore((state) => state.prune);

  const value = useMemo(() => {
    const byCode = new Map(products.map((product) => [product.code, product]));
    return { products, getProductByCode: (code: string) => byCode.get(code) };
  }, [products]);

  useEffect(() => {
    if (hydrated) prune(products.map((product) => product.code));
  }, [hydrated, products, prune]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
