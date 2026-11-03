import { ArrowRight, MessageCircle } from "lucide-react";
import { ShopWhatsAppLink } from "@/components/providers/ShopContext";
import { btn, container } from "@/components/ui/styles";
import { VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";

export function DualConversion() {
  return (
    <section className={`${container} grid gap-3 py-9 sm:grid-cols-2 sm:gap-4 sm:py-12`}>
      <div className="flex flex-col items-start gap-3 rounded-3xl bg-[#173f35] p-5 text-white sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e4d2a8]">Avantage client</p>
        <h2 className="text-xl font-bold leading-tight sm:text-2xl">Les prix client privilégié dès {formatFCFA(VIP_THRESHOLD)}</h2>
        <p className="text-sm leading-relaxed text-[#e0e9e2]">
          À partir de ce montant, les tarifs client privilégié de la grille officielle s'appliquent automatiquement à votre commande.
        </p>
        <ShopWhatsAppLink kind="vip" className={`${btn} mt-1 min-h-11 bg-[#f7f6f0] text-sm text-[#173f35] hover:bg-white`}>
          En savoir plus <ArrowRight aria-hidden className="size-4" />
        </ShopWhatsAppLink>
      </div>
      <div className="flex flex-col items-start gap-3 rounded-3xl border border-[#e3dac4] bg-[#f0eadb] p-5 text-[#253b2f] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b713e]">Projet professionnel</p>
        <h2 className="text-xl font-bold leading-tight sm:text-2xl">Envie de développer votre activité ?</h2>
        <p className="text-sm leading-relaxed text-[#59685d]">
          Découvrez le fonctionnement de l’activité de distributeur indépendant et l’accompagnement proposé.
        </p>
        <ShopWhatsAppLink kind="distributor" className={`${btn} mt-1 min-h-11 bg-[#173f35] text-sm text-white hover:bg-[#10352d]`}>
          Échanger sur WhatsApp <MessageCircle aria-hidden className="size-4" />
        </ShopWhatsAppLink>
      </div>
    </section>
  );
}
