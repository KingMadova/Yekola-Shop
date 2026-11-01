import { ProductGrid } from "@/components/catalogue/ProductGrid";
import { container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";
import { formatFCFA } from "@/lib/pricing";
import { VIP_THRESHOLD } from "@/lib/config";

/** Packs calibrés au-dessus du palier : la remise VIP s'applique dès le premier pack. */
export async function PackSolutions() {
  const packs = (await getCatalog()).filter((product) => product.isPackSolution);
  if (packs.length === 0) return null;

  return (
    <section id="packs" className={`${container} scroll-mt-24 py-12`}>
      <h2 className="text-2xl font-bold text-gray-900">Packs solutions clé en main</h2>
      <p className="mb-5 mt-1 text-gray-800">
        Dès {formatFCFA(VIP_THRESHOLD)} d&apos;achats, votre remise VIP de 5 % s&apos;applique automatiquement.
      </p>
      <ProductGrid products={packs} highlightVip />
    </section>
  );
}
