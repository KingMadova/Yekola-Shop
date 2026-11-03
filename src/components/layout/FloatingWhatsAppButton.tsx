"use client";

import { MessageCircle } from "lucide-react";
import { ShopWhatsAppLink } from "@/components/providers/ShopContext";

/** Contact WhatsApp flottant, discret sur mobile et sans bulle qui masque le contenu. */
export function FloatingWhatsAppButton() {
  return (
    <ShopWhatsAppLink
      kind="advice"
      aria-label="Échanger avec un conseiller sur WhatsApp"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 z-40 inline-flex size-12 items-center justify-center rounded-full bg-[#176b55] text-white shadow-lg ring-1 ring-white/70 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35] sm:bottom-5 sm:right-5 sm:size-14"
    >
      <MessageCircle aria-hidden className="size-6" />
    </ShopWhatsAppLink>
  );
}
