import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import PartnerStoreForm from "../form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier une boutique | Administration Yekola Shop", robots: { index: false, follow: false } };

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ erreur?: string }>;

export default async function EditPartnerStorePage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ id }, query, { supabase }] = await Promise.all([params, searchParams, requireAdmin()]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data: store, error } = await supabase.from("partners")
    .select("id,slug,display_name,whatsapp_number,email,fbo_id,city,is_house")
    .eq("id", id)
    .maybeSingle();

  if (error || !store || store.is_house) notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/boutiques" className="text-sm font-medium text-emerald-800 hover:underline">← Gestion des boutiques</Link>
        <h1 className="mt-6 text-3xl font-bold">Modifier {store.display_name}</h1>
        <p className="mb-8 mt-2 text-slate-600">Modifiez les coordonnées et l'adresse publique de cette boutique.</p>
        <PartnerStoreForm store={store} error={query.erreur} />
      </div>
    </main>
  );
}
