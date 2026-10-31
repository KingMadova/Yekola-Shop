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
  /** Affiche le badge « ce pack active votre remise VIP » (section des packs). */
  highlightVip?: boolean;
}

export function ProductCard({ product, highlightVip = false }: ProductCardProps) {
  const vipImmediate = product.pricePublic >= VIP_THRESHOLD;
  const photo = product.images[0];

  return (
    <li className={`${card} flex flex-col gap-3 p-3`}>
      <Link href={`/produit/${product.slug}`} className={`group flex flex-col gap-3 rounded-xl ${focusRing}`}>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-emerald-50">
          {photo ? (
            <SafeImage src={photo} alt="" fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover" />
          ) : (
            <ImageOff aria-hidden className="absolute inset-0 m-auto size-8 text-emerald-800" />
          )}
          {product.isBestSeller && (
            <span className="absolute left-2 top-2 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
              Meilleure vente
            </span>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-700">{product.category}</p>
          <h3 className="font-semibold text-gray-900 group-hover:underline">{product.name}</h3>
        </div>
      </Link>

      {highlightVip && vipImmediate && (
        <p className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">{COPY.vipBadge}</p>
      )}

      <div className="mt-auto flex items-end justify-between gap-2">
        {vipImmediate ? (
          <div>
            <p className="text-lg font-bold text-emerald-800">{formatFCFA(product.priceVip)}</p>
            <p className="text-xs text-gray-700">
              Prix VIP au lieu de <s>{formatFCFA(product.pricePublic)}</s>
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-bold text-gray-900">{formatFCFA(product.pricePublic)}</p>
            <p className="text-xs text-gray-700">
              VIP : {formatFCFA(product.priceVip)} dès {formatFCFA(VIP_THRESHOLD)} d&apos;achats
            </p>
          </div>
        )}
        <AddToCartButton product={product} />
      </div>
    </li>
  );
}
