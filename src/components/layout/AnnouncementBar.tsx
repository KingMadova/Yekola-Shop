"use client";

import { COPY } from "@/lib/config";
import { useShop } from "@/components/providers/ShopContext";

export function AnnouncementBar() {
  const { partner } = useShop();
  const messages = partner.deliveryNote ? [partner.deliveryNote, ...COPY.announcement.slice(1)] : COPY.announcement;
  return (
    <div className="hidden bg-[#c1440e] text-xs font-medium tracking-wide text-[#fff9f3] md:block">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-1 px-4 py-2 text-center">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
