import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import type { Product } from "@/lib/types";

interface Section {
  title: string;
  body: ReactNode;
}

/** Accordéon natif accessible, sans JavaScript ; seules les informations renseignées sont affichées. */
export function ProductAccordion({ product }: { product: Product }) {
  const sections: Section[] = [];

  if (product.duration) sections.push({ title: "Durée de la cure", body: <p>{product.duration}</p> });
  if (product.usageAdvice) sections.push({ title: "Conseils d'utilisation", body: <p>{product.usageAdvice}</p> });
  if (product.benefits.length > 0) {
    sections.push({
      title: "Détails des bienfaits",
      body: <ul className="list-disc space-y-1 pl-5">{product.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>,
    });
  }

  if (sections.length === 0) return null;

  return (
    <div className="divide-y divide-[#f0dfd0] rounded-2xl border border-[#f2d7c2] bg-[#fff9f3]">
      {sections.map((section, index) => (
        <details key={section.title} open={index === 0} className="group px-4">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 font-semibold text-[#68452f] focus-visible:outline-2 focus-visible:outline-[#c1440e] [&::-webkit-details-marker]:hidden">
            {section.title}
            <ChevronDown aria-hidden className="size-5 shrink-0 text-[#a36c4d] transition-transform group-open:rotate-180 motion-reduce:transition-none" />
          </summary>
          <div className="pb-4 text-sm leading-relaxed text-[#71645d]">{section.body}</div>
        </details>
      ))}
    </div>
  );
}
