"use client";

import { MessageCircle } from "lucide-react";
import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type RefObject,
} from "react";
import { COPY } from "@/lib/config";
import { useShop } from "@/components/providers/ShopContext";
import { normalizeCongoPhone } from "@/lib/phone";
import { formatFCFA } from "@/lib/pricing";
import {
  DELIVERY_ZONES,
  PAYMENT_METHODS,
  type CartItem,
  type CartTotals,
  type CustomerInfo,
} from "@/lib/types";
import { buildCartOrderMessage } from "@/lib/whatsapp";

type TextField = "fullName" | "phone" | "neighborhood";
type FormErrors = Partial<Record<TextField, string>>;

const INITIAL_VALUES: CustomerInfo = {
  fullName: "",
  phone: "",
  zone: DELIVERY_ZONES[0],
  neighborhood: "",
  payment: PAYMENT_METHODS[1], // MTN Mobile Money, modifiable par le client
};

function validate(values: CustomerInfo): FormErrors {
  const errors: FormErrors = {};
  if (values.fullName.trim().length < 2) errors.fullName = "Indiquez votre prénom et votre nom.";
  if (!normalizeCongoPhone(values.phone)) {
    errors.phone = "Entrez un numéro WhatsApp valide, par exemple 06 123 4567.";
  }
  if (values.neighborhood.trim().length < 3) {
    errors.neighborhood = "Indiquez votre quartier ou un repère précis pour la livraison.";
  }
  return errors;
}

const controlClass =
  "min-h-12 w-full rounded-lg border bg-white px-3 text-base text-[#30231d] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#c1440e]";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
}

function Field({ label, error, inputRef, id, ...inputProps }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-gray-900">
        {label}
      </label>
      <input
        {...inputProps}
        id={id}
        ref={inputRef}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${controlClass} ${error ? "border-red-700" : "border-[#deded4]"}`}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

interface CheckoutFormProps {
  items: readonly CartItem[];
  totals: CartTotals;
}

/** Formulaire de commande express : valide les champs, puis ouvre WhatsApp avec le récapitulatif. */
export function CheckoutForm({ items, totals }: CheckoutFormProps) {
  const uid = useId();
  const { partner, whatsappUrl } = useShop();
  const [values, setValues] = useState<CustomerInfo>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  const fieldRefs: Record<TextField, RefObject<HTMLInputElement | null>> = {
    fullName: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    neighborhood: useRef<HTMLInputElement>(null),
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = (["fullName", "phone", "neighborhood"] as const).find(
      (field) => nextErrors[field],
    );
    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus();
      return;
    }

    const url = whatsappUrl(buildCartOrderMessage(items, values, partner.displayName));
    const popup = window.open(url, "_blank");
    if (popup) popup.opener = null;
    else window.location.assign(url); // pop-up bloqué : on ouvre WhatsApp dans l'onglet courant
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-gray-900">Vos informations de livraison</h3>

      <Field
        id={`${uid}-name`}
        label="Prénom et nom"
        autoComplete="name"
        value={values.fullName}
        onChange={(event) => setValues({ ...values, fullName: event.target.value })}
        error={errors.fullName}
        inputRef={fieldRefs.fullName}
      />
      <Field
        id={`${uid}-phone`}
        label="Téléphone WhatsApp"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="06 123 4567"
        value={values.phone}
        onChange={(event) => setValues({ ...values, phone: event.target.value })}
        error={errors.phone}
        inputRef={fieldRefs.phone}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor={`${uid}-zone`} className="text-sm font-semibold text-gray-900">
          Ville
        </label>
        <select
          id={`${uid}-zone`}
          value={values.zone}
          onChange={(event) =>
            setValues({ ...values, zone: event.target.value as CustomerInfo["zone"] })
          }
          className={`${controlClass} border-gray-400`}
        >
          {DELIVERY_ZONES.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      <Field
        id={`${uid}-area`}
        label="Quartier / repère précis"
        value={values.neighborhood}
        onChange={(event) => setValues({ ...values, neighborhood: event.target.value })}
        error={errors.neighborhood}
        inputRef={fieldRefs.neighborhood}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold text-gray-900">Mode de règlement</legend>
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method}
            className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#e3dac4] bg-white px-3 text-sm has-[:checked]:border-[#c1440e] has-[:checked]:bg-[#fff0df]"
          >
            <input
              type="radio"
              name={`${uid}-payment`}
              value={method}
              checked={values.payment === method}
              onChange={() => setValues({ ...values, payment: method })}
              className="size-4 accent-[#c1440e]"
            />
            {method}
          </label>
        ))}
      </fieldset>

      <p className="text-sm text-gray-800">{COPY.cartNote}</p>

      <button
        type="submit"
        disabled={items.length === 0}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#075E54] px-5 font-semibold text-white hover:bg-[#064c44] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        <MessageCircle aria-hidden className="size-5" />
        Confirmer ma commande sur WhatsApp ({formatFCFA(totals.total)})
      </button>

      {sent && (
        <p role="status" className="rounded-xl bg-[#fff0df] p-3 text-sm text-[#c1440e]">
          Votre message est prêt dans WhatsApp. Envoyez-le pour valider votre commande.
        </p>
      )}
    </form>
  );
}
