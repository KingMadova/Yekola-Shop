import { NextRequest, NextResponse } from "next/server";
import { HOUSE_PARTNER_SLUG } from "./lib/config";

/**
 * Les URL publiques historiques correspondent à la boutique maison.
 * Les URL /p/:slug sont déjà explicites et ne sont jamais réécrites.
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const reserved = ["/api", "/admin", "/espace", "/p"];

  if (
    pathname.startsWith("/_next/") ||
    reserved.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/")) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/p/${HOUSE_PARTNER_SLUG}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/:path*"] };
