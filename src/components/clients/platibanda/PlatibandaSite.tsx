import { platibandaCopy } from "@/content/platibanda/copy";
import { listings, type Listing } from "@/content/platibanda/listings";
import { platibandaHref, type PlatibandaMode } from "@/content/platibanda/routes";
import { Contact } from "./Contact";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Holidays } from "./Holidays";
import { Listings } from "./Listings";
import { Manifesto } from "./Manifesto";
import { MotionRoot } from "./MotionRoot";
import { Places } from "./Places";
import { Preloader } from "./Preloader";
import { Review } from "./Review";
import { Services } from "./Services";
import { SmoothScroll } from "./SmoothScroll";
import { Street } from "./Street";
import { Team } from "./Team";

const featured = ["PB-101", "PB-104", "PB-103", "PB-302", "PB-102"];

// Platibanda's website (owner, 2026-10-24): a FICTIONAL real-estate agency in Tavira, made up by Steevanz as a showcase
// for selling sites to real-estate agencies, holiday-rental agencies and property managers (name, logo, team,
// address, listings and prices are invented; the contacts are placeholders; the page and its footer say it is a demo;
// every listing says «Imóvel fictício (exemplo)»; the AMI licence is a placeholder).
// Concept (steevanz-sites-clientes): THE HOUSE FRONT. In the Sotavento every house ends in a platibanda — the decorated
// parapet that hides the roof, with a baroque curve and finials — and every door and window has a painted band, the
// «barra». So the signature motif is that outline (./facade.ts): the logo, the mask the film closes into, the frame of
// each house in the street, the door the opening walks through, the skyline of the footer; and the barra is the
// colour code (ochre, terracotta, indigo, salt-pan pink) of each house and service. Palette of whitewash, ochre,
// roof tile, indigo, salt-pan pink and the deep teal of the ria at dusk; Young Serif + Schibsted Grotesk.
// Scenes: the opening draws a house front and walks in through its door; the river film closes into a house front
// with its platibanda, finials and painted door (pin + scrub); a pinned street of featured houses slides past in
// parallax; the listings with filters; a doorway opens onto Tavira from above and the credo lights up word by word
// (pin + scrub); the services paint their pictures over one another from the bottom up in a window that stays; the
// holiday homes with the «Guia digital» scrolling on a phone in front of a pool inside a house front (pin + scrub);
// the agents' «Cartão de visita digital» turning over as they rise; a strip of places painted like a band; contacts
// and a WhatsApp request; the call to leave a review (never ratings); questions; the footer.
export function PlatibandaSite({ mode }: { mode: PlatibandaMode }) {
  const copy = platibandaCopy;
  const street = featured.map((ref) => listings.find((l) => l.ref === ref)).filter((l): l is Listing => Boolean(l));
  return (
    <MotionRoot>
      <Preloader label={copy.logoLabel} tagline={copy.logoTagline} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-cal px-5 py-3 font-semibold text-ria transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} homeHref={platibandaHref(mode)} onHome />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <Street copy={copy} items={street} mode={mode} />
        <Listings copy={copy} mode={mode} />
        <Manifesto copy={copy} />
        <Services copy={copy} />
        <Holidays copy={copy} />
        <Team copy={copy} />
        <Places copy={copy} />
        <Contact copy={copy} />
        <Review copy={copy} />
        <Faq copy={copy} />
      </main>
      <Footer copy={copy} />
      <SmoothScroll />
    </MotionRoot>
  );
}
