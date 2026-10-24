"use client";

import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { MeadaCategoryId, MeadaCopy, MeadaProduct } from "@/content/meada/copy";
import { meadaPhotos, meadaPrice } from "@/content/meada/facts";
import { useCart } from "./cart";
import { BagIcon, PlusIcon } from "./icons";
import { SplitText } from "./react-bits/SplitText";
import { meadaSections } from "./sections";

const categoryOrder: MeadaCategoryId[] = ["mesa", "texteis", "cestaria", "cera"];

// The online shop (Steevanz «Loja online»): every piece with its price without VAT and «+ IVA» beside it (owner's
// absolute rule), a filter by family and an «Encomendar» button that puts it in the basket (Bag.tsx). The pieces hang
// from a washing line by a clothes peg, like tags in a shop window, and swing with the speed of the scroll — a little
// spring per piece, each answering in its own direction (an idea from React Bits' ScrollVelocity, built on motion's
// scroll velocity). Reduced motion: still. Narrow phones: a card with the photo on the left; wider: photo on top.
export function Shop({ copy }: { copy: MeadaCopy }) {
  const { shop } = copy;
  const [filter, setFilter] = useState<MeadaCategoryId | "all">("all");
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 30, stiffness: 140, mass: 0.6 });
  const still = useMotionValue(0);
  const sway = useTransform(smooth, [-2500, 0, 2500], [-7, 0, 7], { clamp: true });
  const swing = reduced ? still : sway;
  const list = filter === "all" ? shop.list : shop.list.filter((p) => p.category === filter);

  const chip = (active: boolean) =>
    `inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 font-mono text-[0.78rem] tracking-[0.1em] uppercase whitespace-nowrap transition-colors ${
      active ? "bg-grafite text-algodao" : "bg-algodao text-tinta ring-1 ring-tinta/12 hover:ring-fio/50"
    }`;

  return (
    <section id={meadaSections.shop} aria-labelledby="md-shop-title" className="md-linen relative overflow-hidden pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="md-label mb-6 flex items-center gap-3 text-fio">
              <span aria-hidden="true" className="md-stitch w-10" />
              {shop.eyebrow}
            </p>
            <h2 id="md-shop-title" className="font-display text-[clamp(2.7rem,9.5vw,6rem)] leading-[0.96] tracking-[-0.015em]">
              <SplitText text={shop.title} splitType="chars" delay={30} className="block" />
              <span className="block text-fio">{shop.titleItalic}</span>
            </h2>
          </div>
          <div>
            <p className="max-w-lg text-[1.02rem] leading-[1.75] text-cinza">{shop.intro}</p>
            <p className="mt-5 text-sm font-medium text-tinta">{shop.vatNote}</p>
            <p className="mt-1 text-sm text-cinza">{shop.demoNote}</p>
          </div>
        </div>

        <div role="group" aria-label={shop.eyebrow} className="-mx-5 mt-10 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={chip(filter === "all")}>
              {shop.all}
              <span className="opacity-60">{shop.list.length}</span>
            </button>
            {categoryOrder.map((id) => (
              <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} className={chip(filter === id)}>
                {shop.categories[id]}
                <span className="opacity-60">{shop.list.filter((p) => p.category === id).length}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="mx-auto mt-10 grid max-w-[84rem] grid-cols-1 gap-x-3 gap-y-6 px-5 min-[400px]:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:px-8 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((product, i) => (
          <ProductCard key={product.id} product={product} copy={copy} swing={swing} direction={i % 3 === 1 ? -1 : 1} />
        ))}
      </ul>
    </section>
  );
}

function ProductCard({ product, copy, swing, direction }: { product: MeadaProduct; copy: MeadaCopy; swing: MotionValue<number>; direction: 1 | -1 }) {
  const cart = useCart();
  const qty = cart.lines[product.id] ?? 0;
  const photo = meadaPhotos[product.image];
  const rotate = useTransform(swing, (v) => v * direction);

  return (
    <li className="relative pt-7">
      {/* The washing line (continuous across the row) and the peg. */}
      <span aria-hidden="true" className="absolute top-2 -right-3 -left-3 h-px bg-tinta/25 sm:-right-4 sm:-left-4" />
      <m.article
        aria-labelledby={`md-p-${product.id}`}
        style={{ rotate, transformOrigin: "50% -1.25rem" }}
        className="relative h-full will-change-transform"
      >
        <span aria-hidden="true" className="absolute -top-6 left-1/2 z-10 h-7 w-2.5 -translate-x-1/2 rounded-[2px] bg-kraft shadow-[0_2px_0_rgb(31_32_35/0.15)]">
          <span className="absolute inset-x-0 top-3 h-px bg-kraft-2/60" />
        </span>
        <div className="flex h-full gap-4 bg-algodao p-3 shadow-[0_24px_40px_-30px_rgb(31_32_35/0.55)] min-[400px]:flex-col min-[400px]:gap-0 min-[400px]:p-0">
          <div className="relative aspect-[4/5] w-[38%] shrink-0 overflow-hidden bg-cru min-[400px]:w-full">
            <Image
              src={photo.src}
              alt={product.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 400px) 46vw, 38vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-fio)] hover:scale-[1.05]"
              style={{ objectPosition: product.focus ?? "50% 50%" }}
            />
            {/* The price, on a kraft tag. */}
            <p className="md-kraft md-tag absolute top-2 right-2 hidden px-2.5 pt-3 pb-1.5 text-center font-mono text-tinta min-[400px]:block">
              <span className="block text-[0.95rem] leading-none font-medium tabular-nums">{meadaPrice(product.price)}</span>
              <span className="mt-0.5 block text-[0.6rem] tracking-[0.12em]">{copy.shop.plusVat}</span>
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col min-[400px]:p-4 sm:p-5">
            <p className="font-mono text-[0.66rem] tracking-[0.12em] text-fio uppercase">{product.origin}</p>
            <h3 id={`md-p-${product.id}`} className="mt-1.5 font-display text-[1.15rem] leading-snug sm:text-[1.3rem]">
              {product.name}
            </h3>
            <p className="mt-1.5 text-[0.88rem] leading-relaxed text-cinza">{product.detail}</p>
            <p className="mt-2 font-mono tabular-nums min-[400px]:hidden">
              <span className="text-[1.05rem] font-medium">{meadaPrice(product.price)}</span> <span className="text-[0.7rem] tracking-[0.1em] text-cinza">{copy.shop.plusVat}</span>
            </p>
            <div className="mt-auto pt-3">
              <button
                type="button"
                onClick={() => cart.add(product.id)}
                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 font-mono text-[0.74rem] tracking-[0.12em] uppercase transition-colors ${
                  qty ? "bg-fio text-algodao hover:bg-fio-2" : "bg-grafite text-algodao hover:bg-fio"
                }`}
              >
                {qty ? <BagIcon width={16} height={16} /> : <PlusIcon width={16} height={16} />}
                {qty ? `${copy.shop.added} · ${qty}` : copy.shop.add}
                <span className="sr-only"> {product.name}</span>
              </button>
            </div>
          </div>
        </div>
      </m.article>
    </li>
  );
}
