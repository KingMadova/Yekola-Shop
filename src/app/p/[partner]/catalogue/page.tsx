import type { Metadata } from "next";
import { ShopLink, ShopWhatsAppLink } from "@/components/providers/ShopContext";
import { Suspense } from "react";
import { CatalogueFilters } from "@/components/catalogue/CatalogueFilters";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { InterestSignal } from "@/components/lead/InterestSignal";
import { btnWhatsApp, container, focusRing } from "@/components/ui/styles";
import { filterProducts, parseCatalogueQuery } from "@/lib/catalogue";
import { HEALTH_GOAL_META } from "@/lib/config";
import { getCatalog } from "@/lib/data/catalog";


export const metadata: Metadata = {
  title: "Catalogue",
  description: "Tous les produits Forever, classés par catégorie et par besoin, avec les prix en FCFA.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/catalogue` },
};

interface CataloguePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Les filtres lisent l'URL (donnée dynamique) : le contenu est dans un <Suspense>, la page reste préchargeable. */
export default function CataloguePage({ searchParams }: CataloguePageProps) {
  return (
    <div className={`${container} flex flex-col gap-6 py-8 sm:py-12`}>
      <Suspense fallback={<div aria-hidden className="h-64 animate-pulse rounded-2xl bg-[#f0eee7]" />}>
        <CatalogueContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CatalogueContent({ searchParams }: CataloguePageProps) {
  const query = parseCatalogueQuery(await searchParams);
  const results = filterProducts(await getCatalog(), query);
  const title = query.goal ? HEALTH_GOAL_META[query.goal].shortLabel : "Catalogue";

  return (
    <>
      {query.goal && <InterestSignal goal={query.goal} origin="catalogue" />}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#173f35]">{title}</h1>
        <p className="mt-1 text-[#68756c]" aria-live="polite">
          {results.length} produit{results.length > 1 ? "s" : ""}
        </p>
      </div>

      <CatalogueFilters query={query} />

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-[#e9e5d9] bg-[#fbfaf6] p-6">
          <p className="text-lg font-semibold text-[#26392e]">
            {query.goal ? "Nous préparons la sélection pour ce besoin." : "Aucun produit ne correspond à votre recherche."}
          </p>
          <p className="max-w-prose text-[#68756c]">
            Écrivez-nous sur WhatsApp : un distributeur vous recommande les bons produits.
          </p>
          <div className="flex flex-wrap gap-3">
            <ShopWhatsAppLink kind={query.goal ? "need" : "advice"} goal={query.goal ?? undefined} className={btnWhatsApp}>
              Demander conseil sur WhatsApp
            </ShopWhatsAppLink>
            <ShopLink href="/catalogue" className={`inline-flex min-h-12 items-center rounded-xl px-4 font-semibold text-[#173f35] underline ${focusRing}`}>
              Voir tout le catalogue
            </ShopLink>
          </div>
        </div>
      )}
    </>
  );
}
