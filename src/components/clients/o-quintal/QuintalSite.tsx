import type { OQuintalCategoryId } from "@/content/o-quintal/products";
import type { OQuintalRoute } from "@/content/o-quintal/routes";
import { MotionRoot } from "../o-ermita/MotionRoot";
import { SmoothScroll } from "../o-ermita/SmoothScroll";
import { Business } from "./Business";
import { Cart } from "./Cart";
import { Catalogue } from "./Catalogue";
import { Chalkboard } from "./Chalkboard";
import { Crates } from "./Crates";
import { Delivery } from "./Delivery";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { OrderResult } from "./OrderResult";
import { ProduceStrip } from "./ProduceStrip";
import { ProductDetail } from "./ProductDetail";
import { Shelf } from "./Shelf";

// O Quintal's online shop (owner, 2026-10-25): a greengrocer in Lisbon and around that sells fruit and vegetable
// baskets (its current shop: o-quintal.com). Lives inside the Steevanz app with its own root layout; see
// src/lib/client-sites.ts for its domain.
//
// Concept — «a banca» (the stall). Signature motif: the wooden crate (slats drawn in CSS) and the price chalked on
// a slate tag. Palette: kraft paper, crate wood, fig-leaf green, tomato, lemon, slate. Type: Young Serif (a
// painted grocer's sign), Instrument Sans, Caveat for the chalk. Not the arches of O Ermita, not the sea of Lobo do
// Mar. Scenes on the home only (GSAP ScrollTrigger + Lenis through the shared SmoothScroll, React Bits pieces):
//  1. the crate's slats lift to open the stall, and close again as a lid on scroll (pin + scrub);
//  2. the business's sentence chalked word by word on the slate;
//  3. the week's baskets riding sideways along the counter (pin + horizontal scrub; dropping in on phones);
//  4. two strips of produce names drifting with the scroll velocity;
//  5. the delivery van along a road that draws itself, stamping the six councils (pin + scrub);
//  6. the featured shelf, cards dropping in row by row;
//  7. the business-basket crate whose boards slide open.
// The shop pages (catalogue, product, cart, order result) stay light: no pinned scenes, quick on phones.
export function QuintalSite({ route }: { route: OQuintalRoute }) {
  const { mode, page } = route;
  return (
    <MotionRoot>
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-giz px-5 py-3 font-semibold text-folha transition-transform focus:translate-y-0"
      >
        Saltar para o conteúdo
      </a>
      <Header mode={mode} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        {page.kind === "home" ? (
          <>
            <Hero mode={mode} />
            <Chalkboard />
            <Crates mode={mode} />
            <ProduceStrip />
            <Shelf mode={mode} />
            <Delivery />
            <Business />
          </>
        ) : null}
        {page.kind === "shop" ? <Catalogue mode={mode} category={page.category as OQuintalCategoryId | null} /> : null}
        {page.kind === "product" ? <ProductDetail key={page.id} mode={mode} id={page.id} /> : null}
        {page.kind === "cart" ? <Cart mode={mode} /> : null}
        {page.kind === "success" || page.kind === "cancel" ? <OrderResult mode={mode} kind={page.kind} /> : null}
      </main>
      <Footer mode={mode} />
      <div aria-hidden="true" className="oq-grain pointer-events-none fixed inset-0 z-[80]" />
      <SmoothScroll />
      {page.kind === "home" ? <JsonLd /> : null}
    </MotionRoot>
  );
}
