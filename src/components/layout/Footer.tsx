"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { COPY, DISTRIBUTOR_MENTION, SITE_NAME } from "@/lib/config";
import { buildAdviceMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  useEffect(() => setCurrentYear(new Date().getFullYear()), []);
  const contactUrl = buildWhatsAppUrl(buildAdviceMessage());

  return (
    <footer className="mt-12 bg-[#123d32] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-9 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">{SITE_NAME}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#e0e9e2]">{COPY.footer.about}</p>
            <p className="mt-4 text-xs font-semibold text-[#e4d2a8]">{DISTRIBUTOR_MENTION}</p>
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
                <li key={href}><Link href={href} className="inline-flex min-h-10 items-center text-sm text-[#e0e9e2] hover:text-white hover:underline">{label}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#e4d2a8]">Une question ?</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#e0e9e2]">{COPY.footer.contact}</p>
            <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#f6f3ea] px-4 font-semibold text-[#173f35] hover:bg-white">
              <MessageCircle aria-hidden className="size-5" /> Nous écrire
            </a>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-white/15 pt-5 text-xs text-[#d9e4dc] sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {SITE_NAME}. Tous droits réservés.</p>
          <p>{COPY.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
