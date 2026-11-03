"use client";

import { ShopLink, useShop } from "@/components/providers/ShopContext";
import { Menu, Search } from "lucide-react";
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
      <div className={`${container} flex h-[60px] items-center gap-3 sm:h-16`}>
        <ShopLink href="/" className={`shrink-0 text-[17px] font-extrabold tracking-[-0.04em] text-[#173f35] sm:text-xl ${focusRing}`}>
          {partner.displayName}
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

        <div className="ml-auto flex items-center gap-2">
          <ShopLink
            href="/catalogue"
            aria-label="Rechercher un produit"
            className={`inline-flex size-10 items-center justify-center rounded-full text-[#31483d] hover:bg-[#f1eee4] md:hidden ${focusRing}`}
          >
            <Search aria-hidden className="size-5" />
          </ShopLink>
          <details className="relative md:hidden">
            <summary aria-label="Ouvrir le menu" className={`inline-flex size-10 cursor-pointer list-none items-center justify-center rounded-full text-[#31483d] hover:bg-[#f1eee4] ${focusRing}`}>
              <Menu aria-hidden className="size-5" />
            </summary>
            <nav aria-label="Navigation mobile" className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-[#e8e5dc] bg-white p-2 shadow-xl">
              {[...LINKS, { label: "Devenir partenaire", href: "/devenir-partenaire" }, { label: "Mon panier", href: "/panier" }].map((link) => (
                <ShopLink key={link.href} href={link.href} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-[#26392e] hover:bg-[#f6f3ea]">
                  {link.label}
                </ShopLink>
              ))}
            </nav>
          </details>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
