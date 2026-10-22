import { ermitaCopy } from "@/content/o-ermita/copy";
import { ermitaHref, type ErmitaRoute } from "@/content/o-ermita/routes";
import { Booking } from "./Booking";
import { Cuisine } from "./Cuisine";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Interlude } from "./Interlude";
import { JsonLd } from "./JsonLd";
import { MotionRoot } from "./MotionRoot";
import { SmoothScroll } from "./SmoothScroll";
import { Story } from "./Story";
import { Visit } from "./Visit";

// O Ermita's website (owner, 2026-10-22): the restaurant of the Hotel Convento de São Paulo, in the Serra d'Ossa
// (Redondo). Lives inside the Steevanz app with its own root layout; see src/lib/client-sites.ts for its domain.
export function ErmitaSite({ route }: { route: ErmitaRoute }) {
  const { mode, locale } = route;
  const copy = ermitaCopy[locale];
  const other = locale === "pt" ? "en" : "pt";
  return (
    <MotionRoot>
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-cal px-5 py-3 font-semibold text-azulejo-deep transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} locale={locale} homeHref={ermitaHref(mode, locale)} otherLocaleHref={ermitaHref(mode, other)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <Story copy={copy} />
        <Interlude copy={copy} />
        <Cuisine copy={copy} />
        <Gallery copy={copy} />
        <Visit copy={copy} />
        <Booking copy={copy} />
      </main>
      <Footer copy={copy} />
      <SmoothScroll />
      <JsonLd locale={locale} />
    </MotionRoot>
  );
}
