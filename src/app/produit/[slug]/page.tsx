import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { ProductViewSignal } from "@/components/lead/ProductViewSignal";
import { ProductDetail } from "@/components/product/ProductDetail";
import { container } from "@/components/ui/styles";
import { PRODUCTS, getProductBySlug } from "@/data/products";
import { SITE_URL } from "@/lib/config";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDesc,
    openGraph: { title: product.name, description: product.shortDesc, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (other) =>
      other.code !== product.code &&
      (other.category === product.category || other.healthGoals.some((goal) => product.healthGoals.includes(goal))),
  ).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    sku: product.code,
    image: product.images.map((src) => new URL(src, SITE_URL).toString()),
    offers: {
      "@type": "Offer",
      priceCurrency: "XAF",
      price: product.pricePublic,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/produit/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ProductViewSignal code={product.code} goals={product.healthGoals} />

      <nav aria-label="Fil d'Ariane" className={`${container} pt-6 text-sm text-gray-800`}>
        <Link href="/" className="hover:underline">Accueil</Link> / <Link href="/catalogue" className="hover:underline">Catalogue</Link> /{" "}
        <span aria-current="page" className="font-medium text-gray-900">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className={`${container} pb-8`}>
          <h2 className="mb-5 text-2xl font-bold text-gray-900">Vous pourriez aussi aimer</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
