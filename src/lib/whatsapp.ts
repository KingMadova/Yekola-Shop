import { VIP_DISCOUNT_PERCENT, VIP_THRESHOLD, WHATSAPP_NUMBER } from "./config";
import { normalizeCongoPhone } from "./phone";
import {
  computeCartTotals,
  formatFCFA,
  getUnitPrice,
} from "./pricing";
import type { CartItem, CartTotals, CustomerInfo, HealthGoal, Product } from "./types";

/** Lien wa.me avec message pré-rempli et correctement encodé. */
export function buildWhatsAppUrl(
  message: string,
  number: string = WHATSAPP_NUMBER,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function itemLines(items: readonly CartItem[], vipUnlocked: boolean): string[] {
  return items.map(
    ({ product, quantity }) =>
      `• ${quantity} × ${product.name} : ${formatFCFA(getUnitPrice(product, vipUnlocked) * quantity)}`,
  );
}

function totalsLines(totals: CartTotals): string[] {
  const lines = [`Sous-total : ${formatFCFA(totals.subtotalPublic)}`];
  if (totals.vipUnlocked) {
    lines.push(
      `Remise VIP (−${VIP_DISCOUNT_PERCENT} %) : −${formatFCFA(totals.vipDiscount)}`,
    );
  }
  lines.push(`*Total : ${formatFCFA(totals.total)}*`);
  return lines;
}

/** Commande complète depuis le panier. */
export function buildCartOrderMessage(
  items: readonly CartItem[],
  customer: CustomerInfo,
): string {
  const totals = computeCartTotals(items);
  const phone = normalizeCongoPhone(customer.phone);
  return [
    "Bonjour, je souhaite passer commande :",
    "",
    "*Articles*",
    ...itemLines(items, totals.vipUnlocked),
    "",
    ...totalsLines(totals),
    "",
    "*Livraison*",
    `Nom : ${customer.fullName.trim()}`,
    `WhatsApp : ${phone ? `+${phone}` : customer.phone.trim()}`,
    `Ville : ${customer.zone}`,
    `Quartier / repère : ${customer.neighborhood.trim()}`,
    `Règlement : ${customer.payment}`,
  ].join("\n");
}

/** Commande en 1 clic depuis une fiche produit, sans passer par le panier. */
export function buildSingleProductMessage(product: Product, quantity = 1): string {
  const items: CartItem[] = [{ product, quantity }];
  const totals = computeCartTotals(items);
  const lines = [
    "Bonjour, je souhaite commander :",
    "",
    ...itemLines(items, totals.vipUnlocked),
    "",
    ...totalsLines(totals),
  ];
  if (!totals.vipUnlocked) {
    lines.push(`(Remise VIP de ${VIP_DISCOUNT_PERCENT} % dès ${formatFCFA(VIP_THRESHOLD)} d'achats)`);
  }
  lines.push("", "Pouvez-vous me confirmer la disponibilité et la livraison ?");
  return lines.join("\n");
}

/** Demande du catalogue officiel (pop-up de capture), avec le besoin si on le connaît. */
export function buildLeadMessage(firstName: string, phone: string, need?: HealthGoal): string {
  const normalized = normalizeCongoPhone(phone);
  return [
    `Bonjour, je suis ${firstName.trim()}.`,
    "Je souhaite recevoir le catalogue officiel Forever avec les tarifs en FCFA.",
    ...(need ? [`Ce qui m'intéresse : ${need}`] : []),
    `Mon numéro : ${normalized ? `+${normalized}` : phone.trim()}`,
  ].join("\n");
}

/** Bouton flottant : question libre, par message ou note vocale. */
export function buildAdviceMessage(): string {
  return "Bonjour, j'ai une question sur les produits Forever. Je peux vous écrire ou vous envoyer une note vocale ?";
}

export function buildVipInfoMessage(): string {
  return `Bonjour, je souhaite profiter de la remise VIP de ${VIP_DISCOUNT_PERCENT} % dès ${formatFCFA(VIP_THRESHOLD)} d'achats. Pouvez-vous m'expliquer comment faire ?`;
}

export function buildDistributorMessage(): string {
  return "Bonjour, je souhaite en savoir plus sur l'opportunité de devenir distributeur Forever indépendant au Congo.";
}

export function buildNeedAdviceMessage(goal: HealthGoal): string {
  return `Bonjour, je cherche des conseils pour : ${goal}. Que me recommandez-vous ?`;
}
