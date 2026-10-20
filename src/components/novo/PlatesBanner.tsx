import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { formatEuro } from "@/components/ui/Price";
import { TapPlate } from "@/components/visuals/TapPlate";
import { platesCopy } from "@/content/novo-home";
import { getProduct } from "@/content/products";
import { href } from "@/lib/routes";
import base from "./novo.module.css";
import styles from "./plates.module.css";

const locale = "pt";

// The Google review plates, as a promo band right after «O que quer melhorar?». Prices come from
// products.ts, without VAT and with «+ IVA». The phone shows only the empty review form: no rating,
// no count, no review. There is no photo of a real plate in public/ yet, so the plate is the same
// drawing the product pages use.

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

        <div className={styles.stage} role="img" aria-label={copy.stageLabel}>
          <div className={styles.disc} aria-hidden="true" />
          <div className={styles.phone} aria-hidden="true">
            <div className={styles.screen}>
              <p className={styles.biz}>{copy.screen.business}</p>
              <p className={styles.formTitle}>{copy.screen.title}</p>
              <div className={styles.stars}>
                {Array.from({ length: 5 }, (_, i) => (
                  <svg key={i} viewBox="0 0 24 24" width="22" height="22">
                    <path
                      d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
              </div>
              <div className={styles.box}>{copy.screen.placeholder}</div>
              <span className={styles.publish}>{copy.screen.publish}</span>
            </div>
          </div>
          <div className={styles.plate} aria-hidden="true">
            <TapPlate variant="stand" finish="black" symbol="stars" line1={copy.plate.line1} line2={copy.plate.line2} className={styles.plateSvg} />
            <span className={styles.tap} />
          </div>
        </div>
      </div>
    </section>
  );
}
