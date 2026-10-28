import { riscaCopy } from "@/content/risca/copy";
import { riscaHref, type RiscaRoute } from "@/content/risca/routes";
import { Booking } from "./Booking";
import { ClientCard } from "./ClientCard";
import { Colour } from "./Colour";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Lookbook } from "./Lookbook";
import { Manifesto } from "./Manifesto";
import { Marquee } from "./Marquee";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { Queue } from "./Queue";
import { Review } from "./Review";
import { Services } from "./Services";
import { SmoothScroll } from "./SmoothScroll";
import { Team } from "./Team";
import { Visit } from "./Visit";

// Risca's website (owner, 2026-10-24): a FICTIONAL hair salon and barbershop in Cedofeita, Porto, made up by Steevanz
// as a showcase for selling sites to hairdressers and barbers — one sector (owner: «Barbearias» and «Cabeleireiros»
// are the same), so women, men and children are served, with a barbershop that takes walk-ins through a queue on the
// phone. The name, logo, team, address, services and prices are invented; the contacts are placeholders; the page and
// its footer say it is a demo.
// Concept (steevanz-sites-clientes): THE PARTING. «A risca» is the line that parts the hair, and «riscar» is to strike
// through — so the signature motif is one straight line at about 14°, the cut of the scissors: it crosses the
// hand-drawn condensed «RISCA» wordmark (the letters above it slid along the cut), and every mask, wipe and slanted
// button end of the site takes its angle. The page reads like an issue of a fashion magazine about hair: ink, chalk
// paper and one loud dye colour, vermilion; Archivo squeezed to its narrowest capitals (width axis) for the headlines,
// Instrument Serif italic for the second voice. Scenes: the opening cut (the screen splits along the line and parts);
// the salon film trimmed into a magazine cover with its masthead and cover lines; the manifesto in outline cut into
// solid letters by a sweeping line; the price list as an index with pictures wiped in at the angle; the colourist's
// swatch ring opening into a fan; the team as a stack of pages cut in over each other; a lookbook of drifting
// columns; the digital client card stamped visit by visit; crossing strips of services; the online booking (service,
// hairdresser or barber, day, hour); the barbershop's walk-in queue, a ticket counting down on a phone over the
// barbershop film; the call to leave a review (never ratings); visiting; questions; the footer.
export function RiscaSite({ route }: { route: RiscaRoute }) {
  const copy = riscaCopy;
  return (
    <MotionRoot>
      <Preloader label={copy.logoLabel} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 bg-vermelhao px-5 py-3 font-semibold text-tinta transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} homeHref={riscaHref(route.mode)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <Manifesto copy={copy} />
        <Services copy={copy} />
        <Colour copy={copy} />
        <Team copy={copy} />
        <Lookbook copy={copy} />
        <ClientCard copy={copy} />
        <Marquee copy={copy} />
        <Booking copy={copy} />
        <Queue copy={copy} />
        <Review copy={copy} />
        <Visit copy={copy} />
        <Faq copy={copy} />
      </main>
      <Footer copy={copy} />
      <SmoothScroll />
    </MotionRoot>
  );
}
