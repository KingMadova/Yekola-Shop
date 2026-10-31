import { NextResponse } from "next/server";
import { isRecord, parseLeadPayload } from "@/lib/leads";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Limite simple par IP (mémoire du serveur : suffisant contre les abus ordinaires). */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Champ piège invisible : seuls les robots le remplissent. On répond « ok » sans rien enregistrer.
  if (isRecord(body) && typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";
  if (isRateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  const lead = parseLeadPayload(body);
  if (!lead) return NextResponse.json({ ok: false }, { status: 400 });

  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.LEADS_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.warn("[leads] GOOGLE_SHEETS_WEBHOOK_URL ou LEADS_WEBHOOK_SECRET manquant");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...lead, token: secret }),
      redirect: "follow",
      cache: "no-store",
    });
    const result: unknown = await response.json().catch(() => null);
    if (!response.ok || !isRecord(result) || result.ok !== true) {
      throw new Error(`Réponse inattendue du script (${response.status})`);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[leads] échec de l'envoi vers Google Sheets", error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
