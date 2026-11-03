import { Suspense } from "react";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { DualConversion } from "@/components/home/DualConversion";
import { HealthGoalPicker } from "@/components/home/HealthGoalPicker";
import { Hero } from "@/components/home/Hero";
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
      <Suspense fallback={<BestSellersSkeleton />}><BestSellers /></Suspense>
      <Testimonials />
      <DualConversion />
    </>
  );
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
  return <section className="min-h-[290px] animate-pulse bg-gradient-to-br from-[#f9a825] to-[#c1440e] sm:min-h-[390px]" aria-label="Chargement de la présentation" aria-busy="true">
    <div className={`${container} grid gap-3 py-4 sm:grid-cols-2 sm:items-center sm:py-8`}>
      <div className="space-y-3"><div className="h-3 w-32 rounded bg-white/30" /><div className="h-12 max-w-lg rounded bg-white/30" /><div className="h-4 max-w-md rounded bg-white/20" /><div className="h-10 w-48 rounded-xl bg-white/30" /></div>
      <div className="h-[116px] rounded-2xl bg-white/20 sm:h-[150px]" />
    </div>
  </section>;
}

function BestSellersSkeleton() {
  return <section className={`${container} pb-8`} aria-label="Chargement des produits" aria-busy="true">
    <div className="mb-4 h-7 w-48 animate-pulse rounded bg-[#ffe4c9]" />
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{[0,1,2,3].map((n)=><div key={n} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#fff0df]" />)}</div>
  </section>;
}
