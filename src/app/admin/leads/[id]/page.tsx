import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminShell from "../../admin-shell";
import LeadUpdateForm from "../lead-update-form";

export const metadata = { title: "Détail d'une demande | Administration Yekola Shop", robots: { index: false, follow: false } };

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ succes?: string; erreur?: string }>;

export default function AdminLeadDetailPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  return <Suspense fallback={<AdminShell active="leads"><div className="h-96 animate-pulse rounded-3xl bg-white" /></AdminShell>}><AdminLeadDetailContent params={params} searchParams={searchParams} /></Suspense>;
}

async function AdminLeadDetailContent({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  await connection();
  const [{ id }, query, { user }] = await Promise.all([params, searchParams, requireAdmin()]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const client = createAdminClient();
  if (!client) throw new Error("La configuration serveur Supabase est incomplète.");

  const { data: lead, error } = await client.from("leads")
    .select("id,partner_id,first_name,phone,need,need_origin,other_needs,viewed_products,cart_total,campaign,source,referrer,landing_path,page_path,first_visit_at,status,note,requests_count,created_at,last_request_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Impossible de charger la demande : ${error.message}`);
  if (!lead) notFound();

  const { data: partner } = await client.from("partners").select("display_name,slug").eq("id", lead.partner_id).maybeSingle();
  const money = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(lead.cart_total);

  return (
    <AdminShell active="leads" email={user.email ?? undefined}>
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/leads" className="inline-flex min-h-10 items-center text-xs font-bold text-emerald-800 hover:underline">← Retour aux demandes</Link>
        <div className="mb-6 mt-4 flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">Fiche client</p><h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{lead.first_name}</h1><a href={`tel:+${lead.phone}`} className="mt-2 inline-flex min-h-10 items-center text-sm font-bold text-emerald-800">{lead.phone} · Appeler</a></div><div className="rounded-2xl border border-slate-100 bg-white px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Boutique d'origine</p><p className="mt-1 text-sm font-extrabold">{partner?.display_name ?? "Boutique inconnue"}</p><p className="text-xs text-slate-400">/p/{partner?.slug ?? "—"}</p></div></div>

        {query.succes === "updated" && <p role="status" className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">La demande a été mise à jour.</p>}
        {query.erreur && <p role="alert" className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{query.erreur}</p>}

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-base font-extrabold">Informations de la demande</h2><dl className="mt-5 grid gap-4 sm:grid-cols-2"><Info label="Besoin principal" value={lead.need ?? "Non précisé"} /><Info label="Origine du besoin" value={lead.need_origin || "Non précisée"} /><Info label="Panier au moment de la demande" value={`${money} FCFA`} /><Info label="Demandes enregistrées" value={String(lead.requests_count)} /><Info label="Première demande" value={formatDate(lead.created_at)} /><Info label="Dernière demande" value={formatDate(lead.last_request_at)} /></dl>{lead.other_needs?.length > 0 && <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="text-xs font-bold text-slate-500">Autres besoins</h3><div className="mt-2 flex flex-wrap gap-2">{lead.other_needs.map((item: string) => <span key={item} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">{item}</span>)}</div></div>}{lead.viewed_products?.length > 0 && <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="text-xs font-bold text-slate-500">Produits consultés</h3><ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">{lead.viewed_products.map((item: string, index: number) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>}</section>
            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-base font-extrabold">Acquisition</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2"><Info label="Source" value={lead.source || "Non renseignée"} /><Info label="Campagne" value={lead.campaign || "Non renseignée"} /><Info label="Page d'entrée" value={lead.landing_path || "Non renseignée"} /><Info label="Dernière page consultée" value={lead.page_path || "Non renseignée"} /></dl></section>
          </div>
          <aside><div className="mb-3"><h2 className="text-base font-extrabold">Suivi commercial</h2><p className="mt-1 text-xs text-slate-500">Mettez à jour l'avancement et conservez un compte rendu interne.</p></div><LeadUpdateForm id={lead.id} status={lead.status} note={lead.note} /></aside>
        </div>
      </div>
    </AdminShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-700">{value}</dd></div>;
}

function formatDate(value: string | null) {
  if (!value) return "Non renseignée";
  return new Date(value).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}
