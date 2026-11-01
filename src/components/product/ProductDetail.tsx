import { ShieldCheck, Smartphone, Truck } from "lucide-react";
import { COPY, DISTRIBUTOR_MENTION, VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { ProductAccordion } from "./ProductAccordion";
import { ProductActions } from "./ProductActions";
import { ProductImageGallery } from "./ProductImageGallery";

/** Fiche produit complète : galerie, prix public / VIP, accordéon, double bouton d'achat, réassurance. */
export function ProductDetail({ product }: { product: Product }) {
  // Un produit ou un pack déjà au-dessus du palier déclenche la tarif client privilégié dès le premier exemplaire.
  const vipImmediate = product.pricePublic >= VIP_THRESHOLD;

  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-12">
      <ProductImageGallery key={product.slug} images={product.images} alt={product.name} />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-emerald-800">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="max-w-prose text-gray-800">{product.shortDesc || "Besoin d'informations sur ce produit ? Échangez avec un conseiller avant de choisir."}</p>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4">
          {vipImmediate ? (
            <>
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-3xl font-bold text-emerald-800">{formatFCFA(product.priceVip)}</span>
                <span className="text-sm font-medium text-gray-800">Prix client privilégié</span>
              </p>
              <p className="text-sm text-gray-700">
                Prix public : <s>{formatFCFA(product.compareAtPrice ?? product.pricePublic)}</s>
              </p>
              <p className="w-fit rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-900">
                {COPY.vipBadge}
              </p>
            </>
          ) : (
            <>
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-3xl font-bold text-gray-900">{formatFCFA(product.pricePublic)}</span>
                <span className="text-sm font-medium text-gray-800">{product.compareAtPrice ? "Prix promo" : "Prix public"}</span>
                {product.compareAtPrice && (
                  <>
                    <s className="text-base text-gray-700">{formatFCFA(product.compareAtPrice)}</s>
                    <span className="rounded-full bg-amber-700 px-2.5 py-1 text-xs font-bold text-white">{product.promoBadge}</span>
                  </>
                )}
              </p>
              <p className="text-sm text-emerald-800">
                <strong>{formatFCFA(product.priceVip)}</strong> au tarif client privilégié, dès {formatFCFA(VIP_THRESHOLD)} d&apos;achats
              </p>
            </>
          )}
        </div>

        {product.packItems && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="font-semibold text-gray-900">Ce pack contient</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-800">
              {product.packItems.map((item) => (
                <li key={item.code}>
                  {item.quantity} × {item.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ProductAccordion product={product} />
        <ProductActions product={product} />

        <ul className="grid gap-3 text-sm text-gray-800 sm:grid-cols-3">
          <li className="flex items-start gap-2">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-700" />
            Conseils personnalisés pour choisir votre produit
          </li>
          <li className="flex items-start gap-2">
            <Smartphone aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-700" />
            {COPY.paymentTrust.title} : {COPY.paymentTrust.detail}
          </li>
          <li className="flex items-start gap-2">
            <Truck aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-700" />
            Livraison sous 24 h à Brazzaville et Pointe-Noire
          </li>
        </ul>

        <p className="text-xs text-gray-700">{DISTRIBUTOR_MENTION}</p>
      </div>
    </article>
  );
}
