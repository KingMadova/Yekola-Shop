import { CATEGORY_SLUGS, HEALTH_GOAL_SLUGS } from "./config";
import { CATEGORIES, HEALTH_GOALS, type Category, type HealthGoal, type Product } from "./types";

export interface CatalogueQuery {
  category?: Category;
  goal?: HealthGoal;
  q?: string;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const fold = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Lit ?categorie=…&besoin=…&q=… ; les valeurs inconnues sont ignorées. */
export function parseCatalogueQuery(params: RawParams): CatalogueQuery {
  const q = first(params.q)?.trim().slice(0, 80);
  return {
    category: CATEGORIES.find((category) => CATEGORY_SLUGS[category] === first(params.categorie)),
    goal: HEALTH_GOALS.find((goal) => HEALTH_GOAL_SLUGS[goal] === first(params.besoin)),
    q: q || undefined,
  };
}

/** Filtre et trie dans l'ordre officiel de la grille tarifaire. */
export function filterProducts(products: readonly Product[], query: CatalogueQuery): Product[] {
  const needle = query.q ? fold(query.q) : null;
  return products
    .filter((product) => !query.category || product.category === query.category)
    .filter((product) => !query.goal || product.healthGoals.includes(query.goal))
    .filter(
      (product) =>
        !needle || fold(`${product.name} ${product.shortDesc} ${product.category}`).includes(needle),
    )
    .sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category));
}

export function buildCatalogueHref(query: CatalogueQuery): string {
  const params = new URLSearchParams();
  if (query.category) params.set("categorie", CATEGORY_SLUGS[query.category]);
  if (query.goal) params.set("besoin", HEALTH_GOAL_SLUGS[query.goal]);
  if (query.q) params.set("q", query.q);
  const search = params.toString();
  return search ? `/catalogue?${search}` : "/catalogue";
}
