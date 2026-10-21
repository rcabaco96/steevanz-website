import { adVideoLabels, productAds } from "@/content/product-ads";
import type { ProductId } from "@/content/types";
import { localize, type Locale } from "@/lib/i18n";
import { AdVideoDialog } from "./AdVideoDialog";

// A discreet «▶ Ver o vídeo (27 s)» button that opens a product's ad (content/product-ads.ts) in a window
// over the page (owner, 2026-10-22, first on the home's review plates band). Any band can use it with its
// productId and its own «Ver o vídeo» wording; the length comes from the ad. Nothing of the video is
// downloaded until the button is pressed.

export function AdVideoModalButton({ locale, productId, label, className }: { locale: Locale; productId: ProductId; label: string; className?: string }) {
  const ad = productAds[productId];
  if (!ad) return null;
  return (
    <AdVideoDialog
      src={ad.src}
      poster={ad.poster}
      seconds={ad.seconds}
      label={label}
      videoLabel={localize(ad.label, locale)}
      copy={localize(adVideoLabels, locale)}
      className={className}
    />
  );
}
