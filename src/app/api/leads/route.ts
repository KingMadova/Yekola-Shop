import { NextResponse } from "next/server";
import { isRecord, parseLeadPayload } from "@/lib/leads";
import { HOUSE_PARTNER_SLUG } from "@/lib/config";
import { normalizeCongoPhone } from "@/lib/phone";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Limite simple par IP en mémoire ; aucune adresse IP n'est enregistrée dans Supabase. */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

async function getPartnerId(
  client: NonNullable<ReturnType<typeof createAdminClient>>,
  partnerSlug: string,
): Promise<string | null> {
  const { data: existing, error } = await client
    .from("partners")
    .select("id, status")
    .eq("slug", partnerSlug)
    .maybeSingle();

  if (error) throw new Error("Impossible de vérifier la boutique.");
  if (existing) return existing.status === "active" ? existing.id : null;

  // Première initialisation de la boutique maison avec le numéro déjà configuré dans l'environnement.
  if (partnerSlug !== HOUSE_PARTNER_SLUG) return null;
  const whatsappNumber = normalizeCongoPhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "");
  if (!whatsappNumber) return null;

  const { data: created, error: createError } = await client
    .from("partners")
    .insert({
      slug: HOUSE_PARTNER_SLUG,
      display_name: "Yekola Shop",
      whatsapp_number: whatsappNumber,
      is_house: true,
      status: "active",
    })
    .select("id")
    .single();

  if (createError || !created) {
    // Une requête concurrente a éventuellement créé la boutique entre-temps.
    const { data: retry } = await client
      .from("partners")
      .select("id, status")
      .eq("slug", partnerSlug)
      .maybeSingle();
    return retry?.status === "active" ? retry.id : null;
  }

  return created.id;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  // Champ piège invisible : les robots reçoivent une réponse neutre, sans insertion.
  if (isRecord(body) && typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "RATE_LIMITED" }, { status: 429 });
  }

  const lead = parseLeadPayload(body);
  if (!lead) return NextResponse.json({ ok: false, error: "INVALID_LEAD" }, { status: 400 });

  const client = createAdminClient();
  if (!client) {
    console.error("[leads] NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant");
    return NextResponse.json({ ok: false, error: "SERVER_NOT_CONFIGURED" }, { status: 503 });
  }

  try {
    const partnerId = await getPartnerId(client, lead.partnerSlug);
    if (!partnerId) {
      console.error("[leads] Boutique absente, inactive ou non configurée :", lead.partnerSlug);
      return NextResponse.json({ ok: false, error: "SHOP_NOT_CONFIGURED" }, { status: 503 });
    }

    const { error } = await client.rpc("upsert_lead", {
      p_partner_id: partnerId,
      p_first_name: lead.firstName,
      p_phone: lead.phone,
      p_need: lead.need,
      p_need_origin: lead.needOrigin,
      p_other_needs: lead.otherNeeds,
      p_viewed_products: lead.viewedProducts,
      p_cart_total: lead.cartTotal,
      p_campaign: lead.campaign,
      p_source: lead.source,
      p_referrer: lead.referrer,
      p_landing_path: lead.landingPath,
      p_page_path: lead.pagePath,
      p_first_visit_at: lead.firstVisitAt,
      p_latitude: lead.location?.latitude ?? null,
      p_longitude: lead.location?.longitude ?? null,
      p_location_accuracy_m: lead.location?.accuracy ?? null,
    });

    if (error) {
      console.error("[leads] échec de l'enregistrement Supabase", error.message);
      return NextResponse.json({ ok: false, error: "DATABASE_ERROR" }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[leads] échec de l'enregistrement", error);
    return NextResponse.json({ ok: false, error: "LEAD_SAVE_FAILED" }, { status: 502 });
  }
}
