import { Bone, Leaf, Salad, ShieldCheck, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { ShopLink } from "@/components/providers/ShopContext";
import { card, container, focusRing } from "@/components/ui/styles";
import { HEALTH_GOAL_META, HEALTH_GOAL_SLUGS, type HealthGoalIcon } from "@/lib/config";
import { HEALTH_GOALS } from "@/lib/types";

const ICONS: Record<HealthGoalIcon, LucideIcon> = { Salad, Bone, Zap, Sparkles, Leaf, ShieldCheck };

export function HealthGoalPicker() {
  return <section id="besoins" className={`${container} scroll-mt-24 py-6 sm:py-10`}>
    <div className="mb-4 max-w-xl">
      <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#c1440e]">Commencez ici</p>
      <h2 className="text-lg font-extrabold tracking-tight text-[#30231d] sm:text-2xl">Qu’aimeriez-vous améliorer dans votre routine ?</h2>
      <p className="mt-1 text-xs text-[#71645d] sm:text-sm">Choisissez un thème pour préciser votre recherche et être accompagné dans le catalogue.</p>
    </div>
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
      {HEALTH_GOALS.map((goal) => {
        const { shortLabel, icon } = HEALTH_GOAL_META[goal];
        const Icon = ICONS[icon];
        return <li key={goal}><ShopLink href={"/besoins?besoin=" + HEALTH_GOAL_SLUGS[goal]} className={`${card} flex h-full min-h-[100px] flex-col items-start justify-between gap-2 border-[#f2d7c2] p-3 text-left text-xs font-semibold text-[#57301f] transition-colors hover:border-[#ff9b53] hover:bg-[#fffaf5] sm:min-h-32 sm:p-4 sm:text-sm ${focusRing}`}>
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#fff0df]"><Icon aria-hidden className="size-[17px] text-[#c1440e]" /></span>
          <span>{shortLabel}</span>
        </ShopLink></li>;
      })}
    </ul>
  </section>;
}
