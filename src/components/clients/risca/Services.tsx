"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { RiscaCategory, RiscaCopy } from "@/content/risca/copy";
import { riscaDuration, riscaPhotos, riscaPrice } from "@/content/risca/facts";
import { ArrowIcon } from "./icons";
import { SplitText } from "./react-bits/SplitText";
import { openCategoryEvent, pickServiceEvent, riscaSections } from "./sections";

// The slanted wipe of the cut: the new picture comes in from the right behind an edge at the parting's angle.
const hidden = "polygon(120% 0%, 120% 0%, 100% 100%, 100% 100%)";
const shown = "polygon(0% 0%, 120% 0%, 100% 100%, -20% 100%)";

export interface PickService {
  category: RiscaCategory["id"];
  index: number;
}

// The price list, like the index pages of a magazine: five families as tabs, each with its picture (wiped in at the
// angle of the cut) and its services — duration, price without VAT and «+ IVA», a «Marcar» that opens the booking
// with that service chosen. Phones: heading, the picture, then the tabs and the list.
export function Services({ copy }: { copy: RiscaCopy }) {
  const { services } = copy;
  const [active, setActive] = useState<RiscaCategory["id"]>(services.list[0].id);
  const reduced = useReducedMotion();
  // Only a change of tab animates: the first paint (server and browser alike) shows the list as it is.
  const [changed, setChanged] = useState(false);
  const category = services.list.find((c) => c.id === active) ?? services.list[0];
  const photo = riscaPhotos[category.photo];

  useEffect(() => {
    const onOpen = (event: Event) => {
      const id = (event as CustomEvent<RiscaCategory["id"]>).detail;
      if (services.list.some((c) => c.id === id)) {
        setChanged(true);
        setActive(id);
      }
    };
    window.addEventListener(openCategoryEvent, onOpen);
    return () => window.removeEventListener(openCategoryEvent, onOpen);
  }, [services.list]);

  const pick = (index: number) => {
    window.dispatchEvent(new CustomEvent<PickService>(pickServiceEvent, { detail: { category: category.id, index } }));
  };

  return (
    <section id={riscaSections.services} aria-labelledby="rc-services-title" className="relative bg-gesso py-24 sm:py-32">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
          <div>
            <p className="rc-label mb-5 flex items-center gap-4 text-vermelhao-escuro">
              <span aria-hidden="true" className="h-[2px] w-10 bg-vermelhao" />
              {services.eyebrow}
            </p>
            <h2 id="rc-services-title" className="text-[clamp(3.4rem,14vw,9.5rem)] leading-[0.86]">
              <SplitText text={services.title} className="rc-display block" />
              <span className="rc-serif block text-[0.86em] text-vermelhao-escuro">{services.titleSerif}</span>
            </h2>
          </div>
          <p className="max-w-md leading-relaxed text-cinza">{services.intro}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:mt-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden bg-tinta lg:aspect-[4/5]">
              <AnimatePresence initial={false}>
                <m.div
                  key={category.id}
                  className="absolute inset-0"
                  initial={{ clipPath: hidden }}
                  animate={{ clipPath: shown }}
                  exit={{ opacity: 0.99 }}
                  transition={{ duration: reduced ? 0.2 : 0.75, ease: [0.65, 0, 0.35, 1] }}
                >
                  <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(18_17_16/0.7))]" />
                  <p className="rc-display absolute bottom-4 left-5 text-[clamp(2.4rem,8vw,4.5rem)] text-gesso">{category.title}</p>
                </m.div>
              </AnimatePresence>
            </div>
            <p className="mt-4 hidden max-w-sm text-sm leading-relaxed text-cinza lg:block">{category.lead}</p>
          </div>

          <div>
            <div role="tablist" aria-label={services.tabsLabel} className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
              {services.list.map((c) => {
                const selected = c.id === active;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    id={`rc-tab-${c.id}`}
                    aria-selected={selected}
                    aria-controls="rc-services-panel"
                    onClick={() => {
                      setChanged(true);
                      setActive(c.id);
                    }}
                    className={`flex h-11 shrink-0 items-center px-4 text-[0.9rem] font-semibold whitespace-nowrap transition-colors ${
                      selected ? "bg-tinta text-gesso" : "ring-1 ring-tinta/20 hover:ring-tinta/60"
                    }`}
                  >
                    {c.title}
                  </button>
                );
              })}
            </div>

            <div id="rc-services-panel" role="tabpanel" aria-labelledby={`rc-tab-${category.id}`} className="mt-8">
              <p className="mb-6 leading-relaxed text-cinza lg:hidden">{category.lead}</p>
              <ul className="border-t-2 border-tinta">
                {category.services.map((s, i) => (
                  <m.li
                    key={`${category.id}-${s.name}`}
                    initial={changed && !reduced ? { opacity: 0, x: 24 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduced ? 0 : i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-tinta/15 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:py-5"
                  >
                    <div className="min-w-0">
                      <p className="text-[1.05rem] leading-snug font-semibold sm:text-[1.15rem]">{s.name}</p>
                      <p className="mt-0.5 text-[0.85rem] text-cinza">
                        {riscaDuration(s.minutes)}
                        {s.note ? ` · ${s.note}` : ""}
                      </p>
                    </div>
                    <p className="text-right whitespace-nowrap sm:order-none">
                      {s.from ? <span className="mr-1 text-[0.75rem] text-cinza">{services.from}</span> : null}
                      <span className="rc-display text-[1.9rem] leading-none">{riscaPrice(s.price)}</span>{" "}
                      <span className="text-[0.68rem] font-semibold tracking-[0.1em] text-cinza uppercase">{services.plusVat}</span>
                    </p>
                    <a
                      href={`#${riscaSections.book}`}
                      onClick={() => pick(i)}
                      aria-label={services.bookLabel.replace("{servico}", s.name)}
                      className="group col-span-2 inline-flex h-11 items-center justify-between gap-2 bg-papel px-4 text-[0.78rem] font-bold tracking-[0.14em] uppercase transition-colors hover:bg-vermelhao sm:col-span-1 sm:justify-center"
                    >
                      {services.book}
                      <ArrowIcon width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </m.li>
                ))}
              </ul>
              <p className="mt-5 text-[0.82rem] text-cinza">
                {services.vatNote} {services.demoNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
