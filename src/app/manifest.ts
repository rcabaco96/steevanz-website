import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Steevanz",
    short_name: "Steevanz",
    description: "Placas para avaliações e IA para negócios locais.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7f1",
    theme_color: "#7a2d60",
    lang: "pt-PT",
    // The «S.» mark (owner, 2026-10-20): cream S, gold dot, plum background.
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
