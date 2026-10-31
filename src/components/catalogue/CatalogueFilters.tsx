import Link from "next/link";
import { focusRing } from "@/components/ui/styles";
import { buildCatalogueHref, type CatalogueQuery } from "@/lib/catalogue";
import { CATEGORY_SLUGS, HEALTH_GOAL_META, HEALTH_GOAL_SLUGS } from "@/lib/config";
import { CATEGORIES, HEALTH_GOALS } from "@/lib/types";

const pill = (active: boolean) =>
  `inline-flex min-h-11 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium ${focusRing} ${
    active ? "border-emerald-700 bg-emerald-700 text-white" : "border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
  }`;

/** Filtres en liens : fonctionnent sans JavaScript, se partagent par URL et se branchent sur les publicités. */
export function CatalogueFilters({ query }: { query: CatalogueQuery }) {
  return (
    <div className="flex flex-col gap-4">
      <form action="/catalogue" role="search" className="flex gap-2">
        {query.category && <input type="hidden" name="categorie" value={CATEGORY_SLUGS[query.category]} />}
        {query.goal && <input type="hidden" name="besoin" value={HEALTH_GOAL_SLUGS[query.goal]} />}
        <label htmlFor="catalogue-search" className="sr-only">Rechercher dans le catalogue</label>
        <input
          id="catalogue-search"
          name="q"
          type="search"
          defaultValue={query.q}
          placeholder="Rechercher un produit"
          className={`min-h-11 w-full max-w-md rounded-xl border border-gray-400 bg-white px-3 text-base ${focusRing}`}
        />
        <button type="submit" className={`min-h-11 rounded-xl bg-emerald-700 px-5 font-semibold text-white hover:bg-emerald-800 ${focusRing}`}>
          Rechercher
        </button>
      </form>

      <nav aria-label="Catégories">
        <p className="mb-2 text-sm font-semibold text-gray-900">Catégories</p>
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
        <p className="mb-2 text-sm font-semibold text-gray-900">Votre besoin</p>
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
