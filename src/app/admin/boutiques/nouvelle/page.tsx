import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import AdminShell from "../../admin-shell";
import PartnerStoreForm from "../form";

export const metadata = { title: "Nouvelle boutique | Administration Yekola Shop", robots: { index: false, follow: false } };

type SearchParams = Promise<{ erreur?: string }>;

export default function NewPartnerStorePage({ searchParams }: { searchParams: SearchParams }) {
  return <Suspense fallback={<AdminShell active="create"><div className="h-64 animate-pulse rounded-3xl bg-white" /></AdminShell>}><NewPartnerStoreContent searchParams={searchParams} /></Suspense>;
}

async function NewPartnerStoreContent({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const { user } = await requireAdmin();
  const params = await searchParams;

  return <AdminShell active="create" email={user.email ?? undefined}>
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/boutiques" className="text-xs font-bold text-emerald-800 hover:underline">← Retour aux boutiques</Link>
      <div className="mb-6 mt-5"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-700">Développer le réseau</p><h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Nouvelle boutique</h1><p className="mt-2 text-sm leading-6 text-slate-500">Renseignez les informations du partenaire. La boutique sera créée en attente et aucun accès partenaire ne sera ouvert automatiquement.</p></div>
      <PartnerStoreForm error={params.erreur} />
    </div>
  </AdminShell>;
}
