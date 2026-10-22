import { loboCopy } from "@/content/lobo-do-mar/copy";
import { loboHref, type LoboRoute } from "@/content/lobo-do-mar/routes";
import { Board } from "./Board";
import { Booking } from "./Booking";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { Marquee } from "./Marquee";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { SmoothScroll } from "./SmoothScroll";
import { Tides } from "./Tides";
import { Visit } from "./Visit";
import { Wall } from "./Wall";

// Lobo do Mar's website (owner, 2026-10-22): tapas and petiscos in Armação de Pêra. Lives inside the Steevanz app
// with its own root layout; see src/lib/client-sites.ts for its domain.
// Concept (steevanz-sites-clientes): THE TIDE. Its own badge colours (deep navy and coral) with Algarve sand, a wide
// modern display face and the chalk of the board by its door. Every transition rises like a wave: the curtain is a
// tide coming in, the plates of the opening arrive as waves, the three groups of dishes rise over one another
// (pinned), the board writes itself in chalk, a coral marker runs under the line on its wall, the gallery leans
// with the scroll's swell, the words drift on coral and the booking rises over the visit.
export function LoboSite({ route }: { route: LoboRoute }) {
  const { mode, locale } = route;
  const copy = loboCopy[locale];
  const other = locale === "pt" ? "en" : "pt";
  return (
    <MotionRoot>
      <Preloader label={copy.logoLabel} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-coral px-5 py-3 font-semibold text-abismo transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} locale={locale} homeHref={loboHref(mode, locale)} otherLocaleHref={loboHref(mode, other)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <Tides copy={copy} />
        <Board copy={copy} />
        <Wall copy={copy} />
        <Gallery copy={copy} />
        <Marquee copy={copy} />
        <Visit copy={copy} />
        <Booking copy={copy} />
      </main>
      <Footer copy={copy} />
      <SmoothScroll />
      <JsonLd locale={locale} />
    </MotionRoot>
  );
}
