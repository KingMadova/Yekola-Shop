"use client";

import { MessageCircle } from "lucide-react";
import { ShopWhatsAppLink } from "@/components/providers/ShopContext";

export function FloatingWhatsAppButton() {
  return (
    <ShopWhatsAppLink kind="advice" aria-label="Échanger avec un conseiller sur WhatsApp" className="fixed bottom-[calc(4.6rem_+_env(safe-area-inset-bottom))] right-3 z-40 inline-flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f9a825] to-[#c1440e] text-white shadow-lg ring-2 ring-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1440e] sm:bottom-5 sm:right-5 sm:size-14">
      <MessageCircle aria-hidden className="size-6" />
    </ShopWhatsAppLink>
  );
}
