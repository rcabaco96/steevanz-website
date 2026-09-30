import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Steevanz",
    short_name: "Steevanz",
    description: "Placas NFC para reviews no Google e IA para negócios locais.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7f1",
    theme_color: "#7a2d60",
    lang: "pt-PT",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
