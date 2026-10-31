import Link from "next/link";
import { ImageOff } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { btn, container } from "@/components/ui/styles";
import { PRODUCTS } from "@/data/products";
import { COPY, DISTRIBUTOR_MENTION, VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";
import { buildAdviceMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export function Hero() {
  const featured = PRODUCTS.find((product) => product.isPackSolution && product.isBestSeller) ?? PRODUCTS[0];
  const photo = featured?.images[0];
  const vipImmediate = featured ? featured.pricePublic >= VIP_THRESHOLD : false;

  return (
    <section className="bg-emerald-950 text-white">
      <div className={`${container} grid gap-8 py-12 lg:grid-cols-2 lg:items-center lg:py-16`}>
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Le bien-être naturel, livré chez vous en 24 h
          </h1>
          <p className="max-w-lg text-lg text-emerald-100">{COPY.heroSubtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalogue" className={`${btn} bg-white text-emerald-950 hover:bg-emerald-50`}>
              Voir le catalogue
            </Link>
            <a
              href={buildWhatsAppUrl(buildAdviceMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} border border-white/60 text-white hover:bg-white/10`}
            >
              Commander sur WhatsApp
            </a>
          </div>
          <p className="text-sm text-emerald-200">{DISTRIBUTOR_MENTION}</p>
        </div>

        {featured && (
          <Link
            href={`/produit/${featured.slug}`}
            className="group flex gap-4 rounded-2xl bg-white p-4 text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <div className="relative size-32 shrink-0 overflow-hidden rounded-xl bg-emerald-50 sm:size-40">
              {photo ? (
                <SafeImage src={photo} alt="" fill sizes="160px" className="object-cover" />
              ) : (
                <ImageOff aria-hidden className="absolute inset-0 m-auto size-8 text-emerald-800" />
              )}
            </div>
            <div className="flex flex-col justify-center gap-1">
              <p className="text-sm font-medium text-emerald-800">Pack du moment</p>
              <p className="text-xl font-bold group-hover:underline">{featured.name}</p>
              <p className="text-sm text-gray-800">{featured.shortDesc}</p>
              <p className="mt-1 text-lg font-bold text-emerald-800">
                {formatFCFA(vipImmediate ? featured.priceVip : featured.pricePublic)}
                {vipImmediate && <span className="ml-2 text-sm font-medium text-gray-700">prix VIP</span>}
              </p>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
