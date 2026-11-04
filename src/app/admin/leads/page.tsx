import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminShell from "../admin-shell";

export const metadata = { title: "Demandes clients | Administration Yekola Shop", robots: { index: false, follow: false } };

type SearchParams = Promise<{ q?: string; status?: string; partner?: string; page?: string; erreur?: string }>;
const statuses = ["Nouveau", "Contacté", "Intéressé", "Client", "Perdu"] as const;
const PAGE_SIZE = 20;

export default function AdminLeadsPage({ searchParams }: { searchParams: SearchParams }) {
  return <Suspense fallback={<AdminShell active="leads"><div className="h-96 animate-pulse rounded-3xl bg-white" /></AdminShell>}><AdminLeadsContent searchParams={searchParams} /></Suspense>;
}

async function AdminLeadsContent({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const [{ user }, params] = await Promise.all([requireAdmin(), searchParams]);
  const client = createAdminClient();
  if (!client) throw new Error("La configuration serveur Supabase est incomplète.");

  const q = (params.q ?? "").replace(/[^a-zA-Z0-9À-ÿ\\s+-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  const status = statuses.includes(params.status as (typeof statuses)[number]) ? params.status! : "";
  const partnerId = /^[0-9a-f-]{36}$/i.test(params.partner ?? "") ? params.partner! : "";
  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, 100000) : 1;

  const [partnersResult, leadsResult] = await Promise.all([
    client.from("partners").select("id,display_name,slug").order("display_name"),
    (() => {
      let request = client.from("leads")
        .select("id,partner_id,first_name,phone,need,status,cart_total,requests_count,created_at,last_request_at", { count: "exact" })
        .order("last_request_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
      if (q) request = request.or(`first_name.ilike.%${q}%,phone.ilike.%${q}%`);
      if (status) request = request.eq("status", status);
      if (partnerId) request = request.eq("partner_id", partnerId);
      return request;
    })(),
  ]);

  const partners = partnersResult.data ?? [];
  const partnerNames = new Map(partners.map((partner) => [partner.id, partner.display_name]));
  const leads = leadsResult.data ?? [];
  const total = leadsResult.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageUrl(nextPage: number) {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (status) query.set("status", status);
    if (partnerId) query.set("partner", partnerId);
    if (nextPage > 1) query.set("page", String(nextPage));
    const suffix = query.toString();
    return suffix ? `/admin/leads?${suffix}` : "/admin/leads";
  }

  return (
    <AdminShell active="leads" email={user.email ?? undefined}>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">Relation client</p><h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Demandes clients</h1><p className="mt-1 text-sm text-slate-500">Suivez les demandes reçues sur toutes les boutiques.</p></div>
        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3"><p className="text-xs font-semibold text-slate-500">Résultats</p><p className="text-2xl font-black tabular-nums text-[#173b2d]">{total.toLocaleString("fr-FR")}</p></div>
      </div>

      {params.erreur && <p role="alert" className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{params.erreur}</p>}

      <form method="get" className="mb-5 grid gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.5fr)_1fr_1fr_auto] lg:items-end">
        <label className="block text-xs font-bold text-slate-600">Rechercher un nom ou un téléphone
          <input name="q" defaultValue={q} placeholder="Nom ou 242…" className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-[#f8faf9] px-3 text-sm font-medium outline-none focus:border-emerald-700" />
        </label>
        <label className="block text-xs font-bold text-slate-600">Statut
          <select name="status" defaultValue={status} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-[#f8faf9] px-3 text-sm">
            <option value="">Tous les statuts</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-xs font-bold text-slate-600">Boutique
          <select name="partner" defaultValue={partnerId} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-[#f8faf9] px-3 text-sm">
            <option value="">Toutes les boutiques</option>{partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.display_name}</option>)}
          </select>
        </label>
        <div className="flex gap-2"><button type="submit" className="min-h-11 flex-1 rounded-xl bg-[#123d2c] px-4 text-sm font-bold text-white">Filtrer</button><Link href="/admin/leads" className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600">Effacer</Link></div>
      </form>

      {leadsResult.error || partnersResult.error ? <div role="alert" className="rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-700">Impossible de charger les demandes clients. Vérifiez la configuration Supabase et les autorisations serveur.</div> : leads.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-2xl text-emerald-900">◎</span><h2 className="mt-4 font-extrabold">Aucune demande trouvée</h2><p className="mt-1 text-sm text-slate-500">Modifiez les filtres ou attendez les prochaines demandes clients.</p></div> : (
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-[10px] uppercase tracking-[0.14em] text-slate-400"><tr><th className="px-5 py-4">Client</th><th className="px-5 py-4">Besoin</th><th className="px-5 py-4">Boutique</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4">Dernière demande</th><th className="px-5 py-4"></th></tr></thead><tbody className="divide-y divide-slate-100">{leads.map((lead) => <tr key={lead.id}><td className="px-5 py-4"><p className="font-bold text-slate-800">{lead.first_name}</p><a href={`tel:+${lead.phone}`} className="mt-1 block text-xs text-slate-500 hover:text-emerald-800">{lead.phone}</a></td><td className="px-5 py-4"><span className="text-xs text-slate-600">{lead.need ?? "Non précisé"}</span></td><td className="px-5 py-4 text-xs text-slate-600">{partnerNames.get(lead.partner_id) ?? "Boutique inconnue"}</td><td className="px-5 py-4"><Status status={lead.status} /></td><td className="px-5 py-4 text-xs text-slate-500">{new Date(lead.last_request_at).toLocaleDateString("fr-FR")} {lead.requests_count > 1 ? `· ${lead.requests_count} demandes` : ""}</td><td className="px-5 py-4 text-right"><Link href={`/admin/leads/${lead.id}`} className="font-bold text-emerald-800 hover:underline">Détails →</Link></td></tr>)}</tbody></table></div>
          <div className="divide-y divide-slate-100 md:hidden">{leads.map((lead) => <article key={lead.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-sm font-extrabold">{lead.first_name}</h2><a href={`tel:+${lead.phone}`} className="mt-1 block text-xs text-slate-500">{lead.phone}</a></div><Status status={lead.status} /></div><p className="mt-3 text-xs text-slate-600">{lead.need ?? "Besoin non précisé"}</p><div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-400"><span className="truncate">{partnerNames.get(lead.partner_id) ?? "Boutique inconnue"}</span><span>{new Date(lead.last_request_at).toLocaleDateString("fr-FR")}</span></div><Link href={`/admin/leads/${lead.id}`} className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-emerald-50 text-xs font-extrabold text-emerald-900">Consulter la demande →</Link></article>)}</div>
        </div>
      )}

      {pageCount > 1 && <nav aria-label="Pagination des demandes" className="mt-5 flex items-center justify-between gap-3"><p className="text-xs text-slate-500">Page {page} sur {pageCount}</p><div className="flex gap-2">{page > 1 && <Link href={pageUrl(page - 1)} className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold">Précédent</Link>}{page < pageCount && <Link href={pageUrl(page + 1)} className="inline-flex min-h-10 items-center rounded-xl bg-[#123d2c] px-4 text-xs font-bold text-white">Suivant</Link>}</div></nav>}
    </AdminShell>
  );
}

function Status({ status }: { status: string }) {
  const styles = status === "Client" ? "bg-emerald-50 text-emerald-800" : status === "Perdu" ? "bg-red-50 text-red-700" : status === "Intéressé" ? "bg-blue-50 text-blue-800" : status === "Contacté" ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-700";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${styles}`}>{status}</span>;
}
