"use client";

import { btnPrimary, container } from "@/components/ui/styles";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className={`${container} flex flex-col items-start gap-4 py-16`}>
      <h1 className="text-2xl font-bold text-gray-900">Un problème est survenu</h1>
      <p className="max-w-prose text-gray-800">
        La page n&apos;a pas pu se charger. Réessayez ou revenez à l&apos;accueil pour poursuivre votre visite.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className={btnPrimary}>Réessayer</button>
        <a href="/" className={btnPrimary}>Retour à l&apos;accueil</a>
      </div>
    </div>
  );
}
