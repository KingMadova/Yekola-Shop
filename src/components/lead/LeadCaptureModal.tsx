"use client";

import { Check, MapPin, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { focusRing } from "@/components/ui/styles";
import { useCatalog } from "@/components/providers/CatalogContext";
import { CATALOG_PDF_PATH, COPY, HEALTH_GOAL_META, HOUSE_PARTNER_SLUG, LEAD_MODAL_DELAY_MS } from "@/lib/config";
import { buildNeedProfile, ORIGIN_LABELS } from "@/lib/interest";
import { readLeadStatus, retryPendingLead, sendLead, writeLeadStatus } from "@/lib/leadClient";
import { normalizeCongoPhone } from "@/lib/phone";
import { computeCartTotals } from "@/lib/pricing";
import { HEALTH_GOALS, type HealthGoal, type LeadLocation, type LeadPayload } from "@/lib/types";
import { useCartItems, useCartStore } from "@/store/useCartStore";
import { useInterestStore } from "@/store/useInterestStore";

const fieldClass = `min-h-12 w-full rounded-lg border bg-white px-3 text-base text-gray-900 ${focusRing}`;

type LocationState = "idle" | "loading" | "granted" | "denied" | "unavailable";

function isTyping(): boolean {
  const element = document.activeElement;
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}

function downloadCatalogue(): boolean {
  // Le chemin doit désigner un fichier réel dans /public. Aucun lien fictif par défaut.
  if (!CATALOG_PDF_PATH.startsWith("/") || CATALOG_PDF_PATH.startsWith("//")) return false;

  const link = document.createElement("a");
  link.href = CATALOG_PDF_PATH;
  link.download = "catalogue-yekola-shop.pdf";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
}

/**
 * Pop-up de capture : prénom + numéro WhatsApp.
 * Le besoin est déduit du parcours et le GPS ne peut être demandé qu'après un clic explicite.
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
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<{ firstName?: string; phone?: string }>({});
  const [location, setLocation] = useState<LeadLocation | null>(null);
  const [locationState, setLocationState] = useState<LocationState>("idle");

  useEffect(() => {
    void retryPendingLead();
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
    if (!submitted.current) {
      writeLeadStatus("dismissed");
      return;
    }
    window.setTimeout(() => {
      document.getElementById("besoins")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function handleRequestLocation() {
    if (!navigator.geolocation) {
      setLocationState("unavailable");
      return;
    }

    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null,
        });
        setLocationState("granted");
      },
      (error) => {
        setLocation(null);
        setLocationState(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const normalized = normalizeCongoPhone(phone);
    const nextErrors = {
      firstName: firstName.trim().length < 2 ? "Indiquez votre prénom." : undefined,
      phone: normalized ? undefined : "Entrez un numéro WhatsApp valide, par exemple 06 123 4567.",
    };
    setErrors(nextErrors);
    setFormError("");
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
      partnerSlug: HOUSE_PARTNER_SLUG,
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
      firstVisitAt: interest.firstSeenAt,
      location,
    };

    setSubmitting(true);
    const saved = await sendLead(payload, honeypot);
    setSubmitting(false);

    if (!saved) {
      setFormError("Nous n'avons pas pu enregistrer vos informations. Vérifiez votre connexion puis réessayez.");
      return;
    }

    submitted.current = true;
    writeLeadStatus("submitted");
    if (!downloadCatalogue()) {
      setFormError("");
    }
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
            <p className="text-gray-800">Vos informations ont bien été enregistrées.</p>
            {CATALOG_PDF_PATH ? (
              <p className="text-sm text-gray-700">Le téléchargement du catalogue a été lancé. Vous pouvez poursuivre votre navigation.</p>
            ) : (
              <p className="text-sm text-amber-800">Le catalogue PDF n'est pas encore disponible au téléchargement. Votre demande est bien enregistrée.</p>
            )}
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className={`min-h-12 rounded-xl border border-emerald-700 px-6 font-semibold text-emerald-800 hover:bg-emerald-50 ${focusRing}`}
            >
              Continuer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-4">
            <h2 id={titleId} className="pr-10 text-xl font-bold">
              Recevez le catalogue officiel Forever et ses tarifs en FCFA
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

            <section className="rounded-xl border border-gray-200 p-3">
              <div className="flex items-start gap-2">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-800" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">Localisation (facultative)</p>
                  <p className="mt-1 text-xs text-gray-700">
                    Vous pouvez partager votre position pour nous aider à mieux situer votre demande. Elle n'est jamais demandée sans votre clic.
                  </p>
                  {locationState === "granted" && (
                    <p className="mt-2 text-xs font-medium text-emerald-800">Position ajoutée à votre demande.</p>
                  )}
                  {locationState === "denied" && (
                    <p className="mt-2 text-xs text-gray-700">Autorisation refusée. Vous pouvez continuer sans localisation.</p>
                  )}
                  {locationState === "unavailable" && (
                    <p className="mt-2 text-xs text-gray-700">Position indisponible sur cet appareil. Vous pouvez continuer sans localisation.</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleRequestLocation}
                      disabled={locationState === "loading"}
                      className={`min-h-10 rounded-lg border border-emerald-700 px-3 text-sm font-semibold text-emerald-800 disabled:opacity-60 ${focusRing}`}
                    >
                      {locationState === "loading" ? "Localisation…" : location ? "Actualiser ma position" : "Partager ma position"}
                    </button>
                    {location && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocation(null);
                          setLocationState("idle");
                        }}
                        className={`min-h-10 rounded-lg px-3 text-sm text-gray-700 underline ${focusRing}`}
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

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

            {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#075E54] px-5 font-semibold text-white hover:bg-[#064c44] disabled:cursor-wait disabled:opacity-70 ${focusRing}`}
            >
              {submitting ? "Enregistrement…" : "Enregistrer et télécharger le catalogue"}
            </button>

            <p className="text-center text-xs text-gray-700">
              {COPY.leadReassurance} En validant, vous acceptez l'utilisation de ces informations pour donner suite à votre demande. La localisation reste facultative.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
