import type { CSSProperties } from "react";
import { Check } from "@/components/icons";
import { TapPlate } from "@/components/visuals/TapPlate";
import { hero } from "@/content/home-ultra/hero";
import { BrandLine, Wordmark } from "../shared/Brand";
import { CtaButton, TextLink } from "../shared/Buttons";
import { LoopVideo } from "../shared/LoopVideo";
import { PhoneStage, Satellite } from "../shared/PhoneFrame";
import { Section } from "../shared/Section";
import s from "../shared/ultra.module.css";
import h from "./Hero.module.css";

// Hero (#inicio): the brand first. Title = the two-line brand line; the brand film (silent loop of the
// whole product family, ending on «Steevanz.») plays in a 3D-posed frame that straightens over the first
// 75svh of scroll, idle-floats while in view and follows the mouse on desktop.
// Entrance is pure CSS (runs before hydration). The poster is the LCP, so the frame entrance animates
// transform only (never opacity). Reduced motion / Save-Data: poster only (LoopVideo), no animation.

// The pose comes from CSS custom properties so phones get a gentler pose than desktop (Hero.module.css).
const pose = {
  rx: "var(--hero-rx, 8deg)",
  ry: "var(--hero-ry, -12deg)",
  rz: "var(--hero-rz, -2deg)",
};

export function Hero() {
  const { film } = hero;
  return (
    <Section id="inicio" className={h.hero} containerClassName={h.grid}>
      <BrandLine as="h1" reveal="now" className={h.title} />

      <div className={h.copy}>
        <p className={`${s.lead} ${h.lead}`}>{hero.lead}</p>
        <div className={h.actions}>
          <CtaButton href={hero.cta.href} className={h.cta}>
            {hero.cta.label}
          </CtaButton>
          <TextLink href={hero.link.href}>{hero.link.label}</TextLink>
        </div>
        <p className={h.note}>{hero.note}</p>
      </div>

      <div className={h.media}>
        <PhoneStage pose={pose} straighten="root" float pointer className={h.stage}>
          <div className={h.enter}>
            <div className={h.frame}>
              <LoopVideo
                src={film.mobile.src}
                poster={film.posterMobile}
                width={film.mobile.width}
                height={film.mobile.height}
                wide={{ src: film.desktop.src, poster: film.posterDesktop, query: film.desktop.query }}
                posterPriority
                priority={3}
                loop
                fallback={<HeroFilmFallback />}
              />
            </div>

            <Satellite z={70} className={`${h.sat} ${h.plate}`} style={{ "--hero-d": "500ms" } as CSSProperties}>
              <TapPlate variant="stand" symbol="stars" line1={hero.plate.line1} line2={hero.plate.line2} className={h.plateSvg} />
            </Satellite>
            <Satellite z={110} className={`${h.sat} ${h.chip}`} style={{ "--hero-d": "600ms" } as CSSProperties}>
              <span className={h.chipIcon}>
                <Check size={16} strokeWidth={2.4} />
              </span>
              {hero.chip}
            </Satellite>
            <Satellite z={40} className={`${h.sat} ${h.stamp}`} style={{ "--hero-d": "700ms" } as CSSProperties}>
              <Check size={22} strokeWidth={2.4} />
            </Satellite>
          </div>
        </PhoneStage>
        <span className={h.floor} aria-hidden="true" />
      </div>
    </Section>
  );
}

/** Shown only if the brand film poster is missing: a warm brand composition, no claims. */
function HeroFilmFallback() {
  return (
    <div className={h.fallback} aria-hidden="true">
      <Wordmark className={h.fallbackMark} />
      <TapPlate variant="stand" finish="white" symbol="stars" line1={hero.plate.line1} line2={hero.plate.line2} className={h.fallbackPlate} />
    </div>
  );
}
