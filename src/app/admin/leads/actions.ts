"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const LEAD_STATUSES = ["Nouveau", "Contacté", "Intéressé", "Client", "Perdu"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function backToLead(id: string, error: string): never {
  redirect(`/admin/leads/${id}?erreur=${encodeURIComponent(error)}`);
}

export async function updateLead(formData: FormData) {
  await requireAdmin();

  const id = readText(formData, "id");
  const status = readText(formData, "status");
  const note = readText(formData, "note");

  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/admin/leads?erreur=Identifiant%20invalide");
  if (!LEAD_STATUSES.includes(status as LeadStatus)) backToLead(id, "Le statut sélectionné est invalide.");
  if (note.length > 2000) backToLead(id, "La note ne peut pas dépasser 2 000 caractères.");

  const client = createAdminClient();
  if (!client) throw new Error("La configuration serveur Supabase est incomplète.");

  const { data, error } = await client
    .from("leads")
    .update({ status: status as LeadStatus, note: note || null })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) backToLead(id, "Impossible d'enregistrer les modifications. Réessayez.");
  if (!data) backToLead(id, "Cette demande n'existe plus ou n'est plus disponible.");

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  redirect(`/admin/leads/${id}?succes=updated`);
}
