import { VIP_THRESHOLD } from "./config";
import { normalizeCongoPhone } from "./phone";
import { computeCartTotals, formatFCFA, getUnitPrice } from "./pricing";
import type { CartItem, CartTotals, CustomerInfo, HealthGoal, Product } from "./types";

/** Construit un lien WhatsApp à partir du numéro explicite de la boutique active. */
export function buildWhatsAppUrl(message: string, number: string): string {
  if (!/^242[0-9]{9}$/.test(number)) {
    throw new Error("Le numéro WhatsApp de la boutique est absent ou invalide.");
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function greeting(partnerName: string): string {
  return `Bonjour ${partnerName},`;
}

function itemLines(items: readonly CartItem[], vipUnlocked: boolean): string[] {
  return items.map(({ product, quantity }) =>
    `• ${quantity} × ${product.name} : ${formatFCFA(getUnitPrice(product, vipUnlocked) * quantity)}`,
  );
}

function totalsLines(totals: CartTotals): string[] {
  const lines = [`Sous-total : ${formatFCFA(totals.subtotalPublic)}`];
  if (totals.vipUnlocked) lines.push(`Économie au tarif client privilégié : −${formatFCFA(totals.vipDiscount)}`);
  lines.push(`*Total : ${formatFCFA(totals.total)}*`);
  return lines;
}

/** Commande complète depuis le panier ; le nom de la boutique figure dans le message. */
export function buildCartOrderMessage(items: readonly CartItem[], customer: CustomerInfo, partnerName: string): string {
  const totals = computeCartTotals(items);
  const phone = normalizeCongoPhone(customer.phone);
  return [
    greeting(partnerName),
    "Je souhaite passer commande dans votre boutique :",
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

export function buildSingleProductMessage(product: Product, quantity: number, partnerName: string): string {
  const items: CartItem[] = [{ product, quantity }];
  const totals = computeCartTotals(items);
  const lines = [greeting(partnerName), "Je souhaite commander dans votre boutique :", "", ...itemLines(items, totals.vipUnlocked), "", ...totalsLines(totals)];
  if (!totals.vipUnlocked) lines.push(`(Tarif client privilégié accessible dès ${formatFCFA(VIP_THRESHOLD)} d'achats.)`);
  lines.push("", "Pouvez-vous me confirmer la disponibilité et la livraison ?");
  return lines.join("\n");
}

export function buildLeadMessage(firstName: string, phone: string, need?: HealthGoal): string {
  const normalized = normalizeCongoPhone(phone);
  return [
    `Bonjour, je suis ${firstName.trim()}.`,
    "Je souhaite recevoir le catalogue officiel Forever avec les tarifs en FCFA.",
    ...(need ? [`Ce qui m'intéresse : ${need}`] : []),
    `Mon numéro : ${normalized ? `+${normalized}` : phone.trim()}`,
  ].join("\n");
}

export function buildAdviceMessage(partnerName: string): string {
  return `${greeting(partnerName)} j'ai une question sur les produits Forever. Je peux vous écrire ou vous envoyer une note vocale ?`;
}

export function buildVipInfoMessage(partnerName: string): string {
  return `${greeting(partnerName)} je souhaite connaître les conditions pour bénéficier des prix client privilégié dès ${formatFCFA(VIP_THRESHOLD)} d'achats. Pouvez-vous m'expliquer comment faire ?`;
}

export function buildDistributorMessage(partnerName: string): string {
  return `${greeting(partnerName)} je souhaite en savoir plus sur l'opportunité de devenir distributeur Forever indépendant au Congo.`;
}

export function buildNeedAdviceMessage(goal: HealthGoal, partnerName: string): string {
  return `${greeting(partnerName)} je cherche des conseils pour : ${goal}. Que me recommandez-vous ?`;
}
