"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { COPY, DISTRIBUTOR_MENTION, SITE_NAME, WHATSAPP_NUMBER } from '@/lib/config';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#059669] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1 : À propos */}
          <div>
            <h3 className="text-lg font-bold mb-4">{SITE_NAME}</h3>
            <p className="text-sm text-green-50 mb-4">{COPY.footer.about}</p>
            <p className="text-sm text-green-50 font-semibold">
              {DISTRIBUTOR_MENTION}
            </p>
          </div>

          {/* Colonne 2 : Liens utiles */}
          <div>
            <h3 className="text-lg font-bold mb-4">Informations</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/catalogue"
                  className="text-sm text-green-50 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                >
                  Catalogue complet
                </Link>
              </li>
              <li>
                <Link
                  href="/livraison-paiement"
                  className="text-sm text-green-50 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                >
                  {COPY.legal.footerDelivery}
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-sm text-green-50 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
                >
                  {COPY.legal.footerPrivacy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm text-green-50 mb-4">{COPY.footer.contact}</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#059669] font-medium rounded-lg hover:bg-green-50 transition-colors min-h-[44px]"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              Nous contacter
            </a>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="mt-12 pt-8 border-t border-green-600">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-green-50">
              © {currentYear} {SITE_NAME}. Tous droits réservés.
            </p>
            <p className="text-xs text-green-100">{COPY.footer.tagline}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}