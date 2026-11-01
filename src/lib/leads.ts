import { HOUSE_PARTNER_SLUG } from "./config";
import { normalizeCongoPhone } from "./phone";
import { HEALTH_GOALS, type HealthGoal, type LeadPayload, type LeadLocation } from "./types";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const text = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const isGoal = (value: unknown): value is HealthGoal =>
  typeof value === "string" && (HEALTH_GOALS as readonly string[]).includes(value);

function parseFirstVisitAt(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 50) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function parseLocation(value: unknown): LeadLocation | null {
  if (!isRecord(value)) return null;

  const { latitude, longitude, accuracy } = value;
  if (
    typeof latitude !== "number" ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    typeof longitude !== "number" ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  const validAccuracy =
    typeof accuracy === "number" &&
    Number.isFinite(accuracy) &&
    accuracy >= 0 &&
    accuracy <= 100_000;

  return {
    latitude,
    longitude,
    accuracy: validAccuracy ? accuracy : null,
  };
}

/** Validation côté serveur : tout ce qui vient du navigateur est non fiable. */
export function parseLeadPayload(input: unknown): LeadPayload | null {
  if (!isRecord(input)) return null;

  const partnerSlug = text(input.partnerSlug, 30) || HOUSE_PARTNER_SLUG;
  if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(partnerSlug)) return null;

  const firstName = text(input.firstName, 60);
  const phone = typeof input.phone === "string" ? normalizeCongoPhone(input.phone) : null;
  if (firstName.length < 2 || !phone) return null;

  const location = parseLocation(input.location);

  return {
    partnerSlug,
    firstName,
    phone,
    need: isGoal(input.need) ? input.need : null,
    needOrigin: text(input.needOrigin, 120),
    otherNeeds: Array.isArray(input.otherNeeds) ? input.otherNeeds.filter(isGoal).slice(0, 5) : [],
    viewedProducts: Array.isArray(input.viewedProducts)
      ? input.viewedProducts.map((name) => text(name, 80)).filter(Boolean).slice(0, 8)
      : [],
    cartTotal:
      typeof input.cartTotal === "number" && Number.isFinite(input.cartTotal)
        ? Math.min(1_000_000_000, Math.max(0, Math.round(input.cartTotal)))
        : 0,
    campaign: text(input.campaign, 120),
    source: text(input.source, 120),
    referrer: text(input.referrer, 500),
    landingPath: text(input.landingPath, 300),
    pagePath: text(input.pagePath, 300),
    firstVisitAt: parseFirstVisitAt(input.firstVisitAt),
    location,
  };
}
