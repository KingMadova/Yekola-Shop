import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { ShopLink } from "@/components/providers/ShopContext";
import { container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Nos offres du moment",
  description: "Découvrez les promotions et sélections du moment dans cette boutique.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/offres` },
};

export default function OffersPage() {
  return (
    <section className={`${container} flex flex-col gap-6 py-5 sm:py-10`}>
      <header className="rounded-2xl bg-gradient-to-r from-[#f9a825] via-[#ff6a1a] to-[#c1440e] p-5 text-white sm:p-8">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/90 sm:text-xs">Sélections et promotions</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl">Nos offres du moment</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/95">Retrouvez ici les offres réellement disponibles et les packs à découvrir.</p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-[#fff0df]" />}>
        <OffersContent />
      </Suspense>
      <p className="text-sm text-[#71645d]">Vous cherchez un produit précis ? <ShopLink href="/catalogue" className="font-bold text-[#b53c0c] underline underline-offset-4">Parcourir le catalogue</ShopLink>.</p>
    </section>
  );
}

async function OffersContent() {
  const products = await getCatalog();
  const promos = products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.pricePublic);
  const selected = promos.length ? promos : products.filter((p) => p.isPackSolution || p.isBestSeller);
  return selected.length ? <ProductGrid products={selected} highlightVip /> : <p className="rounded-2xl border border-[#f0d6c2] bg-white p-6 text-sm text-[#71645d]">Les prochaines offres seront bientôt disponibles.</p>;
}
