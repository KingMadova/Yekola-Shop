import type { Category, HealthGoal } from "./types";

/** Palier (en FCFA) à partir duquel les prix client privilégié s'appliquent à toute la commande. */
export const VIP_THRESHOLD = 65_000;
export const MAX_LINE_QUANTITY = 99;
export const DISTRIBUTOR_MENTION = "Entrepreneur Forever Indépendant Agréé";

/** Numéro WhatsApp du distributeur, format international sans "+" (ex. 242061234567). */
export const WHATSAPP_NUMBER: string = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""
).replace(/\D/g, "");

/** Slug de la boutique maison tant que le routage multi-boutiques public n’est pas activé. */
export const HOUSE_PARTNER_SLUG = "yekola";

/** Chemin du PDF vérifié dans /public, configuré uniquement après ajout du vrai catalogue. */
export const CATALOG_PDF_PATH = process.env.NEXT_PUBLIC_CATALOG_PDF_PATH ?? "";

/** Textes réutilisés partout : une seule modification suffit pour tout le site. */
export const COPY = {
  announcement: [
    "Livraison express 24 h à Brazzaville et Pointe-Noire",
    "Paiement mobile accepté : MTN Mobile Money, Airtel Money",
    "Prix client privilégié dès 65 000 F d'achats",
  ],
  paymentTrust: {
    title: "Paiement mobile accepté",
    detail: "MTN Mobile Money et Airtel Money",
  },
  heroEyebrow: "Votre boutique bien-être au Congo",
  heroTitle: "Faites le choix d’un bien-être qui vous ressemble.",
  heroSubtitle:
    "Découvrez les produits Forever Living, comparez les prix en FCFA et échangez avec un conseiller pour choisir en toute confiance.",
  heroPrimaryCta: "Voir les produits",
  heroSecondaryCta: "Être conseillé",
  heroReassurance: "Commande sur WhatsApp · Paiement mobile accepté",
  cartNote: "Paiement mobile accepté : MTN Mobile Money et Airtel Money",
  vipBadge: "Le prix client privilégié s'applique dès 65 000 F d'achats",
  leadReassurance:
    "Garanti sans spam. Distributeur disponible à Brazzaville et Pointe-Noire.",
  advicePrompt:
    "Une question sur un produit ? Échangez avec un conseiller.",

  // Pages légales
  legal: {
    privacyTitle: "Politique de confidentialité",
    deliveryTitle: "Livraison et paiement",
    footerPrivacy: "Politique de confidentialité",
    footerDelivery: "Livraison et paiement",
  },

  // Footer
  footer: {
    about: "Votre boutique de produits Forever Living à Brazzaville, Pointe-Noire et dans toute la République du Congo.",
    entrepreneurStatus: "Entrepreneur Forever Indépendant Agréé",
    contact: "Une question avant de commander ? Échangeons sur WhatsApp.",
    tagline: "Commande sur WhatsApp · Paiement mobile accepté",
  },
} as const;

export type HealthGoalIcon =
  | "Salad"
  | "Bone"
  | "Zap"
  | "Sparkles"
  | "Leaf"
  | "ShieldCheck";

/** Libellés courts des cartes d'accueil + nom de l'icône lucide-react. */
export const HEALTH_GOAL_META: Record<
  HealthGoal,
  { shortLabel: string; icon: HealthGoalIcon }
> = {
  "Digestion & Ventre plat": { shortLabel: "Digestion & ventre plat", icon: "Salad" },
  "Articulations & Mobilité": { shortLabel: "Articulations & mobilité", icon: "Bone" },
  "Vitalité & Forme Masculine": { shortLabel: "Vitalité masculine", icon: "Zap" },
  "Peau & Teint Éclatant": { shortLabel: "Beauté de la peau", icon: "Sparkles" },
  "Détox & Perte de Poids": { shortLabel: "Détox & minceur", icon: "Leaf" },
  "Défenses Immunitaires": { shortLabel: "Immunité & tonus", icon: "ShieldCheck" },
};

export const SITE_NAME = "Yekola Shop";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

/** Délai avant le pop-up de capture de lead, et durée de silence après une fermeture. */
export const LEAD_MODAL_DELAY_MS = 7_000;
export const LEAD_DISMISS_DAYS = 7;

/** Slugs d'URL : /catalogue?besoin=digestion&categorie=packs (liens publicitaires compris). */
export const HEALTH_GOAL_SLUGS: Record<HealthGoal, string> = {
  "Digestion & Ventre plat": "digestion",
  "Articulations & Mobilité": "articulations",
  "Vitalité & Forme Masculine": "vitalite",
  "Peau & Teint Éclatant": "peau",
  "Détox & Perte de Poids": "detox",
  "Défenses Immunitaires": "immunite",
};

export const CATEGORY_SLUGS: Record<Category, string> = {
  "Combo / Packs": "packs",
  Boissons: "boissons",
  "Produits de la Ruche": "ruche",
  "Compléments Alimentaires": "complements",
  "Gestion du Poids": "poids",
  "Soins Personnels": "soins-personnels",
  "Soins de la Peau": "soins-peau",
};
