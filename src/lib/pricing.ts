import {
  MAX_LINE_QUANTITY,
  VIP_DISCOUNT_PERCENT,
  VIP_THRESHOLD,
} from "./config";
import type { CartItem, CartTotals, Product } from "./types";

const numberFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

/** 65000 -> "65 000 F" (espaces insécables : le montant ne se coupe jamais en fin de ligne). */
export function formatFCFA(amount: number): string {
  const grouped = numberFormatter.format(Math.round(amount)).replace(/\u202f/g, "\u00a0");
  return `${grouped}\u00a0F`;
}

/** Prix VIP = prix public -5 %, calculé en entiers puis arrondi au franc. */
export function computeVipPrice(pricePublic: number): number {
  return Math.round((pricePublic * (100 - VIP_DISCOUNT_PERCENT)) / 100);
}

export function getUnitPrice(product: Product, vipUnlocked: boolean): number {
  return vipUnlocked ? product.priceVip : product.pricePublic;
}

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.trunc(quantity)));
}

/**
 * Règle stricte : la remise VIP s'applique à TOUTE la commande si, et seulement si,
 * le total au prix public atteint ou dépasse 65 000 F. En dessous : prix public.
 */
export function computeCartTotals(items: readonly CartItem[]): CartTotals {
  let itemCount = 0;
  let subtotalPublic = 0;
  let subtotalVip = 0;

  for (const { product, quantity } of items) {
    itemCount += quantity;
    subtotalPublic += product.pricePublic * quantity;
    subtotalVip += product.priceVip * quantity;
  }

  const vipUnlocked = subtotalPublic >= VIP_THRESHOLD;
  const total = vipUnlocked ? subtotalVip : subtotalPublic;

  return {
    itemCount,
    subtotalPublic,
    vipUnlocked,
    vipDiscount: subtotalPublic - total,
    total,
    amountToVip: Math.max(0, VIP_THRESHOLD - subtotalPublic),
    progressPercent: Math.min(100, Math.floor((subtotalPublic * 100) / VIP_THRESHOLD)),
  };
}
