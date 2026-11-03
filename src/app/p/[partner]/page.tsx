import { Suspense } from "react";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { DualConversion } from "@/components/home/DualConversion";
import { HealthGoalPicker } from "@/components/home/HealthGoalPicker";
import { Hero } from "@/components/home/Hero";
import { PackSolutions } from "@/components/home/PackSolutions";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustBand } from "@/components/home/TrustBand";
import { container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <TrustBand />
      <HealthGoalPicker />
      <Suspense fallback={<BestSellersSkeleton />}>
        <BestSellers />
      </Suspense>
      <Suspense fallback={<PackSolutionsSkeleton />}>
        <PackSolutions />
      </Suspense>
      <Testimonials />
      <DualConversion />
    </>
  );
}

async function BestSellers() {
  const products = await getCatalog();
  const bestSellers = products.filter((product) => product.isBestSeller && !product.isPackSolution);

  if (bestSellers.length === 0) return null;

  return (
    <section className={`${container} pb-12`}>
      <h2 className="mb-5 text-2xl font-bold text-gray-900">Meilleures ventes</h2>
      <ProductGrid products={bestSellers} />
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section
      className="min-h-[390px] animate-pulse bg-[#173f35] sm:min-h-[460px]"
      aria-label="Chargement de la présentation"
      aria-busy="true"
    >
      <div className={`${container} grid gap-5 py-8 lg:grid-cols-2 lg:items-center lg:py-14`}>
        <div className="space-y-4">
          <div className="h-3 w-32 rounded bg-white/20" />
          <div className="h-12 max-w-lg rounded bg-white/20" />
          <div className="h-4 max-w-md rounded bg-white/15" />
          <div className="h-11 w-56 rounded-xl bg-white/20" />
        </div>
        <div className="h-36 rounded-2xl bg-white/15 sm:h-48" />
      </div>
    </section>
  );
}

function BestSellersSkeleton() {
  return (
    <section className={`${container} pb-12`} aria-label="Chargement des meilleures ventes" aria-busy="true">
      <div className="mb-5 h-8 w-56 animate-pulse rounded-lg bg-[#e9e5d9]" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#f0eee7]" />
        ))}
      </div>
    </section>
  );
}

function PackSolutionsSkeleton() {
  return (
    <section
      className={`${container} py-9 sm:py-12`}
      aria-label="Chargement des packs"
      aria-busy="true"
    >
      <div className="mb-5 h-7 w-52 animate-pulse rounded-lg bg-[#e9e5d9]" />
      <div className="mb-5 h-4 w-72 max-w-full animate-pulse rounded bg-[#f0eee7]" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="aspect-[3/4] animate-pulse rounded-2xl bg-[#f0eee7]" />
        ))}
      </div>
    </section>
  );
}
