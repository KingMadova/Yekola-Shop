import { describe, expect, it } from "vitest";
import { parseLeadPayload } from "../leads";

const basePayload = {
  firstName: "Alvine",
  phone: "06 123 4567",
  need: null,
  needOrigin: "",
  otherNeeds: [],
  viewedProducts: [],
  cartTotal: 0,
  campaign: "",
  source: "",
  referrer: "",
  landingPath: "/",
  pagePath: "/",
};

describe("parseLeadPayload", () => {
  it("normalise le téléphone et accepte un lead sans GPS", () => {
    const lead = parseLeadPayload(basePayload);
    expect(lead?.phone).toBe("242061234567");
    expect(lead?.location).toBeNull();
    expect(lead?.firstVisitAt).toBeNull();
  });

  it("conserve une date de première visite ISO valide", () => {
    const lead = parseLeadPayload({
      ...basePayload,
      firstVisitAt: "2026-11-01T08:00:00.000Z",
    });
    expect(lead?.firstVisitAt).toBe("2026-11-01T08:00:00.000Z");
  });

  it("accepte les coordonnées uniquement si latitude et longitude sont valides", () => {
    const lead = parseLeadPayload({
      ...basePayload,
      location: { latitude: -4.7692, longitude: 11.8664, accuracy: 25 },
    });
    expect(lead?.location).toEqual({
      latitude: -4.7692,
      longitude: 11.8664,
      accuracy: 25,
    });
  });

  it("ignore une position absente ou invalide sans invalider le lead", () => {
    const lead = parseLeadPayload({
      ...basePayload,
      location: { latitude: 120, longitude: 11.8664, accuracy: -5 },
    });
    expect(lead?.phone).toBe("242061234567");
    expect(lead?.location).toBeNull();
  });

  it("utilise la boutique maison par défaut et rejette un slug invalide", () => {
    expect(parseLeadPayload(basePayload)?.partnerSlug).toBe("yekola");
    expect(parseLeadPayload({ ...basePayload, partnerSlug: "../admin" })).toBeNull();
  });

  it("rejette un prénom ou un numéro invalide", () => {
    expect(parseLeadPayload({ ...basePayload, firstName: "A" })).toBeNull();
    expect(parseLeadPayload({ ...basePayload, phone: "123" })).toBeNull();
  });
});
