import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Faq } from "@/components/ui/Faq";
import { formatEuro } from "@/components/ui/Price";
import { homeCopy } from "@/content/home";
import { photos } from "@/content/media";
import { howCopy, keyPrices, monthlyExtra, pricesCopy, sectorsCopy } from "@/content/novo-home";
import { getProductCopy } from "@/content/product-copy";
import { getProduct } from "@/content/products";
import { sectors } from "@/content/sectors";
import { href } from "@/lib/routes";
import base from "./novo.module.css";
import styles from "./sections.module.css";

const locale = "pt";

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

function fromLabel(once: number, monthly: number): string {
  const parts = [];
  if (once) parts.push(formatEuro(once, locale));
  if (monthly) parts.push(`${formatEuro(monthly, locale)}/mês`);
  return parts.join(" + ");
}

export function SectorSolutions() {
  return (
    <section aria-labelledby="novo-sectors" className={base.section}>
      <div className={base.wrap}>
        <h2 id="novo-sectors" className={base.h2} data-reveal>
          {sectorsCopy.title}
        </h2>
        <p className={base.lead} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          {sectorsCopy.lead}
        </p>
        <ul className={styles.rail}>
          {sectors.map((sector) => {
            const copy = sector.copy[locale];
            const price = sector.pack ? { once: sector.pack.setup, monthly: sector.pack.monthly } : bundleFrom(sector.bundle);
            const photo = photos[sector.photo];
            return (
              <li key={sector.id} className={styles.sector}>
                <div className={styles.sectorPhoto}>
                  <Image src={photo.src} alt={photo.alt[locale]} fill sizes="(min-width: 1280px) 240px, 82vw" style={{ objectFit: "cover" }} />
                </div>
                <div className={styles.sectorBody}>
                  <h3 className={styles.sectorName}>{copy.name}</h3>
                  <ul className={styles.sectorProducts}>
                    {sector.bundle.map((id) => (
                      <li key={id}>{getProductCopy(id, locale).shortName}</li>
                    ))}
                  </ul>
                  <p className={styles.sectorPrice}>
                    {sector.pack ? "Pack, desde" : sectorsCopy.together} <strong>{fromLabel(price.once, price.monthly)}</strong>
                  </p>
                  <Link href={href(locale, { key: "sector", sectorId: sector.id })} className={styles.sectorLink}>
                    {sectorsCopy.see} {copy.name.toLowerCase()}
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

export function HowWeWork() {
  return (
    <section aria-labelledby="novo-how" className={base.section}>
      <div className={base.wrap}>
        <h2 id="novo-how" className={base.h2} data-reveal>
          {howCopy.title}
        </h2>
        <ol className={styles.how}>
          <span className={styles.howTrack} aria-hidden="true" />
          <span className={styles.howLine} aria-hidden="true" />
          {howCopy.steps.map((step, index) => (
            <li key={step.title} className={styles.howStep} data-reveal style={{ ["--reveal-delay" as string]: `${index * 90}ms` }}>
              <span className={styles.howDot} aria-hidden="true" />
              <h3 className={styles.howTitle}>{step.title}</h3>
              <p className={styles.howBody}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PricesFaq() {
  const faq = homeCopy[locale].faq.items;
  return (
    <section aria-labelledby="novo-prices" className={`${base.section} ${base.case}`}>
      <div className={`${base.wrap} ${styles.pricesGrid}`}>
        <div>
          <h2 id="novo-prices" className={base.h2} data-reveal>
            {pricesCopy.title}
          </h2>
          <p className={base.lead}>{pricesCopy.lead}</p>
          <ul className={styles.priceList}>
            {keyPrices.map((id) => {
              const product = getProduct(id);
              const extra = monthlyExtra(product);
              return (
                <li key={id}>
                  <Link href={href(locale, { key: "product", productId: id })} className={styles.priceRow}>
                    <span className={styles.priceName}>{getProductCopy(id, locale).name}</span>
                    <span className={styles.priceFill} />
                    <span className={styles.priceValue}>
                      <small>desde </small>
                      {formatEuro(product.priceFrom, locale)}
                      <small>
                        {product.priceBilling === "monthly" ? "/mês" : ""}
                        {extra ? ` + ${formatEuro(extra, locale)}/mês` : ""}
                      </small>
                    </span>
                    <span className={styles.priceQualifier}>{product.priceQualifier[locale].replace(/, sem fidelização$/, "")}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href={href(locale, { key: "products" })} className={styles.allLink}>
            {pricesCopy.all}
            <ArrowRight size={16} />
          </Link>
        </div>
        <div>
          <h2 className={styles.faqTitle}>{pricesCopy.faqTitle}</h2>
          <Faq items={faq} />
        </div>
      </div>
    </section>
  );
}
