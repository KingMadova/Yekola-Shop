"use client";

import { ShopLink, useShop } from "@/components/providers/ShopContext";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState, useId } from "react";
import { useCatalog } from "@/components/providers/CatalogContext";
import { focusRing } from "@/components/ui/styles";
import { formatFCFA } from "@/lib/pricing";

interface ProductSearchProps {
  initialQuery?: string;
  categorySlug?: string;
  goalSlug?: string;
  compact?: boolean;
}

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");

export function ProductSearch({
  initialQuery = "",
  categorySlug,
  goalSlug,
  compact = false,
}: ProductSearchProps) {
  const id = useId();
  const { products } = useCatalog();
  const shop = useShop();
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  useEffect(() => setQuery(initialQuery), [initialQuery]);
  const searchHref = "/catalogue?q=" + encodeURIComponent(query.trim())
    + (categorySlug ? "&categorie=" + encodeURIComponent(categorySlug) : "")
    + (goalSlug ? "&besoin=" + encodeURIComponent(goalSlug) : "");
  const matches = useMemo(() => {
    const needle = normalize(query.trim());
    if (needle.length < 2) return [];
    return products
      .filter((product) =>
        normalize([product.name, product.code, product.category, product.shortDesc].join(" ")).includes(needle),
      )
      .slice(0, 5);
  }, [products, query]);
  const showSuggestions = focused && query.trim().length >= 2;

  return (
    <div className="relative w-full">
      <form action={shop.href("/catalogue")} role="search" className="flex w-full items-center gap-2">
        {categorySlug && <input type="hidden" name="categorie" value={categorySlug} />}
        {goalSlug && <input type="hidden" name="besoin" value={goalSlug} />}
        <label htmlFor={id} className="sr-only">Rechercher un produit par nom ou code</label>
        <div className="relative min-w-0 flex-1">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#778178]" />
          <input
            id={id}
            name="q"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 140)}
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls={id + "-suggestions"}
            placeholder="Un produit, un code, une gamme…"
            className={"min-h-11 w-full rounded-xl border border-[#deded4] bg-white pl-10 pr-3 text-base text-[#26392e] placeholder:text-[#879087] " + focusRing + (compact ? " rounded-full text-sm" : "")}
          />
        </div>
        {!compact && (
          <button type="submit" className={"inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#173f35] px-4 text-sm font-semibold text-white hover:bg-[#10352d] " + focusRing}>
            Rechercher
          </button>
        )}
      </form>

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white shadow-[0_14px_40px_rgba(20,45,35,0.16)]">
          {matches.length > 0 ? (
            <ul id={id + "-suggestions"} role="listbox" aria-label="Suggestions de produits" className="divide-y divide-[#f0eee7]">
              {matches.map((product) => (
                <li key={product.code}>
                  <ShopLink
                    href={"/produit/" + product.slug}
                    role="option"
                    aria-selected={false}
                    className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 hover:bg-[#f7f6f0] focus-visible:bg-[#f7f6f0] focus-visible:outline-none"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#26392e]">{product.name}</span>
                      <span className="block text-xs text-[#778178]">{product.code} · {product.category}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-[#173f35]">{formatFCFA(product.pricePublic)}</span>
                  </ShopLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-[#68756c]">Aucun produit ne correspond à « {query} ».</p>
          )}
          <ShopLink
            href={searchHref}
            className="flex min-h-11 items-center justify-center border-t border-[#eeeae0] bg-[#fbfaf6] px-4 text-sm font-semibold text-[#173f35] hover:bg-[#f3f0e7]"
          >
            Voir tous les résultats
          </ShopLink>
        </div>
      )}
    </div>
  );
}
