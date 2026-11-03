import { ImageOff } from "lucide-react";
import { ShopLink } from "@/components/providers/ShopContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { card, focusRing } from "@/components/ui/styles";
import { COPY, VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

interface ProductCardProps { product: Product; highlightVip?: boolean; }

export function ProductCard({ product, highlightVip = false }: ProductCardProps) {
  const vipImmediate = product.pricePublic >= VIP_THRESHOLD;
  const photo = product.images[0];
  return (
    <li className={`${card} flex min-w-0 flex-col gap-2.5 p-2.5 sm:gap-3 sm:p-3`}>
      <ShopLink href={`/produit/${product.slug}`} className={`group flex flex-col gap-2.5 rounded-xl ${focusRing}`}>
        <div className="relative aspect-[4/4.4] overflow-hidden rounded-xl bg-[#fff0df] sm:aspect-square">
          {photo ? <SafeImage src={photo} alt="" fill sizes="(min-width: 1024px) 280px, 50vw" className="object-contain p-1" /> : <ImageOff aria-hidden className="absolute inset-0 m-auto size-7 text-[#d77a37]" />}
          {product.isBestSeller && <span className="absolute left-2 top-2 rounded-full bg-[#fff0df] px-2 py-1 text-[10px] font-semibold text-[#9b310d]">Populaire</span>}
          {product.promoBadge && <span className="absolute right-2 top-2 rounded-full bg-[#c1440e] px-2 py-1 text-[10px] font-bold text-white">{product.promoBadge}</span>}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-[#89796e] sm:text-xs">{product.category}</p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#30231d] group-hover:underline sm:text-base">{product.name}</h3>
        </div>
      </ShopLink>
      {highlightVip && vipImmediate && <p className="w-fit rounded-full bg-[#fff0df] px-2 py-1 text-[9px] font-semibold leading-snug text-[#9b310d] sm:text-[10px]">{COPY.vipBadge}</p>}
      <div className="mt-auto flex flex-col items-start gap-2 pt-1">
        {vipImmediate ? <div><p className="text-base font-bold text-[#a9360b] sm:text-lg">{formatFCFA(product.priceVip)}</p><p className="text-[10px] text-[#89796e] sm:text-xs">Prix client privilégié · au lieu de <s>{formatFCFA(product.compareAtPrice ?? product.pricePublic)}</s></p></div> :
          <div><p className="text-base font-bold text-[#30231d] sm:text-lg">{formatFCFA(product.pricePublic)}{product.compareAtPrice && <s className="ml-1.5 text-xs font-normal text-[#89796e]">{formatFCFA(product.compareAtPrice)}</s>}</p><p className="text-[10px] text-[#89796e] sm:text-xs">Prix privilégié : {formatFCFA(product.priceVip)} dès {formatFCFA(VIP_THRESHOLD)} d&apos;achats</p></div>}
        <div className="w-full"><AddToCartButton product={product} /></div>
      </div>
    </li>
  );
}
