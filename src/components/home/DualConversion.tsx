import { btn, container } from "@/components/ui/styles";
import { VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";
import { buildDistributorMessage, buildVipInfoMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export function DualConversion() {
  return (
    <section className={`${container} grid gap-4 py-12 md:grid-cols-2`}>
      <div className="flex flex-col items-start gap-3 rounded-3xl bg-emerald-950 p-7 text-white">
        <h2 className="text-2xl font-bold">Client VIP : 5 % de remise dès {formatFCFA(VIP_THRESHOLD)}</h2>
        <p className="text-emerald-100">
          Chaque commande qui atteint le palier bénéficie de la remise sur tous les articles, appliquée automatiquement dans votre panier.
        </p>
        <a href={buildWhatsAppUrl(buildVipInfoMessage())} target="_blank" rel="noopener noreferrer" className={`${btn} mt-2 bg-white text-emerald-950 hover:bg-emerald-50`}>
          Profiter de la remise VIP
        </a>
      </div>
      <div className="flex flex-col items-start gap-3 rounded-3xl bg-amber-100 p-7 text-amber-950">
        <h2 className="text-2xl font-bold">Devenez distributeur Forever indépendant</h2>
        <p>Créez votre activité au Congo, avec un accompagnement pas à pas pour démarrer.</p>
        <a href={buildWhatsAppUrl(buildDistributorMessage())} target="_blank" rel="noopener noreferrer" className={`${btn} mt-2 bg-amber-900 text-white hover:bg-amber-950`}>
          Parler à un distributeur
        </a>
      </div>
    </section>
  );
}
