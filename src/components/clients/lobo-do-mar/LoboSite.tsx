import { loboCopy } from "@/content/lobo-do-mar/copy";
import { loboHref, type LoboRoute } from "@/content/lobo-do-mar/routes";
import { Boat } from "./Boat";
import { Booking } from "./Booking";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { Marquee } from "./Marquee";
import { MenuTeaser } from "./MenuTeaser";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { SmoothScroll } from "./SmoothScroll";
import { Tank } from "./Tank";
import { Visit } from "./Visit";
import { Wall } from "./Wall";

// Lobo do Mar's website (owner, 2026-10-22): a MARISQUEIRA in Armação de Pêra («Marisqueira · Sea Wolf» on its sign).
// Lives inside the Steevanz app with its own root layout; see src/lib/client-sites.ts for its domain.
// Concept (steevanz-sites-clientes): THE DISPLAY AND THE SEA, told with the restaurant's own reels. Its logo's navy
// and coral, the dining room's blue ceiling and the octopus drawn on its white walls, the logo's heavy slab capitals.
// Scenes: the tide curtain with the logo; three reels side by side (display, live tank, fish of the day); the live tank and the fish opening out of rounded windows; the owner's
// seafood boat opening out of a porthole with each thing named; the octopus drawing itself behind the video menu;
// the line on its wall; a gallery leaning with the scroll; drifting words; the visit and the booking.
export function LoboSite({ route }: { route: LoboRoute }) {
  const { mode, locale } = route;
  const copy = loboCopy[locale];
  const other = locale === "pt" ? "en" : "pt";
  return (
    <MotionRoot>
      <Preloader label={copy.logoLabel} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-coral px-5 py-3 font-semibold text-white transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} locale={locale} homeHref={loboHref(mode, locale)} otherLocaleHref={loboHref(mode, other)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <Tank copy={copy} />
        <Boat copy={copy} />
        <MenuTeaser copy={copy} />
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
