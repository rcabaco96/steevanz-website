import { prumoCopy } from "@/content/prumo/copy";
import { prumoHref, type PrumoRoute } from "@/content/prumo/routes";
import { Booking } from "./Booking";
import { Disciplines } from "./Disciplines";
import { Faq } from "./Faq";
import { FirstVisit } from "./FirstVisit";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Manifesto } from "./Manifesto";
import { Marquee } from "./Marquee";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { Review } from "./Review";
import { SmoothScroll } from "./SmoothScroll";
import { Space } from "./Space";
import { Studio } from "./Studio";
import { Team } from "./Team";
import { Visit } from "./Visit";

// Prumo's website (owner, 2026-10-24: «cria-me um website para cada tipo de negócio que temos no CRM!»): a FICTIONAL
// small private clinic of physiotherapy, osteopathy and wellness (pilates clínico, therapeutic massage, nutrition) in
// Celas, Coimbra, made up by Steevanz as a showcase for selling sites to the CRM's «Saúde e bem-estar» sector (clinics,
// physiotherapy, wellness centres, chiropractors). The name, logo, team, address, services and prices are invented;
// the contacts are placeholders; the page and its footer say it is a demo. Careful health content: no medical claims,
// no promised results, licence numbers and insurers only as placeholders, a note that it doesn't replace medical advice.
// Concept (steevanz-sites-clientes): THE PLUMB LINE. «Prumo» is the plumb line — and «a prumo», standing true. The
// signature motif is the «fio de prumo» physiotherapists hang in front of a posture grid: a fine thread ending in a
// brass bob, against a grid of squares. Calm and trustworthy, never a hospital: lime-wash white and Ançã limestone
// (Coimbra's stone), slate for the dark, a misty blue, and brass only for the bob; Newsreader (a calm reading serif with
// optical sizes, its italic as the second voice) + Figtree (friendly, very legible). The hand-drawn monoline wordmark
// «prumo» lets the stem of its «p» drop as the thread with the bob. Scenes: the opening draws the letters, the bob
// swings to rest and the dark closes onto the plumb line; the assessment film narrows into a column that leans off
// true and comes back into plumb on the grid, the method's four steps appearing along the thread; the manifesto's
// words start out of line and settle onto a brass level line; the treatments with a sticky panel where each photo is
// let down like a blind and the bob slides down the thread to its number; the first consultation as vertebrae threaded
// one under the other, the minutes adding up; the pilates film seen through the slats of a blind that fold away, and
// the «Cartão de cliente digital» stamped class by class with brass bobs; the team hanging from a brass rail, swinging
// to rest; a strip of disciplines drifting with the scroll; the rooms pinned crooked on the grid and straightening; the
// online booking («Sistema de reservas online»: treatment, therapist, day, hour); visiting, insurers as placeholders;
// the call to leave a review (never ratings); questions with the health note; the footer.
export function PrumoSite({ route }: { route: PrumoRoute }) {
  const copy = prumoCopy;
  return (
    <MotionRoot>
      <Preloader label={copy.logoLabel} line={copy.tagline} />
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-cal px-5 py-3 font-semibold text-ardosia transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} homeHref={prumoHref(route.mode)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero copy={copy} />
        <Manifesto copy={copy} />
        <Disciplines copy={copy} />
        <FirstVisit copy={copy} />
        <Studio copy={copy} />
        <Team copy={copy} />
        <Marquee copy={copy} />
        <Space copy={copy} />
        <Booking copy={copy} />
        <Visit copy={copy} />
        <Review copy={copy} />
        <Faq copy={copy} />
      </main>
      <Footer copy={copy} />
      <SmoothScroll />
    </MotionRoot>
  );
}
