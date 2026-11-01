import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { DualConversion } from "@/components/home/DualConversion";
import { HealthGoalPicker } from "@/components/home/HealthGoalPicker";
import { Hero } from "@/components/home/Hero";
import { PackSolutions } from "@/components/home/PackSolutions";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustBand } from "@/components/home/TrustBand";
import { container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";

export default async function HomePage() {
  const products = await getCatalog();
  const bestSellers = products.filter((product) => product.isBestSeller && !product.isPackSolution);

  return (
    <>
      <Hero />
      <TrustBand />
      <HealthGoalPicker />
      {bestSellers.length > 0 && (
        <section className={`${container} pb-12`}>
          <h2 className="mb-5 text-2xl font-bold text-gray-900">Meilleures ventes</h2>
          <ProductGrid products={bestSellers} />
        </section>
      )}
      <PackSolutions />
      <Testimonials />
      <DualConversion />
    </>
  );
}
