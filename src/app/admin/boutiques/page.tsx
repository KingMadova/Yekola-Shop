import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import AdminShell from "../admin-shell";
import StoreStatusForm from "./store-status-form";

export const metadata = { title: "Boutiques | Administration Yekola Shop", robots: { index: false, follow: false } };

type SearchParams = Promise<{ succes?: string; erreur?: string }>;

export default function AdminStoresPage({ searchParams }: { searchParams: SearchParams }) {
  return <Suspense fallback={<StoresFallback />}><AdminStoresContent searchParams={searchParams} /></Suspense>;
}

async function AdminStoresContent({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const { supabase, user } = await requireAdmin();
  const params = await searchParams;
  const { data: stores, error } = await supabase.from("partners")
    .select("id,slug,display_name,whatsapp_number,email,status,is_house,created_at")
    .order("created_at", { ascending: false });

  return (
    <AdminShell active="stores" email={user.email ?? undefined}>
      <div className="mb-7 flex items-end justify-between gap-3">
        <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">Votre réseau</p><h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Boutiques</h1><p className="mt-1 text-sm text-slate-500">Gérez vos boutiques partenaires.</p></div>
        <Link href="/admin/boutiques/nouvelle" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl bg-[#123d2c] px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-emerald-900 sm:px-5 sm:text-sm"><span className="text-lg leading-none">+</span><span className="hidden xs:inline">Nouvelle boutique</span><span className="xs:hidden">Ajouter</span></Link>
      </div>
      {params.succes && <p role="status" className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">{params.succes === "created" ? "Boutique créée avec succès." : params.succes === "updated" ? "Modifications enregistrées." : "Statut mis à jour."}</p>}
      {params.erreur && <p role="alert" className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{params.erreur}</p>}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3"><span className="text-xs font-semibold text-slate-500">Boutiques enregistrées</span><span className="text-lg font-black tabular-nums text-emerald-900">{stores?.length ?? 0}</span></div>
      {error ? <div className="rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-700">Erreur de lecture : {error.message}</div> : !stores?.length ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-9 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-900">▦</span><h2 className="mt-4 font-extrabold">Aucune boutique</h2><p className="mt-1 text-sm text-slate-500">Ajoutez une boutique partenaire pour commencer.</p></div> : <>
        <div className="grid gap-3 md:hidden">{stores.map(store => <article key={store.id} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_3px_14px_rgba(15,45,32,0.04)]"><div className="flex items-start gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-lg font-black text-emerald-900">{store.display_name.slice(0,1).toUpperCase()}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-extrabold">{store.display_name}</h2><Status status={store.status} /></div><p className="mt-1 truncate text-xs text-slate-400">/p/{store.slug}{store.is_house ? " · Boutique maison" : ""}</p><p className="mt-2 text-xs font-semibold text-slate-600">{store.whatsapp_number}</p></div></div><div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3"><Link href={`/p/${store.slug}`} target="_blank" className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-center text-xs font-bold text-slate-600">Voir la boutique ↗</Link>{store.is_house ? <span className="px-3 py-2.5 text-xs font-bold text-slate-400">Protégée</span> : <><Link href={`/admin/boutiques/${store.id}`} className="flex-1 rounded-xl bg-emerald-50 px-3 py-2.5 text-center text-xs font-extrabold text-emerald-900">Modifier</Link><StoreStatusForm id={store.id} currentStatus={store.status as "pending" | "active" | "suspended"} /></>}</div></article>)}</div>
        <section className="hidden overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm md:block"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-[0.16em] text-slate-400"><tr><th className="px-5 py-4">Boutique</th><th className="px-5 py-4">WhatsApp</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4">Accès</th><th className="px-5 py-4">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{stores.map(store => <tr key={store.id}><td className="px-5 py-4 font-bold">{store.display_name}<span className="block text-xs font-normal text-slate-400">/p/{store.slug}</span></td><td className="px-5 py-4">{store.whatsapp_number}</td><td className="px-5 py-4"><Status status={store.status} /></td><td className="px-5 py-4"><Link href={`/p/${store.slug}`} target="_blank" className="font-semibold text-emerald-800 hover:underline">Voir ↗</Link></td><td className="px-5 py-4"><div className="flex items-center gap-3">{store.is_house ? <span className="text-xs font-semibold text-slate-400">Protégée</span> : <><Link href={`/admin/boutiques/${store.id}`} className="font-semibold text-emerald-800 hover:underline">Modifier</Link><StoreStatusForm id={store.id} currentStatus={store.status as "pending" | "active" | "suspended"} /></>}</div></td></tr>)}</tbody></table></section>
      </>}
    </AdminShell>
  );
}

function Status({ status }: { status: string }) {
  const styles = status === "active" ? "bg-emerald-50 text-emerald-800" : status === "suspended" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800";
  const label = status === "active" ? "Active" : status === "suspended" ? "Suspendue" : "En attente";
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${styles}`}>{label}</span>;
}

function StoresFallback() {
  return <AdminShell active="stores"><div className="animate-pulse"><div className="h-16 w-2/3 rounded-2xl bg-slate-200" /><div className="mt-6 h-28 rounded-3xl bg-white" /><div className="mt-3 h-28 rounded-3xl bg-white" /></div></AdminShell>;
}
