import { describe, expect, it } from "vitest";
import { isValidPartnerSlug } from "../partner-slug";

describe("isValidPartnerSlug", () => {
  it("accepte les slugs conformes à la règle des partenaires", () => {
    expect(isValidPartnerSlug("yekola")).toBe(true);
    expect(isValidPartnerSlug("alvine-2026")).toBe(true);
    expect(isValidPartnerSlug("abc")).toBe(true);
  });

  it("rejette les slugs trop courts, trop longs ou mal formés", () => {
    expect(isValidPartnerSlug("ab")).toBe(false);
    expect(isValidPartnerSlug("a".repeat(31))).toBe(false);
    expect(isValidPartnerSlug("-alvine")).toBe(false);
    expect(isValidPartnerSlug("alvine-")).toBe(false);
    expect(isValidPartnerSlug("Alvine")).toBe(false);
    expect(isValidPartnerSlug("alvine_shop")).toBe(false);
    expect(isValidPartnerSlug("../admin")).toBe(false);
  });

  it("rejette les chemins réservés par l'application", () => {
    for (const slug of ["admin", "api", "p", "catalogue", "produit", "connexion", "sitemap"]) {
      expect(isValidPartnerSlug(slug)).toBe(false);
    }
  });
});
