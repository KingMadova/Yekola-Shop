import { cacheLife, cacheTag } from "next/cache";
import { SEED_PRODUCTS } from "@/data/products";
import type { Product } from "@/lib/types";
import { buildCatalog } from "./mapper";
import { loadRows } from "./source";

/** Le catalogue de secours n'est autorisé qu'en développement, ou avec CATALOG_FALLBACK=seed : jamais de prix périmés en production. */
const seedAllowed = () =>
  process.env.NODE_ENV !== "production" || process.env.CATALOG_FALLBACK === "seed";

/**
 * Catalogue public avec prix de vente (promo comprise), mis en cache 5 minutes.
 * Les promos expirent donc au plus 5 minutes en retard. Le back-office (phase 2) appellera `updateTag("catalog")`.
 */
export async function getCatalog(): Promise<Product[]> {
  "use cache";
  cacheTag("catalog");
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });

  const rows = await loadRows();
  if (rows) return buildCatalog(rows, new Date());
  if (!seedAllowed()) {
    throw new Error("Supabase n'est pas configuré (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  }
  return [...SEED_PRODUCTS];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getCatalog()).find((product) => product.slug === slug);
}
