import { isLocale, locales } from "@/lib/i18n";
import { renderOgImage } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const copy = {
  pt: {
    eyebrow: "Placas NFC · Inteligência artificial",
    title: "Um toque. Mais uma review no Google.",
    subtitle: "Placas NFC e ferramentas de IA para restaurantes, salões, clínicas e comércio local.",
  },
  en: {
    eyebrow: "NFC plates · Artificial intelligence",
    title: "One tap. One more Google review.",
    subtitle: "NFC plates and AI tools for restaurants, salons, clinics and local shops.",
  },
};

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage(copy[isLocale(locale) ? locale : "pt"]);
}
