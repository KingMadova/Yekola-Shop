"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BadgePercent, PackageOpen } from "lucide-react";
import { ShopLink } from "@/components/providers/ShopContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export function HeroOffersCarousel({ products }: { products: Product[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = products.length;

  const goTo = useCallback((index: number) => {
    if (!count) return;
    const next = (index + count) % count;
    setActiveIndex(next);
    rail.current?.scrollTo({ left: next * (rail.current.clientWidth || 0), behavior: "smooth" });
  }, [count]);

  useEffect(() => {
    if (count < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => goTo((activeIndex + 1) % count), 3000);
    return () => window.clearInterval(timer);
  }, [activeIndex, count, goTo, paused]);

  if (!count) return null;

  return (
    <div className="w-full min-w-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="mb-1.5 flex items-center justify-between gap-2 px-1 text-white sm:mb-2">
        <h2 className="text-sm font-extrabold sm:text-base">Nos offres du moment</h2>
        {count > 1 && <div className="hidden gap-1.5 sm:flex">
          <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Offre précédente" className="grid size-11 place-items-center rounded-full border border-white/50 bg-white/10 hover:bg-white/20"><ArrowLeft className="size-4" /></button>
          <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Offre suivante" className="grid size-11 place-items-center rounded-full border border-white/50 bg-white/10 hover:bg-white/20"><ArrowRight className="size-4" /></button>
        </div>}
      </div>
      <div
        ref={rail}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Carrousel des offres"
        onScroll={(event) => setActiveIndex(Math.min(count - 1, Math.round(event.currentTarget.scrollLeft / Math.max(1, event.currentTarget.clientWidth))))}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {products.map((product) => {
          const image = product.images[0];
          const hasPromo = Boolean(product.compareAtPrice && product.compareAtPrice > product.pricePublic);
          return (
            <article key={product.code} className="w-full shrink-0 snap-start">
              <ShopLink href={`/produit/${product.slug}`} className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-white/75 bg-[#fff9f3] text-[#30231d] shadow-[0_14px_34px_rgba(105,37,7,0.22)] sm:aspect-[4/3] sm:max-h-[340px]">
                <div className="absolute inset-0 bg-[#fff0df]">
                  {image ? <SafeImage src={image} alt={product.name} fill sizes="(max-width: 640px) 90vw, 440px" className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04] sm:p-5" /> : <div className="grid size-full place-items-center"><PackageOpen aria-hidden className="size-16 text-[#c1440e]" /></div>}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2c170f]/95 via-[#2c170f]/85 to-transparent px-4 pb-3 pt-12 text-white sm:px-5 sm:pb-4 sm:pt-16">
                  <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[#fff9f3] px-2.5 py-1 text-[9px] font-extrabold text-[#a9360b] sm:text-[10px]">
                    {hasPromo ? <><BadgePercent className="size-3" /> {product.promoBadge || "Offre spéciale"}</> : product.isPackSolution ? "Pack à découvrir" : "Sélection du moment"}
                  </span>
                  <h3 className="line-clamp-2 text-base font-extrabold leading-tight sm:text-xl">{product.name}</h3>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    <span className="text-lg font-extrabold sm:text-xl">{formatFCFA(product.pricePublic)}</span>
                    {hasPromo && <span className="text-xs text-white/75 line-through">{formatFCFA(product.compareAtPrice!)}</span>}
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-extrabold sm:text-xs">Découvrir <ArrowRight className="size-3.5" /></span>
                  </div>
                </div>
              </ShopLink>
            </article>
          );
        })}
      </div>
      {count > 1 && <div className="mt-2 flex items-center justify-center gap-1.5" aria-label={`Offre ${activeIndex + 1} sur ${count}`}>
        {products.map((product, index) => <button key={product.code} type="button" onClick={() => goTo(index)} aria-label={`Afficher l'offre ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} className={`inline-flex min-h-8 min-w-8 items-center justify-center rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white `}>
          <span className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/55"}`} />
        </button>)}
      </div>}
    </div>
  );
}
