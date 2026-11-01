import { computeVipPrice } from "@/lib/pricing";
import type { Product } from "@/lib/types";

/**
 * Catalogue de secours pour le développement local sans Supabase.
 * Les vrais produits vivent en base (voir supabase/seed.sql et scripts/import-products.mjs).
 */
export const SEED_PRODUCTS: readonly Product[] = [
  {
    code: "PACK-ARTICULAIRE",
    name: "Pack Confort Articulaire",
    slug: "pack-confort-articulaire",
    category: "Combo / Packs",
    healthGoals: ["Articulations & Mobilité"],
    pricePublic: 68_543,
    priceVip: computeVipPrice(68_543),
    images: [],
    shortDesc: "Forever Freedom + Active HA + Aloe Heat Lotion, pour le confort au quotidien.",
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
    images: [],
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
