import { HOUSE_PARTNER_SLUG, LEAD_DISMISS_DAYS } from "./config";
import { isRecord, parseLeadPayload } from "./leads";
import type { LeadPayload } from "./types";

type LeadStatus = "submitted" | "dismissed";
const pendingKey = (slug: string) => `forever-lead-pending-v1:${slug}`;
const statusKey = (slug: string) => `forever-lead-status-v1:${slug}`;

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* stockage indisponible */ }
}
function safeRemove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* stockage indisponible */ }
}

export function readLeadStatus(partnerSlug: string): LeadStatus | null {
  const raw = safeGet(statusKey(partnerSlug))
    ?? (partnerSlug === HOUSE_PARTNER_SLUG ? safeGet("forever-lead-status-v1") : null);
  if (!raw) return null;
  try {
    const { status, at } = JSON.parse(raw) as { status?: unknown; at?: unknown };
    if (status === "submitted") return "submitted";
    if (status === "dismissed" && typeof at === "number") {
      return Date.now() - at < LEAD_DISMISS_DAYS * 86_400_000 ? "dismissed" : null;
    }
  } catch {
    // Valeur corrompue : ignorée.
  }
  return null;
}

export function writeLeadStatus(status: LeadStatus, partnerSlug: string): void {
  if (readLeadStatus(partnerSlug) === "submitted") return;
  safeSet(statusKey(partnerSlug), JSON.stringify({ status, at: Date.now() }));
}

async function post(payload: LeadPayload, honeypot = ""): Promise<boolean> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, website: honeypot }),
      keepalive: true,
    });
    const result: unknown = await response.json().catch(() => null);
    if (!response.ok || !isRecord(result) || result.ok !== true) return false;
    safeRemove(pendingKey(payload.partnerSlug));
    if (payload.partnerSlug === HOUSE_PARTNER_SLUG) safeRemove("forever-lead-pending-v1");
    return true;
  } catch {
    return false;
  }
}

export async function sendLead(payload: LeadPayload, honeypot = ""): Promise<boolean> {
  safeSet(pendingKey(payload.partnerSlug), JSON.stringify(payload));
  return post(payload, honeypot);
}

export async function retryPendingLead(partnerSlug: string): Promise<void> {
  const raw = safeGet(pendingKey(partnerSlug))
    ?? (partnerSlug === HOUSE_PARTNER_SLUG ? safeGet("forever-lead-pending-v1") : null);
  if (!raw) return;
  try {
    const payload = parseLeadPayload(JSON.parse(raw));
    if (payload && payload.partnerSlug === partnerSlug && (await post(payload))) {
      writeLeadStatus("submitted", partnerSlug);
    }
  } catch {
    // Valeur corrompue : ignorée.
  }
}
