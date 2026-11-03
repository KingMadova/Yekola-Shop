import { Suspense } from "react";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { DualConversion } from "@/components/home/DualConversion";
import { HealthGoalPicker } from "@/components/home/HealthGoalPicker";
import { Hero } from "@/components/home/Hero";
import { OffersCarousel } from "@/components/home/OffersCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustBand } from "@/components/home/TrustBand";
import { container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}><Hero /></Suspense>
      <TrustBand />
      <HealthGoalPicker />
      <Suspense fallback={<OffersSkeleton />}><HomeOffers /></Suspense>
      <Suspense fallback={<BestSellersSkeleton />}><BestSellers /></Suspense>
      <Testimonials />
      <DualConversion />
    </>
  );
}

async function HomeOffers() {
  const products = await getCatalog();
  const promotions = products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.pricePublic);
  const offers = promotions.length ? promotions : products.filter((p) => p.isPackSolution || p.isBestSeller);
  return <OffersCarousel products={offers.slice(0, 8)} />;
}

async function BestSellers() {
  const products = await getCatalog();
  const bestSellers = products.filter((product) => product.isBestSeller && !product.isPackSolution);
  if (bestSellers.length === 0) return null;
  return <section className={`${container} pb-8 sm:pb-12`}>
    <h2 className="mb-4 text-xl font-extrabold tracking-tight text-[#30231d] sm:mb-5 sm:text-2xl">Les incontournables</h2>
    <ProductGrid products={bestSellers} />
  </section>;
}

function HeroSkeleton() {
  return <section className="min-h-[320px] animate-pulse bg-gradient-to-br from-[#f9a825] to-[#c1440e] sm:min-h-[390px]" aria-label="Chargement de la présentation" aria-busy="true">
    <div className={`${container} grid gap-4 py-6 sm:grid-cols-2 sm:items-center sm:py-10`}>
      <div className="space-y-4"><div className="h-3 w-32 rounded bg-white/30" /><div className="h-12 max-w-lg rounded bg-white/30" /><div className="h-4 max-w-md rounded bg-white/20" /><div className="h-11 w-48 rounded-xl bg-white/30" /></div>
      <div className="h-28 rounded-2xl bg-white/20 sm:h-40" />
    </div>
  </section>;
}
function OffersSkeleton() {
  return <section className={`${container} py-7 sm:py-10`} aria-label="Chargement des offres" aria-busy="true">
    <div className="mb-4 h-7 w-56 animate-pulse rounded bg-[#ffe4c9]" />
    <div className="flex gap-3 overflow-hidden">{[0,1,2].map((n)=><div key={n} className="h-52 w-64 shrink-0 animate-pulse rounded-2xl bg-[#fff0df]" />)}</div>
  </section>;
}
function BestSellersSkeleton() {
  return <section className={`${container} pb-8`} aria-label="Chargement des produits" aria-busy="true">
    <div className="mb-4 h-7 w-48 animate-pulse rounded bg-[#ffe4c9]" />
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{[0,1,2,3].map((n)=><div key={n} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#fff0df]" />)}</div>
  </section>;
}
