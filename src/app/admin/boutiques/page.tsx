import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { updatePartnerStoreStatus } from "./actions";

export const metadata = { title: "Boutiques | Administration Yekola Shop", robots: { index: false, follow: false } };

type SearchParams = Promise<{ succes?: string; erreur?: string }>;

export default async function AdminStoresPage({ searchParams }: { searchParams: SearchParams }) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const { data: stores, error } = await supabase.from("partners")
    .select("id,slug,display_name,whatsapp_number,email,status,is_house,created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm font-medium text-emerald-800 hover:underline">← Tableau de bord</Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="text-3xl font-bold">Gestion des boutiques</h1><p className="mt-2 text-slate-600">Créez et gérez les boutiques maison et partenaires.</p></div>
          <Link href="/admin/boutiques/nouvelle" className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900">+ Nouvelle boutique</Link>
        </div>
        {params.succes && <p role="status" className="mt-6 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{params.succes === "created" ? "Boutique créée." : params.succes === "updated" ? "Boutique modifiée." : "Statut mis à jour."}</p>}
        {params.erreur && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-700">{params.erreur}</p>}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {error ? <p className="p-6 text-sm text-red-700">Erreur de lecture : {error.message}</p> : !stores?.length ? <p className="p-6 text-sm text-slate-500">Aucune boutique.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Boutique</th><th className="px-5 py-4">WhatsApp</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4">Accès</th><th className="px-5 py-4">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{stores.map(store => <tr key={store.id}>
              <td className="px-5 py-4 font-semibold">{store.display_name}<span className="block text-xs font-normal text-slate-500">/p/{store.slug}{store.is_house ? " · boutique maison" : ""}</span></td>
              <td className="px-5 py-4">{store.whatsapp_number}</td>
              <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">{store.status}</span></td>
              <td className="px-5 py-4"><Link href={`/p/${store.slug}`} target="_blank" className="font-medium text-emerald-800 hover:underline">Voir ↗</Link></td>
              <td className="px-5 py-4"><div className="flex items-center gap-3"><Link href={store.is_house ? "#" : `/admin/boutiques/${store.id}`} aria-disabled={store.is_house} className={store.is_house ? "text-slate-400" : "font-medium text-emerald-800 hover:underline"}>{store.is_house ? "Protégée" : "Modifier"}</Link>
                {!store.is_house && <form action={updatePartnerStoreStatus}><input type="hidden" name="id" value={store.id} /><input type="hidden" name="status" value={store.status === "active" ? "suspended" : "active"} /><button className="font-medium text-slate-700 underline">{store.status === "active" ? "Suspendre" : "Activer"}</button></form>}
              </div></td>
            </tr>)}</tbody>
          </table></div>}
        </section>
      </div>
    </main>
  );
}
