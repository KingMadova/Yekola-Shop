import { Bone, Leaf, Salad, ShieldCheck, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { ShopLink } from "@/components/providers/ShopContext";
import { card, container, focusRing } from "@/components/ui/styles";
import { HEALTH_GOAL_META, HEALTH_GOAL_SLUGS, type HealthGoalIcon } from "@/lib/config";
import { HEALTH_GOALS } from "@/lib/types";

const ICONS: Record<HealthGoalIcon, LucideIcon> = { Salad, Bone, Zap, Sparkles, Leaf, ShieldCheck };

/** Chaque carte mène à /besoins?besoin=… : fonctionne sans JavaScript et mémorise le besoin. */
export function HealthGoalPicker() {
  return (
    <section id="besoins" className={`${container} scroll-mt-24 py-9 sm:py-12`}>
      <div className="mb-5 max-w-xl">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7b40]">Commencez ici</p>
        <h2 className="text-xl font-bold tracking-tight text-[#20382d] sm:text-2xl">Qu’aimeriez-vous améliorer dans votre routine ?</h2>
        <p className="mt-1 text-sm text-[#68756c]">Choisissez un thème pour préciser votre recherche et être accompagné dans le catalogue.</p>
      </div>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {HEALTH_GOALS.map((goal) => {
          const { shortLabel, icon } = HEALTH_GOAL_META[goal];
          const Icon = ICONS[icon];
          return (
            <li key={goal}>
              <ShopLink
                href={"/besoins?besoin=" + HEALTH_GOAL_SLUGS[goal]}
                className={`${card} flex h-full min-h-[112px] flex-col items-start justify-between gap-3 border-[#e9e5d9] p-3 text-left text-sm font-semibold text-[#2a4034] transition-colors hover:border-[#bda36d] hover:bg-[#fbfaf6] sm:min-h-32 sm:p-4 ${focusRing}`}
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#edf1e9]">
                  <Icon aria-hidden className="size-[18px] text-[#315d47]" />
                </span>
                <span>{shortLabel}</span>
              </ShopLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
