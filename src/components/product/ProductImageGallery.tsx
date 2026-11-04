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
  // Une galerie est limitée à cinq photos réelles : une principale et quatre aperçus.
  const galleryImages = images
    .filter((src) => typeof src === "string" && src.trim().length > 0)
    .slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsExpanded(false);
      if (event.key === "ArrowRight") setActiveIndex((current) => (current + 1) % galleryImages.length);
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isExpanded, galleryImages.length]);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % galleryImages.length);
  }

  if (!active) {
    return (
      <div role="img" aria-label={`Photo de ${alt} bientôt disponible`} className="flex aspect-square w-full min-w-0 items-center justify-center rounded-2xl border border-dashed border-[#f2d7c2] bg-[#fff5e9] text-[#c1440e]">
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <ImageOff aria-hidden className="size-10" />
          <span className="text-xs font-medium">Photos bientôt disponibles</span>
        </div>
      </div>
    );
  }

  const thumbnails = galleryImages
    .map((src, index) => ({ src, index }))
    .filter(({ index }) => index !== activeIndex);

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_44px] items-start gap-2 sm:grid-cols-[minmax(0,1fr)_64px] sm:gap-3 lg:grid-cols-[minmax(0,1fr)_72px]">
      <div className="relative aspect-square min-w-0 overflow-hidden rounded-2xl border border-[#f2d7c2] bg-[#fff9f3] sm:rounded-3xl">
        <SafeImage key={active} src={active} alt={alt} fill priority={activeIndex === 0} sizes="(min-width: 1024px) 520px, (min-width: 640px) 70vw, calc(100vw - 84px)" className="object-contain p-2 sm:p-4" />
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          aria-label={`Agrandir la photo de ${alt}`}
          className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#c1440e] sm:rounded-3xl"
        />
        {bestseller && <span className="pointer-events-none absolute left-2 top-2 z-20 rounded-full bg-[#f6e5c8] px-2.5 py-1 text-[10px] font-bold text-[#68451d] shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-xs">Bestseller</span>}
        <span className="pointer-events-none absolute bottom-2 right-2 z-20 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-[#68452f] shadow-sm sm:bottom-3 sm:right-3 sm:text-xs">{activeIndex + 1}/{galleryImages.length}</span>
        {galleryImages.length > 1 && <>
          <button type="button" onClick={showPrevious} aria-label="Photo précédente" className="absolute left-1 top-1/2 z-30 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#30231d] shadow-sm touch-manipulation sm:left-2 sm:size-11"><ChevronLeft aria-hidden className="size-5" /></button>
          <button type="button" onClick={showNext} aria-label="Photo suivante" className="absolute right-1 top-1/2 z-30 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#30231d] shadow-sm touch-manipulation sm:right-2 sm:size-11"><ChevronRight aria-hidden className="size-5" /></button>
        </>}
        <span className="pointer-events-none absolute right-2 top-2 z-20 inline-flex size-8 items-center justify-center rounded-full border border-[#eadfd3] bg-white/95 text-[#30231d] shadow-sm sm:right-3 sm:top-3 sm:size-9"><Expand aria-hidden className="size-4" /></span>
      </div>

      <div role="group" aria-label="Quatre autres vues du produit" data-testid="product-thumbnails" className="grid min-w-0 grid-rows-4 gap-2">
        {thumbnails.map(({ src, index }) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Afficher la photo ${index + 1} sur ${galleryImages.length}`}
            className="relative aspect-square w-full min-w-0 touch-manipulation overflow-hidden rounded-xl border-2 border-[#f2d7c2] bg-white opacity-90 shadow-sm transition hover:border-[#c1440e] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e] aria-pressed:border-[#c1440e]"
            aria-pressed={false}
          >
            <SafeImage src={src} alt="" fill sizes="72px" className="object-contain p-1" />
          </button>
        ))}
        {Array.from({ length: 4 - thumbnails.length }, (_, index) => (
          <div key={`empty-${index}`} aria-hidden="true" className="aspect-square w-full rounded-xl border border-dashed border-[#f2d7c2] bg-[#fff9f3]" />
        ))}
      </div>

      {isExpanded && <div role="dialog" aria-modal="true" aria-label={`Aperçu agrandi de ${alt}`} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1714]/95 p-3 sm:p-4" onClick={() => setIsExpanded(false)}>
        <button type="button" onClick={() => setIsExpanded(false)} aria-label="Fermer l'aperçu" className="absolute right-3 top-3 z-20 inline-flex size-11 items-center justify-center rounded-full bg-white text-[#30231d] shadow-lg sm:right-4 sm:top-4"><X aria-hidden className="size-5" /></button>
        <div className="relative aspect-square w-full max-w-[min(88vw,780px)]" onClick={(event) => event.stopPropagation()}>
          <SafeImage src={active} alt={alt} fill sizes="90vw" className="object-contain" />
          {galleryImages.length > 1 && <>
            <button type="button" onClick={showPrevious} aria-label="Photo précédente" className="absolute left-0 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#30231d] shadow-lg"><ChevronLeft aria-hidden /></button>
            <button type="button" onClick={showNext} aria-label="Photo suivante" className="absolute right-0 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#30231d] shadow-lg"><ChevronRight aria-hidden /></button>
          </>}
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold tabular-nums text-[#68452f]">{activeIndex + 1} / {galleryImages.length}</span>
        </div>
      </div>}
    </div>
  );
}
