import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { CatalogProvider } from "@/components/providers/CatalogProvider";
import { SITE_NAME, SITE_URL } from "@/lib/config";
import { getCatalog } from "@/lib/data/catalog";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} : bien-être naturel au Congo`, template: `%s · ${SITE_NAME}` },
  description: "Découvrez les produits Forever Living, consultez les tarifs en FCFA et commandez sur WhatsApp. Paiement mobile accepté et livraison selon votre zone.",
  openGraph: { type: "website", siteName: SITE_NAME, locale: "fr_FR" },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = { themeColor: "#123D32" };

async function CatalogApp({ children }: { children: ReactNode }) {
  const products = await getCatalog();
  return <CatalogProvider products={products}>{children}</CatalogProvider>;
}

function CatalogAppFallback() {
  return (
    <main id="contenu" className="mx-auto min-h-[50vh] w-full max-w-7xl flex-1 px-4 py-8">
      <div aria-hidden="true" className="space-y-4">
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-[#e9e5d9]" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-[#eeeae0]" />
        <div className="h-56 w-full animate-pulse rounded-2xl bg-[#eeeae0]" />
      </div>
      <p className="sr-only">Chargement de la boutique…</p>
    </main>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${font.className} flex min-h-dvh flex-col bg-[#fbfaf6] text-[#26392e] antialiased`}>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">
          Aller au contenu
        </a>
        <Suspense fallback={<CatalogAppFallback />}>
          <CatalogApp>{children}</CatalogApp>
        </Suspense>
      </body>
    </html>
  );
}
