import Link from "next/link";
import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";
import { formatFCFA } from "@/lib/pricing";
import { VIP_THRESHOLD } from "@/lib/config";

export async function PackSolutions() {
  const packs = (await getCatalog()).filter((product) => product.isPackSolution);
  if (packs.length === 0) return null;

  return (
    <section id="packs" className={`${container} scroll-mt-24 py-9 sm:py-12`}>
      <div className="mb-5 max-w-xl">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7b40]">Des choix simples</p>
        <h2 className="text-xl font-bold tracking-tight text-[#20382d] sm:text-2xl">Nos packs à découvrir</h2>
        <p className="mt-1 text-sm text-[#68756c]">
          Dès {formatFCFA(VIP_THRESHOLD)} d&apos;achats, les tarifs client privilégié de la grille officielle s&apos;appliquent à la commande.
        </p>
      </div>
      <ProductGrid products={packs} highlightVip />
      <div className="mt-5"><Link href="/packs" className="inline-flex min-h-11 items-center font-semibold text-[#173f35] underline underline-offset-4">Voir tous les packs</Link></div>
    </section>
  );
}
