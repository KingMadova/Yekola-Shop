import Link from "next/link";
import { createPartnerStore, updatePartnerStore } from "./actions";
import StoreSubmitButton from "./submit-button";

type StoreValues = {
  id?: string;
  display_name: string;
  slug: string;
  whatsapp_number: string;
  email: string | null;
  fbo_id: string | null;
  city: string | null;
};

const inputClass = "mt-2.5 min-h-12 w-full rounded-2xl border border-slate-200 bg-[#f8faf9] px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10";

export default function PartnerStoreForm({ store, error }: { store?: StoreValues; error?: string }) {
  const action = store ? updatePartnerStore : createPartnerStore;

  return (
    <form action={action} className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_8px_35px_rgba(15,45,32,0.055)]">
      {store?.id && <input type="hidden" name="id" value={store.id} />}
      <div className="border-b border-slate-100 px-5 py-5 sm:px-7"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">Informations générales</p><h2 className="mt-1 text-base font-extrabold">Identité de la boutique</h2><p className="mt-1 text-xs leading-5 text-slate-500">Ces informations permettront d'identifier la boutique sur Yekola Shop.</p></div>
      <div className="space-y-5 p-5 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-5 sm:space-y-0 sm:p-7">
        {error && <p role="alert" className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:col-span-2">{error}</p>}
        <label className="block text-xs font-bold text-slate-700">Nom de la boutique <span className="text-emerald-700">*</span>
          <input name="display_name" required minLength={2} maxLength={100} defaultValue={store?.display_name ?? ""} placeholder="Ex. Boutique de Marie" className={inputClass} />
        </label>
        <label className="block text-xs font-bold text-slate-700">Identifiant URL (slug) <span className="text-emerald-700">*</span>
          <input name="slug" required minLength={3} maxLength={30} pattern="[a-z0-9][a-z0-9-]{1,28}[a-z0-9]" defaultValue={store?.slug ?? ""} placeholder="marie-koumba" className={inputClass} />
          <span className="mt-2 block text-[11px] font-normal leading-5 text-slate-400">URL publique : yekolashop.com/p/identifiant</span>
        </label>
        <label className="block text-xs font-bold text-slate-700">Numéro WhatsApp <span className="text-emerald-700">*</span>
          <input name="whatsapp_number" required defaultValue={store?.whatsapp_number ?? "242"} placeholder="242XXXXXXXXX" inputMode="tel" className={inputClass} />
          <span className="mt-2 block text-[11px] font-normal text-slate-400">Indicatif 242 suivi de 9 chiffres.</span>
        </label>
        <label className="block text-xs font-bold text-slate-700">Adresse e-mail
          <input name="email" type="email" defaultValue={store?.email ?? ""} placeholder="partenaire@exemple.com" className={inputClass} />
        </label>
      </div>
      <div className="border-y border-slate-100 bg-[#fbfcfb] px-5 py-5 sm:px-7"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">Informations complémentaires</p><p className="mt-1 text-xs text-slate-500">Facultatives — vous pourrez les compléter plus tard.</p></div>
      <div className="space-y-5 p-5 sm:grid sm:grid-cols-2 sm:gap-5 sm:space-y-0 sm:p-7">
        <label className="block text-xs font-bold text-slate-700">Numéro FBO
          <input name="fbo_id" defaultValue={store?.fbo_id ?? ""} placeholder="Numéro Forever" className={inputClass} />
        </label>
        <label className="block text-xs font-bold text-slate-700">Ville
          <input name="city" defaultValue={store?.city ?? ""} placeholder="Pointe-Noire" className={inputClass} />
        </label>
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white p-5 sm:flex-row sm:justify-end sm:px-7 sm:py-5">
        <Link href="/admin/boutiques" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Annuler</Link>
        <StoreSubmitButton editing={Boolean(store)} />
      </div>
    </form>
  );
}
