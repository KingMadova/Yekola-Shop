import Link from "next/link";
import { ProductSearch } from "./ProductSearch";
import { focusRing } from "@/components/ui/styles";
import { buildCatalogueHref, type CatalogueQuery } from "@/lib/catalogue";
import { CATEGORY_SLUGS, HEALTH_GOAL_META, HEALTH_GOAL_SLUGS } from "@/lib/config";
import { CATEGORIES, HEALTH_GOALS } from "@/lib/types";

const pill = (active: boolean) =>
  `inline-flex min-h-11 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium ${focusRing} ${
    active ? "border-[#173f35] bg-[#173f35] text-white" : "border-[#e3dac4] bg-white text-[#31483d] hover:bg-[#f6f3ea]"
  }`;

/** Filtres en liens : fonctionnent sans JavaScript, se partagent par URL et se branchent sur les publicités. */
export function CatalogueFilters({ query }: { query: CatalogueQuery }) {
  return (
    <div className="flex flex-col gap-4">
      <ProductSearch
        initialQuery={query.q}
        categorySlug={query.category ? CATEGORY_SLUGS[query.category] : undefined}
        goalSlug={query.goal ? HEALTH_GOAL_SLUGS[query.goal] : undefined}
      />

      <nav aria-label="Catégories">
        <p className="mb-2 text-sm font-semibold text-[#26392e]">Catégories</p>
        <ul className="flex gap-2 overflow-x-auto pb-1">
          <li>
            <Link href={buildCatalogueHref({ ...query, category: undefined })} aria-current={!query.category ? "true" : undefined} className={pill(!query.category)}>
              Tout
            </Link>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category}>
              <Link href={buildCatalogueHref({ ...query, category })} aria-current={query.category === category ? "true" : undefined} className={pill(query.category === category)}>
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Besoins santé">
        <p className="mb-2 text-sm font-semibold text-[#26392e]">Votre besoin</p>
        <ul className="flex gap-2 overflow-x-auto pb-1">
          <li>
            <Link href={buildCatalogueHref({ ...query, goal: undefined })} aria-current={!query.goal ? "true" : undefined} className={pill(!query.goal)}>
              Tous les besoins
            </Link>
          </li>
          {HEALTH_GOALS.map((goal) => (
            <li key={goal}>
              <Link href={buildCatalogueHref({ ...query, goal })} aria-current={query.goal === goal ? "true" : undefined} className={pill(query.goal === goal)}>
                {HEALTH_GOAL_META[goal].shortLabel}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
