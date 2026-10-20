import Link from "next/link";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { formatEuro } from "@/components/ui/Price";
import { demoMenuHref, goals, monthlyExtra, novoCopy } from "@/content/novo-home";
import { getProductCopy } from "@/content/product-copy";
import { getProduct, type Product } from "@/content/products";
import { href } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import { ClientStrip } from "./ClientStrip";
import { Goals, type GoalView } from "./Goals";
import { MenuShowcase } from "./MenuShowcase";
import { MobileBar } from "./MobileBar";
import { HowWeWork, PricesFaq, SectorSolutions } from "./NovoSections";
import { LoyaltyBanner } from "./LoyaltyBanner";
import { PlatesBanner } from "./PlatesBanner";
import styles from "./novo.module.css";

const locale = "pt";

function billingSuffix(product: Product): string {
  if (product.priceBilling === "monthly") return "/mês";
  const extra = monthlyExtra(product);
  return extra ? ` + ${formatEuro(extra, locale)}/mês` : "";
}

export function NovoHome() {
  const copy = novoCopy;
  const menuLive = demoMenuHref;
  const whatsapp = whatsappUrl("Olá! Gostava de saber mais sobre as soluções da Steevanz.");
  const bookHref = href(locale, { key: "book" });
  const menuProductHref = href(locale, { key: "product", productId: "digital-menu" });

  const heroCtas = (
    <div className={`${styles.ctaRow} ${styles.heroCtas}`}>
      <Link href={bookHref} className={`${styles.btn} ${styles.btnPrimary}`}>
        {copy.hero.primary}
        <ArrowRight size={18} />
      </Link>
      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnGhost}`}>
        {copy.hero.secondary}
      </a>
    </div>
  );

  const goalViews: GoalView[] = goals.map((goal) => ({
    id: goal.id,
    title: goal.title,
    lead: goal.lead,
    demo: goal.demo,
    products: goal.products.map(({ id, label }) => {
      const product = getProduct(id);
      const productCopy = getProductCopy(id, locale);
      return {
        id,
        href: href(locale, { key: "product", productId: id }),
        name: label ?? productCopy.name,
        tagline: productCopy.tagline,
        price: formatEuro(product.priceFrom, locale),
        suffix: billingSuffix(product),
      };
    }),
  }));
  const automation = getProduct("automation");
  const menuProduct = getProduct("digital-menu");

  return (
    <div className={styles.root} data-novo>
      {/* 1. Hero: Steevanz as a brand (text first, no video, no phone) */}
      <section id="novo-hero" aria-labelledby="novo-hero-title" className={styles.hero}>
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div>
            <p className={styles.heroEyebrow}>{copy.hero.eyebrow}</p>
            <h1 id="novo-hero-title" className={styles.heroTitle}>
              {copy.hero.titleStart} <span className={styles.heroAccent}>{copy.hero.titleAccent}</span>
            </h1>
            <p className={styles.heroSub}>{copy.hero.subtitle}</p>
            {heroCtas}
          </div>
          <div className={styles.heroBrand}>
            <div className={styles.markWrap} aria-hidden="true">
              <div className={styles.mark}>
                <span className={styles.markS}>S</span>
                <span className={styles.markDot} />
              </div>
            </div>
            <p className={styles.brandLine}>
              <span>{copy.brandLine[0]}</span> <span>{copy.brandLine[1]}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. Confiam em nós */}
      <ClientStrip />

      {/* 3. O que quer melhorar? */}
      <section id="solucoes" aria-labelledby="novo-goals" className={styles.section}>
        <div className={styles.wrap}>
          <h2 id="novo-goals" className={styles.h2} data-reveal>
            {copy.goals.title}
          </h2>
          <p className={styles.lead} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            {copy.goals.lead}
          </p>
          <Goals goals={goalViews} custom={{ href: href(locale, { key: "product", productId: "automation" }), price: formatEuro(automation.priceFrom, locale) }} />
        </div>
      </section>

      {/* 4. Placas de reviews do Google: the flagship, after the goals */}
      <PlatesBanner />

      {/* 5. Menu digital showcase */}
      <section aria-labelledby="novo-menu" className={styles.showcase}>
        <div className={styles.wrap}>
          <MenuShowcase
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
                <Link href={menuLive} className={`${styles.btn} ${styles.btnGold}`}>
                  {copy.showcase.cta}
                  <ArrowRight size={18} />
                </Link>
                <Link href={menuProductHref} className={styles.inlineLink}>
                  {copy.showcase.product}
                </Link>
                <p className={styles.showcasePrice}>
                  desde {formatEuro(menuProduct.priceFrom, locale)} {menuProduct.priceQualifier[locale]}
                </p>
              </>
            }
          />
        </div>
      </section>

      {/* 6. Cartão de cliente digital: after the menu, to make them come back */}
      <LoyaltyBanner />

      {/* 7. Soluções por setor */}
      <SectorSolutions />

      {/* 8. Como trabalhamos */}
      <HowWeWork />

      {/* 9. Preços à vista e perguntas */}
      <PricesFaq />

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

      <MobileBar heroId="novo-hero" bookHref={bookHref} whatsappHref={whatsapp} />
    </div>
  );
}
