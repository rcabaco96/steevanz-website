import { seteChavesCopy as copy } from "@/content/sete-chaves/copy";
import {
  seteChavesHref,
  type SeteChavesRoute,
} from "@/content/sete-chaves/routes";
import { Around } from "./Around";
import { Booking } from "./Booking";
import { Day } from "./Day";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Guide } from "./Guide";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { Review } from "./Review";
import { Rooms } from "./Rooms";
import { Rules } from "./Rules";
import { SmoothScroll } from "./SmoothScroll";
import { Story } from "./Story";

// Sete Chaves' website (owner, 2026-10-24): a FICTIONAL guest house in the countryside of Aljezur, on the Costa
// Vicentina, made up by Steevanz as a showcase for selling websites to holiday apartments, guest houses, small hotels
// and rural stays (the name, logo, hosts, address, rooms, rules and prices are invented; the contacts are unusable
// placeholders; the page and its footer say it is a demo). pt-PT only, at /sete-chaves.
//
// Concept (steevanz-sites-clientes): THE KEYS. A guest house is a set of keys — seven here, one per door, found
// hanging behind the kitchen door when the old farmhouse was restored. So the signature motif is the brass key tag
// (round top, the hole for the ring, a number stamped in it): it is the logo, the frame the film closes into, the
// frame of every photo of the day, the board where the rooms hang, the menu's links, the plates of the house rules.
// Palette of the Costa Vicentina: lime-white walls and esteva petals (cal, linho), the grey schist of the cliffs
// (xisto), the brass of old keys (latão), the Atlantic mist (bruma) and the dark blotch at the heart of the esteva
// flower (mancha) for small accents. Type: Gloock (a stamped, high-contrast serif) + Figtree.
// Scenes: the key tag swings on its nail, turns a quarter like in a lock and becomes a keyhole that opens onto the
// house (opening, once per session); a linen curtain in the morning wind closes into the shape of the key tag and
// swings on its ring (hero, pin + scrub); the key board, where scrolling takes the keys off their hooks one by one and
// each room slides open over the last (pin + scrub on large screens; swinging tags on phones); a day as one sky, the
// sun crossing on an arc from breakfast to the stars (pin + scrub); the sea opening from a thin horizon line, the
// beaches' names drifting (React Bits' ScrollVelocity) and postcards straightening on the table; the guest guide
// scrolling inside a phone held to the plate on the bedside table (the Steevanz Guia digital); the house rules on
// screwed plates; the booking request with a demo calendar (WhatsApp or email, nothing charged); the call to leave a
// review (never ratings); questions; the footer.
export function SeteChavesSite({ route }: { route: SeteChavesRoute }) {
  return (
    <MotionRoot>
      <Preloader name="Sete Chaves" line={copy.preloader} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-xisto px-5 py-3 font-medium text-cal transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header homeHref={seteChavesHref(route.mode)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Story copy={copy} />
        <Rooms />
        <Day />
        <Around />
        <Guide />
        <Rules copy={copy} />
        <Booking copy={copy} />
        <Review copy={copy} />
        <Faq copy={copy} />
      </main>
      <Footer copy={copy} />
      <div
        aria-hidden="true"
        className="sc-grain pointer-events-none fixed inset-0 z-[70]"
      />
      <SmoothScroll />
    </MotionRoot>
  );
}
