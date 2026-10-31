import { normalizeCongoPhone } from "./phone";
import { HEALTH_GOALS, type HealthGoal, type LeadPayload } from "./types";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const text = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const isGoal = (value: unknown): value is HealthGoal =>
  typeof value === "string" && (HEALTH_GOALS as readonly string[]).includes(value);

/** Validation côté serveur : tout ce qui vient du navigateur est non fiable. */
export function parseLeadPayload(input: unknown): LeadPayload | null {
  if (!isRecord(input)) return null;
  const firstName = text(input.firstName, 60);
  const phone = typeof input.phone === "string" ? normalizeCongoPhone(input.phone) : null;
  if (firstName.length < 2 || !phone) return null;

  return {
    firstName,
    phone,
    need: isGoal(input.need) ? input.need : null,
    needOrigin: text(input.needOrigin, 80),
    otherNeeds: Array.isArray(input.otherNeeds) ? input.otherNeeds.filter(isGoal).slice(0, 5) : [],
    viewedProducts: Array.isArray(input.viewedProducts)
      ? input.viewedProducts.map((name) => text(name, 80)).filter(Boolean).slice(0, 8)
      : [],
    cartTotal:
      typeof input.cartTotal === "number" && Number.isFinite(input.cartTotal)
        ? Math.max(0, Math.round(input.cartTotal))
        : 0,
    campaign: text(input.campaign, 120),
    source: text(input.source, 120),
    referrer: text(input.referrer, 120),
    landingPath: text(input.landingPath, 200),
    pagePath: text(input.pagePath, 200),
  };
}
