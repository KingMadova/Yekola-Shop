import type { ReactNode } from "react";
import Link from "next/link";
import AdminSignOut from "./sign-out";

type AdminShellProps = {
  children: ReactNode;
  active: "dashboard" | "stores" | "create" | "leads";
  email?: string;
};

const navItems = [
  { href: "/admin", label: "Accueil", short: "Accueil", icon: "⌂", key: "dashboard" },
  { href: "/admin/boutiques", label: "Boutiques", short: "Boutiques", icon: "▦", key: "stores" },
  { href: "/admin/leads", label: "Demandes clients", short: "Demandes", icon: "◎", key: "leads" },
] as const;

export default function AdminShell({ children, active, email }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f7f5] pb-24 text-[#15251e] md:pb-8">
      <header className="sticky top-0 z-30 border-b border-emerald-950/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3" aria-label="Yekola Shop, accueil administration">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#123d2c] text-lg font-black text-white shadow-lg shadow-emerald-950/15">Y</span>
            <span><span className="block text-[15px] font-extrabold tracking-tight">Yekola <span className="text-emerald-700">Shop</span></span><span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Espace administration</span></span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            {navItems.map(item => <Link key={item.key} href={item.href} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active === item.key || (active === "create" && item.key === "stores") ? "bg-emerald-50 text-emerald-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>{item.label}</Link>)}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-xs font-semibold text-slate-700">Administrateur</p><p className="max-w-44 truncate text-[11px] text-slate-400">{email ?? "Compte sécurisé"}</p></div>
            <span className="grid size-10 place-items-center rounded-full border border-emerald-100 bg-emerald-50 text-sm font-bold text-emerald-900">A</span>
            <div className="hidden md:block"><AdminSignOut /></div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 sm:pt-9 lg:px-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-5 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 shadow-[0_-8px_30px_rgba(15,45,32,0.08)] backdrop-blur-xl md:hidden" aria-label="Navigation mobile">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {navItems.map(item => {
            const selected = active === item.key || (active === "create" && item.key === "stores");
            return <Link key={item.key} href={item.href} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-bold ${selected ? "text-emerald-900" : "text-slate-400"}`}><span className={`grid size-8 place-items-center rounded-xl text-xl ${selected ? "bg-emerald-100" : "bg-transparent"}`}>{item.icon}</span>{item.short}</Link>;
          })}
          <div className="flex min-w-0 flex-1 flex-col items-center gap-1"><span className="grid size-8 place-items-center rounded-xl bg-slate-50 text-lg text-slate-500">↪</span><AdminSignOut compact /></div>
        </div>
      </nav>
    </div>
  );
}
