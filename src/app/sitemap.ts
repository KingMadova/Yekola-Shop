import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/catalogue',
    '/confidentialite',
    '/livraison-paiement',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route === '/catalogue' ? 0.9 : 0.7,
  }));

  // TODO Phase 1 : Ajouter les pages produits dynamiquement depuis Supabase
  // const products = await getProducts();
  // const productRoutes = products.map((product) => ({
  //   url: `${SITE_URL}/produit/${product.slug}`,
  //   lastModified: product.updated_at,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }));

  return routes; // .concat(productRoutes);
}