import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yekola Shop",
    short_name: "Yekola",
    description: "Découvrez les offres Yekola et commandez directement sur WhatsApp.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF9F3",
    theme_color: "#FF6A1A",
    icons: [
      { src: "/yekola-business-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
