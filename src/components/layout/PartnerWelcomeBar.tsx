import type { PublicPartner } from "@/lib/data/partners";

export function PartnerWelcomeBar({ partner }: { partner: PublicPartner }) {
  if (partner.isHouse) return null;
  return (
    <div className="border-b border-[#ffd6b5] bg-[#fff0df] px-3 py-2 text-center text-xs font-semibold text-[#9b310d] sm:text-sm">
      Bienvenue dans la boutique de <span className="font-extrabold">{partner.displayName}</span>
    </div>
  );
}
