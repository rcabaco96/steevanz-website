import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { formatEuro } from "@/components/ui/Price";
import { dolci } from "@/content/dolci-salati";
import { clips, dayCopy, goals, heroClips, monthlyExtra, novoCopy } from "@/content/novo-home";
import { getProductCopy } from "@/content/product-copy";
import { getProduct, type Product } from "@/content/products";
import { href } from "@/lib/routes";
import { whatsappUrl } from "@/lib/site";
import { BrandVideo, type BrandFilm } from "./BrandVideo";
import { ClientStrip } from "./ClientStrip";
import { DayJourney } from "./DayJourney";
import { Goals, type GoalView } from "./Goals";
import { MenuShowcase } from "./MenuShowcase";
import { MobileBar } from "./MobileBar";
import { HowWeWork, PricesFaq, SectorSolutions } from "./NovoSections";
import { PhoneVideo } from "./PhoneVideo";
import styles from "./novo.module.css";

const locale = "pt";

/** The brand film, once its four files are in public/home/brand/ (until then, the phone hero). */
function brandFilm(): BrandFilm | null {
  const film: BrandFilm = {
    mobile: { mp4: "/home/brand/hero-mobile.mp4", poster: "/home/brand/hero-mobile.jpg" },
    desktop: { mp4: "/home/brand/hero-desktop.mp4", poster: "/home/brand/hero-desktop.jpg" },
  };
  const files = [film.mobile.mp4, film.mobile.poster, film.desktop.mp4, film.desktop.poster];
  return files.every((file) => existsSync(path.join(process.cwd(), "public", file))) ? film : null;
}

function billingSuffix(product: Product): string {
  if (product.priceBilling === "monthly") return "/mês";
  const extra = monthlyExtra(product);
  return extra ? ` + ${formatEuro(extra, locale)}/mês` : "";
}

export function NovoHome() {
  const copy = novoCopy;
  const menuLive = dolci.menu;
  const whatsapp = whatsappUrl("Olá! Gostava de saber mais sobre as soluções da Steevanz.");
  const bookHref = href(locale, { key: "book" });
  const menuProductHref = href(locale, { key: "product", productId: "digital-menu" });

  const film = brandFilm();
  const heroCtas = (
    <div className={styles.ctaRow}>
      <Link href={menuLive} className={`${styles.btn} ${styles.btnPrimary}`}>
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
      {/* 1. Hero: the brand film when it exists, the phone with real recordings until then */}
      {film ? (
        <section id="novo-hero" aria-labelledby="novo-hero-title" className={`${styles.hero} ${styles.heroBrand}`}>
          <div className={styles.wrap}>
            <div className={styles.brandText}>
              <h1 id="novo-hero-title" className={styles.heroTitle}>
                {copy.hero.titleStart} <span className={styles.heroAccent}>{copy.hero.titleAccent}</span>
              </h1>
              <div>
                <p className={styles.heroSub}>{copy.hero.subtitle}</p>
                {heroCtas}
              </div>
            </div>
            <div className={styles.filmStage}>
              <BrandVideo film={film} label="Filme da Steevanz: os produtos da casa, a terminar no logótipo." />
            </div>
          </div>
        </section>
      ) : (
      <section id="novo-hero" aria-labelledby="novo-hero-title" className={styles.hero}>
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div>
            <h1 id="novo-hero-title" className={styles.heroTitle}>
              {copy.hero.titleStart} <span className={styles.heroAccent}>{copy.hero.titleAccent}</span>
            </h1>
            <p className={styles.heroSub}>{copy.hero.subtitle}</p>
            {heroCtas}
            <p className={styles.heroSectors}>{copy.hero.sectors}</p>
          </div>
          <div className={styles.stage}>
            <div className={styles.dot} aria-hidden="true" />
            <div className={styles.phone3d}>
              <div className={styles.phoneIntro}>
                <div className={`${styles.phone} ${styles.phoneHero}`}>
                  <PhoneVideo clips={heroClips} priority minVisible={0.2} sizes="(min-width: 1024px) 312px, 248px" />
                  <span className={`${styles.tap} ${styles.heroTap}`} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 2. Confiam em nós */}
      <ClientStrip />

      {/* 3. O que quer melhorar? */}
      <section aria-labelledby="novo-goals" className={styles.section}>
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

      {/* 4. Um dia no seu negócio */}
      <section aria-labelledby="novo-day" className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 id="novo-day" className={styles.h2} data-reveal>
            {dayCopy.title}
          </h2>
          <p className={styles.lead} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            {dayCopy.lead}
          </p>
          <DayJourney />
        </div>
      </section>

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

      {/* 6. Soluções por setor */}
      <SectorSolutions />

      {/* 7. Caso real: Dolci e Salati */}
      <section aria-labelledby="novo-case" className={`${styles.section} ${styles.case}`}>
        <div className={`${styles.wrap} ${styles.caseGrid}`}>
          <div>
            <Image src={dolci.logo} alt="Dolci e Salati" width={72} height={72} className={styles.caseLogo} data-reveal />
            <h2 id="novo-case" className={styles.h2} style={{ marginTop: "1.25rem" }} data-reveal>
              {copy.dolci.title}
            </h2>
            <p className={styles.lead} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
              {copy.dolci.body}
            </p>
            <ul className={styles.caseDid} data-reveal style={{ ["--reveal-delay" as string]: "140ms" }}>
              {copy.dolci.did.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.ctaRow}>
              <Link href="/dolci-salati" className={`${styles.btn} ${styles.btnInk}`}>
                {copy.dolci.landing}
                <ArrowRight size={18} />
              </Link>
              <Link href={menuLive} className={`${styles.btn} ${styles.btnGhost}`}>
                {copy.dolci.menu}
              </Link>
            </div>
          </div>
          <div className={styles.caseStage}>
            <div className={`${styles.casePhoto} ${styles.casePhotoLeft}`} data-reveal>
              <Image src={dolci.terrace} alt="A esplanada da Dolci e Salati em Armação de Pêra." fill sizes="(min-width: 1024px) 260px, 40vw" style={{ objectFit: "cover" }} />
            </div>
            <div className={`${styles.casePhoto} ${styles.casePhotoRight}`} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
              <Image src={dolci.cup} alt="Gelado artesanal da Dolci e Salati." fill sizes="(min-width: 1024px) 260px, 40vw" style={{ objectFit: "cover" }} />
            </div>
            <div className={`${styles.phone} ${styles.casePhone}`}>
              <PhoneVideo clips={[clips.dolciLanding]} sizes="(min-width: 1024px) 256px, 208px" />
            </div>
          </div>
        </div>
      </section>

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
          <p className={styles.finalLine}>{copy.finalCta.line}</p>
          <p className={styles.bigMark}>
            Steevanz<span>.</span>
          </p>
        </div>
      </section>

      <MobileBar heroId="novo-hero" menuHref={menuLive} whatsappHref={whatsapp} />
    </div>
  );
}
