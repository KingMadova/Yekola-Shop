"use client";

import { useFormStatus } from "react-dom";
import { updateLead } from "./actions";

const statuses = ["Nouveau", "Contacté", "Intéressé", "Client", "Perdu"] as const;

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#123d2c] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? "Enregistrement…" : "Enregistrer les modifications"}
    </button>
  );
}

export default function LeadUpdateForm({ id, status, note }: { id: string; status: string; note: string | null }) {
  return (
    <form action={updateLead} className="space-y-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
      <input type="hidden" name="id" value={id} />
      <label className="block text-sm font-bold text-slate-700">
        Statut de la demande
        <select name="status" defaultValue={status} className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-[#f8faf9] px-4 text-sm font-medium outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10">
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="block text-sm font-bold text-slate-700">
        Note interne
        <textarea name="note" defaultValue={note ?? ""} maxLength={2000} rows={5} placeholder="Compte rendu d'appel, prochaine action, informations utiles…" className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-[#f8faf9] px-4 py-3 text-sm font-medium outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
        <span className="mt-1 block text-xs font-normal text-slate-400">Visible uniquement dans l'administration. 2 000 caractères maximum.</span>
      </label>
      <div className="flex justify-end"><SaveButton /></div>
    </form>
  );
}
