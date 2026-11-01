import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getCatalog } from "@/lib/data/catalog";

/** Pages fixes + une URL par produit actif du catalogue. Pas de `lastModified` : aucune donnée dynamique au prérendu. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalog();
  const pages = ["", "/catalogue", "/confidentialite", "/livraison-paiement"];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...products.map((product) => ({ url: `${SITE_URL}/produit/${product.slug}` })),
  ];
}
