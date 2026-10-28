"use client";

import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiroPhotos, ponteiroPrice } from "@/content/ponteiro/facts";
import { FlapBoard } from "./FlapBoard";
import { SplitText } from "./react-bits/SplitText";
import { ponteiroSections } from "./sections";

const noop = () => () => {};

// The carta in three parts — the counter, the kitchen, the bar — each with its hours and a picture, every price
// without VAT and marked «+ IVA». A tab bar switches between them (before JavaScript, all three are shown one after
// the other). Beside it, the «prato do dia» board. Phones: heading and intro, the picture, then the tabs and prices.
export function Carta({ copy }: { copy: PonteiroCopy }) {
  const { carta } = copy;
  const [tabId, setTabId] = useState(carta.tabs[0].id);
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const tab = carta.tabs.find((t) => t.id === tabId) ?? carta.tabs[0];
  const photo = ponteiroPhotos[tab.image];

  const onKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const dir = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    event.preventDefault();
    const next = carta.tabs[(index + dir + carta.tabs.length) % carta.tabs.length];
    setTabId(next.id);
    document.getElementById(`pn-tab-${next.id}`)?.focus();
  };

  const list = (t: (typeof carta.tabs)[number]) => (
    <div className="grid gap-9">
      {t.groups.map((group) => (
        <div key={group.title}>
          <h4 className="pn-label mb-3 text-ginja">{group.title}</h4>
          <ul className="border-t border-tinta/12">
            {group.items.map((item) => (
              <li key={item.name} className="flex items-baseline gap-3 border-b border-tinta/12 py-3.5">
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.02rem] leading-snug font-medium">{item.name}</span>
                  {item.note ? <span className="block text-[0.85rem] text-cinza">{item.note}</span> : null}
                </span>
                <span className="shrink-0 text-right whitespace-nowrap">
                  <span className="font-display text-[1.5rem] leading-none tabular-nums">{ponteiroPrice(item.price)}</span>{" "}
                  <span className="text-[0.66rem] font-semibold tracking-[0.1em] text-cinza uppercase">{carta.plusVat}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <section id={ponteiroSections.carta} aria-labelledby="pn-carta-title" className="relative bg-papel py-24 sm:py-32">
      <div className="mx-auto grid max-w-[84rem] gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:col-span-2">
          <p className="pn-label mb-5 flex items-center gap-4 text-ginja">
            <span aria-hidden="true" className="h-px w-10 bg-ginja/50" />
            {carta.eyebrow}
          </p>
          <h2 id="pn-carta-title" className="font-display text-[clamp(2.8rem,10vw,6rem)] leading-[0.92]">
            <SplitText text={carta.title} splitType="words" delay={60} /> <span className="text-ginja italic">{carta.titleItalic}</span>
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-tinta/75">{carta.intro}</p>
        </div>

        {/* The picture of the part of the carta on show, and the prato do dia. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-marmore">
            <AnimatePresence initial={false}>
              <m.div
                key={tab.id}
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.2, 0.9, 0.25, 1] }}
                className="absolute inset-0"
              >
                <Image src={photo.src} alt={tab.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 40vw, 100vw" className="h-full w-full object-cover" />
              </m.div>
            </AnimatePresence>
            <span className="pn-label absolute top-4 left-4 rounded-full bg-papel/90 px-3 py-1.5 text-tinta">{tab.hours}</span>
          </div>
          <div className="mt-6">
            <FlapBoard copy={copy} />
          </div>
        </div>

        <div>
          {hydrated ? (
            <>
              <div role="tablist" aria-label={carta.tabsLabel} className="flex gap-2 rounded-full bg-marmore p-1.5">
                {carta.tabs.map((t, i) => (
                  <button
                    key={t.id}
                    id={`pn-tab-${t.id}`}
                    type="button"
                    role="tab"
                    aria-selected={t.id === tab.id}
                    aria-controls={`pn-panel-${t.id}`}
                    tabIndex={t.id === tab.id ? 0 : -1}
                    onClick={() => setTabId(t.id)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={`relative h-12 flex-1 rounded-full text-[0.98rem] font-semibold transition-colors ${t.id === tab.id ? "text-papel" : "text-tinta/70 hover:text-tinta"}`}
                  >
                    {t.id === tab.id ? <m.span layoutId="pn-tab-pill" className="absolute inset-0 rounded-full bg-tinta" transition={{ type: "spring", stiffness: 380, damping: 34 }} /> : null}
                    <span className="relative">{t.label}</span>
                  </button>
                ))}
              </div>
              <div id={`pn-panel-${tab.id}`} role="tabpanel" aria-labelledby={`pn-tab-${tab.id}`} tabIndex={0} className="mt-8 outline-none">
                <p className="mb-8 max-w-lg leading-relaxed text-tinta/75">{tab.intro}</p>
                <AnimatePresence mode="wait" initial={false}>
                  <m.div key={tab.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    {list(tab)}
                  </m.div>
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="grid gap-14">
              {carta.tabs.map((t) => (
                <div key={t.id}>
                  <h3 className="font-display text-4xl">{t.label}</h3>
                  <p className="mt-2 mb-6 text-sm text-cinza">{t.hours}</p>
                  {list(t)}
                </div>
              ))}
            </div>
          )}
          <p className="mt-8 text-sm leading-relaxed text-cinza">
            {carta.vatNote} {carta.demoNote}
          </p>
        </div>
      </div>
    </section>
  );
}
