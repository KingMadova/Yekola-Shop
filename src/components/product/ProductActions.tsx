"use client";

import { MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { clampQuantity, computeCartTotals, formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { buildSingleProductMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCartStore } from "@/store/useCartStore";

const stepperButton =
  "inline-flex size-11 items-center justify-center rounded-xl border border-gray-400 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-emerald-700";

/** Double bouton d'achat : « Ajouter au panier » et « Commander en 1 clic via WhatsApp » (sans passer par le panier). */
export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const totals = computeCartTotals([{ product, quantity }]);
  const whatsappUrl = buildWhatsAppUrl(buildSingleProductMessage(product, quantity));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div role="group" aria-label="Quantité" className="flex items-center gap-2">
          <button
            type="button"
            className={stepperButton}
            aria-label="Diminuer la quantité"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => clampQuantity(current - 1))}
          >
            <Minus aria-hidden className="size-4" />
          </button>
          <span aria-live="polite" className="w-10 text-center text-lg font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            className={stepperButton}
            aria-label="Augmenter la quantité"
            onClick={() => setQuantity((current) => clampQuantity(current + 1))}
          >
            <Plus aria-hidden className="size-4" />
          </button>
        </div>
        <p className="text-sm text-gray-800">
          Total : <strong>{formatFCFA(totals.total)}</strong>
          {totals.vipUnlocked && " (prix VIP appliqué)"}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => addItem(product, quantity)}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          <ShoppingCart aria-hidden className="size-5" />
          Ajouter au panier
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#075E54] px-5 text-center font-semibold text-white hover:bg-[#064c44] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          <MessageCircle aria-hidden className="size-5" />
          Commander en 1 clic via WhatsApp
        </a>
      </div>
    </div>
  );
}
