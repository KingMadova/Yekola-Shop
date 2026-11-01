import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { InterestSignal } from "@/components/lead/InterestSignal";
import { container } from "@/components/ui/styles";
import { HEALTH_GOAL_META, HEALTH_GOAL_SLUGS } from "@/lib/config";
import { parseCatalogueQuery } from "@/lib/catalogue";
import { HEALTH_GOALS } from "@/lib/types";
import { buildNeedAdviceMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Vos besoins",
  description: "Choisissez le thème qui vous intéresse et échangez avec un conseiller pour découvrir les produits adaptés à votre recherche.",
};

interface NeedsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function NeedsPage({ searchParams }: NeedsPageProps) {
  return (
    <div className={container + " py-8 sm:py-12"}>
      <Suspense fallback={<div aria-hidden className="h-80 animate-pulse rounded-2xl bg-[#f0eee7]" />}>
        <NeedsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function NeedsContent({ searchParams }: NeedsPageProps) {
  const query = parseCatalogueQuery(await searchParams);
  const selected = query.goal;

  return (
    <div className="flex flex-col gap-8">
      {selected && <InterestSignal goal={selected} origin="choix" />}
      <header className="max-w-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a7b40]">Un point de départ pour choisir</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#173f35] sm:text-4xl">
          {selected ? HEALTH_GOAL_META[selected].shortLabel : "Qu’aimeriez-vous intégrer à votre routine ?"}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#68756c]">
          Choisissez le thème qui vous intéresse. Un conseiller pourra vous présenter les références disponibles et leurs informations, sans promesse médicale.
        </p>
      </header>

      {selected && (
        <section className="rounded-3xl bg-[#173f35] p-5 text-white sm:p-7">
          <h2 className="text-xl font-bold">Échangeons sur votre recherche</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#e4ece6]">
            Expliquez-nous ce que vous recherchez au quotidien. Nous vous aiderons à parcourir le catalogue et à comprendre les informations produit.
          </p>
          <a href={buildWhatsAppUrl(buildNeedAdviceMessage(selected))} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#f6f3ea] px-5 font-semibold text-[#173f35] hover:bg-white">
            Être conseillé sur WhatsApp
          </a>
        </section>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {HEALTH_GOALS.map((goal) => {
          const active = goal === selected;
          return (
            <Link
              key={goal}
              href={"/besoins?besoin=" + HEALTH_GOAL_SLUGS[goal]}
              aria-current={active ? "page" : undefined}
              className={"flex min-h-28 flex-col justify-between rounded-2xl border p-5 transition-colors " + (active ? "border-[#173f35] bg-[#edf1e9]" : "border-[#e9e5d9] bg-white hover:border-[#bda36d] hover:bg-[#fbfaf6]")}
            >
              <span className="text-sm font-semibold text-[#26392e]">{HEALTH_GOAL_META[goal].shortLabel}</span>
              <span className="mt-3 text-xs font-semibold text-[#8b713e]">Explorer ce thème →</span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-[#e9e5d9] pt-5">
        <Link href="/catalogue" className="inline-flex min-h-11 items-center rounded-xl bg-[#173f35] px-5 font-semibold text-white hover:bg-[#10352d]">Parcourir tous les produits</Link>
        {selected && <Link href="/besoins" className="text-sm font-semibold text-[#173f35] underline underline-offset-4">Effacer ma sélection</Link>}
      </div>
    </div>
  );
}
