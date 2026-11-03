import { ShopLink } from "@/components/providers/ShopContext";
import { ProductSearch } from "./ProductSearch";
import { focusRing } from "@/components/ui/styles";
import { buildCatalogueHref, type CatalogueQuery } from "@/lib/catalogue";
import { CATEGORY_SLUGS, HEALTH_GOAL_SLUGS } from "@/lib/config";
import { CATEGORIES } from "@/lib/types";

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
            <ShopLink href={buildCatalogueHref({ ...query, category: undefined })} aria-current={!query.category ? "true" : undefined} className={pill(!query.category)}>
              Tout
            </ShopLink>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category}>
              <ShopLink href={buildCatalogueHref({ ...query, category })} aria-current={query.category === category ? "true" : undefined} className={pill(query.category === category)}>
                {category}
              </ShopLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-wrap items-center gap-2 border-t border-[#e9e5d9] pt-3">
        <p className="text-sm text-[#68756c]">Vous préférez commencer par un objectif ?</p>
        <ShopLink href="/besoins" className="inline-flex min-h-10 items-center font-semibold text-[#173f35] underline underline-offset-4">
          Explorer vos besoins
        </ShopLink>
      </div>
    </div>
  );
}
