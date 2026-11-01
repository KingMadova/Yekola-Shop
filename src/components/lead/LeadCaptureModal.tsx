"use client";

import { Check, MessageCircle, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { focusRing } from "@/components/ui/styles";
import { useCatalog } from "@/components/providers/CatalogContext";
import { COPY, HEALTH_GOAL_META, LEAD_MODAL_DELAY_MS } from "@/lib/config";
import { buildNeedProfile, ORIGIN_LABELS } from "@/lib/interest";
import { readLeadStatus, retryPendingLead, sendLead, writeLeadStatus } from "@/lib/leadClient";
import { normalizeCongoPhone } from "@/lib/phone";
import { computeCartTotals } from "@/lib/pricing";
import { HEALTH_GOALS, type HealthGoal, type LeadPayload } from "@/lib/types";
import { buildLeadMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCartItems, useCartStore } from "@/store/useCartStore";
import { useInterestStore } from "@/store/useInterestStore";

const fieldClass = `min-h-12 w-full rounded-lg border bg-white px-3 text-base text-gray-900 ${focusRing}`;

function isTyping(): boolean {
  const element = document.activeElement;
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}

/**
 * Pop-up de capture : prénom + numéro WhatsApp, rien d'autre d'obligatoire.
 * Le besoin est déduit du parcours (publicité, filtres, fiches, panier) ; le visiteur peut le corriger en un geste.
 */
export function LeadCaptureModal() {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const submitted = useRef(false);
  const { getProductByCode } = useCatalog();
  const cartItems = useCartItems();
  const itemsRef = useRef(cartItems);
  useEffect(() => {
    itemsRef.current = cartItems;
  }, [cartItems]);

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [need, setNeed] = useState<HealthGoal | null>(null);
  const [inferred, setInferred] = useState(false);
  const [editingNeed, setEditingNeed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; phone?: string }>({});

  // Ouverture après 7 s, sans jamais gêner : onglet masqué, panier ouvert ou saisie en cours => on attend.
  useEffect(() => {
    retryPendingLead();
    if (readLeadStatus() !== null) return;

    let timer = 0;
    let attempts = 0;
    const tryOpen = () => {
      const busy = document.hidden || useCartStore.getState().isOpen || isTyping();
      if (busy) {
        if (attempts < 8) {
          attempts += 1;
          timer = window.setTimeout(tryOpen, 4000);
        }
        return;
      }
      const interest = useInterestStore.getState();
      const profile = buildNeedProfile({
        scores: interest.scores,
        origins: interest.origins,
        chosen: null,
        cartGoals: itemsRef.current.flatMap((item) => item.product.healthGoals),
      });
      setNeed(profile.need);
      setInferred(profile.need !== null);
      setOpen(true);
    };
    timer = window.setTimeout(tryOpen, LEAD_MODAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  function handleClose() {
    setOpen(false);
    if (!submitted.current) writeLeadStatus("dismissed");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeCongoPhone(phone);
    const nextErrors = {
      firstName: firstName.trim().length < 2 ? "Indiquez votre prénom." : undefined,
      phone: normalized ? undefined : "Entrez un numéro WhatsApp valide, par exemple 06 123 4567.",
    };
    setErrors(nextErrors);
    if (nextErrors.firstName) return nameRef.current?.focus();
    if (nextErrors.phone || !normalized) return phoneRef.current?.focus();

    const interest = useInterestStore.getState();
    const items = itemsRef.current;
    const profile = buildNeedProfile({
      scores: interest.scores,
      origins: interest.origins,
      chosen: touched ? need : null,
      cartGoals: items.flatMap((item) => item.product.healthGoals),
    });
    const payload: LeadPayload = {
      firstName: firstName.trim(),
      phone: normalized,
      need: profile.need,
      needOrigin: profile.origins.map((origin) => ORIGIN_LABELS[origin]).join(", "),
      otherNeeds: profile.others,
      viewedProducts: interest.viewedProducts.map((code) => getProductByCode(code)?.name ?? code),
      cartTotal: computeCartTotals(items).total,
      campaign: interest.campaign ?? "",
      source: interest.source ?? "",
      referrer: interest.referrer ?? "",
      landingPath: interest.landingPath ?? "",
      pagePath: window.location.pathname,
    };

    // 1) Le lead part vers Google Sheets sans attendre (copie locale en cas d'échec). 2) WhatsApp s'ouvre aussitôt.
    sendLead(payload, honeypot);
    submitted.current = true;
    writeLeadStatus("submitted");

    const url = buildWhatsAppUrl(buildLeadMessage(payload.firstName, payload.phone, profile.need ?? undefined));
    const popup = window.open(url, "_blank");
    if (popup) popup.opener = null;
    else window.location.assign(url);
    setDone(true);
  }

  const chips = (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-semibold text-gray-900">Votre besoin (facultatif)</legend>
      <div className="flex flex-wrap gap-2">
        {HEALTH_GOALS.map((goal) => (
          <label
            key={goal}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-gray-300 bg-white px-4 text-sm has-[:checked]:border-emerald-700 has-[:checked]:bg-emerald-700 has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-emerald-700"
          >
            <input
              type="radio"
              name={`${titleId}-need`}
              value={goal}
              checked={need === goal}
              onChange={() => {
                setNeed(goal);
                setTouched(true);
              }}
              className="sr-only"
            />
            {HEALTH_GOAL_META[goal].shortLabel}
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-3xl bg-white p-0 text-gray-900 backdrop:bg-black/50 sm:m-auto sm:max-w-md sm:rounded-3xl"
    >
      <div className="relative flex flex-col gap-4 p-5">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Fermer"
          className={`absolute right-2 top-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-gray-100 ${focusRing}`}
        >
          <X aria-hidden className="size-5" />
        </button>

        {done ? (
          <div role="status" className="flex flex-col items-center gap-3 py-4 text-center">
            <Check aria-hidden className="size-12 rounded-full bg-emerald-100 p-2.5 text-emerald-800" />
            <h2 id={titleId} className="text-xl font-bold">Merci {firstName.trim()} !</h2>
            <p className="text-gray-800">WhatsApp s&apos;ouvre avec votre demande. Envoyez le message pour recevoir le catalogue.</p>
            <button type="button" onClick={() => dialogRef.current?.close()} className={`min-h-12 rounded-xl border border-emerald-700 px-6 font-semibold text-emerald-800 hover:bg-emerald-50 ${focusRing}`}>
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-4">
            <h2 id={titleId} className="pr-10 text-xl font-bold">
              Téléchargez le catalogue officiel Forever avec les tarifs en FCFA sur WhatsApp
            </h2>

            <div className="flex flex-col gap-1">
              <label htmlFor={`${titleId}-name`} className="text-sm font-semibold">Prénom</label>
              <input
                id={`${titleId}-name`}
                ref={nameRef}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                aria-invalid={errors.firstName ? true : undefined}
                aria-describedby={errors.firstName ? `${titleId}-name-error` : undefined}
                className={`${fieldClass} ${errors.firstName ? "border-red-700" : "border-gray-400"}`}
              />
              {errors.firstName && <p id={`${titleId}-name-error`} className="text-sm text-red-700">{errors.firstName}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={`${titleId}-phone`} className="text-sm font-semibold">Numéro WhatsApp</label>
              <input
                id={`${titleId}-phone`}
                ref={phoneRef}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="06 123 4567"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? `${titleId}-phone-error` : undefined}
                className={`${fieldClass} ${errors.phone ? "border-red-700" : "border-gray-400"}`}
              />
              {errors.phone && <p id={`${titleId}-phone-error`} className="text-sm text-red-700">{errors.phone}</p>}
            </div>

            {inferred && need && !editingNeed ? (
              <p className="text-sm text-gray-800">
                Catalogue adapté à : <strong>{HEALTH_GOAL_META[need].shortLabel}</strong>{" "}
                <button type="button" onClick={() => setEditingNeed(true)} className={`rounded font-medium text-emerald-800 underline ${focusRing}`}>
                  Changer
                </button>
              </p>
            ) : (
              chips
            )}

            {/* Champ piège : invisible pour les humains, rempli par les robots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              className="absolute -left-[9999px] size-px opacity-0"
            />

            <button type="submit" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#075E54] px-5 font-semibold text-white hover:bg-[#064c44] ${focusRing}`}>
              <MessageCircle aria-hidden className="size-5" />
              Recevoir le catalogue sur WhatsApp
            </button>

            <p className="text-center text-xs text-gray-700">
              {COPY.leadReassurance} En continuant, vous acceptez d&apos;être contacté sur WhatsApp au sujet de ce catalogue.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
