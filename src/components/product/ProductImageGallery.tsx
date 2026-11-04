"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, ImageOff, X } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

interface ProductImageGalleryProps {
  images: readonly string[];
  alt: string;
  bestseller?: boolean;
}

export function ProductImageGallery({ images, alt, bestseller = false }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const active = images[activeIndex];

  useEffect(() => {
    if (isExpanded || images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [images.length, isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsExpanded(false);
      if (event.key === "ArrowRight") setActiveIndex((current) => (current + 1) % images.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, images.length]);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % images.length);
  }

  if (!active) {
    return (
      <div role="img" aria-label={`Photo de ${alt} bientôt disponible`} className="flex h-[240px] items-center justify-center rounded-3xl border border-dashed border-[#f2d7c2] bg-[#fff5e9] text-[#c1440e] sm:h-[320px] lg:aspect-[4/5] lg:h-auto">
        <ImageOff aria-hidden className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <div className="relative h-[240px] min-h-[240px] overflow-hidden rounded-3xl border border-[#f2d7c2] bg-[#fff9f3] sm:h-[320px] sm:min-h-[320px] lg:aspect-[4/5] lg:h-auto">
        <SafeImage key={active} src={active} alt={alt} fill priority={activeIndex === 0} sizes="(min-width: 1024px) 560px, 100vw" className="object-contain p-3" />
        {bestseller && <span className="absolute left-3 top-3 z-10 rounded-full bg-[#f6e5c8] px-3 py-1.5 text-xs font-bold text-[#68451d] shadow-sm">Bestseller</span>}
        <button type="button" onClick={() => setIsExpanded(true)} aria-label="Agrandir la photo du produit" className="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-[#eadfd3] bg-white/95 text-[#30231d] shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e]">
          <Expand aria-hidden className="size-4" />
        </button>
        {images.length > 1 && <>
          <button type="button" onClick={showPrevious} aria-label="Photo précédente" className="absolute left-2 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#30231d] shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-[#c1440e]"><ChevronLeft aria-hidden className="size-5" /></button>
          <button type="button" onClick={showNext} aria-label="Photo suivante" className="absolute right-2 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#30231d] shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-[#c1440e]"><ChevronRight aria-hidden className="size-5" /></button>
        </>}
      </div>

      {images.length > 0 && <div className="flex w-full items-center gap-2" aria-label="Vignettes des photos du produit" data-testid="product-thumbnails">
        <div className="grid min-w-0 flex-1 grid-cols-5 gap-2">
          {images.slice(0, 5).map((src, index) => <button key={`${src}-${index}`} type="button" onClick={() => setActiveIndex(index)} aria-label={`Afficher la photo ${index + 1} sur ${images.length}`} aria-current={index === activeIndex ? "true" : undefined} className={`relative aspect-square min-w-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e] ${index === activeIndex ? "border-[#c1440e] opacity-100" : "border-[#f2d7c2] opacity-75 hover:opacity-100"}`}>
            <SafeImage src={src} alt="" fill sizes="(max-width: 640px) 18vw, 100px" className="object-contain p-1" />
          </button>)}
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-[#68452f]" aria-live="polite">{activeIndex + 1}/{images.length}</span>
      </div>}
      {images.length > 5 && <p className="text-[11px] text-[#8a7668]">Les 5 premières vignettes sont affichées. Utilisez les flèches pour parcourir toutes les photos.</p>}

      {isExpanded && <div role="dialog" aria-modal="true" aria-label={`Aperçu de ${alt}`} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1714]/95 p-4" onClick={() => setIsExpanded(false)}>
        <button type="button" onClick={() => setIsExpanded(false)} aria-label="Fermer l'aperçu" className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white text-[#30231d]"><X aria-hidden className="size-5" /></button>
        <div className="relative h-[85dvh] w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
          <SafeImage src={active} alt={alt} fill sizes="100vw" className="object-contain" />
          {images.length > 1 && <>
            <button type="button" onClick={showPrevious} aria-label="Photo précédente" className="absolute left-0 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#30231d]"><ChevronLeft aria-hidden /></button>
            <button type="button" onClick={showNext} aria-label="Photo suivante" className="absolute right-0 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#30231d]"><ChevronRight aria-hidden /></button>
          </>}
        </div>
      </div>}
    </div>
  );
}
