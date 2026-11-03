"use client";

import { ShoppingCart } from "lucide-react";
import { useCartHydrated, useCartStore, useCartTotals } from "@/store/useCartStore";

export function CartButton() {
  const openCart = useCartStore((state) => state.openCart);
  const hydrated = useCartHydrated();
  const { itemCount } = useCartTotals();
  const showBadge = hydrated && itemCount > 0;
  return (
    <button type="button" onClick={openCart} aria-label={showBadge ? `Ouvrir le panier, ${itemCount} article${itemCount > 1 ? "s" : ""}` : "Ouvrir le panier"} className="relative inline-flex size-11 items-center justify-center rounded-full text-[#8f2d09] hover:bg-[#fff0df] focus-visible:outline-2 focus-visible:outline-[#c1440e]">
      <ShoppingCart aria-hidden className="size-6" />
      {showBadge && <span aria-hidden className="absolute -right-0.5 -top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[#c1440e] px-1 text-xs font-semibold text-white">{itemCount}</span>}
    </button>
  );
}
