import { computeVipPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";

/**
 * Jeu de départ : seuls les deux packs dont le prix public est confirmé.
 * TODO : remplacer par l'import de la liste de prix FLP nettoyée (JSON),
 * en gardant `priceVip: computeVipPrice(pricePublic)` pour rester cohérent.
 */
export const PRODUCTS: readonly Product[] = [
  {
    code: "PACK-ARTICULAIRE",
    name: "Pack Confort Articulaire",
    slug: "pack-confort-articulaire",
    category: "Combo / Packs",
    healthGoals: ["Articulations & Mobilité"],
    pricePublic: 68_543,
    priceVip: computeVipPrice(68_543),
    images: ["/images/products/pack-articulaire-1.jpg"],
    shortDesc: "Forever Freedom + Active HA + Aloe Heat Lotion, pour le confort au quotidien.",
    // TODO : duration et usageAdvice à compléter d'après les fiches Forever.
    benefits: [
      "Trois produits complémentaires réunis dans un seul pack",
      "Accompagne le confort articulaire au quotidien",
      "Active automatiquement la remise VIP de 5 %",
    ],
    isBestSeller: true,
    isPackSolution: true,
  },
  {
    code: "PACK-C9",
    name: "Pack Détox Minceur C9",
    slug: "pack-detox-minceur-c9",
    category: "Combo / Packs",
    healthGoals: ["Détox & Perte de Poids"],
    pricePublic: 97_166,
    priceVip: computeVipPrice(97_166),
    images: ["/images/products/pack-c9-1.jpg"],
    shortDesc: "Programme Clean 9, au choix Vanille ou Chocolat.",
    duration: "Programme de 9 jours (Clean 9)",
    benefits: [
      "Programme structuré pour repartir sur de bonnes habitudes",
      "Saveur au choix : Vanille ou Chocolat",
      "Active automatiquement la remise VIP de 5 %",
    ],
    isPackSolution: true,
  },
];

const byCode = new Map(PRODUCTS.map((product) => [product.code, product]));
const bySlug = new Map(PRODUCTS.map((product) => [product.slug, product]));

export function getProductByCode(code: string): Product | undefined {
  return byCode.get(code);
}

export function getProductBySlug(slug: string): Product | undefined {
  return bySlug.get(slug);
}
