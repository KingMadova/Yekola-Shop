import { ShieldCheck, Smartphone, Truck } from "lucide-react";
import { COPY, DISTRIBUTOR_MENTION, VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { ProductAccordion } from "./ProductAccordion";
import { ProductActions } from "./ProductActions";
import { ProductImageGallery } from "./ProductImageGallery";

export function ProductDetail({ product }: { product: Product }) {
  const vipImmediate = product.pricePublic >= VIP_THRESHOLD;
  return (
    <article className="mx-auto grid max-w-6xl gap-6 px-4 py-5 sm:py-8 lg:grid-cols-2 lg:gap-12">
      <ProductImageGallery key={product.slug} images={product.images} alt={product.name} />
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[#c1440e]">{product.category} · Réf. {product.code}</p>
          <h1 className="text-2xl font-extrabold text-[#30231d] sm:text-3xl">{product.name}</h1>
          <p className="max-w-prose text-sm leading-relaxed text-[#71645d] sm:text-base">{product.shortDesc || "Besoin d'informations sur ce produit ? Échangez avec un conseiller avant de choisir."}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border border-[#f2d7c2] bg-[#fff5e9] p-4">
          {vipImmediate ? <>
            <p className="flex flex-wrap items-baseline gap-x-3"><span className="text-3xl font-extrabold text-[#a9360b]">{formatFCFA(product.priceVip)}</span><span className="text-sm font-medium text-[#57301f]">Prix client privilégié</span></p>
            <p className="text-sm text-[#71645d]">Prix public : <s>{formatFCFA(product.compareAtPrice ?? product.pricePublic)}</s></p>
            <p className="w-fit rounded-full bg-[#ffe3c6] px-3 py-1.5 text-sm font-semibold text-[#9b310d]">{COPY.vipBadge}</p>
          </> : <>
            <p className="flex flex-wrap items-baseline gap-x-3"><span className="text-3xl font-extrabold text-[#30231d]">{formatFCFA(product.pricePublic)}</span><span className="text-sm font-medium text-[#57301f]">{product.compareAtPrice ? "Prix promo" : "Prix public"}</span>
              {product.compareAtPrice && <><s className="text-base text-[#89796e]">{formatFCFA(product.compareAtPrice)}</s><span className="rounded-full bg-[#c1440e] px-2.5 py-1 text-xs font-bold text-white">{product.promoBadge}</span></>}
            </p>
            <p className="text-sm text-[#a9360b]"><strong>{formatFCFA(product.priceVip)}</strong> au tarif client privilégié, dès {formatFCFA(VIP_THRESHOLD)} d&apos;achats</p>
          </>}
        </div>
        {product.packItems && <div className="rounded-2xl border border-[#f2d7c2] bg-white p-4"><p className="font-semibold text-[#30231d]">Ce pack contient</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#57301f]">{product.packItems.map((item)=><li key={item.code}>{item.quantity} × {item.name}</li>)}</ul></div>}
        <ProductAccordion product={product} />
        <ProductActions product={product} />
        <ul className="grid gap-3 text-sm text-[#57301f] sm:grid-cols-3">
          <li className="flex items-start gap-2"><ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-[#c1440e]" />Conseils personnalisés pour choisir votre produit</li>
          <li className="flex items-start gap-2"><Smartphone aria-hidden className="mt-0.5 size-5 shrink-0 text-[#c1440e]" />{COPY.paymentTrust.title} : {COPY.paymentTrust.detail}</li>
          <li className="flex items-start gap-2"><Truck aria-hidden className="mt-0.5 size-5 shrink-0 text-[#c1440e]" />Livraison sous 24 h à Brazzaville et Pointe-Noire</li>
        </ul>
        <p className="text-xs text-[#71645d]">{DISTRIBUTOR_MENTION}</p>
      </div>
    </article>
  );
}
