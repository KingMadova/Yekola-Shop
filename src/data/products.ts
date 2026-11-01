import officialPriceList from "../../data/liste-prix-officielle.json";
import type { Category, Product } from "@/lib/types";

const slugify = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Catalogue de secours : les 53 références et leurs deux tarifs proviennent de la grille officielle. */
export const SEED_PRODUCTS: readonly Product[] = officialPriceList.products.map((item) => ({
  code: item.code,
  name: item.name,
  slug: slugify(item.name),
  category: item.category as Category,
  healthGoals: [],
  pricePublic: item.pricePublic,
  priceVip: item.priceVip,
  images: [],
  shortDesc: "",
  benefits: [],
  isPackSolution: item.isPack || undefined,
}));
