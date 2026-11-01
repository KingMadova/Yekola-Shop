import { CheckCircle2, Gift } from "lucide-react";
import { VIP_THRESHOLD } from "@/lib/config";
import { formatFCFA } from "@/lib/pricing";
import type { CartTotals } from "@/lib/types";

interface VipProgressBarProps {
  totals: CartTotals;
}

/** Jauge vers l'accès aux prix client privilégié : montant restant sous 65 000 F, message de confirmation au-dessus. */
export function VipProgressBar({ totals }: VipProgressBarProps) {
  const { vipUnlocked, amountToVip, progressPercent, vipDiscount, subtotalPublic, itemCount } =
    totals;

  const message = vipUnlocked
    ? `Prix client privilégié activé : vous économisez ${formatFCFA(vipDiscount)}.`
    : itemCount === 0
      ? `Dès ${formatFCFA(VIP_THRESHOLD)} d'achats, accédez aux prix client privilégié du catalogue.`
      : `Plus que ${formatFCFA(amountToVip)} pour accéder aux prix client privilégié sur votre commande.`;

  const Icon = vipUnlocked ? CheckCircle2 : Gift;

  return (
    <div
      className={`rounded-xl border p-3 ${
        vipUnlocked
          ? "border-[#cbd8ca] bg-[#edf1e9] text-[#173f35]"
          : "border-[#e9e5d9] bg-[#fbfaf6] text-[#26392e]"
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden
          className={`mt-0.5 size-5 shrink-0 ${vipUnlocked ? "text-[#315d47]" : "text-[#8b713e]"}`}
        />
        <p role="status" className="text-sm font-semibold">
          {message}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Progression vers les prix client privilégié"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#e9e5d9]"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none ${
            vipUnlocked ? "bg-[#315d47]" : "bg-[#b08c48]"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="mt-1.5 text-xs text-[#68756c]">
        {formatFCFA(subtotalPublic)} sur {formatFCFA(VIP_THRESHOLD)}
      </p>
    </div>
  );
}
