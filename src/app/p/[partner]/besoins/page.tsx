import type { Metadata } from "next";
import { ShopLink, ShopWhatsAppLink } from "@/components/providers/ShopContext";
import { Suspense } from "react";
import { InterestSignal } from "@/components/lead/InterestSignal";
import { container } from "@/components/ui/styles";
import { HEALTH_GOAL_META, HEALTH_GOAL_SLUGS } from "@/lib/config";
import { parseCatalogueQuery } from "@/lib/catalogue";
import { HEALTH_GOALS } from "@/lib/types";


export const metadata: Metadata = {
  title: "Vos besoins",
  description: "Choisissez le thème qui vous intéresse et échangez avec un conseiller pour découvrir les produits adaptés à votre recherche.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/besoins` },
};

interface NeedsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function NeedsPage({ searchParams }: NeedsPageProps) {
  return (
    <div className={container + " py-8 sm:py-12"}>
      <Suspense fallback={<div aria-hidden className="h-80 animate-pulse rounded-2xl bg-[#fff0df]" />}>
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
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#c1440e]">Un point de départ pour choisir</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#a9360b] sm:text-4xl">
          {selected ? HEALTH_GOAL_META[selected].shortLabel : "Qu’aimeriez-vous intégrer à votre routine ?"}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#71645d]">
          Choisissez le thème qui vous intéresse. Un conseiller pourra vous présenter les références disponibles et leurs informations, sans promesse médicale.
        </p>
      </header>

      {selected && (
        <section className="rounded-3xl bg-[#c1440e] p-5 text-white sm:p-7">
          <h2 className="text-xl font-bold">Échangeons sur votre recherche</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90">
            Expliquez-nous ce que vous recherchez au quotidien. Nous vous aiderons à parcourir le catalogue et à comprendre les informations produit.
          </p>
          <ShopWhatsAppLink kind="need" goal={selected} className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#fff9f3] px-5 font-semibold text-[#a9360b] hover:bg-white">
            Être conseillé sur WhatsApp
          </ShopWhatsAppLink>
        </section>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {HEALTH_GOALS.map((goal) => {
          const active = goal === selected;
          return (
            <ShopLink
              key={goal}
              href={"/besoins?besoin=" + HEALTH_GOAL_SLUGS[goal]}
              aria-current={active ? "page" : undefined}
              className={"flex min-h-28 flex-col justify-between rounded-2xl border p-5 transition-colors " + (active ? "border-[#c1440e] bg-[#fff0df]" : "border-[#f4ddca] bg-white hover:border-[#ff6a1a] hover:bg-[#fff9f3]")}
            >
              <span className="text-sm font-semibold text-[#30231d]">{HEALTH_GOAL_META[goal].shortLabel}</span>
              <span className="mt-3 text-xs font-semibold text-[#c1440e]">Explorer ce thème →</span>
            </ShopLink>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-[#f4ddca] pt-5">
        <ShopLink href="/catalogue" className="inline-flex min-h-11 items-center rounded-xl bg-[#c1440e] px-5 font-semibold text-white hover:bg-[#a9360b]">Parcourir tous les produits</ShopLink>
        {selected && <ShopLink href="/besoins" className="text-sm font-semibold text-[#a9360b] underline underline-offset-4">Effacer ma sélection</ShopLink>}
      </div>
    </div>
  );
}
