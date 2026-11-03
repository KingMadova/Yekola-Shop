import Link from "next/link";
import { createPartnerStore, updatePartnerStore } from "./actions";

type StoreValues = {
  id?: string;
  display_name: string;
  slug: string;
  whatsapp_number: string;
  email: string | null;
  fbo_id: string | null;
  city: string | null;
};

export default function PartnerStoreForm({ store, error }: { store?: StoreValues; error?: string }) {
  const action = store ? updatePartnerStore : createPartnerStore;

  return (
    <form action={action} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
      {store?.id && <input type="hidden" name="id" value={store.id} />}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">Nom de la boutique *
          <input name="display_name" required minLength={2} maxLength={100} defaultValue={store?.display_name ?? ""} placeholder="Ex. Boutique de Marie" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
        </label>
        <label className="block text-sm font-medium text-slate-700">Identifiant URL (slug) *
          <input name="slug" required minLength={3} maxLength={30} pattern="[a-z0-9][a-z0-9-]{1,28}[a-z0-9]" defaultValue={store?.slug ?? ""} placeholder="ex. marie-koumba" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          <span className="mt-1 block text-xs font-normal text-slate-500">Adresse : /p/identifiant — minuscules, chiffres et tirets.</span>
        </label>
        <label className="block text-sm font-medium text-slate-700">WhatsApp (Congo) *
          <input name="whatsapp_number" required defaultValue={store?.whatsapp_number ?? "242"} placeholder="242XXXXXXXXX" inputMode="tel" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          <span className="mt-1 block text-xs font-normal text-slate-500">242 suivi de 9 chiffres, sans espace.</span>
        </label>
        <label className="block text-sm font-medium text-slate-700">Adresse e-mail
          <input name="email" type="email" defaultValue={store?.email ?? ""} placeholder="partenaire@exemple.com" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
        </label>
        <label className="block text-sm font-medium text-slate-700">Numéro FBO
          <input name="fbo_id" defaultValue={store?.fbo_id ?? ""} placeholder="Numéro Forever" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
        </label>
        <label className="block text-sm font-medium text-slate-700">Ville
          <input name="city" defaultValue={store?.city ?? ""} placeholder="Pointe-Noire" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
        </label>
      </div>
      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        <button type="submit" className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900">{store ? "Enregistrer les modifications" : "Créer la boutique"}</button>
        <Link href="/admin/boutiques" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Annuler</Link>
      </div>
    </form>
  );
}
