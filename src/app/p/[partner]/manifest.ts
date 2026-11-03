import type { MetadataRoute } from "next";

export default async function manifest({ params }: { params: Promise<{ partner: string }> }): Promise<MetadataRoute.Manifest> {
  const { partner } = await params;
  return {
    name: `Yekola Shop · ${partner}`,
    short_name: partner.slice(0, 12),
    description: "La boutique Yekola de votre partenaire.",
    start_url: `/p/${partner}`,
    scope: `/p/${partner}/`,
    display: "standalone",
    background_color: "#FFF9F3",
    theme_color: "#FF6A1A",
    icons: [{ src: "/yekola-business-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
