import Link from 'next/link';

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

      </div>
    </main>
  );
}