import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Steevanz — Placas NFC para reviews no Google e IA para negócios locais";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Placas NFC · Inteligência artificial",
    title: "Um toque. Mais uma review no Google.",
    subtitle: "Placas NFC e ferramentas de IA para restaurantes, salões, clínicas e comércio local.",
  });
}
