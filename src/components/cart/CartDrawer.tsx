"use client";

import { ShoppingBag, X } from "lucide-react";
import Link from "next/link";
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
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-[#f6f3ea] p-0 text-[#26392e] backdrop:bg-black/50 open:flex open:flex-col"
    >
      <header className="flex items-center justify-between border-b border-[#e9e5d9] bg-[#fbfaf6] px-4 py-3">
        <h2 id={titleId} className="text-lg font-bold">
          Mon panier{hydrated && totals.itemCount > 0 ? ` (${totals.itemCount})` : ""}
        </h2>
        <button
          type="button"
          onClick={closeCart}
          aria-label="Fermer le panier"
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-[#f6f3ea] focus-visible:outline-2 focus-visible:outline-[#173f35]"
        >
          <X aria-hidden className="size-5" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        {!hydrated ? (
          <div aria-hidden className="h-24 animate-pulse rounded-2xl bg-[#e9e5d9]" />
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag aria-hidden className="size-10 text-[#315d47]" />
            <p className="font-semibold">Votre panier est vide</p>
            <p className="max-w-xs text-sm text-gray-800">
              Ajoutez un produit ou un pack pour commander sur WhatsApp.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="min-h-11 rounded-xl border border-[#173f35] px-5 font-semibold text-[#173f35] hover:bg-[#edf1e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35]"
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

            <dl className="flex flex-col gap-1 rounded-2xl border border-[#e9e5d9] bg-[#fbfaf6] p-4 text-sm">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd>{formatFCFA(totals.subtotalPublic)}</dd>
              </div>
              {totals.vipUnlocked && (
                <div className="flex justify-between text-[#315d47]">
                  <dt>Économie au tarif privilégié</dt>
                  <dd>−{formatFCFA(totals.vipDiscount)}</dd>
                </div>
              )}
              <div className="mt-1 flex justify-between border-t border-[#e9e5d9] pt-2 text-lg font-bold">
                <dt>Total</dt>
                <dd>{formatFCFA(totals.total)}</dd>
              </div>
            </dl>

            <CheckoutForm items={items} totals={totals} />
            <Link href="/panier" onClick={closeCart} className="min-h-11 self-center text-sm font-semibold text-[#173f35] underline underline-offset-4">Ouvrir la page panier</Link>

            <button
              type="button"
              onClick={clear}
              className="min-h-11 self-center text-sm text-[#68756c] underline hover:text-[#26392e] focus-visible:outline-2 focus-visible:outline-[#173f35]"
            >
              Vider le panier
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
