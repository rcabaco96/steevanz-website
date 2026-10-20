import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { AdVideo } from "@/components/media/AdVideo";
import { formatEuro } from "@/components/ui/Price";
import { loyaltyCopy } from "@/content/novo-home";
import { adVideoLabels, productAds } from "@/content/product-ads";
import { getProduct } from "@/content/products";
import { href } from "@/lib/routes";
import base from "./novo.module.css";
import styles from "./plates.module.css";

const locale = "pt";

// The «Cartão de cliente digital» band, after the Menu digital showcase: the plates band's layout on
// the other side (the video first on a computer), on soft rose, with the card's ad video. The price
// comes from products.ts, «/mês + IVA».

export function LoyaltyBanner() {
  const copy = loyaltyCopy;
  const product = getProduct("loyalty");
  const ad = productAds.loyalty!;
  const productHref = href(locale, { key: "product", productId: product.id });
  const perMonth = product.priceBilling === "monthly" ? "/mês" : "";
  const qualifier = product.priceQualifier[locale].replace(/^por mês,?\s*/, "");

  return (
    <section aria-labelledby="novo-loyalty" className={`${styles.band} ${styles.bandRose}`}>
      <div className={`${base.wrap} ${styles.grid} ${styles.gridReverse}`}>
        <div className={styles.text}>
          <p className={styles.eyebrow} data-reveal>
            {copy.eyebrow}
          </p>
          <h2 id="novo-loyalty" className={`${base.h2} ${styles.title}`} data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
            {copy.titleStart} <em className={styles.accent}>{copy.titleAccent}</em>
          </h2>
          <p className={styles.body} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            {copy.body}
          </p>
          <ul className={styles.points} data-reveal style={{ ["--reveal-delay" as string]: "180ms" }}>
            {copy.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className={styles.buy} data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
            <p className={styles.price}>
              <span className={styles.priceFrom}>{copy.from}</span> <strong>{formatEuro(product.priceFrom, locale)}</strong>
              {perMonth} {qualifier} <span className={styles.vat}>{copy.vat}</span>
            </p>
            <Link href={productHref} className={`${base.btn} ${base.btnInk}`}>
              {copy.cta}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className={styles.adStage}>
          <div className={styles.adDisc} aria-hidden="true" />
          <AdVideo src={ad.src} poster={ad.poster} label={ad.label[locale]} copy={adVideoLabels[locale]} />
        </div>
      </div>
    </section>
  );
}
