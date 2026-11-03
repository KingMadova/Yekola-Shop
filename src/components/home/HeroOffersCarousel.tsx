"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, BadgePercent, PackageOpen } from "lucide-react";
import { ShopLink } from "@/components/providers/ShopContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export function HeroOffersCarousel({ products }: { products: Product[] }) {
  const rail = useRef<HTMLDivElement>(null);
  if (products.length === 0) return null;

  const move = (direction: -1 | 1) => {
    rail.current?.scrollBy({ left: direction * (rail.current.clientWidth || 320), behavior: "smooth" });
  };

  return (
    <div className="w-full min-w-0">
      <div className="mb-1.5 flex items-center justify-between gap-2 px-1 text-white sm:mb-2">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/90 sm:text-[10px]">Sélection de la boutique</p>
          <h2 className="text-sm font-extrabold sm:text-base">Nos offres du moment</h2>
        </div>
        {products.length > 1 && <div className="hidden gap-1.5 sm:flex">
          <button type="button" onClick={() => move(-1)} aria-label="Offre précédente" className="grid size-8 place-items-center rounded-full border border-white/50 bg-white/10 hover:bg-white/20"><ArrowLeft className="size-4" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Offre suivante" className="grid size-8 place-items-center rounded-full border border-white/50 bg-white/10 hover:bg-white/20"><ArrowRight className="size-4" /></button>
        </div>}
      </div>
      <div ref={rail} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Carrousel des offres">
        {products.map((product) => {
          const image = product.images[0];
          const hasPromo = Boolean(product.compareAtPrice && product.compareAtPrice > product.pricePublic);
          return (
            <article key={product.code} className="w-full shrink-0 snap-start">
              <ShopLink href={`/produit/${product.slug}`} className="group grid h-[116px] grid-cols-[42%_1fr] overflow-hidden rounded-2xl border border-white/70 bg-[#fff9f3] text-[#30231d] shadow-[0_12px_30px_rgba(105,37,7,0.18)] sm:h-[150px] sm:grid-cols-[44%_1fr]">
                <div className="relative grid min-w-0 place-items-center overflow-hidden bg-[#fff0df]">
                  {image ? <SafeImage src={image} alt={product.name} fill sizes="(max-width: 640px) 38vw, 210px" className="scale-[1.55] object-contain transition-transform duration-300 group-hover:scale-[1.68]" /> : <PackageOpen aria-hidden className="size-10 text-[#c1440e]" />}
                </div>
                <div className="flex min-w-0 flex-col justify-center gap-1.5 px-3 py-2 sm:gap-2 sm:px-4">
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#ffe5cc] px-2 py-0.5 text-[9px] font-extrabold text-[#a9360b] sm:text-[10px]">
                    {hasPromo ? <><BadgePercent className="size-3" /> {product.promoBadge || "Promotion"}</> : product.isPackSolution ? "Pack à découvrir" : "Sélection du moment"}
                  </span>
                  <h3 className="line-clamp-2 text-xs font-extrabold leading-tight tracking-tight sm:text-base">{product.name}</h3>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-sm font-extrabold text-[#b53c0c] sm:text-lg">{formatFCFA(product.pricePublic)}</span>
                    {hasPromo && <span className="text-[10px] text-[#897c73] line-through sm:text-xs">{formatFCFA(product.compareAtPrice!)}</span>}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#a9360b] sm:text-xs">Découvrir <ArrowRight className="size-3.5" /></span>
                </div>
              </ShopLink>
            </article>
          );
        })}
      </div>
      {products.length > 1 && <div className="mt-1.5 flex items-center justify-center gap-1.5 sm:hidden" aria-hidden="true">
        {products.slice(0, 6).map((product, index) => <span key={product.code} className={`h-1 rounded-full ${index === 0 ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} />)}
      </div>}
    </div>
  );
}
