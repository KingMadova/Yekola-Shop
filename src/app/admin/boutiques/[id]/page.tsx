import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminShell from "../../admin-shell";
import PartnerStoreForm from "../form";

export const metadata = { title: "Modifier une boutique | Administration Yekola Shop", robots: { index: false, follow: false } };

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ erreur?: string }>;

export default async function EditPartnerStorePage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ id }, query, { user }] = await Promise.all([params, searchParams, requireAdmin()]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  // La page est déjà protégée par requireAdmin(). Utiliser le client serveur
  // privilégié comme les actions CRUD, sans exposer service_role au navigateur.
  const adminClient = createAdminClient();
  if (!adminClient) throw new Error("La clé serveur Supabase est absente. Vérifiez SUPABASE_SERVICE_ROLE_KEY.");

  const { data: store, error } = await adminClient.from("partners")
    .select("id,slug,display_name,whatsapp_number,email,fbo_id,city,is_house")
    .eq("id", id)
    .maybeSingle();

  if (error || !store || store.is_house) notFound();

  return (
    <AdminShell active="stores" email={user.email ?? undefined}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-7">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">Gestion des boutiques</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Modifier {store.display_name}</h1>
          <p className="mt-2 text-sm text-slate-500">Modifiez les coordonnées et l'adresse publique de cette boutique.</p>
        </div>
        <PartnerStoreForm store={store} error={query.erreur} />
      </div>
    </AdminShell>
  );
}
