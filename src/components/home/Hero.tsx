import { ShopLink, ShopWhatsAppLink, ShopWelcomeText } from "@/components/providers/ShopContext";
import { ArrowRight, MessageCircle, PackageCheck } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { btn, container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";
import { COPY, DISTRIBUTOR_MENTION } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";

export async function Hero() {
  const products = await getCatalog();
  const featured = products.find((product) => product.isPackSolution && product.isBestSeller) ?? products.find((p) => p.isPackSolution) ?? products[0];
  const photo = featured?.images[0];

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#f9a825] via-[#ff6a1a] to-[#c1440e] text-white">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-28 size-64 rounded-full border border-white/20 sm:size-80" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-[#fff9f3]/10 blur-3xl" />
      <div className={`${container} relative grid gap-3 py-4 sm:grid-cols-[1.05fr_0.95fr] sm:items-center sm:gap-6 sm:py-8 lg:gap-10 lg:py-10`}>
        <div className="flex flex-col items-start gap-2 sm:gap-3">
          <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/95 sm:text-xs">
            <span className="size-1.5 rounded-full bg-white" /> {COPY.heroEyebrow}
          </p>
          <h1 className="max-w-[17ch] text-[clamp(1.8rem,7vw,2.55rem)] font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-4xl lg:text-[3.1rem]">
            {COPY.heroTitle}
          </h1>
          <p className="max-w-xl text-[12px] leading-relaxed text-white/95 sm:text-sm">
            <ShopWelcomeText fallback={COPY.heroSubtitle} />
          </p>
          <div className="flex w-full flex-wrap gap-2 pt-0.5 sm:w-auto sm:gap-3">
            <ShopLink href="/catalogue" className={`${btn} min-h-10 flex-1 bg-[#fff9f3] px-4 text-xs font-bold text-[#a9360b] hover:bg-white sm:flex-none sm:px-5 sm:text-sm`}>
              {COPY.heroPrimaryCta} <ArrowRight aria-hidden className="size-4" />
            </ShopLink>
            <ShopWhatsAppLink kind="advice" className={`${btn} min-h-10 flex-1 border border-white/70 px-3 text-xs font-bold text-white hover:bg-white/10 sm:flex-none sm:px-4 sm:text-sm`}>
              <MessageCircle aria-hidden className="size-4" /> {COPY.heroSecondaryCta}
            </ShopWhatsAppLink>
          </div>
          <p className="text-[9px] leading-snug text-white/90 sm:text-[11px]">{DISTRIBUTOR_MENTION}</p>
        </div>

        {featured && <ShopLink href={`/produit/${featured.slug}`} className="group flex h-[112px] min-w-0 items-center gap-2.5 overflow-hidden rounded-2xl border border-white/70 bg-[#fff9f3] p-2.5 text-[#30231d] shadow-[0_12px_32px_rgba(105,37,7,0.18)] sm:h-[136px] sm:gap-4 sm:p-3.5">
          <div className="relative grid size-[104px] shrink-0 place-items-center overflow-hidden rounded-xl bg-[#fff0df] sm:size-[128px]">
            {photo ? <SafeImage src={photo} alt="" fill sizes="128px" className="scale-[1.45] object-contain" /> : <PackageCheck aria-hidden className="size-9 text-[#c1440e]" />}
          </div>
          <div className="flex min-w-0 flex-col justify-center gap-1">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#c1440e] sm:text-[10px]">À découvrir</p>
            <p className="line-clamp-2 text-sm font-extrabold leading-tight tracking-tight group-hover:underline sm:text-base">{featured.name}</p>
            <p className="line-clamp-2 text-[10px] leading-snug text-[#71645d] sm:text-xs">{featured.shortDesc}</p>
            <p className="mt-0.5 text-sm font-extrabold text-[#b53c0c] sm:text-base">{formatFCFA(featured.pricePublic)}</p>
          </div>
        </ShopLink>}
        <p className="text-center text-[9px] text-white/95 sm:col-span-2 sm:text-left sm:text-[11px]">{COPY.heroReassurance}</p>
      </div>
    </section>
  );
}
