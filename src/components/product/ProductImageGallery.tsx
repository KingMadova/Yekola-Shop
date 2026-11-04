"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, ImageOff, X } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

interface ProductImageGalleryProps {
  images: readonly string[];
  alt: string;
  bestseller?: boolean;
}

export function ProductImageGallery({ images, alt, bestseller = false }: ProductImageGalleryProps) {
  const galleryImages = images.filter((src) => typeof src === "string" && src.trim().length > 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const thumbnailRail = useRef<HTMLDivElement>(null);
  const active = galleryImages[activeIndex];

  useEffect(() => {
    if (isExpanded || galleryImages.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % galleryImages.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [galleryImages.length, isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsExpanded(false);
      if (event.key === "ArrowRight") setActiveIndex((current) => (current + 1) % galleryImages.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, galleryImages.length]);

  useEffect(() => {
    const activeThumbnail = thumbnailRail.current?.querySelector<HTMLButtonElement>(`[data-image-index="${activeIndex}"]`);
    activeThumbnail?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % galleryImages.length);
  }

  if (!active) {
    return (
      <div role="img" aria-label={`Photo de ${alt} bientôt disponible`} className="flex h-[clamp(220px,65vw,320px)] min-w-0 items-center justify-center rounded-3xl border border-dashed border-[#f2d7c2] bg-[#fff5e9] text-[#c1440e] lg:aspect-[4/5] lg:h-auto">
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <ImageOff aria-hidden className="size-10" />
          <span className="text-xs font-medium">Photos bientôt disponibles</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative h-[clamp(220px,65vw,320px)] min-h-0 w-full overflow-hidden rounded-3xl border border-[#f2d7c2] bg-[#fff9f3] sm:h-[360px] lg:aspect-[4/5] lg:h-auto">
        <SafeImage key={active} src={active} alt={alt} fill priority={activeIndex === 0} sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw" className="object-contain p-3" />
        {bestseller && <span className="absolute left-3 top-3 z-10 rounded-full bg-[#f6e5c8] px-3 py-1.5 text-xs font-bold text-[#68451d] shadow-sm">Bestseller</span>}
        <button type="button" onClick={() => setIsExpanded(true)} aria-label="Agrandir la photo du produit" className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-[#eadfd3] bg-white/95 text-[#30231d] shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e]">
          <Expand aria-hidden className="size-4" />
        </button>
        {galleryImages.length > 1 && <>
          <button type="button" onClick={showPrevious} aria-label="Photo précédente" className="absolute left-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#30231d] shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-[#c1440e]"><ChevronLeft aria-hidden className="size-5" /></button>
          <button type="button" onClick={showNext} aria-label="Photo suivante" className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#30231d] shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-[#c1440e]"><ChevronRight aria-hidden className="size-5" /></button>
        </>}
      </div>

      <div ref={thumbnailRail} role="group" aria-label="Vignettes des photos du produit" data-testid="product-thumbnails" className="flex w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin]">
        {galleryImages.map((src, index) => (
          <button key={`${src}-${index}`} data-image-index={index} type="button" onClick={() => setActiveIndex(index)} aria-label={`Afficher la photo ${index + 1} sur ${galleryImages.length}`} aria-current={index === activeIndex ? "true" : undefined} className={`relative size-16 shrink-0 touch-manipulation overflow-hidden rounded-xl border-2 bg-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e] sm:size-[72px] ${index === activeIndex ? "border-[#c1440e] opacity-100" : "border-[#f2d7c2] opacity-80"}`}>
            <SafeImage src={src} alt="" fill sizes="72px" className="object-contain p-1" />
          </button>
        ))}
        <span className="sticky right-0 ml-auto flex min-h-16 shrink-0 items-center bg-[#fff9f3]/95 px-2 text-xs font-semibold tabular-nums text-[#68452f] sm:min-h-[72px]" aria-live="polite">{activeIndex + 1}/{galleryImages.length}</span>
      </div>

      {isExpanded && <div role="dialog" aria-modal="true" aria-label={`Aperçu de ${alt}`} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1714]/95 p-4" onClick={() => setIsExpanded(false)}>
        <button type="button" onClick={() => setIsExpanded(false)} aria-label="Fermer l'aperçu" className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white text-[#30231d]"><X aria-hidden className="size-5" /></button>
        <div className="relative h-[85dvh] w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
          <SafeImage src={active} alt={alt} fill sizes="100vw" className="object-contain" />
          {galleryImages.length > 1 && <>
            <button type="button" onClick={showPrevious} aria-label="Photo précédente" className="absolute left-0 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#30231d]"><ChevronLeft aria-hidden /></button>
            <button type="button" onClick={showNext} aria-label="Photo suivante" className="absolute right-0 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#30231d]"><ChevronRight aria-hidden /></button>
          </>}
        </div>
      </div>}
    </div>
  );
}
