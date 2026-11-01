import { LEAD_DISMISS_DAYS } from "./config";
import { isRecord, parseLeadPayload } from "./leads";
import type { LeadPayload } from "./types";

const PENDING_KEY = "forever-lead-pending-v1";
const STATUS_KEY = "forever-lead-status-v1";
type LeadStatus = "submitted" | "dismissed";

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* navigation privée : on continue sans mémoire */
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* stockage indisponible : sans effet */
  }
}

/** « submitted » pour toujours, « dismissed » pendant LEAD_DISMISS_DAYS jours. */
export function readLeadStatus(): LeadStatus | null {
  const raw = safeGet(STATUS_KEY);
  if (!raw) return null;
  try {
    const { status, at } = JSON.parse(raw) as { status?: unknown; at?: unknown };
    if (status === "submitted") return "submitted";
    if (status === "dismissed" && typeof at === "number") {
      return Date.now() - at < LEAD_DISMISS_DAYS * 86_400_000 ? "dismissed" : null;
    }
  } catch {
    /* valeur corrompue : ignorée */
  }
  return null;
}

export function writeLeadStatus(status: LeadStatus): void {
  if (readLeadStatus() === "submitted") return;
  safeSet(STATUS_KEY, JSON.stringify({ status, at: Date.now() }));
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

    safeRemove(PENDING_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Attend la confirmation Supabase ; garde une copie locale si l'API échoue. */
export async function sendLead(payload: LeadPayload, honeypot = ""): Promise<boolean> {
  safeSet(PENDING_KEY, JSON.stringify(payload));
  return post(payload, honeypot);
}

/** Reprend un envoi interrompu lors d'une visite ultérieure, sans afficher de faux succès. */
export async function retryPendingLead(): Promise<void> {
  const raw = safeGet(PENDING_KEY);
  if (!raw) return;
  try {
    const payload = parseLeadPayload(JSON.parse(raw));
    if (payload && (await post(payload))) writeLeadStatus("submitted");
  } catch {
    /* valeur corrompue : ignorée */
  }
}
