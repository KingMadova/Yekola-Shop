import { describe, expect, it } from "vitest";
import officialPriceList from "../../../data/liste-prix-officielle.json";

describe("grille tarifaire officielle", () => {
  it("contient 53 références sans code dupliqué", () => {
    const codes = officialPriceList.products.map((product) => product.code);
    expect(codes).toHaveLength(53);
    expect(new Set(codes).size).toBe(53);
  });

  it("fournit les deux tarifs pour chaque référence", () => {
    for (const product of officialPriceList.products) {
      expect(product.pricePublic).toBeGreaterThan(0);
      expect(product.priceVip).toBeGreaterThan(0);
      expect(product.priceVip).toBeLessThanOrEqual(product.pricePublic);
    }
  });

  it("conserve les deux tarifs exacts de l'Aloe Vera Gel", () => {
    const aloe = officialPriceList.products.find((product) => product.code === "15");
    expect(aloe?.pricePublic).toBe(20_156);
    expect(aloe?.priceVip).toBe(19_322);
  });

  it("classe les deux combos et les deux programmes C9 parmi les packs", () => {
    expect(officialPriceList.products.filter((product) => product.isPack).map((product) => product.code))
      .toEqual(["456", "634", "547", "548"]);
  });
});
