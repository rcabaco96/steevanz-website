import { ferragialCopy } from "@/content/ferragial/copy";
import { ferragial } from "@/content/ferragial/facts";
import { ferragialHref, type FerragialRoute } from "@/content/ferragial/routes";
import { Basket } from "./Basket";
import { CartProvider } from "./cart";
import { Club } from "./Club";
import { Events } from "./Events";
import { Family } from "./Family";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Land } from "./Land";
import { Manifesto } from "./Manifesto";
import { MotionRoot } from "./MotionRoot";
import { Opening } from "./Opening";
import { Review } from "./Review";
import { SmoothScroll } from "./SmoothScroll";
import { Talha } from "./Talha";
import { Visit } from "./Visit";
import { Visits } from "./Visits";
import { Wines } from "./Wines";
import { Year } from "./Year";

// The Adega Ferragial's website (owner, 2026-10-24: «cria-me um website para cada tipo de negócio que temos no CRM»):
// a FICTIONAL family winery near Vidigueira, in the Alentejo, made up by Steevanz as a showcase for selling sites to
// wineries with wine tourism (the CRM's «adegas»). Name, logo, family, address, phone (unassigned +351 900 range),
// wines, visits, dates and prices are invented, and the page says so (hero badge, notes beside every price list,
// footer). No awards, scores, ratings, reviews or visitor numbers; prices without VAT, «+ IVA» beside them; a
// responsible-drinking line; the shop and the tastings for adults only. Steevanz products woven in: the online shop
// (basket → order request by WhatsApp or email, never a payment), the online booking of visits and tastings, the
// «Cartão de cliente digital» as the wine club, and the «Deixe a sua avaliação» call.
//
// Concept (steevanz-sites-clientes): THE HORIZON AND THE TALHA. The Alentejo is a straight line between a big sky and
// a flat earth, and its oldest wine is made in clay talhas. The signature motif is that line: the logo is a talha
// crossed by the horizon (also the level of the wine inside), with half a sun rising on it; every opening and closing
// on the site happens along a horizontal line. Palette of the plain: lime-wash white, straw, fired clay, the garnet of
// the wine and the must, schist, rockrose green, bleached sky. Gloock + Familjen Grotesk.
// Scenes, in order: the opening draws the horizon in the dark, raises a clay sun and splits the screen along the
// line (sky up, earth down); the sunrise film closes from sky and earth onto its own horizon and a sun rises on the
// remaining line; a sentence whose words rise from behind their line; the wines with one glass poured in each wine's
// colour as the list passes (the online shop); the talha drawn in clay, filling with must while the skins sink, until
// the São Martinho drop; the experiences opening out of their horizon line and the booking request; the year in the
// vineyard pinned sideways with a sun travelling an arc and the scene's colour turning with the seasons; the grape
// varieties drifting on a straw band and the dates; the club card stamped with cork; the land as a skyline of photos
// on one long horizon; the family; how to get there over a sunset time-lapse; the review call; questions; the footer.
export function FerragialSite({ route }: { route: FerragialRoute }) {
  const copy = ferragialCopy;
  return (
    <MotionRoot>
      <CartProvider>
        <Opening name={ferragial.name} line={copy.opening.line} />
        <a
          href="#conteudo"
          className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-cal px-5 py-3 font-medium text-xisto transition-transform focus:translate-y-0"
        >
          {copy.skip}
        </a>
        <Header copy={copy} homeHref={ferragialHref(route.mode)} />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <Hero copy={copy} />
          <Manifesto copy={copy} />
          <Wines copy={copy} />
          <Talha copy={copy} />
          <Visits copy={copy} />
          <Year copy={copy} />
          <Events copy={copy} />
          <Club copy={copy} />
          <Land copy={copy} />
          <Family copy={copy} />
          <Visit copy={copy} />
          <Review copy={copy} />
          <Faq copy={copy} />
        </main>
        <Footer copy={copy} />
        <Basket copy={copy} />
        <div aria-hidden="true" className="fg-grain pointer-events-none fixed inset-0 z-[70]" />
        <SmoothScroll />
      </CartProvider>
    </MotionRoot>
  );
}
