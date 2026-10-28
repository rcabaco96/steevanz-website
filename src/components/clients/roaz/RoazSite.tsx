import { roazCopy } from "@/content/roaz/copy";
import { roazHref, type RoazRoute } from "@/content/roaz/routes";
import { Aboard } from "./Aboard";
import { Booking } from "./Booking";
import { Coast } from "./Coast";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Logbook } from "./Logbook";
import { Manifesto } from "./Manifesto";
import { Marquee } from "./Marquee";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { Review } from "./Review";
import { Skipper } from "./Skipper";
import { SmoothScroll } from "./SmoothScroll";
import { Tours } from "./Tours";
import { Waitlist } from "./Waitlist";

// Roaz's website (owner, 2026-10-24): a FICTIONAL boat-trip and sea-activities operator on the pier of Ferragudo,
// in the Algarve, made up by Steevanz as a showcase for selling sites to boat-trip operators and activity companies
// (the name, logo, boat, skipper, meeting point, trips, times, policies and prices are invented; the contacts belong
// to no one; the page and its footer say it is a demo; the places of the coast are real).
// Concept (steevanz-sites-clientes): THE LINE OF THE SEA, SEEN FROM A SMALL BOAT. Signature motifs: the horizon line
// broken by a dolphin's back and fin (the «roaz» of the stencil wordmark, lettered like a hull's registration) and
// the WAKE — the V of white water a boat leaves behind — which is how things open on this site. Palette of the
// Algarve from the water: deep sea blue, the turquoise of the shallows, the ochre of the limestone cliffs, salt-white
// and sand. Big Shoulders (+ Stencil) and Figtree. Scenes: a boat crosses the dark and its wake opens the screen; the
// drone film's top edge sinks to a horizon that rolls like a boat, the sky opening above with where we are and a
// compass ruler sliding; a sentence surfacing word by word from under its water line; the coast from Ferragudo to
// Benagil as a sliding chart, the boat sailing east and each stop lighting up; four trips whose films open the way
// each is seen (out of a cave's mouth, through binoculars, from the horizon as the sun sinks, inside a wake); the
// walk-up waitlist on a phone; two strips of trip names running both ways like a bow wave; the logbook, every
// picture opening in a wake; before boarding (policies, placeholders for licences); the skipper's card turning over;
// the online booking ending in a sample ticket; the call to leave a review (never ratings); questions; the footer.
export function RoazSite({ route }: { route: RoazRoute }) {
  const copy = roazCopy;
  return (
    <MotionRoot>
      <Preloader label={copy.logoLabel} line={copy.tagline} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-falesia px-5 py-3 font-semibold text-fundo transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} homeHref={roazHref(route.mode)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <Manifesto copy={copy} />
        <Coast copy={copy} />
        <Tours copy={copy} />
        <Waitlist copy={copy} />
        <Marquee copy={copy} />
        <Logbook copy={copy} />
        <Aboard copy={copy} />
        <Skipper copy={copy} />
        <Booking copy={copy} />
        <Review copy={copy} />
        <Faq copy={copy} />
      </main>
      <Footer copy={copy} />
      <SmoothScroll />
    </MotionRoot>
  );
}
