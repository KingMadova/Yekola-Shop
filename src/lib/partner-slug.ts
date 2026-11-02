const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

const RESERVED_SLUGS = new Set([
  "admin", "api", "p", "espace", "partenaire", "catalogue", "produit",
  "connexion", "login", "logout", "hors-ligne", "confidentialite",
  "livraison-paiement", "sitemap", "robots", "manifest", "www",
]);

/** Même règle que la contrainte SQL, avec les chemins réservés du site. */
export function isValidPartnerSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && !RESERVED_SLUGS.has(slug);
}
