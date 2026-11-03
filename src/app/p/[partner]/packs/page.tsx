import type { Metadata } from "next";
import { ShopLink } from "@/components/providers/ShopContext";
import { Suspense } from "react";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Nos packs",
  description: "Retrouvez les packs Forever Living et leurs tarifs en FCFA.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/packs` },
};

export default function PacksPage() {
  return (
    <section className={container + " flex flex-col gap-7 py-8 sm:py-12"}>
      <header className="max-w-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a7b40]">Sélections prêtes à découvrir</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#c1440e] sm:text-4xl">Nos packs</h1>
        <p className="mt-3 text-base leading-relaxed text-[#71645d]">
          Retrouvez les packs et programmes de démarrage, avec leurs prix publics et leurs tarifs client privilégié.
        </p>
      </header>

      <Suspense fallback={<PacksGridFallback />}>
        <PacksContent />
      </Suspense>

      <p className="text-sm text-[#71645d]">Vous hésitez entre plusieurs références ? <ShopLink href="/besoins" className="font-semibold text-[#c1440e] underline underline-offset-4">Parlons de votre besoin.</ShopLink></p>
    </section>
  );
}

async function PacksContent() {
  const packs = (await getCatalog()).filter((product) => product.isPackSolution);

  return packs.length > 0 ? (
    <ProductGrid products={packs} highlightVip />
  ) : (
    <div className="rounded-2xl border border-[#f2d7c2] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#30231d]">Les packs arrivent bientôt.</h2>
      <p className="mt-2 text-sm text-[#71645d]">Vous pouvez déjà parcourir les autres références du catalogue.</p>
      <ShopLink href="/catalogue" className="mt-4 inline-flex min-h-11 items-center font-semibold text-[#c1440e] underline underline-offset-4">Voir le catalogue</ShopLink>
    </div>
  );
}

function PacksGridFallback() {
  return (
    <div aria-label="Chargement des packs" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1].map((item) => (
        <div key={item} aria-hidden="true" className="overflow-hidden rounded-2xl border border-[#f2d7c2] bg-white p-4">
          <div className="aspect-[4/3] animate-pulse rounded-xl bg-[#eeeae0]" />
          <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-[#f2d7c2]" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-[#eeeae0]" />
          <div className="mt-5 h-10 w-full animate-pulse rounded-lg bg-[#f2d7c2]" />
        </div>
      ))}
    </div>
  );
}
