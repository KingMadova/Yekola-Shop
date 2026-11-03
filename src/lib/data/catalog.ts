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
  if (rows && rows.products.length > 0) return buildCatalog(rows, new Date());

  // Une connexion Supabase peut réussir tout en ne renvoyant aucun produit valide
  // (par exemple, uniquement d'anciennes lignes de démonstration sans tarif VIP).
  // Le catalogue JSON officiel n'est utilisé qu'en développement ou sur activation explicite.
  if (seedAllowed()) {
    if (rows) console.warn("[catalogue] aucune ligne Supabase valide ; utilisation du catalogue officiel de secours.");
    return [...SEED_PRODUCTS];
  }

  if (!rows) {
    throw new Error("Supabase n'est pas configuré (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  }
  throw new Error("Le catalogue Supabase est vide ou ne contient aucune référence valide. Importez la grille officielle ou activez temporairement CATALOG_FALLBACK=seed.");
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getCatalog()).find((product) => product.slug === slug);
}
