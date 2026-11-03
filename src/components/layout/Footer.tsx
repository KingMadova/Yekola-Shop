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
    <footer className="mt-12 bg-[#123d32] pb-20 text-white md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-9 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">{partner.displayName}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#e0e9e2]">{COPY.footer.about}</p>
            <p className="mt-4 text-xs font-semibold text-[#e4d2a8]">{DISTRIBUTOR_MENTION}{partner.fboId ? ` · FBO ${partner.fboId}` : ""}</p>
          </div>

          <nav aria-label="Liens utiles">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#e4d2a8]">Explorer</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
              {[
                ["Catalogue", "/catalogue"],
                ["Packs", "/packs"],
                ["Vos besoins", "/besoins"],
                ["Panier", "/panier"],
                ["Devenir partenaire", "/devenir-partenaire"],
                ["Livraison et paiement", "/livraison-paiement"],
                ["Confidentialité", "/confidentialite"],
              ].map(([label, href]) => (
                <li key={href}><ShopLink href={href} className="inline-flex min-h-10 items-center text-sm text-[#e0e9e2] hover:text-white hover:underline">{label}</ShopLink></li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#e4d2a8]">Une question ?</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#e0e9e2]">{COPY.footer.contact}</p>
            <ShopWhatsAppLink kind="advice" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#f6f3ea] px-4 font-semibold text-[#173f35] hover:bg-white">
              <MessageCircle aria-hidden className="size-5" /> Nous écrire
            </ShopWhatsAppLink>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-white/15 pt-5 text-xs text-[#d9e4dc] sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {partner.displayName}. Tous droits réservés.</p>
          <p>{COPY.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
