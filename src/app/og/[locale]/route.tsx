import { locales } from "@/lib/i18n";
import { renderBrandOgImage } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// The site's general link preview: the round «S.» mark on cream, the same in every language (owner, 2026-10-20).
export async function GET() {
  return renderBrandOgImage();
}
