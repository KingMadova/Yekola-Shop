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
    <section className={container + " flex flex-col gap-6 py-6 sm:py-12"}>
      <header>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a5430]">Votre sélection</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#30231d]">Votre panier</h1>
        <p className="mt-2 text-sm text-[#71645d]">Vérifiez les quantités et les tarifs avant de transmettre votre commande sur WhatsApp.</p>
      </header>

      {!hydrated ? (
        <div aria-hidden className="h-32 animate-pulse rounded-2xl bg-[#fff0df]" />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-[#f2d7c2] bg-[#fff9f3] px-5 py-10 text-center">
          <ShoppingBag aria-hidden className="size-10 text-[#c1440e]" />
          <h2 className="text-lg font-semibold text-[#30231d]">Votre panier est encore vide.</h2>
          <p className="max-w-sm text-sm text-[#71645d]">Découvrez le catalogue et ajoutez les références qui vous intéressent.</p>
          <ShopLink href="/catalogue" className="mt-2 inline-flex min-h-11 items-center rounded-xl bg-[#c1440e] px-5 font-semibold text-white transition hover:bg-[#a9360b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e]">Découvrir les produits</ShopLink>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-4">
            <VipProgressBar totals={totals} />
            <ul className="flex flex-col gap-3">
              {items.map((item) => <CartLineItem key={item.product.code} item={item} vipUnlocked={totals.vipUnlocked} />)}
            </ul>
            <button type="button" onClick={clear} className="min-h-11 self-start text-sm text-[#8a7668] underline underline-offset-4">Vider le panier</button>
          </div>

          <aside className="flex flex-col gap-4 rounded-3xl border border-[#f2d7c2] bg-[#fff9f3] p-4 sm:p-5">
            <h2 className="text-lg font-bold text-[#30231d]">Récapitulatif</h2>
            <dl className="flex flex-col gap-2 text-sm text-[#71645d]">
              <div className="flex justify-between gap-3"><dt>Sous-total public</dt><dd className="font-semibold">{formatFCFA(totals.subtotalPublic)}</dd></div>
              {totals.vipUnlocked && <div className="flex justify-between gap-3 text-[#a9360b]"><dt>Économie au tarif privilégié</dt><dd className="font-semibold">−{formatFCFA(totals.vipDiscount)}</dd></div>}
              <div className="flex justify-between gap-3 border-t border-[#f0dfd0] pt-3 text-base font-bold text-[#30231d]"><dt>Total estimé</dt><dd>{formatFCFA(totals.total)}</dd></div>
            </dl>
            <CheckoutForm items={items} totals={totals} />
            <p className="text-xs leading-relaxed text-[#71645d]">La commande sera transmise dans WhatsApp. Elle sera confirmée après échange avec le conseiller.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
