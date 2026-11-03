"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, BadgePercent, PackageOpen } from "lucide-react";
import { ShopLink } from "@/components/providers/ShopContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export function OffersCarousel({ products }: { products: Product[] }) {
  const rail = useRef<HTMLDivElement>(null);
  if (products.length === 0) return null;

  const move = (direction: -1 | 1) => {
    rail.current?.scrollBy({ left: direction * Math.max(260, rail.current.clientWidth * 0.82), behavior: "smooth" });
  };

  return (
    <section aria-labelledby="offers-title" className="py-7 sm:py-10">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-3 px-4 sm:px-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#c1440e] sm:text-xs">À saisir ou à découvrir</p>
          <h2 id="offers-title" className="mt-1 text-xl font-extrabold tracking-tight text-[#30231d] sm:text-2xl">Nos offres du moment</h2>
          <p className="mt-1 max-w-xl text-xs text-[#71645d] sm:text-sm">Des sélections et promotions disponibles dans cette boutique.</p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" onClick={() => move(-1)} aria-label="Offres précédentes" className="grid size-10 place-items-center rounded-full border border-[#f2c8a7] bg-white text-[#a63b13] hover:bg-[#fff0df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e]"><ArrowLeft className="size-4" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Offres suivantes" className="grid size-10 place-items-center rounded-full border border-[#f2c8a7] bg-white text-[#a63b13] hover:bg-[#fff0df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e]"><ArrowRight className="size-4" /></button>
        </div>
      </div>
      <div ref={rail} className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 sm:px-6">
        {products.map((product) => {
          const image = product.images[0];
          const hasPromo = Boolean(product.compareAtPrice && product.compareAtPrice > product.pricePublic);
          return (
            <article key={product.code} className="w-[78vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#f0d6c2] bg-white shadow-[0_8px_24px_rgba(120,55,20,0.07)] sm:w-[280px]">
              <ShopLink href={`/produit/${product.slug}`} className="block focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#c1440e]">
                <div className="relative aspect-[5/3] overflow-hidden bg-[#fff5e9]">
                  {image ? <SafeImage src={image} alt={product.name} fill sizes="(max-width: 640px) 78vw, 280px" className="object-contain p-3 transition-transform duration-300 hover:scale-105" /> : <PackageOpen className="absolute inset-0 m-auto size-12 text-[#e9a15e]" />}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#c1440e] px-2.5 py-1 text-[10px] font-bold text-white">
                    {hasPromo ? <><BadgePercent className="size-3" /> {product.promoBadge || "Promotion"}</> : product.isPackSolution ? "Pack" : "À découvrir"}
                  </span>
                </div>
                <div className="p-3.5">
                  <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-snug text-[#30231d]">{product.name}</h3>
                  <p className="mt-2 flex items-center gap-2">
                    <span className="text-base font-extrabold text-[#b53c0c]">{formatFCFA(product.pricePublic)}</span>
                    {hasPromo && <span className="text-xs text-[#897c73] line-through">{formatFCFA(product.compareAtPrice!)}</span>}
                  </p>
                  <span className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#f9a825] to-[#c1440e] px-3 text-xs font-bold text-white">Découvrir l'offre <ArrowRight className="ml-2 size-4" /></span>
                </div>
              </ShopLink>
            </article>
          );
        })}
      </div>
    </section>
  );
}
