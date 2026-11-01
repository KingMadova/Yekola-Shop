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
          ? "border-emerald-600 bg-emerald-50 text-emerald-900"
          : "border-gray-200 bg-white text-gray-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden
          className={`mt-0.5 size-5 shrink-0 ${vipUnlocked ? "text-emerald-700" : "text-amber-700"}`}
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
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none ${
            vipUnlocked ? "bg-emerald-600" : "bg-amber-600"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="mt-1.5 text-xs text-gray-700">
        {formatFCFA(subtotalPublic)} sur {formatFCFA(VIP_THRESHOLD)}
      </p>
    </div>
  );
}
