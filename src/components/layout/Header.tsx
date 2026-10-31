import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";
import { container, focusRing } from "@/components/ui/styles";
import { SITE_NAME } from "@/lib/config";
import { buildDistributorMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Packs solutions", href: "/#packs" },
  { label: "Besoins santé", href: "/#besoins" },
] as const;

const linkClass = `rounded-md py-2 text-sm font-medium text-gray-900 hover:text-emerald-800 ${focusRing}`;

export function Header() {
  const distributorUrl = buildWhatsAppUrl(buildDistributorMessage());

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className={`${container} flex h-16 items-center gap-4`}>
        <Link href="/" className={`text-lg font-extrabold text-emerald-900 ${focusRing}`}>
          {SITE_NAME}
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-5 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
          <a href={distributorUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Devenir distributeur
          </a>
        </nav>

        <form action="/catalogue" role="search" className="mx-auto hidden w-full max-w-sm lg:block">
          <label htmlFor="header-search" className="sr-only">
            Rechercher un produit
          </label>
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder="Rechercher un produit ou un besoin"
            className={`min-h-11 w-full rounded-full border border-gray-300 bg-gray-100 px-4 text-sm ${focusRing}`}
          />
        </form>

        <div className="ml-auto">
          <CartButton />
        </div>
      </div>

      <nav
        aria-label="Navigation mobile"
        className="flex gap-4 overflow-x-auto border-t border-gray-100 px-4 md:hidden"
      >
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={`${linkClass} min-h-11 whitespace-nowrap`}>
            {link.label}
          </Link>
        ))}
        <a href={distributorUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} min-h-11 whitespace-nowrap`}>
          Devenir distributeur
        </a>
      </nav>
    </header>
  );
}
