import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { AdVideo } from "@/components/media/AdVideo";
import { formatEuro } from "@/components/ui/Price";
import { monthlyExtra, perMonth, type AdBandCopy } from "@/content/novo-home";
import { adVideoLabels, productAds } from "@/content/product-ads";
import { getProduct } from "@/content/products";
import type { ProductId } from "@/content/types";
import { localize, type Locale, type Localized } from "@/lib/i18n";
import { href } from "@/lib/routes";
import base from "./novo.module.css";
import styles from "./plates.module.css";

// A product band with its ad video (content/product-ads.ts), in the plates and loyalty bands' layout: on a
// phone the title and lead, then the video, then the points, the price and the button; on a computer the
// video on one side (`media`) and the text on the other. Used for the «Guia digital do alojamento» and
// «Cartão de visita digital» bands. Prices come from products.ts, without VAT and with «+ IVA».

export function AdBand({
  locale,
  productId,
  copy: localizedCopy,
  headingId,
  tone,
  media,
}: {
  locale: Locale;
  productId: ProductId;
  copy: Localized<AdBandCopy>;
  headingId: string;
  tone: "gold" | "rose";
  media: "left" | "right";
}) {
  const copy = localize(localizedCopy, locale);
  const product = getProduct(productId);
  const ad = productAds[productId]!;
  const productHref = href(locale, { key: "product", productId });
  const monthly = monthlyExtra(product);
  const bestPack = product.packs?.reduce((best, pack) => (pack.unitPrice < best.unitPrice ? pack : best));
  // A note with {price}/{quantity}/{quantities} needs packs; one without them (the guide's) is shown as is.
  const note = bestPack
    ? copy.note
        .replace("{price}", formatEuro(bestPack.unitPrice, locale))
        .replace("{quantity}", String(bestPack.quantity))
        .replace("{quantities}", new Intl.ListFormat(locale, { type: "disjunction" }).format((product.packs ?? []).map((pack) => String(pack.quantity))))
    : copy.note && !copy.note.includes("{")
      ? copy.note
      : null;

  return (
    <section aria-labelledby={headingId} className={`${styles.band} ${tone === "rose" ? styles.bandRose : ""}`}>
      <div className={`${base.wrap} ${styles.grid} ${media === "left" ? styles.flip : ""}`}>
        <div className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            {copy.eyebrow}
          </p>
          <h2 id={headingId} className={`${base.h2} ${styles.title}`} data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
            {copy.titleStart} <em className={styles.accent}>{copy.titleAccent}</em>
          </h2>
          <p className={styles.body} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            {copy.body}
          </p>
        </div>
        <div className={styles.adStage}>
          <div className={styles.adDisc} aria-hidden="true" />
          <AdVideo src={ad.src} poster={ad.poster} label={localize(ad.label, locale)} copy={localize(adVideoLabels, locale)} />
        </div>
        <div className={styles.rest}>
          <ul className={styles.points} data-reveal style={{ ["--reveal-delay" as string]: "180ms" }}>
            {copy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className={styles.buy} data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
            <p className={styles.price}>
              {copy.from ? <span className={styles.priceFrom}>{copy.from} </span> : null}
              <strong>{formatEuro(product.priceFrom, locale)}</strong> {copy.per}
              {monthly ? ` + ${formatEuro(monthly, locale)}${perMonth(locale)}` : ""} <span className={styles.vat}>{copy.vat}</span>
              {note ? <small className={styles.pack}>{note}</small> : null}
            </p>
            <Link href={productHref} className={`${base.btn} ${base.btnInk}`}>
              {copy.cta}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
