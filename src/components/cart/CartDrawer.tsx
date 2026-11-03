"use client";

import { ShoppingBag, X } from "lucide-react";
import { ShopLink } from "@/components/providers/ShopContext";
import { useEffect, useId, useRef } from "react";
import { formatFCFA } from "@/lib/pricing";
import {
  useCartHydrated,
  useCartItems,
  useCartStore,
  useCartTotals,
} from "@/store/useCartStore";
import { CartLineItem } from "./CartLineItem";
import { CheckoutForm } from "./CheckoutForm";
import { VipProgressBar } from "./VipProgressBar";

/** Tiroir du panier basé sur <dialog> : focus piégé, Échap et clic sur le fond ferment. À monter une fois dans app/layout.tsx. */
export function CartDrawer() {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const clear = useCartStore((state) => state.clear);
  const hydrated = useCartHydrated();
  const items = useCartItems();
  const totals = useCartTotals();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();

    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={closeCart}
      onClick={(event) => {
        if (event.target === dialogRef.current) closeCart();
      }}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-[#fff5e9] p-0 text-[#30231d] backdrop:bg-black/50 open:flex open:flex-col"
    >
      <header className="flex items-center justify-between border-b border-[#f2d7c2] bg-[#fff9f3] px-4 py-3">
        <h2 id={titleId} className="text-lg font-bold">
          Mon panier{hydrated && totals.itemCount > 0 ? ` (${totals.itemCount})` : ""}
        </h2>
        <button
          type="button"
          onClick={closeCart}
          aria-label="Fermer le panier"
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-[#fff5e9] focus-visible:outline-2 focus-visible:outline-[#c1440e]"
        >
          <X aria-hidden className="size-5" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        {!hydrated ? (
          <div aria-hidden className="h-24 animate-pulse rounded-2xl bg-[#f2d7c2]" />
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag aria-hidden className="size-10 text-[#c1440e]" />
            <p className="font-semibold">Votre panier est vide</p>
            <p className="max-w-xs text-sm text-gray-800">
              Ajoutez un produit ou un pack pour commander sur WhatsApp.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="min-h-11 rounded-xl border border-[#c1440e] px-5 font-semibold text-[#c1440e] hover:bg-[#fff0df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e]"
            >
              Voir les produits
            </button>
          </div>
        ) : (
          <>
            <VipProgressBar totals={totals} />

            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <CartLineItem key={item.product.code} item={item} vipUnlocked={totals.vipUnlocked} />
              ))}
            </ul>

            <dl className="flex flex-col gap-1 rounded-2xl border border-[#f2d7c2] bg-[#fff9f3] p-4 text-sm">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd>{formatFCFA(totals.subtotalPublic)}</dd>
              </div>
              {totals.vipUnlocked && (
                <div className="flex justify-between text-[#c1440e]">
                  <dt>Économie au tarif privilégié</dt>
                  <dd>−{formatFCFA(totals.vipDiscount)}</dd>
                </div>
              )}
              <div className="mt-1 flex justify-between border-t border-[#f2d7c2] pt-2 text-lg font-bold">
                <dt>Total</dt>
                <dd>{formatFCFA(totals.total)}</dd>
              </div>
            </dl>

            <CheckoutForm items={items} totals={totals} />
            <ShopLink href="/panier" onClick={closeCart} className="min-h-11 self-center text-sm font-semibold text-[#c1440e] underline underline-offset-4">Ouvrir la page panier</ShopLink>

            <button
              type="button"
              onClick={clear}
              className="min-h-11 self-center text-sm text-[#71645d] underline hover:text-[#30231d] focus-visible:outline-2 focus-visible:outline-[#c1440e]"
            >
              Vider le panier
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
