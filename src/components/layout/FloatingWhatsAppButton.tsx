"use client";

import { MessageCircle, Mic, X } from "lucide-react";
import { useState } from "react";
import { COPY } from "@/lib/config";
import { buildAdviceMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

/** Bouton WhatsApp persistant (bas droite) avec bulle d'accroche fermable. À monter dans app/layout.tsx. */
export function FloatingWhatsAppButton() {
  const [bubbleOpen, setBubbleOpen] = useState(true);

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-end gap-2">
      {bubbleOpen && (
        <div className="relative max-w-60 rounded-2xl rounded-br-sm border border-gray-200 bg-white p-3 pr-10 text-sm text-gray-900 shadow-lg">
          <p>{COPY.advicePrompt}</p>
          <button
            type="button"
            onClick={() => setBubbleOpen(false)}
            aria-label="Fermer la bulle d'aide"
            className="absolute right-0.5 top-0.5 inline-flex size-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-emerald-700"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      )}

      <a
        href={buildWhatsAppUrl(buildAdviceMessage())}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Écrire sur WhatsApp : message ou note vocale"
        className="relative inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-[#075E54] text-white shadow-lg hover:bg-[#064c44] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        <MessageCircle aria-hidden className="size-7" />
        <span
          aria-hidden
          className="absolute -right-1 -top-1 inline-flex size-6 items-center justify-center rounded-full bg-amber-700 ring-2 ring-white"
        >
          <Mic className="size-3.5" />
        </span>
      </a>
    </div>
  );
}
