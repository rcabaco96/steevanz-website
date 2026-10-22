import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { AdVideoModalButton } from "@/components/media/AdVideoModalButton";
import { formatEuro } from "@/components/ui/Price";
import { HeroTapScene } from "@/components/visuals/HeroTapScene";
import { platesCopy, sceneCopy } from "@/content/novo-home";
import { getProduct } from "@/content/products";
import { localize, type Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { PauseOffscreen } from "./PauseOffscreen";
import base from "./novo.module.css";
import styles from "./plates.module.css";

// The review plates (Google, Tripadvisor or Booking.com, one per plate), right after the last band with a video. Prices come from
// products.ts, without VAT and with «+ IVA». The animation is the plate scene HeroTapScene
// (owner, 2026-10-20), on a dark panel, paused while off screen. Under or beside the main button, a discreet
// «Ver o vídeo (27 s)» opens the plates ad in a window over the page (owner, 2026-10-22).

export function PlatesBanner({ locale }: { locale: Locale }) {
  const copy = localize(platesCopy, locale);
  const product = getProduct("google-review-plates");
  const bestPack = product.packs?.reduce((best, pack) => (pack.unitPrice < best.unitPrice ? pack : best));
  const productHref = href(locale, { key: "product", productId: product.id });

  return (
    <section aria-labelledby="novo-plates" className={styles.band}>
      <div className={`${base.wrap} ${styles.grid}`}>
        <div className={styles.head}>
          <p className={styles.eyebrow} data-reveal>
            {copy.eyebrow}
          </p>
          <h2 id="novo-plates" className={`${base.h2} ${styles.title}`} data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
            {copy.titleStart} <em className={styles.accent}>{copy.titleAccent}</em>
          </h2>
          <p className={styles.body} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            {copy.body}
          </p>
        </div>

        <PauseOffscreen className={styles.panel}>
          <HeroTapScene copy={localize(sceneCopy, locale)} />
        </PauseOffscreen>

        <div className={styles.rest}>
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
                  {copy.pack.replace("{price}", formatEuro(bestPack.unitPrice, locale)).replace("{quantity}", String(bestPack.quantity))}
                </small>
              ) : null}
            </p>
            <Link href={productHref} className={`${base.btn} ${base.btnInk}`}>
              {copy.cta}
              <ArrowRight size={18} />
            </Link>
            <AdVideoModalButton locale={locale} productId={product.id} label={copy.video} />
          </div>
        </div>
      </div>
    </section>
  );
}
