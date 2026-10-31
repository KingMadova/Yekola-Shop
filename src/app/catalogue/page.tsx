import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CatalogueFilters } from "@/components/catalogue/CatalogueFilters";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { InterestSignal } from "@/components/lead/InterestSignal";
import { btnWhatsApp, container, focusRing } from "@/components/ui/styles";
import { PRODUCTS } from "@/data/products";
import { filterProducts, parseCatalogueQuery } from "@/lib/catalogue";
import { HEALTH_GOAL_META } from "@/lib/config";
import { buildAdviceMessage, buildNeedAdviceMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Tous les produits Forever, classés par catégorie et par besoin, avec les prix en FCFA.",
};

interface CataloguePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function CataloguePage({ searchParams }: CataloguePageProps) {
  return (
    <Suspense fallback={<CatalogueFallback />}>
      <CatalogueContent searchParams={searchParams} />
    </Suspense>
  );
}

async function CatalogueContent({ searchParams }: CataloguePageProps) {
  const query = parseCatalogueQuery(await searchParams);
  const results = filterProducts(PRODUCTS, query);
  const title = query.goal ? HEALTH_GOAL_META[query.goal].shortLabel : "Catalogue";

  return (
    <div className={`${container} flex flex-col gap-6 py-8`}>
      {query.goal && <InterestSignal goal={query.goal} origin="catalogue" />}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-gray-800" aria-live="polite">
          {results.length} produit{results.length > 1 ? "s" : ""}
        </p>
      </div>
      <CatalogueFilters query={query} />
      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-lg font-semibold text-gray-900">
            {query.goal ? "Nous préparons la sélection pour ce besoin." : "Aucun produit ne correspond à votre recherche."}
          </p>
          <p className="max-w-prose text-gray-800">
            Écrivez-nous sur WhatsApp : un distributeur vous recommande les bons produits.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl(query.goal ? buildNeedAdviceMessage(query.goal) : buildAdviceMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className={btnWhatsApp}
            >
              Demander conseil sur WhatsApp
            </a>
            <Link href="/catalogue" className={`inline-flex min-h-12 items-center rounded-xl px-4 font-semibold text-emerald-800 underline ${focusRing}`}>
              Voir tout le catalogue
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/** Placeholder affiché pendant la résolution des searchParams (prerendering partiel). */
function CatalogueFallback() {
  return (
    <div className={`${container} flex flex-col gap-6 py-8`}>
      <div>
        <div className="h-9 w-48 animate-pulse rounded-lg bg-gray-200" aria-hidden />
        <div className="mt-2 h-5 w-24 animate-pulse rounded-lg bg-gray-200" aria-hidden />
      </div>
      <div className="h-11 w-full max-w-md animate-pulse rounded-xl bg-gray-200" aria-hidden />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <li key={i} className="rounded-2xl border border-gray-200 bg-white p-3">
            <div className="aspect-square animate-pulse rounded-xl bg-gray-200" />
            <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-5 w-1/2 animate-pulse rounded bg-gray-200" />
          </li>
        ))}
      </ul>
    </div>
  );
}