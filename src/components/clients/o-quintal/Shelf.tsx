"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { oQuintalCategories, oQuintalFromPrice, oQuintalListed } from "@/content/o-quintal/products";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { SplitText } from "../o-ermita/react-bits/SplitText";
import { ArrowIcon } from "./icons";
import { ProductCard } from "./ProductCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scene 6 — «A prateleira». The featured products («Produtos Destacados» on the business's home page) are set
// out on the shelf: cards drop in one row at a time with a small bounce, the category tabs underneath. One
// light trigger per row (no pin), so it stays quick on phones.
export function Shelf({ mode }: { mode: OQuintalMode }) {
  const root = useRef<HTMLElement>(null);
  const featured = oQuintalListed.filter((item) => item.featured && item.category !== "cabazes" && oQuintalFromPrice(item) !== null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
        gsap.set(cards, { y: -36, opacity: 0 });
        ScrollTrigger.batch(cards, {
          start: "top 95%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, ease: "bounce.out", duration: 0.9, stagger: 0.08 }),
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="oq-shelf-title" className="bg-kraft px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[84rem]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="oq-stamp text-tomate-deep">Produtos destacados</p>
            <h2 id="oq-shelf-title" className="mt-4 font-display text-[clamp(2.2rem,7vw,4rem)] leading-[1.03] text-ardosia">
              <SplitText text="Da banca para casa." splitType="chars" />
            </h2>
          </div>
          <Link href={oQuintalHref(mode, { kind: "shop", category: null })} className="inline-flex min-h-12 items-center gap-2 font-semibold text-folha">
            Ver toda a loja <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((item) => (
            <ProductCard key={item.id} product={item} mode={mode} />
          ))}
        </div>
        <ul className="mt-12 flex flex-wrap gap-2">
          {oQuintalCategories.map((category) => (
            <li key={category.id}>
              <Link
                href={oQuintalHref(mode, { kind: "shop", category: category.id })}
                className="inline-flex min-h-11 items-center rounded-full border-2 border-ardosia/15 px-5 font-semibold text-ardosia transition-colors hover:border-folha hover:bg-folha hover:text-giz"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
