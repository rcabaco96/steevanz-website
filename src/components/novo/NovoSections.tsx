import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { formatEuro } from "@/components/ui/Price";
import { photos } from "@/content/media";
import { howCopy, monthlyExtra, perMonth, sectorsCopy } from "@/content/novo-home";
import { getProductCopy } from "@/content/product-copy";
import { getProduct } from "@/content/products";
import { sectors } from "@/content/sectors";
import { localizePartial, localize, type Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import base from "./novo.module.css";
import styles from "./sections.module.css";

/** «desde» for a set of products: what is paid once plus what is paid each month. */
function bundleFrom(productIds: Parameters<typeof getProduct>[0][]): { once: number; monthly: number } {
  let once = 0;
  let monthly = 0;
  for (const id of productIds) {
    const product = getProduct(id);
    if (product.priceBilling === "monthly") monthly += product.priceFrom;
    else {
      once += product.priceFrom;
      monthly += monthlyExtra(product);
    }
  }
  return { once, monthly };
}

function fromLabel(once: number, monthly: number, locale: Locale): string {
  const parts = [];
  if (once) parts.push(formatEuro(once, locale));
  if (monthly) parts.push(`${formatEuro(monthly, locale)}${perMonth(locale)}`);
  return parts.join(" + ");
}

export function SectorSolutions({ locale }: { locale: Locale }) {
  const t = localize(sectorsCopy, locale);
  return (
    <section aria-labelledby="novo-sectors" className={base.section}>
      <div className={base.wrap}>
        <h2 id="novo-sectors" className={base.h2} data-reveal>
          {t.title}
        </h2>
        <p className={base.lead} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          {t.lead}
        </p>
        <ul className={styles.rail}>
          {sectors.map((sector) => {
            const copy = localizePartial(sector.copy, locale);
            const price = sector.pack ? { once: sector.pack.setup, monthly: sector.pack.monthly } : bundleFrom(sector.bundle);
            const photo = photos[sector.photo];
            return (
              <li key={sector.id} className={styles.sector}>
                <div className={styles.sectorPhoto}>
                  <Image src={photo.src} alt={localize(photo.alt, locale)} fill sizes="(min-width: 1280px) 240px, 82vw" style={{ objectFit: "cover" }} />
                </div>
                <div className={styles.sectorBody}>
                  <h3 className={styles.sectorName}>{copy.name}</h3>
                  <ul className={styles.sectorProducts}>
                    {sector.bundle.map((id) => (
                      <li key={id}>{getProductCopy(id, locale).shortName}</li>
                    ))}
                  </ul>
                  <p className={styles.sectorPrice}>
                    {sector.pack ? t.pack : t.together} <strong>{fromLabel(price.once, price.monthly, locale)}</strong>
                  </p>
                  <Link href={href(locale, { key: "sector", sectorId: sector.id })} className={styles.sectorLink}>
                    {t.see.replace("{sector}", t.lowerSector ? copy.name.toLowerCase() : copy.name)}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function HowWeWork({ locale }: { locale: Locale }) {
  const copy = localize(howCopy, locale);
  return (
    <section aria-labelledby="novo-how" className={base.section}>
      <div className={base.wrap}>
        <h2 id="novo-how" className={base.h2} data-reveal>
          {copy.title}
        </h2>
        <ol className={styles.how}>
          <span className={styles.howTrack} aria-hidden="true" />
          <span className={styles.howLine} aria-hidden="true" />
          {copy.steps.map((step, index) => (
            <li key={step.title} className={styles.howStep} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }}>
              <span className={styles.howDot} aria-hidden="true">
                {index + 1}
              </span>
              <h3 className={styles.howTitle}>{step.title}</h3>
              <p className={styles.howBody}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
