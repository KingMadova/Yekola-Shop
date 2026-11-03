import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import AdminSignOut from "./sign-out";

export const metadata = { title: "Administration | Yekola Shop", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const { supabase, user } = await requireAdmin();
  const [partnersResult, productsResult, leadsResult] = await Promise.all([
    supabase.from("partners").select("id,slug,display_name,whatsapp_number,status,is_house,created_at").order("created_at", { ascending: false }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);
  const partners = partnersResult.data ?? [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Yekola Shop</p><h1 className="mt-1 text-xl font-bold">Administration</h1></div>
          <div className="flex items-center gap-4"><span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span><AdminSignOut /></div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8"><h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2><p className="mt-2 text-slate-600">Vue d'ensemble de votre activité Yekola Shop.</p></div>
        {(partnersResult.error || productsResult.error || leadsResult.error) && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">Certaines statistiques n'ont pas pu être chargées. Vérifiez les migrations et les autorisations Supabase.</p>}
        <section className="grid gap-4 sm:grid-cols-3">
          <Stat label="Boutiques" value={partners.length} detail="Boutiques enregistrées" />
          <Stat label="Produits" value={productsResult.count ?? "—"} detail="Produits du catalogue" />
          <Stat label="Demandes clients" value={leadsResult.count ?? "—"} detail="Leads enregistrés" />
        </section>
        <section className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin/boutiques" className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900">Gérer les boutiques</Link>
        </section>
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5"><div><h3 className="font-semibold">Boutiques</h3><p className="mt-1 text-sm text-slate-500">État des boutiques maison et partenaires.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">{partners.length} enregistrée(s)</span></div>
          {partnersResult.error ? <p className="p-6 text-sm text-red-700">Impossible de lire les boutiques : {partnersResult.error.message}</p> : partners.length === 0 ? <p className="p-6 text-sm text-slate-500">Aucune boutique enregistrée.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3">Boutique</th><th className="px-6 py-3">WhatsApp</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Statut</th><th className="px-6 py-3">URL</th></tr></thead><tbody className="divide-y divide-slate-100">{partners.map(partner => <tr key={partner.id}><td className="px-6 py-4 font-medium">{partner.display_name}<span className="block text-xs font-normal text-slate-500">/{partner.slug}</span></td><td className="px-6 py-4">{partner.whatsapp_number}</td><td className="px-6 py-4">{partner.is_house ? "Boutique maison" : "Partenaire"}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${partner.status === "active" ? "bg-emerald-50 text-emerald-800" : partner.status === "suspended" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>{partner.status}</span></td><td className="px-6 py-4"><Link className="font-medium text-emerald-800 hover:underline" href={`/p/${partner.slug}`} target="_blank">Voir la boutique ↗</Link></td></tr>)}</tbody></table></div>}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, detail }: { label: string; value: number | string; detail: string }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>;
}
