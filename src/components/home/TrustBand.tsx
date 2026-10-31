import { ShieldCheck, Smartphone, Store, Truck } from "lucide-react";
import { card, container } from "@/components/ui/styles";
import { COPY } from "@/lib/config";

const ITEMS = [
  { icon: ShieldCheck, title: "Produits 100 % originaux", detail: "Scellés, avec label IASC" },
  { icon: Smartphone, title: COPY.paymentTrust.title, detail: COPY.paymentTrust.detail },
  { icon: Truck, title: "Livraison sous 24 h", detail: "Brazzaville et Pointe-Noire. Province par agences de transport" },
  { icon: Store, title: "Retrait physique", detail: "Possible sur rendez-vous" },
] as const;

export function TrustBand() {
  return (
    <section aria-label="Nos garanties" className={`${container} -mt-6`}>
      <ul className={`${card} grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4`}>
        {ITEMS.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <Icon aria-hidden className="size-5 text-emerald-700" />
            </span>
            <p className="text-sm">
              <strong className="block text-gray-900">{title}</strong>
              <span className="text-gray-800">{detail}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
