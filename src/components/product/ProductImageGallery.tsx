"use client";

import { ImageOff } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: readonly string[];
  /** Nom du produit, utilisé comme texte alternatif. */
  alt: string;
}

/** Grande photo active + miniatures cliquables. Monter avec `key={product.slug}` pour repartir de la 1re photo. */
export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  if (!active) {
    return (
      <div
        role="img"
        aria-label={`Photo de ${alt} bientôt disponible`}
        className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-emerald-600 bg-emerald-50 text-emerald-800"
      >
        <ImageOff aria-hidden className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <SafeImage
          key={active}
          src={active}
          alt={alt}
          fill
          priority={activeIndex === 0}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <ul aria-label="Photos du produit" className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Voir la photo ${index + 1} sur ${images.length}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`relative block size-20 overflow-hidden rounded-xl border-2 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                  index === activeIndex
                    ? "border-emerald-600"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <SafeImage src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
