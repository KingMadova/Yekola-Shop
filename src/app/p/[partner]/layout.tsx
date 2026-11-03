import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FloatingWhatsAppButton } from "@/components/layout/FloatingWhatsAppButton";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { InterestTracker } from "@/components/lead/InterestTracker";
import { LeadCaptureModal } from "@/components/lead/LeadCaptureModal";
import { CartHydrator } from "@/components/providers/CartHydrator";
import { ShopProvider } from "@/components/providers/ShopContext";
import { SITE_URL } from "@/lib/config";
import { getActivePartnerSlugs, getPartner } from "@/lib/data/partners";

// Le contexte boutique dépend du slug et doit être résolu avant le rendu partagé.
export const instant = false;

interface PartnerLayoutProps {
  children: ReactNode;
  params: Promise<{ partner: string }>;
}

export async function generateStaticParams() {
  return (await getActivePartnerSlugs()).map((partner) => ({ partner }));
}

export async function generateMetadata({ params }: PartnerLayoutProps): Promise<Metadata> {
  "use cache";
  const { partner: slug } = await params;
  const partner = await getPartner(slug);
  if (!partner || partner.isHouse) return {};
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: SITE_URL },
  };
}

export default async function PartnerLayout({ children, params }: PartnerLayoutProps) {
  const { partner: slug } = await params;
  const partner = await getPartner(slug);
  if (!partner) notFound();

  return (
    <ShopProvider partner={partner}>
      <CartHydrator partnerSlug={partner.slug} />
      <InterestTracker partnerSlug={partner.slug} />
      <AnnouncementBar />
      <Header />
      <main id="contenu" className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <LeadCaptureModal />
      <FloatingWhatsAppButton />
    </ShopProvider>
  );
}
