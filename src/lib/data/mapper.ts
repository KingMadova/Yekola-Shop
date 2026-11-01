import type { Product } from "../types";
import type { CatalogRows, PromotionRow } from "./rows";

export interface ResolvedPromo {
  price: number;
  badge: string;
}

/**
 * Meilleure promo en cours à l'instant `now` (la plus basse), ou null.
 * Une promo invalide (prix ≥ prix catalogue), inactive, expirée ou pas commencée est ignorée.
 */
export function resolvePromo(
  basePrice: number,
  promos: readonly PromotionRow[],
  now: Date,
): ResolvedPromo | null {
  const time = now.getTime();
  let best: ResolvedPromo | null = null;

  for (const promo of promos) {
    if (!promo.is_active) continue;
    const start = Date.parse(promo.starts_at);
    const end = Date.parse(promo.ends_at);
    if (!(start <= time && time < end)) continue;

    const price =
      promo.promo_price ??
      (promo.percent_off !== null ? Math.round((basePrice * (100 - promo.percent_off)) / 100) : null);
    if (price === null || price < 0 || price >= basePrice) continue;

    if (!best || price < best.price) {
      const percent = Math.round(((basePrice - price) / basePrice) * 100);
      best = { price, badge: promo.badge?.trim() || `-${promo.percent_off ?? percent} %` };
    }
  }
  return best;
}

/**
 * Transforme les lignes de la base en produits « effectifs » :
 * `pricePublic` et `priceVip` viennent des deux colonnes tarifaires officielles.
 * Une promotion réduit les deux tarifs dans la même proportion ; aucun taux VIP n'est recalculé.
 */
export function buildCatalog(rows: CatalogRows, now: Date): Product[] {
  const promosByProduct = new Map<string, PromotionRow[]>();
  for (const promo of rows.promotions) {
    promosByProduct.set(promo.product_id, [...(promosByProduct.get(promo.product_id) ?? []), promo]);
  }

  const byId = new Map(rows.products.map((row) => [row.id, row]));
  const itemsByPack = new Map<string, { code: string; name: string; quantity: number }[]>();
  for (const item of rows.packItems) {
    const component = byId.get(item.product_id);
    if (!component) continue;
    itemsByPack.set(item.pack_id, [
      ...(itemsByPack.get(item.pack_id) ?? []),
      { code: component.code, name: component.name, quantity: item.quantity },
    ]);
  }

  return [...rows.products]
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "fr"))
    .map((row): Product => {
      const promo = resolvePromo(row.price_public, promosByProduct.get(row.id) ?? [], now);
      const sellingPrice = promo?.price ?? row.price_public;
      const packItems = row.is_pack ? itemsByPack.get(row.id) : undefined;
      return {
        code: row.code,
        name: row.name,
        slug: row.slug,
        category: row.category,
        healthGoals: row.health_goals,
        pricePublic: sellingPrice,
        priceVip: promo && row.price_public > 0
          ? Math.min(sellingPrice, Math.round(row.price_vip * sellingPrice / row.price_public))
          : row.price_vip,
        images: row.images,
        shortDesc: row.short_desc,
        duration: row.duration ?? undefined,
        usageAdvice: row.usage_advice ?? undefined,
        benefits: row.benefits,
        isBestSeller: row.is_best_seller || undefined,
        isPackSolution: row.is_pack || undefined,
        compareAtPrice: promo ? row.price_public : undefined,
        promoBadge: promo?.badge,
        packItems: packItems && packItems.length > 0 ? packItems : undefined,
      };
    });
}
