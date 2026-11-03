import type { Metadata } from "next";
import { ShopLink } from "@/components/providers/ShopContext";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { ProductViewSignal } from "@/components/lead/ProductViewSignal";
import { ProductDetail } from "@/components/product/ProductDetail";
import { container } from "@/components/ui/styles";
import { getCatalog, getProductBySlug } from "@/lib/data/catalog";
import { SITE_URL } from "@/lib/config";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getCatalog()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDesc,
    openGraph: { title: product.name, description: product.shortDesc, images: product.images.slice(0, 1) },
    alternates: { canonical: `${SITE_URL}/produit/${product.slug}` },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}

async function ProductPageContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getCatalog()).filter(
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\\\u003c") }} />
      <ProductViewSignal code={product.code} goals={product.healthGoals} />

      <nav aria-label="Fil d'Ariane" className={`${container} pt-6 text-sm text-gray-800`}>
        <ShopLink href="/" className="hover:underline">Accueil</ShopLink> / <ShopLink href="/catalogue" className="hover:underline">Catalogue</ShopLink> /{" "}
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

function ProductPageSkeleton() {
  return (
    <div className={`${container} space-y-6 py-8`} aria-label="Chargement de la fiche produit" aria-busy="true">
      <div className="h-4 w-48 animate-pulse rounded bg-[#e9e5d9]" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-[#f0eee7]" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-[#e9e5d9]" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-[#e9e5d9]" />
          <div className="h-24 animate-pulse rounded bg-[#f0eee7]" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-[#e9e5d9]" />
        </div>
      </div>
    </div>
  );
}
