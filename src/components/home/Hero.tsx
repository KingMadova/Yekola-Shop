import { ShopLink, ShopWhatsAppLink, ShopWelcomeText } from "@/components/providers/ShopContext";
import { ArrowRight, MessageCircle } from "lucide-react";
import { HeroOffersCarousel } from "@/components/home/HeroOffersCarousel";
import { btn, container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";
import { COPY } from "@/lib/config";

export async function Hero() {
  const products = await getCatalog();
  const promotions = products.filter((product) => product.compareAtPrice && product.compareAtPrice > product.pricePublic);
  const offers = (promotions.length ? promotions : products.filter((product) => product.isPackSolution || product.isBestSeller)).slice(0, 6);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#f9a825] via-[#ff6a1a] to-[#c1440e] text-white">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-28 size-64 rounded-full border border-white/20 sm:size-80" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-[#fff9f3]/10 blur-3xl" />
      <div className={`${container} relative grid gap-3 py-3 sm:grid-cols-[1.05fr_0.95fr] sm:items-center sm:gap-6 sm:py-7 lg:gap-10 lg:py-8`}>
        <div className="flex flex-col items-start gap-2 sm:gap-3">
          <h1 className="max-w-[17ch] text-[clamp(1.75rem,7vw,2.45rem)] font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-4xl lg:text-[3.1rem]">
            {COPY.heroTitle}
          </h1>
          <p className="max-w-xl text-[11px] leading-relaxed text-white/95 sm:text-sm">
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
        </div>

        {offers.length > 0 && <div className="min-w-0 sm:pl-1">
          <HeroOffersCarousel products={offers} />
        </div>}
        <p className="text-center text-[9px] text-white/95 sm:col-span-2 sm:text-left sm:text-[11px]">{COPY.heroReassurance}</p>
      </div>
    </section>
  );
}
