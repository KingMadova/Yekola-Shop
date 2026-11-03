import type { Metadata } from "next";
import { ShopLink, ShopWhatsAppLink } from "@/components/providers/ShopContext";
import { MessageCircle, Users, BookOpen, Briefcase } from "lucide-react";
import { container } from "@/components/ui/styles";
import { DISTRIBUTOR_MENTION } from "@/lib/config";


export const metadata: Metadata = {
  title: "Devenir partenaire",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/devenir-partenaire` },
  description: "Découvrez l'activité de distributeur indépendant Forever Living et échangez avec un conseiller avant de prendre votre décision.",
};

const steps = [
  { title: "Comprendre le modèle", text: "Découvrez les produits, le fonctionnement de la distribution indépendante et les conditions de démarrage." },
  { title: "Vous former", text: "Apprenez à présenter les produits avec sérieux, à écouter les besoins et à accompagner vos premiers clients." },
  { title: "Développer votre activité", text: "Organisez votre prospection et votre suivi client à votre rythme, avec un accompagnement adapté." },
];

export default function BecomePartnerPage() {
  return (
    <section className={container + " flex flex-col gap-10 py-8 sm:py-12"}>
      <header className="max-w-3xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a7b40]">Projet professionnel</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#173f35] sm:text-5xl">Et si vous développiez votre propre activité ?</h1>
        <p className="mt-4 text-base leading-relaxed text-[#68756c] sm:text-lg">
          Découvrez le modèle de distributeur indépendant Forever Living, posez vos questions et prenez le temps de vérifier si cette activité correspond à vos objectifs.
        </p>
        <ShopWhatsAppLink kind="distributor" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#173f35] px-5 font-semibold text-white hover:bg-[#10352d]">
          <MessageCircle aria-hidden className="size-5" /> Demander une présentation
        </ShopWhatsAppLink>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-2xl border border-[#e9e5d9] bg-white p-5">
            <span className="mb-4 inline-flex size-9 items-center justify-center rounded-full bg-[#edf1e9] text-sm font-bold text-[#315d47]">{index + 1}</span>
            <h2 className="text-lg font-bold text-[#26392e]">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#68756c]">{step.text}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-5 rounded-3xl bg-[#f6f3ea] p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div>
          <h2 className="text-xl font-bold text-[#173f35]">Une décision éclairée, sans pression.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#59685d]">
            Les revenus ne sont pas garantis. Les résultats dépendent notamment de l'activité commerciale, du temps consacré, des ventes réalisées et des conditions du programme. Demandez les coûts, les règles et les responsabilités avant de vous engager.
          </p>
          <p className="mt-3 text-xs text-[#68756c]">{DISTRIBUTOR_MENTION}</p>
        </div>
        <ShopLink href="/catalogue" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#173f35] px-5 font-semibold text-[#173f35] hover:bg-white">Découvrir les produits</ShopLink>
      </section>

      <div className="flex items-center gap-3 text-sm text-[#68756c]">
        <Users aria-hidden className="size-5 shrink-0" />
        <span>Vous pouvez commencer par une simple conversation pour comprendre le modèle et poser toutes vos questions.</span>
        <BookOpen aria-hidden className="hidden size-5 shrink-0 sm:block" />
        <Briefcase aria-hidden className="hidden size-5 shrink-0 sm:block" />
      </div>
    </section>
  );
}
