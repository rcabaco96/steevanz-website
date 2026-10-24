"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { RiscaCopy } from "@/content/risca/copy";
import { risca } from "@/content/risca/facts";
import { CheckIcon, ClockIcon } from "./icons";
import { riscaSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The example queue the phone plays through: the ticket being served goes from `from` to the visitor's own. */
const queue = { letter: "B", from: 12, mine: 15, minutesEach: 8 };

// The barbershop without appointment (Steevanz's «Lista de espera digital»). The barbershop film runs behind a panel
// cut at the angle of the parting; on it stands a phone with the visitor's ticket. Scrolling plays the queue (GSAP
// scrub; on large screens the scene holds): the ticket being served counts up, the people ahead and the estimated
// wait count down, and «É a sua vez!» rises at the end. Beside it, the three steps (QR or a tap at the door, the wait
// on the phone, the page rings) and the counter for those who'd rather not use the phone. Phones: heading, the film
// with the phone, then the steps. Reduced motion and no JavaScript: the phone shows the turn has come.
export function Queue({ copy }: { copy: RiscaCopy }) {
  const { queue: q } = copy;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const ahead = queue.mine - queue.from;

  useEffect(() => {
    const el = film.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const $ = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", large: "(min-width: 1024px) and (min-height: 700px)" }, (ctx) => {
        const { motion, large } = ctx.conditions as { motion: boolean; large: boolean };
        if (!motion) return;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: large
            ? { trigger: el, start: "top top", end: "+=100%", pin: true, scrub: 0.5, anticipatePin: 1 }
            : { trigger: $("[data-queue-phone]")[0], start: "top 85%", end: "bottom 40%", scrub: 0.5 },
        });
        // The panel is cut open while the section comes up, before the scene holds.
        gsap.fromTo(
          $("[data-queue-panel]"),
          { clipPath: "polygon(0% 0%, 0% 0%, -30% 100%, -30% 100%)" },
          { clipPath: "polygon(0% 0%, 130% 0%, 100% 100%, -30% 100%)", ease: "power2.out", scrollTrigger: { trigger: $("[data-queue-panel]")[0], start: "top 90%", end: "top 30%", scrub: 0.5 } },
        );
        tl.fromTo($("[data-queue-phone]"), { yPercent: 14, rotate: 4 }, { yPercent: 0, rotate: -3, duration: ahead + 1.5 }, 0)
          .fromTo($("[data-queue-turn]"), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, ahead + 0.6)
          .to({}, { duration: 0.4 });
        for (let i = 1; i <= ahead; i++) {
          tl.set($("[data-serving]"), { textContent: queue.from + i }, i)
            .set($("[data-ahead]"), { textContent: ahead - i }, i)
            .fromTo($("[data-wait]"), { textContent: (ahead - i + 1) * queue.minutesEach }, { textContent: (ahead - i) * queue.minutesEach, snap: { textContent: 1 }, duration: 0.9 }, i - 0.9)
            .fromTo($("[data-serving-row]"), { backgroundColor: "rgb(255 65 39 / 0.35)" }, { backgroundColor: "rgb(255 65 39 / 0)", duration: 0.5 }, i);
        }
        gsap.set($("[data-serving]"), { textContent: queue.from });
        gsap.set($("[data-ahead]"), { textContent: ahead });
        gsap.set($("[data-wait]"), { textContent: ahead * queue.minutesEach });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id={riscaSections.queue} ref={root} aria-labelledby="rc-queue-title" className="rc-on-dark relative overflow-hidden bg-tinta py-24 text-gesso lg:flex lg:min-h-svh lg:items-center lg:py-20">
      <div className="mx-auto grid w-full max-w-[92rem] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
        <div className="lg:col-start-2 lg:row-start-1">
          <p className="rc-label mb-5 flex items-center gap-4 text-vermelhao">
            <span aria-hidden="true" className="h-[2px] w-10 bg-vermelhao" />
            {q.eyebrow}
          </p>
          <h2 id="rc-queue-title" className="text-[clamp(3rem,11vw,6.8rem)] leading-[0.86]">
            <span className="rc-display block">{q.title}</span>
            <span className="rc-serif block text-[0.8em] text-vermelhao">{q.titleSerif}</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-gesso/75">{q.intro}</p>
        </div>

        {/* The barbershop film and the phone (media: second on phones, on the left on large screens). */}
        <div className="relative lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div data-queue-panel className="relative aspect-[4/5] overflow-hidden bg-grafite sm:aspect-[16/11] lg:aspect-[4/5]">
            <Image src={risca.media.barbershopPoster} alt={q.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <video
              ref={film}
              src={risca.media.barbershop}
              poster={risca.media.barbershopPoster}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(200deg,rgb(18_17_16/0.1)_30%,rgb(18_17_16/0.75))]" />
          </div>

          <div
            data-queue-phone
            className="absolute right-3 bottom-[-2.5rem] w-[min(62vw,16.5rem)] overflow-hidden rounded-[1.8rem] bg-gesso p-4 text-tinta shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] ring-[6px] ring-grafite sm:right-8 lg:right-[-2.5rem] lg:bottom-10"
          >
            <p className="rc-label text-[0.58rem] text-cinza">{q.phone.title} · Risca</p>
            <div className="mt-3 flex items-end justify-between gap-2 border-b-2 border-tinta pb-3">
              <div>
                <p className="text-[0.7rem] text-cinza">{q.phone.ticket}</p>
                <p className="rc-display text-[3.2rem] leading-[0.9]">
                  {queue.letter}
                  {queue.mine}
                </p>
              </div>
              <ClockIcon width={22} height={22} className="mb-2 text-vermelhao-escuro" />
            </div>
            <dl className="mt-2 grid text-[0.82rem]">
              <div data-serving-row className="flex items-baseline justify-between gap-2 py-1.5">
                <dt className="text-cinza">{q.phone.serving}</dt>
                <dd className="rc-display text-[1.5rem] tabular-nums">
                  {queue.letter}
                  <span data-serving>{queue.mine}</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2 border-t border-tinta/10 py-1.5">
                <dt className="text-cinza">{q.phone.ahead}</dt>
                <dd className="rc-display text-[1.5rem] tabular-nums">
                  <span data-ahead>0</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-2 border-t border-tinta/10 py-1.5">
                <dt className="text-cinza">{q.phone.wait}</dt>
                <dd className="rc-display text-[1.5rem] tabular-nums">
                  <span data-wait>0</span> <span className="text-[0.9rem]">{q.phone.minutes}</span>
                </dd>
              </div>
            </dl>
            <div className="relative mt-2 h-14 overflow-hidden">
              <div data-queue-turn className="absolute inset-0 flex items-center gap-3 bg-vermelhao px-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tinta text-gesso">
                  <CheckIcon width={16} height={16} strokeWidth={2.4} />
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.9rem] font-bold">{q.phone.turn}</span>
                  <span className="block text-[0.72rem]">{q.phone.turnText}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 lg:col-start-2 lg:row-start-2 lg:pt-0">
          <ol className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
            {q.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[auto_1fr] gap-x-4 border-t border-gesso/20 pt-4">
                <span className="rc-display text-[2.2rem] leading-none text-vermelhao">0{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-[0.93rem] leading-relaxed text-gesso/70">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-md text-[0.93rem] leading-relaxed text-gesso/80">{q.counter}</p>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3 text-[0.9rem]">
            <span className="rc-label text-vermelhao">{q.hoursLabel}</span>
            <span>{risca.walkIn}</span>
          </p>
          <p className="mt-4 text-[0.78rem] text-gesso/50">{q.example}</p>
        </div>
      </div>
    </section>
  );
}
