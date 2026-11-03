import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { HOUSE_PARTNER_SLUG } from "./lib/config";

/**
 * Actualise la session Supabase avant le rendu des routes.
 * Les pages admin effectuent ensuite leur propre contrôle de rôle côté serveur.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    // getUser valide le jeton auprès de Supabase Auth et déclenche son renouvellement si nécessaire.
    await supabase.auth.getUser();
  }

  const pathname = request.nextUrl.pathname;
  const reserved = ["/api", "/admin", "/espace", "/p"];
  if (
    pathname.startsWith("/_next/") ||
    reserved.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/")) ||
    pathname.includes(".")
  ) {
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/p/${HOUSE_PARTNER_SLUG}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, response);
}

export const config = { matcher: ["/:path*"] };
