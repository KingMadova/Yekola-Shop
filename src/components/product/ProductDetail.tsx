import { BadgeCheck, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { COPY, DISTRIBUTOR_MENTION, VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { ProductAccordion } from "./ProductAccordion";
import { ProductActions } from "./ProductActions";
import { ProductImageGallery } from "./ProductImageGallery";

export function ProductDetail({ product }: { product: Product }) {
  const vipImmediate = product.pricePublic >= VIP_THRESHOLD;

  return (
    <article className="mx-auto grid min-w-0 max-w-7xl items-start gap-3 px-4 py-2 sm:gap-10 sm:py-8 lg:grid-cols-2 lg:gap-12 lg:px-6">
      <ProductImageGallery key={product.slug} images={product.images} alt={product.name} bestseller={product.isBestSeller} />

      <div className="flex min-w-0 flex-col gap-2.5 sm:gap-6">
        <header className="flex min-w-0 flex-col gap-1 sm:gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a6a43] sm:text-[11px]">{product.category} <span className="px-1 text-[#d7a47b]">/</span> Réf. {product.code}</p>
          <h1 className="break-words font-serif text-[clamp(1.3rem,5vw,1.6rem)] font-bold leading-tight tracking-tight text-[#30231d] sm:text-4xl">{product.name}</h1>
        </header>

        {product.shortDesc && <section aria-labelledby="product-description-title" className="flex flex-col gap-1">
          <h2 id="product-description-title" className="text-xs font-bold uppercase tracking-[0.12em] text-[#9a5430]">Description</h2>
          <p className="max-w-prose text-xs leading-relaxed text-[#71645d] sm:text-base">{product.shortDesc}</p>
        </section>}

        <section aria-label="Prix du produit" className="flex flex-col gap-1 border-y border-[#f0dfd0] py-2.5 sm:gap-2 sm:py-4">
          {vipImmediate ? <>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-[1.4rem] font-extrabold tracking-tight text-[#a9360b] sm:text-4xl">{formatFCFA(product.priceVip)}</p>
              <span className="text-sm font-medium text-[#68452f]">Prix client privilégié</span>
            </div>
            <p className="text-xs text-[#71645d] sm:text-sm">Prix public : <s>{formatFCFA(product.compareAtPrice ?? product.pricePublic)}</s></p>
            <p className="w-fit rounded-full bg-[#fff0df] px-3 py-1 text-[11px] font-semibold text-[#9b310d] sm:py-1.5 sm:text-xs">{COPY.vipBadge}</p>
          </> : <>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-[1.4rem] font-extrabold tracking-tight text-[#30231d] sm:text-4xl">{formatFCFA(product.pricePublic)}</p>
              <span className="text-xs font-medium text-[#68452f] sm:text-sm">{product.compareAtPrice ? "Prix promotionnel" : "Prix public"}</span>
              {product.compareAtPrice && <s className="text-xs text-[#89796e] sm:text-sm">{formatFCFA(product.compareAtPrice)}</s>}
              {product.compareAtPrice && product.promoBadge && <span className="rounded-full bg-[#c1440e] px-2.5 py-1 text-xs font-bold text-white">{product.promoBadge}</span>}
            </div>
            <p className="text-xs text-[#9a5430] sm:text-sm"><strong>{formatFCFA(product.priceVip)}</strong> au tarif client privilégié, dès {formatFCFA(VIP_THRESHOLD)} d&apos;achats</p>
          </>}
        </section>

        {product.benefits.length > 0 && <section aria-label="Points forts du produit" className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          {product.benefits.slice(0, 3).map((benefit) => <div key={benefit} className="flex items-start gap-2 rounded-xl bg-[#fff8f0] p-3 text-xs leading-relaxed text-[#68452f] sm:flex-col sm:gap-2 sm:border sm:border-[#f2e3d5]">
            <BadgeCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-[#c1440e] sm:size-5" />
            <span>{benefit}</span>
          </div>)}
        </section>}

        {product.packItems && <section className="rounded-2xl border border-[#f2d7c2] bg-white p-4">
          <h2 className="font-semibold text-[#30231d]">Composition du pack</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#68452f]">{product.packItems.map((item) => <li key={item.code}>{item.quantity} × {item.name}</li>)}</ul>
        </section>}

        <ProductAccordion product={product} />
        <ProductActions product={product} />

        <ul className="grid grid-cols-1 gap-3 border-t border-[#f0dfd0] pt-4 text-xs leading-relaxed text-[#68452f] sm:grid-cols-3">
          <li className="flex items-center gap-2"><ShieldCheck aria-hidden className="size-5 shrink-0 text-[#c1440e]" />Conseils personnalisés</li>
          <li className="flex items-center gap-2"><Smartphone aria-hidden className="size-5 shrink-0 text-[#c1440e]" />{COPY.paymentTrust.title}</li>
          <li className="flex items-center gap-2"><Truck aria-hidden className="size-5 shrink-0 text-[#c1440e]" />Livraison selon votre zone</li>
        </ul>
        <p className="text-xs text-[#8a7668]">{DISTRIBUTOR_MENTION}</p>
      </div>
    </article>
  );
}
