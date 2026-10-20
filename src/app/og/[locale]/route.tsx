import { isLocale, locales } from "@/lib/i18n";
import { renderOgImage } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const copy = {
  pt: {
    eyebrow: "Tecnologia para negócios locais",
    title: "Os seus clientes encontram, escolhem e voltam.",
    subtitle: "Tecnologia do futuro. Com os bons modos de antigamente.",
  },
  en: {
    eyebrow: "Technology for local businesses",
    title: "Your customers find you, choose you and come back.",
    subtitle: "Technology of the future. With old-fashioned good manners.",
  },
};

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return renderOgImage(copy[isLocale(locale) ? locale : "pt"]);
}
