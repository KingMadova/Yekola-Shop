"use client";

import { useState, useEffect } from "react";
import { ShopLink, ShopWhatsAppLink, useShop } from "@/components/providers/ShopContext";
import { MessageCircle } from "lucide-react";
import { COPY, DISTRIBUTOR_MENTION } from "@/lib/config";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  useEffect(() => setCurrentYear(new Date().getFullYear()), []);
  const { partner } = useShop();

  return (
    <footer className="mt-8 bg-[#7f2b0b] pb-[calc(6rem_+_env(safe-area-inset-bottom))] text-[#fff9f3] md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-11">
        <div className="grid gap-7 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">{partner.displayName}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#ffe5d2]">{COPY.footer.about}</p>
            <p className="mt-4 text-xs font-semibold text-[#ffd18a]">{DISTRIBUTOR_MENTION}{partner.fboId ? ` · FBO ${partner.fboId}` : ""}</p>
          </div>
          <nav aria-label="Liens utiles">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#ffd18a]">Explorer</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
              {[
                ["Catalogue", "/catalogue"], ["Nos offres", "/offres"], ["Packs", "/packs"],
                ["Vos besoins", "/besoins"], ["Panier", "/panier"], ["Devenir partenaire", "/devenir-partenaire"],
                ["Livraison et paiement", "/livraison-paiement"], ["Confidentialité", "/confidentialite"],
              ].map(([label, href]) => <li key={href}><ShopLink href={href} className="inline-flex min-h-10 items-center text-sm text-[#ffe5d2] hover:text-white hover:underline">{label}</ShopLink></li>)}
            </ul>
          </nav>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#ffd18a]">Une question ?</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#ffe5d2]">{COPY.footer.contact}</p>
            <ShopWhatsAppLink kind="advice" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#fff9f3] px-4 font-semibold text-[#9b310d] hover:bg-white">
              <MessageCircle aria-hidden className="size-5" /> Nous écrire
            </ShopWhatsAppLink>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-white/20 pt-5 text-xs text-[#ffe5d2] sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {partner.displayName}. Tous droits réservés.</p>
          <p>{COPY.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
