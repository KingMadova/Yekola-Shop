"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const RESERVED_SLUGS = new Set([
  "admin", "api", "p", "espace", "partenaire", "catalogue", "produit",
  "connexion", "login", "logout", "hors-ligne", "confidentialite",
  "livraison-paiement", "sitemap", "robots", "manifest", "www",
]);

const STORE_STATUSES = ["pending", "active", "suspended"] as const;
type StoreStatus = (typeof STORE_STATUSES)[number];

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

type StoreValidation =
  | { value: { display_name: string; slug: string; whatsapp_number: string; email: string | null; fbo_id: string | null; city: string | null } }
  | { error: string };

function validateStore(formData: FormData): StoreValidation {
  const displayName = readText(formData, "display_name");
  const slug = readText(formData, "slug").toLowerCase();
  const whatsappNumber = readText(formData, "whatsapp_number").replace(/[\s+()-]/g, "");
  const email = readText(formData, "email").toLowerCase();
  const fboId = readText(formData, "fbo_id");
  const city = readText(formData, "city");

  if (displayName.length < 2 || displayName.length > 100) return { error: "Le nom doit contenir entre 2 et 100 caractères." };
  if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(slug)) return { error: "Le slug doit contenir 3 à 30 caractères : minuscules, chiffres et tirets." };
  if (RESERVED_SLUGS.has(slug)) return { error: "Ce slug est réservé par le système." };
  if (!/^242[0-9]{9}$/.test(whatsappNumber)) return { error: "Le WhatsApp doit être au format congolais : 242 suivi de 9 chiffres." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "L'adresse e-mail n'est pas valide." };

  return { value: { display_name: displayName, slug, whatsapp_number: whatsappNumber, email: email || null, fbo_id: fboId || null, city: city || null } };
}

function getAdminDatabase() {
  const client = createAdminClient();
  if (!client) throw new Error("La clé serveur Supabase est absente. Vérifiez SUPABASE_SERVICE_ROLE_KEY.");
  return client;
}

export async function createPartnerStore(formData: FormData) {
  await requireAdmin();
  const parsed = validateStore(formData);
  if ("error" in parsed) redirect(`/admin/boutiques/nouvelle?erreur=${encodeURIComponent(parsed.error)}`);

  const { error } = await getAdminDatabase().from("partners").insert({
    ...parsed.value,
    is_house: false,
    status: "pending",
    user_id: null,
  });

  if (error) {
    const message = error.code === "23505" ? "Ce slug ou cette boutique existe déjà." : error.message;
    redirect(`/admin/boutiques/nouvelle?erreur=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/boutiques");
  redirect("/admin/boutiques?succes=created");
}

export async function updatePartnerStore(formData: FormData) {
  await requireAdmin();
  const id = readText(formData, "id");
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/boutiques?erreur=Identifiant%20invalide");

  const parsed = validateStore(formData);
  if ("error" in parsed) redirect(`/admin/boutiques/${id}?erreur=${encodeURIComponent(parsed.error)}`);

  const { data: updated, error } = await getAdminDatabase().from("partners")
    .update(parsed.value)
    .eq("id", id)
    .eq("is_house", false)
    .select("id,slug")
    .maybeSingle();

  if (error) {
    const message = error.code === "23505" ? "Ce slug est déjà utilisé." : error.message;
    redirect(`/admin/boutiques/${id}?erreur=${encodeURIComponent(message)}`);
  }
  if (!updated) {
    redirect(`/admin/boutiques/${id}?erreur=${encodeURIComponent("Aucune boutique partenaire n'a été modifiée. Elle est peut-être protégée ou n'existe plus.")}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/boutiques");
  revalidatePath(`/p/${updated.slug}`);
  redirect("/admin/boutiques?succes=updated");
}

export async function updatePartnerStoreStatus(formData: FormData) {
  await requireAdmin();
  const id = readText(formData, "id");
  const status = readText(formData, "status");
  const currentStatus = readText(formData, "current_status");

  if (
    !/^[0-9a-f-]{36}$/i.test(id) ||
    !STORE_STATUSES.includes(status as StoreStatus) ||
    !STORE_STATUSES.includes(currentStatus as StoreStatus) ||
    status === currentStatus
  ) {
    redirect("/admin/boutiques?erreur=Paramètres%20invalides");
  }

  const { data: updated, error } = await getAdminDatabase().from("partners")
    .update({ status: status as StoreStatus })
    .eq("id", id)
    .eq("is_house", false)
    .eq("status", currentStatus)
    .select("id,slug")
    .maybeSingle();

  if (error) redirect(`/admin/boutiques?erreur=${encodeURIComponent(error.message)}`);
  if (!updated) {
    redirect(`/admin/boutiques?erreur=${encodeURIComponent("Le statut n'a pas été modifié : la boutique est protégée, introuvable ou son statut a changé. Actualisez la page.")}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/boutiques");
  revalidatePath(`/p/${updated.slug}`);
  redirect("/admin/boutiques?succes=status");
}
