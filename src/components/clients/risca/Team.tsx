"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import type { RiscaCopy } from "@/content/risca/copy";
import { riscaPhotos } from "@/content/risca/facts";
import { ArrowIcon } from "./icons";
import { pickStylistEvent, riscaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const hidden = "polygon(115% 0%, 140% 0%, 115% 100%, 90% 100%)";
const shown = "polygon(-25% 0%, 140% 0%, 115% 100%, -50% 100%)";

// The team as a stack of magazine pages. Scrolling holds the stage (pin + scrub) and each next stylist is cut in over
// the last one by an edge at the angle of the parting, the page underneath sinking back. Each page: the name in big
// capitals, the speciality, a picture of that kind of work (stock footage, not the person: the page says so) and
// «Marcar com …», which opens the booking with that stylist chosen. Reduced motion and no JavaScript: the pages
// simply follow one another.
export function Team({ copy }: { copy: RiscaCopy }) {
  const { team } = copy;
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = stage.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const cards = q("[data-card]");
        el.classList.add("rc-stacked");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${(cards.length - 1) * 85}%`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
        });
        cards.forEach((card, i) => {
          if (i === 0) return;
          const at = i - 1;
          tl.fromTo(card, { clipPath: hidden }, { clipPath: shown, duration: 1, ease: "power2.inOut" }, at)
            .fromTo(card.querySelector("[data-card-photo]"), { scale: 1.18 }, { scale: 1, duration: 1 }, at)
            .to(cards[i - 1], { scale: 0.92, duration: 1 }, at)
            .to(cards[i - 1].querySelector("[data-card-dim]"), { opacity: 0.7, duration: 1 }, at)
            .to(q("[data-count]"), { textContent: i + 1, snap: { textContent: 1 }, duration: 0.01 }, at + 0.5);
        });
        tl.to({}, { duration: 0.3 });
        return () => el.classList.remove("rc-stacked");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const book = (id: string) => window.dispatchEvent(new CustomEvent(pickStylistEvent, { detail: id }));

  return (
    <section id={riscaSections.team} ref={root} aria-labelledby="rc-team-title" className="rc-on-dark relative bg-tinta text-gesso">
      <div className="mx-auto max-w-[92rem] px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-end">
          <div>
            <p className="rc-label mb-5 flex items-center gap-4 text-vermelhao">
              <span aria-hidden="true" className="h-[2px] w-10 bg-vermelhao" />
              {team.eyebrow}
            </p>
            <h2 id="rc-team-title" className="text-[clamp(3.2rem,12vw,8.4rem)] leading-[0.86]">
              <span className="rc-display block">{team.title}</span>
              <span className="rc-serif block text-[0.86em] text-vermelhao">{team.titleSerif}</span>
            </h2>
          </div>
          <div>
            <p className="max-w-md leading-relaxed text-gesso/75">{team.intro}</p>
            <p className="mt-3 max-w-md text-[0.8rem] leading-relaxed text-gesso/50">{team.note}</p>
          </div>
        </div>
      </div>

      <div ref={stage} className="rc-stage relative overflow-hidden">
        <p aria-hidden="true" className="rc-label absolute top-20 right-5 z-20 hidden tabular-nums text-gesso/60 sm:right-8 [.rc-stacked_&]:block">
          <span data-count>1</span> / {team.list.length}
        </p>
        {team.list.map((s, i) => {
          const photo = riscaPhotos[s.photo];
          return (
            <article
              key={s.id}
              data-card
              aria-labelledby={`rc-stylist-${s.id}`}
              className="relative flex origin-center flex-col bg-tinta px-5 pt-6 pb-12 sm:px-8 [.rc-stacked_&]:absolute [.rc-stacked_&]:inset-0 [.rc-stacked_&]:pt-20 [.rc-stacked_&]:pb-8"
              style={{ zIndex: i + 1 }}
            >
              <div className="mx-auto grid h-full w-full max-w-[92rem] min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-5 border-t border-gesso/15 pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:grid-rows-[1fr] lg:gap-12">
                <header className="lg:col-start-2 lg:self-start">
                  <p className="rc-label text-vermelhao">
                    0{i + 1} · {s.role}
                  </p>
                  <h3 id={`rc-stylist-${s.id}`} className="rc-display mt-3 text-[clamp(3.2rem,15vw,8rem)]">
                    {s.name}
                  </h3>
                </header>
                <div className="relative min-h-[11rem] overflow-hidden lg:col-start-1 lg:row-start-1 lg:min-h-[26rem]">
                  <div data-card-photo className="absolute inset-0">
                    <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  </div>
                </div>
                <div className="lg:col-start-2 lg:self-end">
                  <p className="max-w-md leading-relaxed text-gesso/80">{s.text}</p>
                  <a
                    href={`#${riscaSections.book}`}
                    onClick={() => book(s.id)}
                    className="rc-slant mt-5 inline-flex h-12 items-center gap-3 bg-vermelhao pr-9 pl-6 text-[0.8rem] font-bold tracking-[0.14em] text-tinta uppercase transition-colors hover:bg-gesso"
                  >
                    {team.book.replace("{nome}", s.name.split(" ")[0])}
                    <ArrowIcon width={16} height={16} />
                  </a>
                </div>
              </div>
              <div data-card-dim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-tinta opacity-0" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
