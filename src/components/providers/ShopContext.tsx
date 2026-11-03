"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from "react";
import { buildWhatsAppUrl, buildAdviceMessage, buildDistributorMessage, buildNeedAdviceMessage, buildVipInfoMessage } from "@/lib/whatsapp";
import { buildShopHref } from "@/lib/shop-path";
import type { PublicPartner } from "@/lib/data/partners";
import type { HealthGoal } from "@/lib/types";

interface ShopContextValue {
  partner: PublicPartner;
  href: (path: string) => string;
  whatsappUrl: (message: string) => string;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ partner, children }: { partner: PublicPartner; children: ReactNode }) {
  const value = useMemo<ShopContextValue>(
    () => ({
      partner,
      href: (path) => buildShopHref(partner, path),
      whatsappUrl: (message) => buildWhatsAppUrl(message, partner.whatsappNumber),
    }),
    [partner],
  );
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop doit être utilisé sous <ShopProvider>.");
  return context;
}

type ShopLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function ShopLink({ href, ...props }: ShopLinkProps) {
  const shop = useShop();
  return <Link {...props} href={shop.href(href)} />;
}

type ShopWhatsAppLinkProps = {
  kind: "need" | "advice" | "vip" | "distributor";
  goal?: HealthGoal;
  children: ReactNode;
  className?: string;
};

/** Lien WhatsApp utilisant toujours le numéro et le nom de la boutique active. */
export function ShopWhatsAppLink({ kind, goal, children, className }: ShopWhatsAppLinkProps) {
  const { partner, whatsappUrl } = useShop();
  let message: string;
  if (kind === "need" && goal) message = buildNeedAdviceMessage(goal, partner.displayName);
  else if (kind === "vip") message = buildVipInfoMessage(partner.displayName);
  else if (kind === "distributor") message = buildDistributorMessage(partner.displayName);
  else message = buildAdviceMessage(partner.displayName);

  return <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

export function ShopWelcomeText({ fallback }: { fallback: string }) {
  const { partner } = useShop();
  return <>{partner.welcomeText || fallback}</>;
}

export function ShopDeliveryNote() {
  const { partner } = useShop();
  return partner.deliveryNote ? <p className="rounded-xl bg-[#edf1e9] p-4 text-sm text-[#315d47]">{partner.deliveryNote}</p> : null;
}
