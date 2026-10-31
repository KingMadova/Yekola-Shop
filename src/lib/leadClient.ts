import { LEAD_DISMISS_DAYS } from "./config";
import { parseLeadPayload } from "./leads";
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

/** « submitted » pour toujours, « dismissed » pendant LEAD_DISMISS_DAYS jours : ensuite le pop-up peut revenir une fois. */
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

async function post(payload: LeadPayload, honeypot = ""): Promise<void> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, website: honeypot }),
      keepalive: true, // la requête aboutit même si WhatsApp prend le dessus sur l'onglet
    });
    if (response.ok) localStorage.removeItem(PENDING_KEY);
  } catch {
    /* réseau coupé : le lead reste en attente et repart à la prochaine visite */
  }
}

/** Envoie le lead sans jamais bloquer le visiteur ; garde une copie locale jusqu'à confirmation. */
export function sendLead(payload: LeadPayload, honeypot = ""): void {
  safeSet(PENDING_KEY, JSON.stringify(payload));
  void post(payload, honeypot);
}

export function retryPendingLead(): void {
  const raw = safeGet(PENDING_KEY);
  if (!raw) return;
  try {
    const payload = parseLeadPayload(JSON.parse(raw));
    if (payload) void post(payload);
  } catch {
    /* ignoré */
  }
}
