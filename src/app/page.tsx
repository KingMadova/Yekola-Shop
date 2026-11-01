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
      <Hero />
      <TrustBand />
      <HealthGoalPicker />
      <Suspense fallback={<BestSellersSkeleton />}>
        <BestSellers />
      </Suspense>
      <PackSolutions />
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
