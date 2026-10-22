import { ermitaCopy } from "@/content/o-ermita/copy";
import { ermitaHref, type ErmitaRoute } from "@/content/o-ermita/routes";
import { AzulejoWall } from "./AzulejoWall";
import { Booking } from "./Booking";
import { Cuisine } from "./Cuisine";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { Manifesto } from "./Manifesto";
import { Marquee } from "./Marquee";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { SalaReveal } from "./SalaReveal";
import { SmoothScroll } from "./SmoothScroll";
import { Timeline } from "./Timeline";
import { Visit } from "./Visit";

// O Ermita's website (owner, 2026-10-22): the restaurant of the Hotel Convento de São Paulo, in the Serra d'Ossa
// (Redondo). Lives inside the Steevanz app with its own root layout; see src/lib/client-sites.ts for its domain.
// The page is a sequence of scenes (GSAP ScrollTrigger + Lenis, React Bits pieces): the curtain, the flight to
// the convent closing into a window, the sentence that lights up, eight centuries sideways, the tile wall, the
// chapel opening out of its arch, the cuisine, the gallery, the drifting words, the visit and the booking.
export function ErmitaSite({ route }: { route: ErmitaRoute }) {
  const { mode, locale } = route;
  const copy = ermitaCopy[locale];
  const other = locale === "pt" ? "en" : "pt";
  return (
    <MotionRoot>
      <Preloader label={copy.logoLabel} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-cal px-5 py-3 font-semibold text-azulejo-deep transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} locale={locale} homeHref={ermitaHref(mode, locale)} otherLocaleHref={ermitaHref(mode, other)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <Manifesto copy={copy} />
        <Timeline copy={copy} />
        <AzulejoWall copy={copy} locale={locale} />
        <SalaReveal copy={copy} />
        <Cuisine copy={copy} />
        <Gallery copy={copy} />
        <Marquee copy={copy} />
        <Visit copy={copy} />
        <Booking copy={copy} />
      </main>
      <Footer copy={copy} />
      <div aria-hidden="true" className="oe-grain pointer-events-none fixed inset-0 z-[70]" />
      <SmoothScroll />
      <JsonLd locale={locale} />
    </MotionRoot>
  );
}
