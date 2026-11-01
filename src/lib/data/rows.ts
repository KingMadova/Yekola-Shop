import { CATEGORIES, HEALTH_GOALS, type Category, type HealthGoal } from "../types";

export interface ProductRow {
  id: string;
  code: string;
  slug: string;
  name: string;
  category: Category;
  health_goals: HealthGoal[];
  price_public: number;
  short_desc: string;
  duration: string | null;
  usage_advice: string | null;
  benefits: string[];
  images: string[];
  is_best_seller: boolean;
  is_pack: boolean;
  sort_order: number;
}

export interface PromotionRow {
  id: string;
  product_id: string;
  promo_price: number | null;
  percent_off: number | null;
  badge: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface PackItemRow {
  pack_id: string;
  product_id: string;
  quantity: number;
}

export interface CatalogRows {
  products: ProductRow[];
  promotions: PromotionRow[];
  packItems: PackItemRow[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const str = (value: unknown): string | null => (typeof value === "string" ? value : null);
const int = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? Math.round(value) : null;
const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const records = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? value.filter(isRecord) : [];

/** Les données de la base sont validées à l'entrée : une ligne invalide est ignorée (avec avertissement), jamais affichée. */
export function parseProductRows(value: unknown): ProductRow[] {
  const rows: ProductRow[] = [];
  for (const raw of records(value)) {
    const id = str(raw.id);
    const code = str(raw.code);
    const slug = str(raw.slug);
    const name = str(raw.name);
    const price = int(raw.price_public);
    const category = CATEGORIES.find((item) => item === raw.category);
    if (!id || !code || !slug || !name || price === null || price < 0 || !category) {
      console.warn(`[catalogue] ligne produit ignorée : ${code ?? id ?? "inconnue"}`);
      continue;
    }
    const goals = strings(raw.health_goals);
    rows.push({
      id, code, slug, name, category,
      health_goals: HEALTH_GOALS.filter((goal) => goals.includes(goal)),
      price_public: price,
      short_desc: str(raw.short_desc) ?? "",
      duration: str(raw.duration),
      usage_advice: str(raw.usage_advice),
      benefits: strings(raw.benefits),
      images: strings(raw.images),
      is_best_seller: raw.is_best_seller === true,
      is_pack: raw.is_pack === true,
      sort_order: int(raw.sort_order) ?? 0,
    });
  }
  return rows;
}

export function parsePromotionRows(value: unknown): PromotionRow[] {
  const rows: PromotionRow[] = [];
  for (const raw of records(value)) {
    const id = str(raw.id);
    const productId = str(raw.product_id);
    const startsAt = str(raw.starts_at);
    const endsAt = str(raw.ends_at);
    if (!id || !productId || !startsAt || !endsAt) continue;
    rows.push({
      id,
      product_id: productId,
      promo_price: int(raw.promo_price),
      percent_off: int(raw.percent_off),
      badge: str(raw.badge),
      starts_at: startsAt,
      ends_at: endsAt,
      is_active: raw.is_active !== false,
    });
  }
  return rows;
}

export function parsePackItemRows(value: unknown): PackItemRow[] {
  const rows: PackItemRow[] = [];
  for (const raw of records(value)) {
    const packId = str(raw.pack_id);
    const productId = str(raw.product_id);
    const quantity = int(raw.quantity);
    if (packId && productId && quantity !== null && quantity > 0) {
      rows.push({ pack_id: packId, product_id: productId, quantity });
    }
  }
  return rows;
}
