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
  return (
    <section aria-label="Informations pratiques" className={`${container} pt-5 sm:pt-8`}>
      <ul className={`${card} grid gap-3 border-[#e9e5d9] bg-white p-4 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-4`}>
        {ITEMS.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#edf1e9]">
              <Icon aria-hidden className="size-[18px] text-[#315d47]" />
            </span>
            <p className="text-xs leading-relaxed sm:text-sm">
              <strong className="block text-[#24382d]">{title}</strong>
              <span className="text-[#68756c]">{detail}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
