import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Yekola Shop",
  description: "Découvrez comment Yekola Shop collecte et protège les données personnelles liées à vos demandes et commandes.",
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h1 className="mb-8 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Politique de confidentialité
        </h1>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-lg leading-relaxed">
            Yekola Shop protège les informations que vous nous confiez. Cette politique décrit
            les données utilisées lorsque vous demandez le catalogue ou passez une commande.
          </p>

          <section className="space-y-3">
            <h2 className="pt-4 text-2xl font-bold text-gray-900">1. Données collectées</h2>
            <p>Lors d'une demande de catalogue, nous pouvons enregistrer :</p>
            <ul className="list-disc space-y-2 pl-6">
              <li><strong>Prénom et numéro WhatsApp</strong>, nécessaires pour identifier et traiter votre demande.</li>
              <li><strong>Besoin exprimé ou déduit</strong>, produits consultés et montant du panier, afin de mieux comprendre votre demande.</li>
              <li><strong>Informations de provenance</strong> : campagne, source, page d'arrivée et page consultée.</li>
              <li><strong>Date de première visite</strong>, lorsqu'elle est disponible dans le navigateur, à titre indicatif.</li>
              <li><strong>Date et heure de soumission</strong>, générées par notre base de données au moment de l'enregistrement.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="pt-4 text-2xl font-bold text-gray-900">2. Localisation GPS facultative</h2>
            <p>
              La localisation n'est jamais obligatoire. Elle est demandée uniquement si vous cliquez
              volontairement sur le bouton de partage de position et acceptez la demande de votre navigateur.
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Si vous acceptez, nous pouvons enregistrer la latitude, la longitude, la précision et l'heure de réception de la position.</li>
              <li>Si vous refusez, ignorez la demande ou si votre appareil ne fournit pas de position, aucune coordonnée GPS n'est enregistrée.</li>
              <li>Votre refus n'empêche ni l'envoi du formulaire ni le traitement de votre demande.</li>
              <li>Nous ne déduisons pas votre position géographique à partir de votre adresse IP.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="pt-4 text-2xl font-bold text-gray-900">3. Utilisation et stockage</h2>
            <p>Les données servent à :</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>enregistrer et suivre votre demande de catalogue ;</li>
              <li>comprendre vos centres d'intérêt pour vous orienter vers les produits pertinents ;</li>
              <li>répondre à vos demandes et assurer le suivi d'une éventuelle commande ;</li>
              <li>améliorer le fonctionnement et la pertinence de la boutique.</li>
            </ul>
            <p>
              Les demandes sont enregistrées dans une base de données Supabase utilisée par Yekola Shop.
              L'adresse IP peut être traitée temporairement par le serveur à des fins de limitation des abus ;
              elle n'est pas ajoutée à la fiche prospect et n'est pas utilisée pour vous localiser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="pt-4 text-2xl font-bold text-gray-900">4. Accès et partage</h2>
            <p>
              Vos données ne sont ni vendues ni louées. Elles sont accessibles aux personnes autorisées
              chargées du suivi de la boutique utilisée. Si vous arrivez par la boutique d'un partenaire,
              ce partenaire peut consulter les informations nécessaires au suivi de votre demande.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="pt-4 text-2xl font-bold text-gray-900">5. Conservation et sécurité</h2>
            <p>
              Nous conservons les données pendant la durée nécessaire au traitement et au suivi de votre
              demande, avec des mesures destinées à empêcher les accès non autorisés. La durée précise de
              conservation doit être définie avant la mise en production.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="pt-4 text-2xl font-bold text-gray-900">6. Vos droits</h2>
            <p>
              Vous pouvez demander l'accès à vos données, leur rectification ou leur suppression, ainsi que
              vous opposer à leur utilisation à des fins commerciales. Pour exercer ces droits, contactez-nous
              par WhatsApp au numéro affiché sur la boutique.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="pt-4 text-2xl font-bold text-gray-900">7. Cookies et stockage local</h2>
            <p>
              Le site utilise le stockage local du navigateur pour mémoriser certains éléments nécessaires
              à son fonctionnement, notamment le panier, les préférences de parcours et l'état du formulaire.
              Ces éléments ne déclenchent pas de demande GPS automatique.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="pt-4 text-2xl font-bold text-gray-900">8. Contact et modifications</h2>
            <p>
              Pour toute question concernant vos données, contactez-nous par WhatsApp au numéro affiché
              sur le site. Cette politique peut être mise à jour ; la date de dernière modification est
              indiquée ci-dessous.
            </p>
          </section>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">Dernière mise à jour : 1er novembre 2026</p>
          </div>
        </div>
      </div>
    </main>
  );
}
