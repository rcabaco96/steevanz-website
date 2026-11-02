import type { Metadata, Viewport } from "next";
import { grob } from "@/content/grob/facts";
import { grobCanonical, grobOrigin } from "@/content/grob/routes";

// Os metadados do próprio clube: o seu nome, os seus ícones (do emblema), a sua imagem de pré-visualização. Nada
// da Steevanz. Robots: o caminho de pré-visualização leva «noindex» do proxy (X-Robots-Tag).
export const grobTitle = "GROB · Grupo Recreativo Olival Basto · Desde 1937";
export const grobDescription =
  "Clube recreativo e desportivo de Olival Basto, Odivelas, fundado em 1937. Futsal, ténis de mesa, yoga, pilates clínico e zumba: inscrições, a sede renovada, sócios e contactos.";

export function grobMetadata(): Metadata {
  return {
    // Só a origem: uma base com caminho (/grob) poria a imagem em /grob/media/… (um 404).
    metadataBase: new URL(new URL(grobOrigin).origin),
    title: { absolute: grobTitle },
    description: grobDescription,
    applicationName: grob.short,
    alternates: { canonical: grobCanonical() },
    icons: {
      icon: [
        { url: grob.media.favicon, sizes: "any" },
        { url: grob.media.icon192, type: "image/png", sizes: "192x192" },
        { url: grob.media.icon512, type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: grob.media.appleIcon, sizes: "180x180" }],
    },
    manifest: "/grob/manifest.webmanifest",
    openGraph: {
      type: "website",
      siteName: grob.name,
      title: grobTitle,
      description: grobDescription,
      url: grobCanonical(),
      locale: "pt_PT",
      images: [{ url: grob.media.og, width: 1200, height: 630, alt: "O emblema do GROB em 3D sobre o verde do pavilhão, com fotografias do clube" }],
    },
    twitter: { card: "summary_large_image", title: grobTitle, description: grobDescription, images: [grob.media.og] },
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

export const grobViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#062615",
  colorScheme: "light",
};
