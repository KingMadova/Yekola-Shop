import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";

export const metadata: Metadata = {
  title: "Nos packs",
  description: "Retrouvez les packs Forever Living et leurs tarifs en FCFA.",
};

export default async function PacksPage() {
  const packs = (await getCatalog()).filter((product) => product.isPackSolution);

  return (
    <section className={container + " flex flex-col gap-7 py-8 sm:py-12"}>
      <header className="max-w-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a7b40]">Sélections prêtes à découvrir</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#173f35] sm:text-4xl">Nos packs</h1>
        <p className="mt-3 text-base leading-relaxed text-[#68756c]">
          Retrouvez les packs et programmes de démarrage, avec leurs prix publics et leurs tarifs client privilégié.
        </p>
      </header>

      {packs.length > 0 ? (
        <ProductGrid products={packs} highlightVip />
      ) : (
        <div className="rounded-2xl border border-[#e9e5d9] bg-white p-6">
          <h2 className="text-lg font-semibold text-[#26392e]">Les packs arrivent bientôt.</h2>
          <p className="mt-2 text-sm text-[#68756c]">Vous pouvez déjà parcourir les autres références du catalogue.</p>
          <Link href="/catalogue" className="mt-4 inline-flex min-h-11 items-center font-semibold text-[#173f35] underline underline-offset-4">Voir le catalogue</Link>
        </div>
      )}

      <p className="text-sm text-[#68756c]">Vous hésitez entre plusieurs références ? <Link href="/besoins" className="font-semibold text-[#173f35] underline underline-offset-4">Parlons de votre besoin.</Link></p>
    </section>
  );
}
