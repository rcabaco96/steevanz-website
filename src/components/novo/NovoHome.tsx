import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { formatEuro } from "@/components/ui/Price";
import { goalCtas, goals, homeAdBands, monthlyExtra, novoCopy, perMonth } from "@/content/novo-home";
import { productAds } from "@/content/product-ads";
import { getProductCopy } from "@/content/product-copy";
import { getProduct, type Product } from "@/content/products";
import { localize, type Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site";
import { AdBand } from "./AdBand";
import { ClientStrip } from "./ClientStrip";
import { Goals, type GoalView } from "./Goals";
import { MenuShowcase } from "./MenuShowcase";
import { Hero } from "./Hero";
import { HowWeWork, SectorSolutions } from "./NovoSections";
import { LoyaltyBanner } from "./LoyaltyBanner";
import { PlatesBanner } from "./PlatesBanner";
import styles from "./novo.module.css";

// The home page, the same in the six languages: «/» (pt), «/en», «/es», «/fr», «/de» and «/it», with the copy in
// content/novo-home.ts.

/** Indexable, canonical «/», «/en», …, each with the others as its alternates (lib/seo). */
export function novoHomeMetadata(locale: Locale): Metadata {
  const copy = localize(novoCopy, locale);
  return pageMetadata({ locale, route: { key: "home" }, title: copy.metaTitle, description: copy.metaDescription, absoluteTitle: true });
}

function billingSuffix(product: Product, locale: Locale): string {
  if (product.priceBilling === "monthly") return perMonth(locale);
  const extra = monthlyExtra(product);
  return extra ? ` + ${formatEuro(extra, locale)}${perMonth(locale)}` : "";
}

export function NovoHome({ locale }: { locale: Locale }) {
  const copy = localize(novoCopy, locale);
  const whatsapp = whatsappUrl(copy.whatsappMessage);
  const bookHref = href(locale, { key: "book" });
  const menuProductHref = href(locale, { key: "product", productId: "digital-menu" });

  const goalViews: GoalView[] = localize(goals, locale).map((goal) => ({
    id: goal.id,
    title: goal.title,
    lead: goal.lead,
    // Always from the cheapest «desde» price up (owner, 2026-10-20); the content order breaks ties.
    products: [...goal.products]
      .sort((a, b) => getProduct(a.id).priceFrom - getProduct(b.id).priceFrom)
      .map(({ id, label, benefit }) => {
      const product = getProduct(id);
      return {
        id,
        href: href(locale, { key: "product", productId: id }),
        icon: product.icon,
        name: label ?? getProductCopy(id, locale).name,
        benefit,
        // Always without VAT, and saying so (owner, 2026-10-18).
        price: `${copy.goals.from} ${formatEuro(product.priceFrom, locale)}${billingSuffix(product, locale)} ${copy.goals.vat}`,
        cta: localize(goalCtas[id], locale),
      };
      }),
  }));
  const menuProduct = getProduct("digital-menu");

  return (
    <div className={styles.root} data-novo>
      {/* 1. Hero (owner, 2026-10-22): dark plum, three real businesses filmed in loops with the Steevanz moments over
          them; on a phone the title and intro, then the three zig-zag strips, then the buttons. */}
      <Hero locale={locale} copy={copy} bookHref={bookHref} whatsapp={whatsapp} />

      {/* 2. Confiam em nós */}
      <ClientStrip locale={locale} />

      {/* 3. Menu digital showcase */}
      <section aria-labelledby="novo-menu" className={styles.showcase}>
        <div className={styles.wrap}>
          <MenuShowcase
            locale={locale}
            head={
              <>
                <h2 id="novo-menu" className={styles.h2}>
                  {copy.showcase.title}
                </h2>
                <p className={styles.showcaseLead}>{copy.showcase.lead}</p>
              </>
            }
            foot={
              <>
                {/* The product's call to action goes to its page, which has «Agendar demonstração» (owner, 2026-10-20). */}
                <Link href={menuProductHref} className={`${styles.btn} ${styles.btnGold}`}>
                  {copy.showcase.cta}
                  <ArrowRight size={18} />
                </Link>
                <p className={styles.showcasePrice}>
                  {copy.showcase.from} {formatEuro(menuProduct.priceFrom, locale)} {localize(menuProduct.priceQualifier, locale)} {copy.showcase.vat}
                </p>
              </>
            }
          />
        </div>
      </section>

      {/* 4. Cartão de cliente digital: after the menu, to make them come back */}
      <LoyaltyBanner locale={locale} />

      {/* 5. The bands with a product ad (content/novo-home.ts, homeAdBands: guest guide, business card, keychain, waitlist,
          bookings, …), each shown once its ad is in content/product-ads.ts. All the bands with a video come before the
          goals; the tones and the video sides alternate (owner, 2026-10-20). */}
      {homeAdBands
        .filter((band) => productAds[band.productId])
        .map((band, index) => (
          <AdBand
            key={band.productId}
            locale={locale}
            productId={band.productId}
            copy={band.copy}
            headingId={band.headingId}
            tone={index % 2 === 0 ? "gold" : "rose"}
            media={index % 2 === 0 ? "left" : "right"}
          />
        ))}

      {/* 6. Placas para avaliações: right after the last section with a video (owner, 2026-10-22); its own ad opens
          in a window from a button. */}
      <PlatesBanner locale={locale} />

      {/* 7. O que quer melhorar? Always below every band with a video (owner, 2026-10-20). */}
      <section id="solucoes" aria-labelledby="novo-goals" className={styles.section}>
        <div className={styles.wrap}>
          <h2 id="novo-goals" className={styles.h2} data-reveal>
            {copy.goals.title}
          </h2>
          <p className={styles.lead} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            {copy.goals.lead}
          </p>
          <Goals label={copy.goals.title} goals={goalViews} />
        </div>
      </section>

      {/* 8. Soluções por setor */}
      <SectorSolutions locale={locale} />

      {/* 9. Como trabalhamos */}
      <HowWeWork locale={locale} />

      {/* 10. Final CTA and close */}
      <section aria-labelledby="novo-final" className={styles.final}>
        <div className={styles.wrap}>
          <h2 id="novo-final" className={styles.h2} data-reveal>
            {copy.finalCta.title}
          </h2>
          <p className={styles.finalBody} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            {copy.finalCta.body}
          </p>
          <div className={styles.ctaRow}>
            <Link href={bookHref} className={`${styles.btn} ${styles.btnInk}`}>
              {copy.finalCta.primary}
              <ArrowRight size={18} />
            </Link>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.finalBtnGhost}`}>
              <WhatsAppIcon size={18} />
              {copy.finalCta.secondary}
            </a>
          </div>
          <p className={styles.finalLine}>{copy.brandLine.join(" ")}</p>
          <p className={styles.bigMark}>
            Steevanz<span>.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
