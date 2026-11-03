import { ShieldCheck, Smartphone, Store, Truck } from "lucide-react";
import { card, container } from "@/components/ui/styles";
import { COPY } from "@/lib/config";

const ITEMS = [
  { icon: ShieldCheck, title: "Une sélection à découvrir", detail: "Produits de la gamme Forever Living" },
  { icon: Smartphone, title: COPY.paymentTrust.title, detail: COPY.paymentTrust.detail },
  { icon: Truck, title: "Livraison selon votre zone", detail: "24 h à Brazzaville et Pointe-Noire ; agences en province" },
  { icon: Store, title: "Retrait sur rendez-vous", detail: "Une solution à convenir avec votre conseiller" },
] as const;

export function TrustBand() {
  return <section aria-label="Informations pratiques" className={`${container} pt-3 sm:pt-6`}>
    <ul className={`${card} grid grid-cols-4 items-center gap-2 border-[#f2d7c2] bg-white p-2 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-4`}>
      {ITEMS.map(({ icon: Icon, title, detail }) => <li key={title} className="flex min-w-0 items-center justify-center gap-2.5 sm:justify-start">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fff0df] sm:size-9"><Icon aria-hidden className="size-[19px] text-[#c1440e]" /></span>
        <p className="sr-only text-[10px] leading-relaxed sm:not-sr-only sm:text-sm"><strong className="block text-[#30231d]">{title}</strong><span className="text-[#71645d]">{detail}</span></p>
      </li>)}
    </ul>
  </section>;
}
