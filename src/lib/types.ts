/**
 * Source de vérité des catégories et besoins santé.
 * Les tableaux `as const` donnent l'ordre officiel de la grille tarifaire
 * au runtime ET les unions de types au compile-time.
 */
export const CATEGORIES = [
  "Combo / Packs",
  "Boissons",
  "Produits de la Ruche",
  "Compléments Alimentaires",
  "Gestion du Poids",
  "Soins Personnels",
  "Soins de la Peau",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const HEALTH_GOALS = [
  "Digestion & Ventre plat",
  "Articulations & Mobilité",
  "Vitalité & Forme Masculine",
  "Peau & Teint Éclatant",
  "Détox & Perte de Poids",
  "Défenses Immunitaires",
] as const;
export type HealthGoal = (typeof HEALTH_GOALS)[number];

export interface Product {
  code: string;
  name: string;
  slug: string;
  category: Category;
  healthGoals: HealthGoal[];
  pricePublic: number; // en FCFA, entier
  priceVip: number; // en FCFA, entier (-5 %)
  images: string[];
  shortDesc: string;
  duration?: string; // Ex : "Cure de 30 jours (60 comprimés)"
  usageAdvice?: string; // Conseils d'utilisation / posologie
  benefits: string[];
  isBestSeller?: boolean;
  isPackSolution?: boolean; // Pack calibré > 65 000 F
  /** Prix catalogue barré quand une promo est active (`pricePublic` est alors le prix de vente). */
  compareAtPrice?: number;
  promoBadge?: string;
  /** Composition d'un pack (remplie par le catalogue). */
  packItems?: { code: string; name: string; quantity: number }[];
}

export const PAYMENT_METHODS = [
  "Espèces à la livraison",
  "MTN Mobile Money",
  "Airtel Money",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const DELIVERY_ZONES = ["Brazzaville", "Pointe-Noire", "Province"] as const;
export type DeliveryZone = (typeof DELIVERY_ZONES)[number];

/** Ligne persistée : on ne stocke que le code, jamais le prix (évite les prix périmés). */
export interface CartLine {
  code: string;
  quantity: number;
}

/** Ligne résolue contre le catalogue courant. */
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  /** Total au prix public, avant remise : c'est lui qui est comparé au palier. */
  subtotalPublic: number;
  vipUnlocked: boolean;
  vipDiscount: number;
  /** Montant à régler : prix VIP si le palier est atteint, prix public sinon. */
  total: number;
  /** FCFA manquants pour débloquer la remise (0 si débloquée). */
  amountToVip: number;
  /** 0 à 100, arrondi à l'inférieur : 64 999 F n'affiche jamais 100 %. */
  progressPercent: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  zone: DeliveryZone;
  neighborhood: string;
  payment: PaymentMethod;
}

/** Lead envoyé vers Google Sheets : coordonnées + besoin déduit du parcours du visiteur. */
export interface LeadPayload {
  firstName: string;
  phone: string; // normalisé, ex. "242061234567"
  need: HealthGoal | null;
  needOrigin: string; // ex. "publicité, filtre catalogue"
  otherNeeds: HealthGoal[];
  viewedProducts: string[];
  cartTotal: number;
  campaign: string;
  source: string;
  referrer: string;
  landingPath: string;
  pagePath: string;
}
