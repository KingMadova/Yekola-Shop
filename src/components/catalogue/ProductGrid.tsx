import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, highlightVip = false }: { products: readonly Product[]; highlightVip?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.code} product={product} highlightVip={highlightVip} />
      ))}
    </ul>
  );
}
