"use client";

import { ShopLink, useShop } from "@/components/providers/ShopContext";
import { Search } from "lucide-react";
import { ProductSearch } from "@/components/catalogue/ProductSearch";
import { CartButton } from "@/components/cart/CartButton";
import { container, focusRing } from "@/components/ui/styles";

const LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Packs", href: "/packs" },
  { label: "Vos besoins", href: "/besoins" },
] as const;

const linkClass = `rounded-full px-3 py-2 text-sm font-medium text-[#31483d] transition-colors hover:bg-[#f1eee4] hover:text-[#10352d] ${focusRing}`;

export function Header() {
  const { partner } = useShop();
  return (
    <header className="sticky top-0 z-30 border-b border-[#e8e5dc] bg-[#fbfaf6]/95 shadow-[0_2px_14px_rgba(20,45,35,0.04)] backdrop-blur">
      <div className={`${container} flex h-[60px] items-center gap-2 sm:h-16 sm:gap-3`}>
        <ShopLink href="/" className={`min-w-0 shrink text-[17px] font-extrabold tracking-[-0.04em] text-[#173f35] sm:text-xl ${focusRing}`}>
          <span className="block truncate">{partner.displayName}</span>
        </ShopLink>

        <nav aria-label="Navigation principale" className="ml-5 hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <ShopLink key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </ShopLink>
          ))}
          <ShopLink href="/devenir-partenaire" className={linkClass}>
            Devenir partenaire
          </ShopLink>
        </nav>

        <div className="mx-auto hidden w-full max-w-xs lg:block"><ProductSearch compact /></div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <ShopLink
            href="/catalogue"
            aria-label="Rechercher un produit"
            className={`inline-flex size-11 items-center justify-center rounded-full text-[#31483d] hover:bg-[#f1eee4] md:hidden ${focusRing}`}
          >
            <Search aria-hidden className="size-5" />
          </ShopLink>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
