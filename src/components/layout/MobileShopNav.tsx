"use client";

import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Package, ShoppingBag } from "lucide-react";
import { ShopLink, useShop } from "@/components/providers/ShopContext";
import { useCartHydrated, useCartTotals } from "@/store/useCartStore";

const ITEMS = [
  { label: "Accueil", href: "/", icon: Home, matches: (path: string, home: string) => path === home },
  { label: "Catalogue", href: "/catalogue", icon: LayoutGrid, matches: (path: string) => path.endsWith("/catalogue") || path.includes("/produit/") },
  { label: "Packs", href: "/packs", icon: Package, matches: (path: string) => path.endsWith("/packs") },
  { label: "Panier", href: "/panier", icon: ShoppingBag, matches: (path: string) => path.endsWith("/panier") },
] as const;

/** Navigation principale persistante, conçue pour le pouce sur les petits écrans. */
export function MobileShopNav() {
  const pathname = usePathname();
  const { partner } = useShop();
  const hydrated = useCartHydrated();
  const { itemCount } = useCartTotals();
  const homePath = `/p/${partner.slug}`;

  return (
    <nav
      aria-label="Navigation mobile de la boutique"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8e5dc] bg-[#fbfaf6]/95 px-2 pt-2 shadow-[0_-6px_24px_rgba(20,45,35,0.07)] backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {ITEMS.map(({ label, href, icon: Icon, matches }) => {
          const active = matches(pathname, homePath);
          const count = label === "Panier" && hydrated ? itemCount : 0;
          return (
            <li key={href}>
              <ShopLink
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition-colors ${active ? "bg-[#eaf0e8] text-[#173f35]" : "text-[#68756c] hover:bg-[#f1eee4]"}`}
              >
                <span className="relative">
                  <Icon aria-hidden className="size-5" strokeWidth={active ? 2.5 : 2} />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-2 inline-flex min-w-4 items-center justify-center rounded-full bg-[#176b55] px-1 text-[9px] font-bold text-white">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                <span>{label}</span>
              </ShopLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
