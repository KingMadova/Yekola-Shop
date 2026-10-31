import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Yekola Shop',
  description: 'Découvrez comment Yekola Shop protège vos données personnelles lors de votre commande.',
};

export default function ConfidentialitePage() {
  return (
    <main className="bg-[#F9FAFB] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">
          Politique de confidentialité
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-lg leading-relaxed">
            Chez <strong>Yekola Shop</strong>, nous nous engageons à protéger vos données personnelles. 
            Cette politique explique quelles informations nous collectons, pourquoi nous les collectons 
            et comment nous les utilisons.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">1. Données collectées</h2>
            <p>
              Nous collectons uniquement les informations nécessaires au traitement de votre commande :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Numéro de téléphone</strong> : pour vous contacter concernant votre commande et vous envoyer des informations sur nos produits</li>
              <li><strong>Nom</strong> (facultatif) : pour personnaliser notre communication</li>
              <li><strong>Ville</strong> : pour adapter nos informations de livraison</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Traiter votre commande et vous contacter par WhatsApp</li>
              <li>Vous informer de nos offres et promotions (uniquement si vous le souhaitez)</li>
              <li>Améliorer notre service et notre sélection de produits</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">3. Partage des données</h2>
            <p>
              <strong>Nous ne vendons ni ne louons jamais vos données à des tiers.</strong> Vos informations 
              sont conservées de manière sécurisée et ne sont accessibles qu'aux personnes autorisées de 
              Yekola Shop.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">4. Conservation des données</h2>
            <p>
              Vos données sont conservées aussi longtemps que nécessaire pour vous fournir notre service. 
              Vous pouvez à tout moment demander leur suppression en nous contactant par WhatsApp.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">5. Vos droits</h2>
            <p>Conformément à la réglementation en vigueur, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Droit d'accès</strong> : vous pouvez demander une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : vous pouvez corriger vos informations</li>
              <li><strong>Droit à l'oubli</strong> : vous pouvez demander la suppression de vos données</li>
              <li><strong>Droit d'opposition</strong> : vous pouvez refuser l'utilisation de vos données à des fins commerciales</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous simplement par WhatsApp au numéro indiqué sur notre site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">6. Cookies</h2>
            <p>
              Notre site utilise uniquement des cookies techniques nécessaires à son fonctionnement 
              (panier, session utilisateur). Nous n'utilisons pas de cookies de suivi publicitaire.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">7. Modifications</h2>
            <p>
              Nous pouvons mettre à jour cette politique. Toute modification sera publiée sur cette page 
              avec la date de mise à jour.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">8. Contact</h2>
            <p>
              Pour toute question concernant cette politique ou vos données personnelles, contactez-nous 
              par WhatsApp au numéro affiché sur notre site.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Dernière mise à jour : 1er novembre 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}