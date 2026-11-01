import { ImageOff } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { card, focusRing } from "@/components/ui/styles";
import { COPY, VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
  highlightVip?: boolean;
}

export function ProductCard({ product, highlightVip = false }: ProductCardProps) {
  const vipImmediate = product.pricePublic >= VIP_THRESHOLD;
  const photo = product.images[0];

  return (
    <li className={`${card} flex min-w-0 flex-col gap-2.5 border-[#e9e5d9] bg-white p-2.5 sm:gap-3 sm:p-3`}>
      <Link href={`/produit/${product.slug}`} className={`group flex flex-col gap-2.5 rounded-xl ${focusRing}`}>
        <div className="relative aspect-[4/4.4] overflow-hidden rounded-xl bg-[#edf1e9] sm:aspect-square">
          {photo ? (
            <SafeImage src={photo} alt="" fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover" />
          ) : (
            <ImageOff aria-hidden className="absolute inset-0 m-auto size-7 text-[#52715c]" />
          )}
          {product.isBestSeller && (
            <span className="absolute left-2 top-2 rounded-full bg-[#f0eadb] px-2 py-1 text-[10px] font-semibold text-[#705a2f]">
              Populaire
            </span>
          )}
          {product.promoBadge && (
            <span className="absolute right-2 top-2 rounded-full bg-[#8a6330] px-2 py-1 text-[10px] font-bold text-white">
              {product.promoBadge}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-[#7b857c] sm:text-xs">{product.category}</p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#26392e] group-hover:underline sm:text-base">{product.name}</h3>
        </div>
      </Link>

      {highlightVip && vipImmediate && (
        <p className="w-fit rounded-full bg-[#f4efdf] px-2 py-1 text-[9px] font-semibold leading-snug text-[#705a2f] sm:text-[10px]">{COPY.vipBadge}</p>
      )}

      <div className="mt-auto flex flex-col items-start gap-2 pt-1">
        {vipImmediate ? (
          <div>
            <p className="text-base font-bold text-[#173f35] sm:text-lg">{formatFCFA(product.priceVip)}</p>
            <p className="text-[10px] text-[#778178] sm:text-xs">
              Prix VIP · au lieu de <s>{formatFCFA(product.compareAtPrice ?? product.pricePublic)}</s>
            </p>
          </div>
        ) : (
          <div>
            <p className="text-base font-bold text-[#26392e] sm:text-lg">
              {formatFCFA(product.pricePublic)}
              {product.compareAtPrice && (
                <s className="ml-1.5 text-xs font-normal text-[#778178]">{formatFCFA(product.compareAtPrice)}</s>
              )}
            </p>
            <p className="text-[10px] text-[#778178] sm:text-xs">
              VIP : {formatFCFA(product.priceVip)} dès {formatFCFA(VIP_THRESHOLD)} d&apos;achats
            </p>
          </div>
        )}
        <div className="w-full">
          <AddToCartButton product={product} />
        </div>
      </div>
    </li>
  );
}
