import Link from "next/link";
import { ArrowRight, MessageCircle, PackageCheck } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { btn, container } from "@/components/ui/styles";
import { getCatalog } from "@/lib/data/catalog";
import { COPY, DISTRIBUTOR_MENTION, VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";
import { buildAdviceMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export async function Hero() {
  const products = await getCatalog();
  const featured = products.find((product) => product.isPackSolution && product.isBestSeller) ?? products[0];
  const photo = featured?.images[0];
  const vipImmediate = featured ? featured.pricePublic >= VIP_THRESHOLD : false;

  return (
    <section className="relative isolate overflow-hidden bg-[#173f35] text-white">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full border border-white/10 sm:size-96" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-[#c5a15a]/10 blur-3xl" />
      <div className={`${container} relative grid gap-4 py-5 sm:gap-6 sm:py-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-14`}>
        <div className="flex flex-col items-start gap-2.5 sm:gap-4">
          <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e4d2a8] sm:text-xs">
            <span className="size-1.5 rounded-full bg-[#d7b96f]" />
            {COPY.heroEyebrow}
          </p>
          <h1 className="max-w-[17ch] text-[clamp(1.85rem,7.1vw,2.65rem)] font-semibold leading-[1.06] tracking-[-0.045em] sm:text-5xl sm:leading-[1.04] lg:text-[3.5rem]">
            {COPY.heroTitle}
          </h1>
          <p className="max-w-xl text-[13px] leading-relaxed text-[#e0e9e2] sm:text-base">
            {COPY.heroSubtitle}
          </p>
          <div className="flex w-full flex-wrap gap-2 pt-1 sm:w-auto sm:gap-3">
            <Link href="/catalogue" className={`${btn} min-h-11 flex-1 bg-[#f7f6f0] px-4 text-sm text-[#173f35] hover:bg-white sm:flex-none sm:px-6`}>
              {COPY.heroPrimaryCta}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <a
              href={buildWhatsAppUrl(buildAdviceMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} min-h-11 flex-1 border border-white/35 px-3 text-sm text-white hover:bg-white/10 sm:flex-none sm:px-5`}
            >
              <MessageCircle aria-hidden className="size-4" />
              {COPY.heroSecondaryCta}
            </a>
          </div>
          <p className="text-[10px] leading-snug text-[#d4e0d7] sm:text-xs">{DISTRIBUTOR_MENTION}</p>
        </div>

        {featured && (
          <Link
            href={`/produit/${featured.slug}`}
            className="group flex min-h-[104px] items-center gap-3 rounded-2xl border border-white/15 bg-[#f8f7f1] p-3 text-[#1d2923] shadow-[0_16px_45px_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-0.5 sm:gap-5 sm:p-5 lg:min-h-52"
          >
            <div className="relative size-[88px] shrink-0 overflow-hidden rounded-xl bg-[#e9eee5] sm:size-36 lg:size-44">
              {photo ? (
                <SafeImage src={photo} alt="" fill sizes="(min-width: 1024px) 176px, 88px" className="object-cover" />
              ) : (
                <PackageCheck aria-hidden className="absolute inset-0 m-auto size-8 text-[#54745e]" />
              )}
            </div>
            <div className="flex min-w-0 flex-col justify-center gap-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b713e] sm:text-xs">À découvrir</p>
              <p className="text-base font-bold leading-tight tracking-tight group-hover:underline sm:text-xl">{featured.name}</p>
              <p className="line-clamp-2 text-xs leading-snug text-[#66736b] sm:text-sm">{featured.shortDesc}</p>
              <p className="mt-1 text-base font-bold text-[#173f35] sm:text-lg">
                {formatFCFA(vipImmediate ? featured.priceVip : featured.pricePublic)}
                {vipImmediate && <span className="ml-1.5 text-[10px] font-semibold text-[#8b713e] sm:text-xs">prix VIP</span>}
              </p>
            </div>
          </Link>
        )}
        <p className="text-center text-[10px] text-[#c9d8ce] sm:text-left sm:text-xs lg:col-span-2">
          {COPY.heroReassurance}
        </p>
      </div>
    </section>
  );
}
