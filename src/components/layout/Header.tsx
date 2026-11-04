"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ShopLink, useShop } from "@/components/providers/ShopContext";
import { Search, X } from "lucide-react";
import { ProductSearch } from "@/components/catalogue/ProductSearch";
import { CartButton } from "@/components/cart/CartButton";
import { container, focusRing } from "@/components/ui/styles";

const LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Nos offres", href: "/offres" },
  { label: "Packs", href: "/packs" },
  { label: "Vos besoins", href: "/besoins" },
] as const;

const linkClass = `rounded-full px-3 py-2 text-sm font-semibold text-[#57301f] transition-colors hover:bg-[#fff0df] hover:text-[#a9360b] ${focusRing}`;

export function Header() {
  const { partner } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!searchOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-30 border-b border-[#f4ddca] bg-[#fff9f3]/95 shadow-[0_2px_14px_rgba(120,55,20,0.06)] backdrop-blur">
      <div className={`${container} flex h-[58px] items-center gap-2 sm:h-16 sm:gap-3`}>
        <ShopLink href="/" className={`flex min-w-0 shrink items-center gap-2 text-[16px] font-extrabold tracking-[-0.04em] text-[#c1440e] sm:text-lg ${focusRing}`}>
          <Image src={partner.isHouse ? "/yekola-business-logo.svg" : "/yekola-business-icon.svg"} alt="Yekola Business" width={partner.isHouse ? 48 : 30} height={partner.isHouse ? 50 : 26} priority className={partner.isHouse ? "h-[48px] w-[47px] shrink-0 object-contain" : "h-[26px] w-[31px] shrink-0 object-contain"} />
          {!partner.isHouse && <span className="block truncate">{partner.displayName}</span>}
        </ShopLink>
        <nav aria-label="Navigation principale" className="ml-4 hidden items-center gap-1 md:flex">
          {LINKS.map((link) => <ShopLink key={link.href} href={link.href} className={linkClass}>{link.label}</ShopLink>)}
          <ShopLink href="/devenir-partenaire" className={linkClass}>Devenir partenaire</ShopLink>
        </nav>
        <div className="mx-auto hidden w-full max-w-xs lg:block"><ProductSearch compact /></div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Ouvrir la recherche de produits"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            className={`inline-flex size-11 items-center justify-center rounded-full text-[#9b310d] hover:bg-[#fff0df] lg:hidden ${focusRing}`}
          >
            <Search aria-hidden className="size-5" />
          </button>
          <CartButton />
        </div>
      </div>

      {searchOpen && <div className="fixed inset-0 z-[60] lg:hidden">
        <button type="button" aria-label="Fermer la recherche" onClick={() => setSearchOpen(false)} className="absolute inset-0 h-full w-full bg-[#21170f]/45" />
        <section role="dialog" aria-modal="true" aria-labelledby="mobile-search-title" className="relative z-10 border-b border-[#f0dfd0] bg-[#fff9f3] px-4 pb-5 pt-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="mobile-search-title" className="text-base font-bold text-[#30231d]">Rechercher un produit</h2>
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Fermer" className={`inline-flex size-11 items-center justify-center rounded-full text-[#68452f] hover:bg-[#fff0df] ${focusRing}`}>
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <ProductSearch autoFocus />
        </section>
      </div>}
    </header>
  );
}
