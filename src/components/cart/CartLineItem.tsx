"use client";

import { ImageOff, Minus, Plus, Trash2 } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatFCFA, getUnitPrice } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";

const stepperButton =
  "inline-flex size-11 items-center justify-center rounded-lg border border-[#deded4] bg-white text-[#30231d] hover:bg-[#fff5e9] focus-visible:outline-2 focus-visible:outline-[#c1440e]";

interface CartLineItemProps {
  item: CartItem;
  vipUnlocked: boolean;
}

export function CartLineItem({ item, vipUnlocked }: CartLineItemProps) {
  const { product, quantity } = item;
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const unitPrice = getUnitPrice(product, vipUnlocked);
  const strike = vipUnlocked ? (product.compareAtPrice ?? product.pricePublic) : product.compareAtPrice;
  const photo = product.images[0];

  return (
    <li className="flex gap-3 rounded-2xl border border-[#f2d7c2] bg-[#fff9f3] p-3">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#fff0df]">
        {photo ? (
          <SafeImage src={photo} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <ImageOff aria-hidden className="absolute inset-0 m-auto size-6 text-[#c1440e]" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-[#30231d]">{product.name}</p>
            <p className="text-sm text-[#59685d]">
              {formatFCFA(unitPrice)}
              {strike && <s className="ml-2 text-xs text-[#71645d]">{formatFCFA(strike)}</s>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(product.code)}
            aria-label={`Retirer ${product.name} du panier`}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-[#fff5e9] focus-visible:outline-2 focus-visible:outline-emerald-700"
          >
            <Trash2 aria-hidden className="size-5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div role="group" aria-label={`Quantité de ${product.name}`} className="flex items-center gap-2">
            <button
              type="button"
              className={stepperButton}
              aria-label="Diminuer la quantité"
              onClick={() => setQuantity(product.code, quantity - 1)}
            >
              <Minus aria-hidden className="size-4" />
            </button>
            <span aria-live="polite" className="w-8 text-center font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              className={stepperButton}
              aria-label="Augmenter la quantité"
              onClick={() => setQuantity(product.code, quantity + 1)}
            >
              <Plus aria-hidden className="size-4" />
            </button>
          </div>
          <p className="font-bold text-gray-900">{formatFCFA(unitPrice * quantity)}</p>
        </div>
      </div>
    </li>
  );
}
