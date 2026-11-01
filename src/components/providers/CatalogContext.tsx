"use client";

import { createContext, useContext } from "react";
import type { Product } from "@/lib/types";

export interface CatalogContextValue {
  products: readonly Product[];
  getProductByCode: (code: string) => Product | undefined;
}

export const CatalogContext = createContext<CatalogContextValue | null>(null);

/** Catalogue courant côté navigateur (panier, pop-up de lead). Doit être utilisé sous <CatalogProvider>. */
export function useCatalog(): CatalogContextValue {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("useCatalog doit être utilisé sous <CatalogProvider>.");
  return value;
}
