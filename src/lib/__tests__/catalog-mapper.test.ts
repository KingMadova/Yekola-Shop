import { describe, expect, it } from "vitest";
import { buildCatalog, resolvePromo } from "../data/mapper";
import type { CatalogRows, ProductRow, PromotionRow } from "../data/rows";
import { computeCartTotals } from "../pricing";

const NOW = new Date("2026-11-10T12:00:00Z");

const product = (id: string, price: number, over: Partial<ProductRow> = {}): ProductRow => ({
  id, code: id.toUpperCase(), slug: id, name: `Produit ${id}`, category: "Boissons", health_goals: [],
  price_public: price, price_vip: Math.round(price * 0.95), short_desc: "", duration: null, usage_advice: null, benefits: [], images: [],
  is_best_seller: false, is_pack: false, sort_order: 0, ...over,
});

const promo = (productId: string, over: Partial<PromotionRow> = {}): PromotionRow => ({
  id: `promo-${productId}`, product_id: productId, promo_price: null, percent_off: 10, badge: null,
  starts_at: "2026-11-01T00:00:00Z", ends_at: "2026-11-30T00:00:00Z", is_active: true, ...over,
});

const rows = (products: ProductRow[], promotions: PromotionRow[] = []): CatalogRows => ({
  products, promotions, packItems: [],
});

describe("promotions", () => {
  it("applique une promotion dans la même proportion aux deux tarifs officiels", () => {
    const [p] = buildCatalog(rows([product("a", 40_000)], [promo("a", { percent_off: 25 })]), NOW);
    expect(p?.pricePublic).toBe(30_000);
    expect(p?.compareAtPrice).toBe(40_000);
    expect(p?.promoBadge).toBe("-25 %");
    expect(p?.priceVip).toBe(28_500);
  });

  it("applique un prix promo fixe et conserve la proportion entre les deux tarifs", () => {
    const [p] = buildCatalog(rows([product("a", 40_000)], [promo("a", { percent_off: null, promo_price: 35_000, badge: "Offre de lancement" })]), NOW);
    expect(p?.pricePublic).toBe(35_000);
    expect(p?.promoBadge).toBe("Offre de lancement");
  });

  it("ignore une promo expirée, pas commencée, désactivée ou absurde", () => {
    for (const bad of [
      promo("a", { ends_at: "2026-11-05T00:00:00Z" }),
      promo("a", { starts_at: "2026-12-01T00:00:00Z", ends_at: "2026-12-10T00:00:00Z" }),
      promo("a", { is_active: false }),
      promo("a", { percent_off: null, promo_price: 50_000 }),
    ]) {
      const [p] = buildCatalog(rows([product("a", 40_000)], [bad]), NOW);
      expect(p?.pricePublic).toBe(40_000);
      expect(p?.compareAtPrice).toBeUndefined();
    }
  });

  it("garde la meilleure promo quand plusieurs sont en cours", () => {
    expect(resolvePromo(40_000, [promo("a", { percent_off: 10 }), promo("a", { percent_off: 30 })], NOW)?.price).toBe(28_000);
  });
});

describe("palier client privilégié avec promos (mesuré aux prix de vente)", () => {
  it("applique le VIP sur les prix promo quand le total promo atteint 65 000 F", () => {
    const items = buildCatalog(rows([product("a", 50_000)], [promo("a", { percent_off: 30 })]), NOW);
    const totals = computeCartTotals([{ product: items[0]!, quantity: 2 }]); // 2 x 35 000 = 70 000
    expect(totals.vipUnlocked).toBe(true);
    expect(totals.total).toBe(2 * 33_250);
  });

  it("ne déclenche pas le VIP si la promo fait passer le total sous 65 000 F", () => {
    const items = buildCatalog(rows([product("a", 40_000)], [promo("a", { percent_off: 25 })]), NOW);
    const totals = computeCartTotals([{ product: items[0]!, quantity: 2 }]); // 80 000 avant promo, 60 000 après
    expect(totals.vipUnlocked).toBe(false);
    expect(totals.total).toBe(60_000);
  });
});

describe("catalogue", () => {
  it("compose les packs, trie par ordre puis par nom", () => {
    const base: CatalogRows = {
      products: [product("b", 1_000, { sort_order: 2 }), product("pack", 70_000, { is_pack: true, sort_order: 1 }), product("a", 1_000, { sort_order: 2 })],
      promotions: [],
      packItems: [{ pack_id: "pack", product_id: "a", quantity: 2 }, { pack_id: "pack", product_id: "ghost", quantity: 1 }],
    };
    const catalog = buildCatalog(base, NOW);
    expect(catalog.map((p) => p.slug)).toEqual(["pack", "a", "b"]);
    expect(catalog[0]?.packItems).toEqual([{ code: "A", name: "Produit a", quantity: 2 }]);
    expect(catalog[0]?.isPackSolution).toBe(true);
  });
});
