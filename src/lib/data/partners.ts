import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

/** Champs volontairement limités à la vue publique partners_public. */
export interface PublicPartner {
  slug: string;
  displayName: string;
  whatsappNumber: string;
  fboId: string | null;
  city: string | null;
  photoUrl: string | null;
  welcomeText: string | null;
  deliveryNote: string | null;
  isHouse: boolean;
}

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
const RESERVED_SLUGS = new Set([
  "admin", "api", "p", "espace", "partenaire", "catalogue", "produit",
  "connexion", "login", "logout", "hors-ligne", "confidentialite",
  "livraison-paiement", "sitemap", "robots", "manifest", "www",
]);

/** Même règle de slug que la contrainte SQL, avec les chemins réservés du site. */
export function isValidPartnerSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && !RESERVED_SLUGS.has(slug);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePublicPartner(value: unknown): PublicPartner {
  if (!isRecord(value)) {
    throw new Error("Supabase a renvoyé un profil partenaire invalide.");
  }

  const {
    slug,
    display_name,
    whatsapp_number,
    fbo_id,
    city,
    photo_url,
    welcome_text,
    delivery_note,
    is_house,
  } = value;

  if (
    typeof slug !== "string" ||
    !SLUG_PATTERN.test(slug) ||
    typeof display_name !== "string" ||
    typeof whatsapp_number !== "string" ||
    !/^242[0-9]{9}$/.test(whatsapp_number) ||
    typeof is_house !== "boolean"
  ) {
    throw new Error("Le profil public du partenaire contient des données invalides.");
  }

  const nullableString = (field: unknown): string | null =>
    typeof field === "string" ? field : null;

  return {
    slug,
    displayName: display_name,
    whatsappNumber: whatsapp_number,
    fboId: nullableString(fbo_id),
    city: nullableString(city),
    photoUrl: nullableString(photo_url),
    welcomeText: nullableString(welcome_text),
    deliveryNote: nullableString(delivery_note),
    isHouse: is_house,
  };
}

/**
 * Récupère une boutique active depuis la vue publique.
 * Chaque slug possède son propre cache pour éviter tout mélange entre partenaires.
 */
export async function getPartner(slug: string): Promise<PublicPartner | null> {
  "use cache";
  if (!isValidPartnerSlug(slug)) return null;

  cacheTag(`partner:${slug}`);
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });

  const client = createPublicClient();
  if (!client) return null;

  const { data, error } = await client
    .from("partners_public")
    .select("slug, display_name, whatsapp_number, fbo_id, city, photo_url, welcome_text, delivery_note, is_house")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossible de récupérer la boutique « ${slug} » : ${error.message}`);
  }

  return data ? parsePublicPartner(data) : null;
}

/** Liste les slugs des boutiques actives, sans exposer leurs autres informations. */
export async function getActivePartnerSlugs(): Promise<string[]> {
  "use cache";
  cacheTag("partners:active-slugs");
  cacheLife({ stale: 60, revalidate: 300, expire: 86_400 });

  const client = createPublicClient();
  if (!client) return [];

  const { data, error } = await client
    .from("partners_public")
    .select("slug")
    .order("slug", { ascending: true });

  if (error) {
    throw new Error(`Impossible de récupérer les boutiques actives : ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error("Supabase a renvoyé une liste de boutiques invalide.");
  }

  return data.flatMap((row: unknown) => {
    if (!isRecord(row) || typeof row.slug !== "string" || !isValidPartnerSlug(row.slug)) {
      return [];
    }
    return [row.slug];
  });
}
