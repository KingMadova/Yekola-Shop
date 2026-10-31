import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FloatingWhatsAppButton } from "@/components/layout/FloatingWhatsAppButton";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { InterestTracker } from "@/components/lead/InterestTracker";
import { LeadCaptureModal } from "@/components/lead/LeadCaptureModal";
import { CartHydrator } from "@/components/providers/CartHydrator";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} : bien-être naturel au Congo`, template: `%s · ${SITE_NAME}` },
  description:
    "Produits Forever Living originaux et scellés, livrés à Brazzaville et Pointe-Noire sous 24 h. Commande sur WhatsApp, paiement mobile accepté.",
  openGraph: { type: "website", siteName: SITE_NAME, locale: "fr_FR" },
};

export const viewport: Viewport = { themeColor: "#059669" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${font.className} flex min-h-dvh flex-col bg-gray-50 text-gray-900 antialiased`}>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">
          Aller au contenu
        </a>
        <AnnouncementBar />
        <Header />
        <main id="contenu" className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <FloatingWhatsAppButton />
        <LeadCaptureModal />
        <CartHydrator />
        <InterestTracker />
      </body>
    </html>
  );
}
