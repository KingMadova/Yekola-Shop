import { ArrowRight, MessageCircle } from "lucide-react";
import { ShopWhatsAppLink } from "@/components/providers/ShopContext";
import { btn, container } from "@/components/ui/styles";
import { VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";

export function DualConversion() {
  return <section className={`${container} grid gap-3 py-6 sm:grid-cols-2 sm:gap-4 sm:py-10`}>
    <div className="flex flex-col items-start gap-3 rounded-3xl bg-gradient-to-br from-[#f9a825] to-[#c1440e] p-5 text-white sm:p-7">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/95">Avantage client</p>
      <h2 className="text-xl font-extrabold leading-tight sm:text-2xl">Les prix client privilégié dès {formatFCFA(VIP_THRESHOLD)}</h2>
      <p className="text-sm leading-relaxed text-white/95">À partir de ce montant, les tarifs client privilégié de la grille officielle s'appliquent automatiquement à votre commande.</p>
      <ShopWhatsAppLink kind="vip" className={`${btn} mt-1 min-h-11 bg-[#fff9f3] text-sm text-[#a9360b] hover:bg-white`}>En savoir plus <ArrowRight aria-hidden className="size-4" /></ShopWhatsAppLink>
    </div>
    <div className="flex flex-col items-start gap-3 rounded-3xl border border-[#f2d7c2] bg-[#fff0df] p-5 text-[#57301f] sm:p-7">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#c1440e]">Projet professionnel</p>
      <h2 className="text-xl font-extrabold leading-tight sm:text-2xl">Envie de développer votre activité ?</h2>
      <p className="text-sm leading-relaxed text-[#71645d]">Découvrez le fonctionnement de l’activité de distributeur indépendant et l’accompagnement proposé.</p>
      <ShopWhatsAppLink kind="distributor" className={`${btn} mt-1 min-h-11 bg-[#c1440e] text-sm text-white hover:bg-[#a9360b]`}>Échanger sur WhatsApp <MessageCircle aria-hidden className="size-4" /></ShopWhatsAppLink>
    </div>
  </section>;
}
