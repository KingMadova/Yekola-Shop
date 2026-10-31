import { Bone, Leaf, Salad, ShieldCheck, Sparkles, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { card, container, focusRing } from "@/components/ui/styles";
import { buildCatalogueHref } from "@/lib/catalogue";
import { HEALTH_GOAL_META, type HealthGoalIcon } from "@/lib/config";
import { HEALTH_GOALS } from "@/lib/types";

const ICONS: Record<HealthGoalIcon, LucideIcon> = { Salad, Bone, Zap, Sparkles, Leaf, ShieldCheck };

/** Chaque carte mène à /catalogue?besoin=… : les produits adaptés s'affichent aussitôt, et le besoin est mémorisé. */
export function HealthGoalPicker() {
  return (
    <section id="besoins" className={`${container} scroll-mt-24 py-12`}>
      <h2 className="text-2xl font-bold text-gray-900">Que recherchez-vous ?</h2>
      <p className="mt-1 text-gray-800">Choisissez votre besoin, nous affichons les produits adaptés.</p>
      <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {HEALTH_GOALS.map((goal) => {
          const { shortLabel, icon } = HEALTH_GOAL_META[goal];
          const Icon = ICONS[icon];
          return (
            <li key={goal}>
              <Link
                href={buildCatalogueHref({ goal })}
                className={`${card} flex h-full min-h-28 flex-col items-center justify-center gap-3 p-4 text-center font-semibold text-gray-900 hover:border-emerald-600 hover:bg-emerald-50 ${focusRing}`}
              >
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-50">
                  <Icon aria-hidden className="size-7 text-emerald-700" />
                </span>
                {shortLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
