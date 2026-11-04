"use client";

import { useFormStatus } from "react-dom";

export default function StoreSubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#123d2c] px-6 text-sm font-extrabold text-white shadow-lg shadow-emerald-950/15 transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enregistrement…" : editing ? "Enregistrer les modifications" : "Créer la boutique"}
    </button>
  );
}
