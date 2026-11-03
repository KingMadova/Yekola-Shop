"use client";

import { ShoppingCart } from "lucide-react";
import { focusRing } from "@/components/ui/styles";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  return <button type="button" onClick={() => addItem(product)} aria-label={`Ajouter ${product.name} au panier`} className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f9a825] to-[#c1440e] px-3 text-xs font-bold text-white transition-[filter] hover:brightness-105 sm:text-sm ${focusRing}`}>
    <ShoppingCart aria-hidden className="size-4" /> Ajouter au panier
  </button>;
}
