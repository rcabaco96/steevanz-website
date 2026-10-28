import { orveCopy } from "@/content/orve/copy";
import { orveHref, orveHtmlLang, orveLanguageNames, orveLocales, type OrveRoute } from "@/content/orve/routes";
import { Booking } from "./Booking";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { House } from "./House";
import { Journey } from "./Journey";
import { Manifesto } from "./Manifesto";
import { Marquee } from "./Marquee";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { Reflections } from "./Reflections";
import { Review } from "./Review";
import { Rituals } from "./Rituals";
import { SmoothScroll } from "./SmoothScroll";
import { Team } from "./Team";

// Orvé's website (owner, 2026-10-23): a FICTIONAL beauty and aesthetics atelier in Lisbon's Príncipe Real, made up
// by Steevanz as a showcase for selling sites to beauty businesses (the name, logo, team, address, treatments and
// prices are invented; the phone and WhatsApp are Steevanz's own, so prospects can try the booking; the page and its
// footer say it is a demo). Six languages (owner, 2026-10-24): /orve, /orve/en, /es, /fr, /de, /it.
// Concept (steevanz-sites-clientes): DEW AT DAWN. Skin after care looks like morning dew, so the signature motif is
// the dew drop — the accent of the «é» in the hand-drawn didone wordmark, the round lens a drop makes when seen from
// above, the drop shape with its point up. Palette of dawn (mother-of-pearl, blush clay, copper, the cocoa of the hour
// before sunrise, a pale blue glint); Bodoni Moda + Jost. Scenes: a drop falls onto the «e» and the dark is drawn
// back into it; the film of a hydration mask gathers into a lens ringed by turning words; a sentence fills with a
// rising copper meniscus; the price list as stacking cards; the house ritual as a drop riding a wave with the
// minutes counting; the treatment room seen through a swelling drop; the team inside drops falling at different
// speeds; the gallery as condensation on a dark window; a tilted strip of treatments; the booking request; the call
// to leave a review (never ratings); questions; the footer.
export function OrveSite({ route }: { route: OrveRoute }) {
  const copy = orveCopy[route.locale];
  const languages = orveLocales.map((code) => ({ code, name: orveLanguageNames[code], lang: orveHtmlLang[code], href: orveHref(route.mode, code) }));
  return (
    <MotionRoot>
      <Preloader label={copy.logoLabel} line={copy.tagline} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-nacar px-5 py-3 font-medium text-cacau transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} homeHref={orveHref(route.mode, route.locale)} languages={languages} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <Manifesto copy={copy} />
        <Rituals copy={copy} />
        <Journey copy={copy} />
        <House copy={copy} />
        <Team copy={copy} />
        <Reflections copy={copy} />
        <Marquee copy={copy} />
        <Booking copy={copy} />
        <Review copy={copy} />
        <Faq copy={copy} />
      </main>
      <Footer copy={copy} languages={languages} />
      <div aria-hidden="true" className="or-grain pointer-events-none fixed inset-0 z-[70]" />
      <SmoothScroll />
    </MotionRoot>
  );
}
