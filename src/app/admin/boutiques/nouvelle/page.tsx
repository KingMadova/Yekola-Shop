import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import PartnerStoreForm from "../form";

export const metadata = { title: "Nouvelle boutique | Administration Yekola Shop", robots: { index: false, follow: false } };

type SearchParams = Promise<{ erreur?: string }>;

export default function NewPartnerStorePage({ searchParams }: { searchParams: SearchParams }) {
  return <Suspense fallback={<main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-500">Préparation du formulaire…</main>}>
    <NewPartnerStoreContent searchParams={searchParams} />
  </Suspense>;
}

async function NewPartnerStoreContent({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  await requireAdmin();
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/boutiques" className="text-sm font-medium text-emerald-800 hover:underline">← Gestion des boutiques</Link>
        <h1 className="mt-6 text-3xl font-bold">Créer une boutique partenaire</h1>
        <p className="mb-8 mt-2 text-slate-600">La boutique sera créée en attente. Son partenaire ne pourra pas encore s'y connecter.</p>
        <PartnerStoreForm error={params.erreur} />
      </div>
    </main>
  );
}
