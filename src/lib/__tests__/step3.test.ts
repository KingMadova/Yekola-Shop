import { describe, expect, it } from "vitest";
import { filterProducts, buildCatalogueHref, parseCatalogueQuery } from "../catalogue";
import { applySignal, buildNeedProfile, goalFromText, rankGoals } from "../interest";
import { parseLeadPayload } from "../leads";
import type { Product } from "../types";

const product = (code: string, over: Partial<Product> = {}): Product => ({
  code,
  name: `Produit ${code}`,
  slug: code.toLowerCase(),
  category: "Boissons",
  healthGoals: [],
  pricePublic: 10_000,
  priceVip: 9_500,
  images: [],
  shortDesc: "Boisson à base d'aloès",
  benefits: [],
  ...over,
});

describe("besoin déduit de l'arrivée", () => {
  it("reconnaît les slugs et les noms de campagne", () => {
    expect(goalFromText("digestion")).toBe("Digestion & Ventre plat");
    expect(goalFromText("campagne-digestion-30-jours")).toBe("Digestion & Ventre plat");
    expect(goalFromText("C9-minceur")).toBe("Détox & Perte de Poids");
    expect(goalFromText("promo-noel")).toBeNull();
  });

  it("classe par poids des signaux", () => {
    let s = applySignal({}, {}, "Peau & Teint Éclatant", "produit");
    s = applySignal(s.scores, s.origins, "Digestion & Ventre plat", "pub");
    expect(rankGoals(s.scores)[0]).toBe("Digestion & Ventre plat");
  });

  it("un choix explicite l'emporte sur la déduction", () => {
    const ad = applySignal({}, {}, "Digestion & Ventre plat", "pub");
    const profile = buildNeedProfile({ ...ad, chosen: "Défenses Immunitaires", cartGoals: [] });
    expect(profile.need).toBe("Défenses Immunitaires");
    expect(profile.origins).toEqual(["choix"]);
    expect(profile.others).toEqual(["Digestion & Ventre plat"]);
  });

  it("retourne null sans aucun signal", () => {
    expect(buildNeedProfile({ scores: {}, origins: {}, chosen: null, cartGoals: [] }).need).toBeNull();
  });
});

describe("catalogue", () => {
  const list = [
    product("A", { category: "Soins de la Peau", healthGoals: ["Peau & Teint Éclatant"] }),
    product("B", { category: "Combo / Packs", healthGoals: ["Digestion & Ventre plat"] }),
  ];

  it("filtre par catégorie et besoin, dans l'ordre officiel", () => {
    expect(filterProducts(list, {}).map((p) => p.code)).toEqual(["B", "A"]);
    expect(filterProducts(list, { goal: "Peau & Teint Éclatant" }).map((p) => p.code)).toEqual(["A"]);
    expect(filterProducts(list, { category: "Combo / Packs" }).map((p) => p.code)).toEqual(["B"]);
  });

  it("cherche sans tenir compte des accents", () => {
    expect(filterProducts(list, { q: "aloes" })).toHaveLength(2);
  });

  it("lit et reconstruit l'URL", () => {
    const query = parseCatalogueQuery({ besoin: "digestion", categorie: ["packs"], q: " gel " });
    expect(query).toEqual({ category: "Combo / Packs", goal: "Digestion & Ventre plat", q: "gel" });
    expect(buildCatalogueHref(query)).toBe("/catalogue?categorie=packs&besoin=digestion&q=gel");
    expect(parseCatalogueQuery({ besoin: "inconnu" }).goal).toBeUndefined();
  });
});

describe("validation des leads", () => {
  it("accepte un lead valide et normalise le numéro", () => {
    const lead = parseLeadPayload({ firstName: " Marie ", phone: "06 123 4567", need: "Peau & Teint Éclatant" });
    expect(lead?.phone).toBe("242061234567");
    expect(lead?.firstName).toBe("Marie");
  });

  it("rejette un numéro invalide, un prénom vide et un besoin inconnu", () => {
    expect(parseLeadPayload({ firstName: "Marie", phone: "123" })).toBeNull();
    expect(parseLeadPayload({ firstName: "", phone: "061234567" })).toBeNull();
    expect(parseLeadPayload({ firstName: "Marie", phone: "061234567", need: "Autre" })?.need).toBeNull();
  });
});
