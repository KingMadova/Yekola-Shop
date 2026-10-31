import { SafeImage } from "@/components/ui/SafeImage";
import { card, container } from "@/components/ui/styles";
import { TESTIMONIALS } from "@/data/testimonials";

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className={`${container} py-12`}>
      <h2 className="text-2xl font-bold text-gray-900">Ils ont reçu leur commande</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <li key={item.image} className={`${card} flex flex-col gap-3 p-4`}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-emerald-50">
              <SafeImage src={item.image} alt={`Capture WhatsApp d'un message de ${item.name}`} fill sizes="(min-width: 1024px) 360px, 100vw" className="object-cover" />
            </div>
            <p className="text-sm text-gray-800">
              <strong>{item.name}</strong>, {item.city}
              {item.caption && <span className="block">{item.caption}</span>}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
