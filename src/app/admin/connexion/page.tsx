import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";
import LoginForm from "./login-form";

export const metadata = { title: "Connexion administrateur | Yekola Shop", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
    if (admin) redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">Yekola Shop</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Espace administration</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Connectez-vous avec le compte administrateur qui vous a été attribué.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs leading-5 text-slate-500">Accès réservé aux administrateurs autorisés. Aucun compte ne peut être créé depuis cette page.</p>
      </section>
    </main>
  );
}
