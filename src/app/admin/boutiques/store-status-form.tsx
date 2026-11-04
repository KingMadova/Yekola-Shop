"use client";

import type { FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { updatePartnerStoreStatus } from "./actions";

type Props = {
  id: string;
  currentStatus: "pending" | "active" | "suspended";
};

function StatusSubmitButton({ nextStatus }: { nextStatus: "active" | "suspended" }) {
  const { pending } = useFormStatus();
  const label = nextStatus === "suspended" ? "Suspendre" : "Activer";

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "En cours…" : label}
    </button>
  );
}

export default function StoreStatusForm({ id, currentStatus }: Props) {
  const nextStatus = currentStatus === "active" ? "suspended" : "active";

  function confirmChange(event: FormEvent<HTMLFormElement>) {
    const action = nextStatus === "suspended" ? "suspendre" : "activer";
    if (!window.confirm(`Voulez-vous vraiment ${action} cette boutique ?`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={updatePartnerStoreStatus} onSubmit={confirmChange}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="current_status" value={currentStatus} />
      <input type="hidden" name="status" value={nextStatus} />
      <StatusSubmitButton nextStatus={nextStatus} />
    </form>
  );
}
