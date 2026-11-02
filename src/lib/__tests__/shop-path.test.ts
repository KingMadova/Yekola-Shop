import { describe, expect, it } from "vitest";
import { buildShopHref } from "../shop-path";
import type { PublicPartner } from "../data/partners";

const house: Pick<PublicPartner, "slug" | "isHouse"> = {
  slug: "yekola",
  isHouse: true,
};

const partner: Pick<PublicPartner, "slug" | "isHouse"> = {
  slug: "alvine",
  isHouse: false,
};

describe("buildShopHref", () => {
  it("préserve les chemins de la boutique maison", () => {
    expect(buildShopHref(house, "/")).toBe("/");
    expect(buildShopHref(house, "/catalogue?besoin=digestion")).toBe("/catalogue?besoin=digestion");
  });

  it("préfixe les chemins d'une boutique partenaire", () => {
    expect(buildShopHref(partner, "/")).toBe("/p/alvine");
    expect(buildShopHref(partner, "/catalogue")).toBe("/p/alvine/catalogue");
    expect(buildShopHref(partner, "/produit/aloe-vera?source=pub")).toBe(
      "/p/alvine/produit/aloe-vera?source=pub",
    );
  });

  it("refuse les chemins externes et les slugs invalides", () => {
    expect(() => buildShopHref(partner, "//example.com")).toThrow();
    expect(() => buildShopHref(partner, "https://example.com")).toThrow();
    expect(() => buildShopHref({ slug: "admin", isHouse: false }, "/")).toThrow();
  });
});
