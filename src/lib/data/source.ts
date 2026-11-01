import { createPublicClient } from "../supabase/public";
import { parsePackItemRows, parsePromotionRows, parseProductRows, type CatalogRows } from "./rows";

/** Lit les produits actifs, les promos actives et les compositions de packs. Null si Supabase n'est pas configuré. */
export async function loadRows(): Promise<CatalogRows | null> {
  const client = createPublicClient();
  if (!client) return null;

  const [products, promotions, packItems] = await Promise.all([
    client.from("products").select("*").eq("is_active", true).order("sort_order"),
    client.from("promotions").select("*").eq("is_active", true),
    client.from("pack_items").select("*"),
  ]);

  for (const result of [products, promotions, packItems]) {
    if (result.error) throw new Error(`Supabase : ${result.error.message}`);
  }
  return {
    products: parseProductRows(products.data),
    promotions: parsePromotionRows(promotions.data),
    packItems: parsePackItemRows(packItems.data),
  };
}
