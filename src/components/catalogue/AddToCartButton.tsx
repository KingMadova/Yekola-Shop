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
      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#173f35] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#10352d] sm:text-sm ${focusRing}`}
    >
      <ShoppingCart aria-hidden className="size-4" />
      Ajouter au panier
    </button>
  );
}
