"use client";

import { MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/components/providers/ShopContext";
import { clampQuantity, computeCartTotals, formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { buildSingleProductMessage } from "@/lib/whatsapp";
import { useCartStore } from "@/store/useCartStore";

const stepperButton =
  "inline-flex size-11 items-center justify-center rounded-xl border border-[#ead9ca] bg-white text-[#30231d] transition hover:bg-[#fff5e9] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e]";

/** Quantité, ajout au panier et commande directe sur le WhatsApp de la boutique active. */
export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { partner, whatsappUrl } = useShop();
  const totals = computeCartTotals([{ product, quantity }]);
  const orderUrl = whatsappUrl(buildSingleProductMessage(product, quantity, partner.displayName));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7668]">Quantité</span>
          <div role="group" aria-label="Quantité" className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#ead9ca] bg-white p-1">
            <button type="button" className={stepperButton} aria-label="Diminuer la quantité" disabled={quantity <= 1} onClick={() => setQuantity((current) => clampQuantity(current - 1))}><Minus aria-hidden className="size-4" /></button>
            <span aria-live="polite" className="min-w-9 text-center text-base font-bold tabular-nums text-[#30231d]">{quantity}</span>
            <button type="button" className={stepperButton} aria-label="Augmenter la quantité" onClick={() => setQuantity((current) => clampQuantity(current + 1))}><Plus aria-hidden className="size-4" /></button>
          </div>
        </div>
        <p className="text-right text-sm text-[#71645d]">Total estimé <strong className="block text-lg text-[#30231d]">{formatFCFA(totals.total)}</strong>{totals.vipUnlocked && <span className="text-xs text-[#9a5430]">Tarif privilégié appliqué</span>}</p>
      </div>

      <button type="button" onClick={() => addItem(product, quantity)} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#c1440e] px-5 font-bold tracking-[0.04em] text-white shadow-sm transition hover:bg-[#a9360b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e]">
        <ShoppingCart aria-hidden className="size-5" />
        Ajouter au panier
      </button>
      <a href={orderUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#d8a78a] bg-[#fff9f3] px-5 text-center text-sm font-semibold text-[#a9360b] transition hover:bg-[#fff0df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e]">
        <MessageCircle aria-hidden className="size-5" />
        Commander directement sur WhatsApp
      </a>
    </div>
  );
}
