import { fabiosCopy } from "@/content/fabios-roadstop/copy";
import type { FabiosRoute } from "@/content/fabios-roadstop/routes";
import { AboutPage } from "./AboutPage";
import { AllDay } from "./AllDay";
import { ContactPage } from "./ContactPage";
import { Dishes } from "./Dishes";
import { Experience } from "./Experience";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { fabiosLinks } from "./links";
import { MotionRoot } from "./MotionRoot";
import { SmoothScroll } from "./SmoothScroll";
import { Social } from "./Social";
import { Visit } from "./Visit";

// Fabio's Roadstop's website (owner, 2026-10-21): an American 1950s diner in Armação de Pêra. Lives inside the
// Steevanz app with its own root layout; see src/lib/client-sites.ts for its domain.
export function FabiosSite({ route }: { route: FabiosRoute }) {
  const { mode, locale, page } = route;
  const copy = fabiosCopy[locale];
  const links = fabiosLinks(mode, locale, page);
  return (
    <MotionRoot>
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-sun px-5 py-3 font-bold text-ink transition-transform focus:translate-y-0"
      >
        {copy.skip}
      </a>
      <Header copy={copy} links={links} locale={locale} page={page} tagline={copy.allDay.eyebrow} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        {page === "home" ? (
          <>
            <Hero copy={copy} links={links} />
            <Dishes copy={copy} menuHref={links.menu} />
            <AllDay copy={copy} />
            <Experience copy={copy} aboutHref={links.about} />
            <Visit copy={copy} />
            <Social copy={copy} />
          </>
        ) : page === "about" ? (
          <AboutPage copy={copy} links={links} />
        ) : (
          <ContactPage copy={copy} />
        )}
      </main>
      <Footer copy={copy} links={links} />
      <SmoothScroll />
      <JsonLd locale={locale} />
    </MotionRoot>
  );
}
