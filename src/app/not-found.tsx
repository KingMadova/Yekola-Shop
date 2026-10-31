import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="bg-[#F9FAFB] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-6xl sm:text-8xl font-extrabold text-[#059669] mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Page introuvable
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#059669] hover:bg-[#047857] transition-colors min-h-[44px]"
          >
            Retour à l'accueil
          </Link>
          
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#059669] text-base font-medium rounded-lg text-[#059669] bg-white hover:bg-[#F9FAFB] transition-colors min-h-[44px]"
          >
            Voir le catalogue
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Besoin d'aide ? Contactez-nous sur WhatsApp
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '242061234567'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-lg text-white bg-[#25D366] hover:bg-[#1DA851] transition-colors min-h-[44px]"
          >
            <MessageCircle className="w-5 h-5" />
            Nous contacter
          </a>
        </div>
      </div>
    </main>
  );
}