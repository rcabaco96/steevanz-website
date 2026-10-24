import { ponteiroCopy } from "@/content/ponteiro/copy";
import { ponteiroHref, type PonteiroRoute } from "@/content/ponteiro/routes";
import { Carta } from "./Carta";
import { Casa } from "./Casa";
import { Closing } from "./Closing";
import { DayDial } from "./DayDial";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { MenuDigital } from "./MenuDigital";
import { MotionRoot } from "./MotionRoot";
import { Reservas } from "./Reservas";
import { Review } from "./Review";
import { Shutter } from "./Shutter";
import { SmoothScroll } from "./SmoothScroll";
import { Visit } from "./Visit";
import { Vitrine } from "./Vitrine";

// Ponteiro's website (owner, 2026-10-24): a FICTIONAL café, kitchen and bar in Porto's Bonfim, made up by Steevanz as
// the showcase for selling sites to restaurants, cafés, pastelarias and bars («é tudo o mesmo»): one house that is a
// pastelaria at 7:30, a restaurant at lunch and dinner and a bar until late, so any of the three sees itself in it.
// The name, logo, team, address, dishes and prices are invented; the contacts are placeholders; the page and its
// footer say it is a demo.
// Concept (steevanz-sites-clientes): THE HOURS OF ONE DAY. «Ponteiro» is the hand of a clock, so the signature motif
// is a one-hand clock: the logo is a lowercase «p» whose bowl is a clock face, and its hand is the page's own clock in
// the header (07:30 at the top, two in the morning at the footer). The other motif is the shop's rolling steel
// shutter, which goes up at the opening and comes down at the end. Palette of a day: counter marble, egg-yolk yellow
// (the custard of the pastel de nata), ginja red (the cherry liqueur of the bar) and midnight indigo; Instrument
// Serif + Bricolage Grotesque. Scenes: the shutter rolls up as the clock ticks to 7:30; the coffee film narrows into a
// triptych as the oven fire and the bar slide in; a 24-hour dial whose hand sweeps the four moments of the day while
// the room changes light; the carta in three parts with a split-flap «prato do dia» board; the pastry counter's two
// glass shelves sliding in opposite directions; a phone rising from the table with the Menu digital playing while the
// sentence lights word by word; reservations and the waitlist phone turning yellow when the table is ready; the team
// along their hours over the counter film; a strip of things ordered at the counter; the review call; questions; the
// visit; the shutter coming down over the neon sign; the footer.
export function PonteiroSite({ route }: { route: PonteiroRoute }) {
  const copy = ponteiroCopy;
  return (
    <MotionRoot>
      <Shutter label={copy.logoLabel} sign={copy.opening.sign} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-gema px-5 py-3 font-semibold text-tinta transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} homeHref={ponteiroHref(route.mode)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <DayDial copy={copy} />
        <Carta copy={copy} />
        <Vitrine copy={copy} />
        <MenuDigital copy={copy} />
        <Reservas copy={copy} />
        <Casa copy={copy} />
        <Marquee copy={copy} />
        <Review copy={copy} />
        <Faq copy={copy} />
        <Visit copy={copy} />
        <Closing copy={copy} />
      </main>
      <Footer copy={copy} />
      <SmoothScroll />
    </MotionRoot>
  );
}
