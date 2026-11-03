import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Votre panier",
  robots: { index: false, follow: false },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/panier` },
};

export default function CartPage() {
  return <CartPageContent />;
}
