import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import AdminShell from "./admin-shell";

export const metadata = { title: "Administration | Yekola Shop", robots: { index: false, follow: false } };

export default function AdminPage() {
  return <Suspense fallback={<DashboardFallback />}><AdminDashboard /></Suspense>;
}

async function AdminDashboard() {
  await connection();
  const { supabase, user } = await requireAdmin();
  const [partnersResult, productsResult, leadsResult] = await Promise.all([
    supabase.from("partners").select("id,slug,display_name,whatsapp_number,status,is_house,created_at").order("created_at", { ascending: false }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);
  const partners = partnersResult.data ?? [];
  const activeStores = partners.filter(partner => partner.status === "active").length;
  const hasError = partnersResult.error || productsResult.error || leadsResult.error;

  return (
    <AdminShell active="dashboard" email={user.email ?? undefined}>
      <section className="mb-7 overflow-hidden rounded-[28px] bg-[#123d2c] p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-emerald-200">Votre espace de pilotage</p>
          <h1 className="mt-3 text-[clamp(1.8rem,5vw,2.7rem)] font-black leading-tight tracking-tight">Bonjour, Alvine <span className="text-emerald-300">✦</span></h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-emerald-50/75">Gardez un œil sur votre réseau de boutiques et pilotez votre activité depuis un seul endroit.</p>
          <Link href="/admin/boutiques" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-[#123d2c] shadow-lg transition hover:bg-emerald-50">Gérer mes boutiques <span aria-hidden="true">→</span></Link>
        </div>
        <div aria-hidden="true" className="pointer-events-none relative"><span className="absolute -right-4 -top-48 hidden size-72 rounded-full border-[38px] border-white/5 sm:block" /><span className="absolute -right-1 -top-28 hidden size-44 rounded-full border border-emerald-200/20 sm:block" /></div>
      </section>

      {hasError && <p role="alert" className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">Certaines données n'ont pas pu être chargées. Vérifiez les autorisations Supabase.</p>}

      <section aria-label="Indicateurs clés" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <Metric label="Boutiques" value={partners.length} hint="Dans votre réseau" icon="▦" />
        <Metric label="Actives" value={activeStores} hint="En ligne actuellement" icon="↗" />
        <div className="col-span-2 sm:col-span-1"><Metric label="Produits" value={productsResult.count ?? "—"} hint="Dans le catalogue" icon="◇" /></div>
      </section>

      <section className="mt-9">
        <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">Réseau</p><h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Vos boutiques</h2><p className="mt-1 text-xs text-slate-500">{leadsResult.count ?? 0} demande(s) client enregistrée(s)</p></div><Link href="/admin/boutiques" className="shrink-0 text-xs font-extrabold text-emerald-800 hover:underline">Tout voir →</Link></div>
        {partnersResult.error ? <div className="rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-700">Impossible de lire les boutiques : {partnersResult.error.message}</div> : partners.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-800">▦</span><h3 className="mt-3 font-bold">Aucune boutique pour le moment</h3><p className="mt-1 text-sm text-slate-500">Créez votre première boutique partenaire.</p><Link href="/admin/boutiques/nouvelle" className="mt-4 inline-flex rounded-xl bg-[#123d2c] px-4 py-3 text-sm font-bold text-white">Créer une boutique</Link></div> : <div className="grid gap-3 lg:grid-cols-2">{partners.slice(0, 6).map(partner => <article key={partner.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_3px_14px_rgba(15,45,32,0.035)] sm:gap-4 sm:p-5"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-lg font-black text-emerald-900">{partner.display_name.slice(0,1).toUpperCase()}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-extrabold">{partner.display_name}</h3><Status status={partner.status} /></div><p className="mt-1 truncate text-xs text-slate-400">/p/{partner.slug} · {partner.is_house ? "Boutique maison" : "Partenaire"}</p></div><Link href={partner.is_house ? "/p/yekola" : `/admin/boutiques/${partner.id}`} aria-label={partner.is_house ? "Voir la boutique maison" : `Modifier ${partner.display_name}`} className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-lg text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-900">↗</Link></article>)}</div>}
      </section>
    </AdminShell>
  );
}

function Metric({ label, value, hint, icon }: { label: string; value: number | string; hint: string; icon: string }) {
  return <article className="rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_4px_18px_rgba(15,45,32,0.04)] sm:p-5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">{label}</span><span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-lg text-emerald-900">{icon}</span></div><p className="mt-3 text-3xl font-black tracking-tight tabular-nums text-[#173b2d]">{value}</p><p className="mt-1 text-[11px] text-slate-400">{hint}</p></article>;
}

function Status({ status }: { status: string }) {
  const styles = status === "active" ? "bg-emerald-50 text-emerald-800" : status === "suspended" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800";
  const label = status === "active" ? "Active" : status === "suspended" ? "Suspendue" : "En attente";
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${styles}`}>{label}</span>;
}

function DashboardFallback() {
  return <AdminShell active="dashboard"><div className="animate-pulse"><div className="h-56 rounded-[28px] bg-emerald-950/10" /><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="h-28 rounded-3xl bg-white" /><div className="h-28 rounded-3xl bg-white" /><div className="col-span-2 h-28 rounded-3xl bg-white sm:col-span-1" /></div><div className="mt-8 h-40 rounded-3xl bg-white" /></div></AdminShell>;
}
