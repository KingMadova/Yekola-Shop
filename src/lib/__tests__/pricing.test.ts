import { describe, expect, it } from "vitest";
import { normalizeCongoPhone } from "../phone";
import { computeCartTotals, formatFCFA } from "../pricing";
import type { CartItem, Product } from "../types";
import { buildSingleProductMessage, buildWhatsAppUrl } from "../whatsapp";

function makeProduct(pricePublic: number, priceVip: number, code = "T1"): Product {
  return {
    code,
    name: `Produit ${code}`,
    slug: code.toLowerCase(),
    category: "Boissons",
    healthGoals: [],
    pricePublic,
    priceVip,
    images: [],
    shortDesc: "",
    benefits: [],
  };
}

const item = (price: number, vipPrice: number, quantity = 1, code = "T1"): CartItem => ({
  product: makeProduct(price, vipPrice, code),
  quantity,
});

const plain = (text: string) => text.replace(/\u00a0/g, " ");

describe("tarifs client privilégié officiels", () => {
  it("utilise exactement le tarif de la grille, sans recalculer 5 %", () => {
    const totals = computeCartTotals([item(20_156, 19_322, 4)]);
    expect(totals.subtotalPublic).toBe(80_624);
    expect(totals.vipUnlocked).toBe(true);
    expect(totals.total).toBe(77_288);
    expect(totals.vipDiscount).toBe(3_336);
  });
});

describe("palier de 65 000 F", () => {
  it("garde le prix public à 64 999 F", () => {
    const totals = computeCartTotals([item(64_999, 61_750)]);
    expect(totals.vipUnlocked).toBe(false);
    expect(totals.total).toBe(64_999);
    expect(totals.vipDiscount).toBe(0);
    expect(totals.amountToVip).toBe(1);
    expect(totals.progressPercent).toBe(99);
  });

  it("active la remise dès 65 000 F pile", () => {
    const totals = computeCartTotals([item(65_000, 61_750)]);
    expect(totals.vipUnlocked).toBe(true);
    expect(totals.total).toBe(61_750);
    expect(totals.vipDiscount).toBe(3_250);
    expect(totals.amountToVip).toBe(0);
    expect(totals.progressPercent).toBe(100);
  });

  it("applique la remise à toutes les lignes quand le total cumulé atteint le palier", () => {
    const totals = computeCartTotals([item(40_000, 38_000, 1, "A"), item(30_000, 28_500, 1, "B")]);
    expect(totals.subtotalPublic).toBe(70_000);
    expect(totals.total).toBe(38_000 + 28_500);
  });

  it("gère le panier vide", () => {
    const totals = computeCartTotals([]);
    expect(totals.total).toBe(0);
    expect(totals.amountToVip).toBe(65_000);
    expect(totals.progressPercent).toBe(0);
  });
});

describe("formatage et téléphone", () => {
  it("formate en FCFA", () => {
    expect(plain(formatFCFA(65_000))).toBe("65 000 F");
  });

  it("normalise les numéros congolais", () => {
    expect(normalizeCongoPhone("06 123 4567")).toBe("242061234567");
    expect(normalizeCongoPhone("+242 06 123 4567")).toBe("242061234567");
    expect(normalizeCongoPhone("123")).toBeNull();
  });
});

describe("WhatsApp", () => {
  it("construit un lien wa.me encodé", () => {
    const url = buildWhatsAppUrl("Bonjour & merci", "242061234567");
    expect(url).toBe("https://wa.me/242061234567?text=Bonjour%20%26%20merci");
  });

  it("reprend le tarif privilégié exact dans la commande 1 clic d'un pack > 65 000 F", () => {
    const message = plain(buildSingleProductMessage(makeProduct(68_543, 65_116), 1, "Yekola Shop"));
    expect(message).toContain("65 116 F");
    expect(message).toContain("client privilégié");
    expect(message).toContain("Bonjour Yekola Shop");
  });
});
