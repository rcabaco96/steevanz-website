import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { formatEuro } from "@/components/ui/Price";
import { HeroTapScene } from "@/components/visuals/HeroTapScene";
import { homeCopy } from "@/content/home";
import { platesCopy } from "@/content/novo-home";
import { getProduct } from "@/content/products";
import { href } from "@/lib/routes";
import { PauseOffscreen } from "./PauseOffscreen";
import base from "./novo.module.css";
import styles from "./plates.module.css";

const locale = "pt";

// The Google review plates, as the first band after the clients strip. Prices come from
// products.ts, without VAT and with «+ IVA». The animation is the old home hero's plate scene
// (owner, 2026-10-20), on a dark panel, paused while off screen.

export function PlatesBanner() {
  const copy = platesCopy;
  const product = getProduct("google-review-plates");
  const bestPack = product.packs?.reduce((best, pack) => (pack.unitPrice < best.unitPrice ? pack : best));
  const productHref = href(locale, { key: "product", productId: product.id });

  return (
    <section aria-labelledby="novo-plates" className={styles.band}>
      <div className={`${base.wrap} ${styles.grid}`}>
        <div className={styles.text}>
          <p className={styles.eyebrow} data-reveal>
            {copy.eyebrow}
          </p>
          <h2 id="novo-plates" className={`${base.h2} ${styles.title}`} data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
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
              <span className={styles.priceFrom}>{copy.from}</span>{" "}
              <strong>{formatEuro(product.priceFrom, locale)}</strong> {copy.perPlate} <span className={styles.vat}>{copy.vat}</span>
              {bestPack ? (
                <small className={styles.pack}>
                  {formatEuro(bestPack.unitPrice, locale)} {copy.perPlate} a partir de {bestPack.quantity}
                </small>
              ) : null}
            </p>
            <Link href={productHref} className={`${base.btn} ${base.btnInk}`}>
              {copy.cta}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <PauseOffscreen className={styles.panel}>
          <HeroTapScene copy={homeCopy[locale].scene} />
        </PauseOffscreen>
      </div>
    </section>
  );
}
