"use client";

import { ShopLink } from "@/components/providers/ShopContext";
import { ShoppingBag } from "lucide-react";
import { container } from "@/components/ui/styles";
import { formatFCFA } from "@/lib/pricing";
import { useCartHydrated, useCartItems, useCartStore, useCartTotals } from "@/store/useCartStore";
import { CartLineItem } from "./CartLineItem";
import { CheckoutForm } from "./CheckoutForm";
import { VipProgressBar } from "./VipProgressBar";

export function CartPageContent() {
  const hydrated = useCartHydrated();
  const items = useCartItems();
  const totals = useCartTotals();
  const clear = useCartStore((state) => state.clear);

  return (
    <section className={container + " flex flex-col gap-6 py-8 sm:py-12"}>
      <header>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a7b40]">Votre sélection</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#173f35]">Votre panier</h1>
        <p className="mt-2 text-sm text-[#68756c]">Vérifiez les quantités et les tarifs avant de transmettre votre commande sur WhatsApp.</p>
      </header>

      {!hydrated ? (
        <div aria-hidden className="h-32 animate-pulse rounded-2xl bg-[#f0eee7]" />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-[#e9e5d9] bg-white px-5 py-12 text-center">
          <ShoppingBag aria-hidden className="size-10 text-[#315d47]" />
          <h2 className="text-lg font-semibold text-[#26392e]">Votre panier est encore vide.</h2>
          <p className="max-w-sm text-sm text-[#68756c]">Découvrez le catalogue et ajoutez les références qui vous intéressent.</p>
          <ShopLink href="/catalogue" className="mt-2 inline-flex min-h-11 items-center rounded-xl bg-[#173f35] px-5 font-semibold text-white hover:bg-[#10352d]">Découvrir les produits</ShopLink>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-4">
            <VipProgressBar totals={totals} />
            <ul className="flex flex-col gap-3">
              {items.map((item) => <CartLineItem key={item.product.code} item={item} vipUnlocked={totals.vipUnlocked} />)}
            </ul>
            <button type="button" onClick={clear} className="min-h-11 self-start text-sm text-[#68756c] underline underline-offset-4">Vider le panier</button>
          </div>

          <aside className="flex flex-col gap-4 rounded-3xl border border-[#e9e5d9] bg-[#fbfaf6] p-4 sm:p-5">
            <h2 className="text-lg font-bold text-[#26392e]">Récapitulatif</h2>
            <dl className="flex flex-col gap-2 text-sm text-[#45564a]">
              <div className="flex justify-between gap-3"><dt>Sous-total public</dt><dd className="font-semibold">{formatFCFA(totals.subtotalPublic)}</dd></div>
              {totals.vipUnlocked && <div className="flex justify-between gap-3 text-[#176b55]"><dt>Économie au tarif privilégié</dt><dd className="font-semibold">−{formatFCFA(totals.vipDiscount)}</dd></div>}
              <div className="flex justify-between gap-3 border-t border-[#e3dac4] pt-3 text-base font-bold text-[#173f35]"><dt>Total estimé</dt><dd>{formatFCFA(totals.total)}</dd></div>
            </dl>
            <CheckoutForm items={items} totals={totals} />
            <p className="text-xs leading-relaxed text-[#68756c]">La commande sera transmise dans WhatsApp. Elle sera confirmée après échange avec le conseiller.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
