import { meadaCopy } from "@/content/meada/copy";
import { meadaHref, type MeadaRoute } from "@/content/meada/routes";
import { Bag } from "./Bag";
import { CartProvider } from "./cart";
import { Crafts } from "./Crafts";
import { Faq } from "./Faq";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { LoyaltyCard } from "./LoyaltyCard";
import { Manifesto } from "./Manifesto";
import { Marquee } from "./Marquee";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { Review } from "./Review";
import { Shop } from "./Shop";
import { SmoothScroll } from "./SmoothScroll";
import { Visit } from "./Visit";

// Meada's website (owner, 2026-10-24): a FICTIONAL concept store of home and Portuguese crafts in the historic centre of
// Guimarães, made up by Steevanz as a showcase for selling websites, online shops («Loja online») and the digital
// customer card («Cartão de cliente digital») to shops. The name, logo, team, workshops, address, products and prices
// are invented; the contacts are placeholders; the page and its footer say it is a demo.
// Concept (steevanz-sites-clientes): THE RED THREAD. A «meada» is a skein — thread before it becomes a piece — and
// Guimarães is the town of linen and of embroidery in red thread on white. So the signature motif is the thread and
// what it makes: the running stitch (pesponto) used as every rule and underline, the cross-stitch (ponto de cruz) as
// the mark and as the «ponto» of the customer card, and the kraft hang tag tied with red string that every handmade
// piece carries. Palette of cotton and raw linen, kraft paper, madder red thread and cool graphite; Young Serif +
// Schibsted Grotesk + DM Mono (the stamped tags). Scenes: the word «meada» written in thread on linen, a stitch sewn
// under it and the linen pulled up by its thread; the loom film cut down to a hang tag that is punched, tied and set
// swinging; a sentence sewn word by word with a running stitch; the shop as pieces pegged on a washing line, swinging
// with the scroll speed, and a basket that writes the order; the four crafts woven in on a loom, weft thread by weft
// thread, with a red shuttle running down the warp; the customer card filling with cross-stitches up to the gift;
// swatches of the house unrolled and stitched round; two bands of materials sewn across in opposite directions; how
// to order and visit; the call to leave a review (never ratings); questions; the footer.
export function MeadaSite({ route }: { route: MeadaRoute }) {
  const copy = meadaCopy;
  return (
    <MotionRoot>
      <CartProvider>
        <Preloader label={copy.logoLabel} />
        <a
          href="#conteudo"
          className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-algodao px-5 py-3 font-medium text-tinta transition-transform focus:translate-y-0"
        >
          {copy.skip}
        </a>
        <Header copy={copy} homeHref={meadaHref(route.mode)} />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          <Hero copy={copy} />
          <Manifesto copy={copy} />
          <Shop copy={copy} />
          <Crafts copy={copy} />
          <LoyaltyCard copy={copy} />
          <Gallery copy={copy} />
          <Marquee copy={copy} />
          <Visit copy={copy} />
          <Review copy={copy} />
          <Faq copy={copy} />
        </main>
        <Footer copy={copy} />
        <Bag copy={copy} />
        <SmoothScroll />
      </CartProvider>
    </MotionRoot>
  );
}
