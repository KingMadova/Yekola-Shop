"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
  type ReactNode,
} from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buildShopHref } from "@/lib/shop-path";
import type { PublicPartner } from "@/lib/data/partners";

interface ShopContextValue {
  partner: PublicPartner;
  href: (path: string) => string;
  whatsappUrl: (message: string) => string;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({
  partner,
  children,
}: {
  partner: PublicPartner;
  children: ReactNode;
}) {
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
  if (!context) {
    throw new Error("useShop doit être utilisé sous <ShopProvider>.");
  }
  return context;
}

type ShopLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** Lien interne automatiquement préfixé par le slug de la boutique partenaire. */
export function ShopLink({ href, ...props }: ShopLinkProps) {
  const shop = useShop();
  return <Link {...props} href={shop.href(href)} />;
}
