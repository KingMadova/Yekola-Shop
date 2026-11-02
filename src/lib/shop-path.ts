import type { PublicPartner } from "@/lib/data/partners";
import { isValidPartnerSlug } from "@/lib/partner-slug";

/** Construit un chemin interne dans la boutique courante, sans changer les URL de la boutique maison. */
export function buildShopHref(partner: Pick<PublicPartner, "slug" | "isHouse">, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("ShopLink accepte uniquement un chemin interne commençant par un seul « / ».");
  }
  if (!isValidPartnerSlug(partner.slug)) {
    throw new Error("Le slug de la boutique est invalide.");
  }
  if (partner.isHouse) return path;
  if (path === "/") return `/p/${partner.slug}`;
  return `/p/${partner.slug}${path}`;
}
