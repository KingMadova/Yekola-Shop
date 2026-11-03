import { Metadata } from 'next';
import { ShopDeliveryNote } from '@/components/providers/ShopContext';

export const metadata: Metadata = {
  title: 'Livraison et paiement | Yekola Shop',
  description: 'Livraison express 24h à Brazzaville et Pointe-Noire. Paiement mobile accepté (MTN, Airtel, espèces).',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'}/livraison-paiement` },
};

export default function LivraisonPaiementPage() {
  return (
    <main className="bg-[#F9FAFB] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">
          Livraison et paiement
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">Modes de livraison</h2>
            <p>
              Nous proposons plusieurs options de livraison adaptées à votre localisation :
            </p>
            <ShopDeliveryNote />
            
            <div className="grid gap-6 sm:grid-cols-2 not-prose">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-[#059669] mb-3">
                  Brazzaville et Pointe-Noire
                </h3>
                <p className="text-gray-700 mb-4">
                  <strong>Livraison express en 24 heures</strong> à votre domicile ou lieu de travail.
                </p>
                <p className="text-sm text-gray-600">
                  Livraison gratuite à partir de 100 000 F d'achat
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-[#059669] mb-3">
                  Autres villes et provinces
                </h3>
                <p className="text-gray-700 mb-4">
                  Expédition via les agences de transport partenaires. Délai de 2 à 5 jours ouvrés.
                </p>
                <p className="text-sm text-gray-600">
                  Frais de transport calculés selon la destination
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:col-span-2">
                <h3 className="text-xl font-bold text-[#059669] mb-3">
                  Retrait sur rendez-vous
                </h3>
                <p className="text-gray-700">
                  Vous préférez récupérer votre commande en personne ? Contactez-nous par WhatsApp 
                  pour convenir d'un rendez-vous à notre point de retrait.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">Modes de paiement</h2>
            <p className="flex items-center gap-2 text-lg">
              <span className="inline-block w-3 h-3 bg-[#059669] rounded-full"></span>
              <strong>Paiement mobile accepté</strong>
            </p>
            <p>
              Nous acceptons plusieurs modes de paiement pour votre commodité :
            </p>

            <div className="grid gap-4 sm:grid-cols-3 not-prose">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">Espèces</h3>
                <p className="text-sm text-gray-700">
                  Paiement en espèces à la livraison de votre commande
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">MTN Mobile Money</h3>
                <p className="text-sm text-gray-700">
                  Transfert via MTN MoMo avant ou après livraison
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2">Airtel Money</h3>
                <p className="text-sm text-gray-700">
                  Transfert via Airtel Money avant ou après livraison
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">Comment passer commande</h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>Choisissez vos produits</strong> dans notre catalogue et ajoutez-les à votre panier
              </li>
              <li>
                <strong>Validez votre panier</strong> en cliquant sur le bouton de commande
              </li>
              <li>
                <strong>WhatsApp s'ouvre automatiquement</strong> avec le récapitulatif de votre commande
              </li>
              <li>
                <strong>Envoyez le message</strong> pour confirmer votre commande
              </li>
              <li>
                <strong>Nous vous contactons</strong> pour confirmer les détails de livraison et le mode de paiement
              </li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 pt-4">Questions fréquentes</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Puis-je payer à la livraison ?
                </h3>
                <p>
                  Oui, vous pouvez payer en espèces ou par Mobile Money au moment de la livraison.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Y a-t-il des frais de livraison ?
                </h3>
                <p>
                  La livraison est gratuite à Brazzaville et Pointe-Noire pour les commandes supérieures 
                  à 100 000 F. Pour les autres villes, les frais sont calculés selon la destination.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Que faire si je ne suis pas disponible pour la livraison ?
                </h3>
                <p>
                  Contactez-nous par WhatsApp pour reprogrammer la livraison à un moment qui vous convient.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 not-prose">
            <p className="text-center">
              <strong className="text-[#059669]">Entrepreneur Forever Indépendant Agréé</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}