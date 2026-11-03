"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-auth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("La session n'a pas pu être vérifiée.");

      const { data: admin, error: adminError } = await supabase
        .from("admins").select("user_id").eq("user_id", user.id).maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        throw new Error("Ce compte n'a pas les droits administrateur.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connexion impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  const reason = searchParams.get("error");

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      {reason === "unauthorized" && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Votre compte n'est pas autorisé à accéder à l'administration.</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block text-sm font-medium text-slate-700">Adresse e-mail
        <input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
      </label>
      <label className="block text-sm font-medium text-slate-700">Mot de passe
        <input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
      </label>
      <button disabled={busy} className="w-full rounded-xl bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
