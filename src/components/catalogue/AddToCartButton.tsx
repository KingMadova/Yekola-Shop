"use client";

import { ShoppingCart } from "lucide-react";
import { focusRing } from "@/components/ui/styles";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      aria-label={`Ajouter ${product.name} au panier`}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 ${focusRing}`}
    >
      <ShoppingCart aria-hidden className="size-5" />
    </button>
  );
}
