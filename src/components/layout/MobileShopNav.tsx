"use client";

import { usePathname } from "next/navigation";
import { Home, LayoutGrid, BadgePercent, Package, ShoppingBag } from "lucide-react";
import { ShopLink, useShop } from "@/components/providers/ShopContext";
import { useCartHydrated, useCartTotals } from "@/store/useCartStore";

const ITEMS = [
  { label: "Accueil", href: "/", icon: Home, matches: (path: string, home: string) => path === home || path === "/" },
  { label: "Catalogue", href: "/catalogue", icon: LayoutGrid, matches: (path: string) => path.endsWith("/catalogue") || path.includes("/produit/") },
  { label: "Offres", href: "/offres", icon: BadgePercent, matches: (path: string) => path.endsWith("/offres") },
  { label: "Packs", href: "/packs", icon: Package, matches: (path: string) => path.endsWith("/packs") },
  { label: "Panier", href: "/panier", icon: ShoppingBag, matches: (path: string) => path.endsWith("/panier") },
] as const;

export function MobileShopNav() {
  const pathname = usePathname();
  const { partner } = useShop();
  const hydrated = useCartHydrated();
  const { itemCount } = useCartTotals();
  const homePath = `/p/${partner.slug}`;

  return (
    <nav aria-label="Navigation mobile de la boutique" className="fixed inset-x-0 bottom-0 z-40 border-t border-[#f4ddca] bg-[#fff9f3]/96 px-1 pt-1.5 shadow-[0_-6px_24px_rgba(120,55,20,0.08)] backdrop-blur md:hidden" style={{ paddingBottom: "max(0.4rem, env(safe-area-inset-bottom))" }}>
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-0.5">
        {ITEMS.map(({ label, href, icon: Icon, matches }) => {
          const active = matches(pathname, homePath);
          const count = label === "Panier" && hydrated ? itemCount : 0;
          return <li key={href}>
            <ShopLink href={href} aria-current={active ? "page" : undefined} className={`relative flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl px-0.5 text-[9px] font-bold transition-colors ${active ? "bg-[#fff0df] text-[#b53c0c]" : "text-[#79685d] hover:bg-[#fff4e8]"}`}>
              <span className="relative"><Icon aria-hidden className="size-[19px]" strokeWidth={active ? 2.5 : 2} />
                {count > 0 && <span className="absolute -right-2 -top-2 inline-flex min-w-4 items-center justify-center rounded-full bg-[#c1440e] px-1 text-[9px] font-bold text-white">{count > 9 ? "9+" : count}</span>}
              </span>
              <span>{label}</span>
            </ShopLink>
          </li>;
        })}
      </ul>
    </nav>
  );
}
