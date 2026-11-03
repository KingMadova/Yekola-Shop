"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-auth";

export default function AdminSignOut({ compact = false }: { compact?: boolean }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function signOut() {
    setBusy(true);
    await createSupabaseBrowserClient().auth.signOut();
    router.replace("/admin/connexion");
    router.refresh();
  }
  return <button onClick={signOut} disabled={busy} className={compact ? "text-[11px] font-bold text-slate-500 disabled:opacity-60" : "rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"}>{busy ? "Sortie…" : compact ? "Quitter" : "Se déconnecter"}</button>;
}
