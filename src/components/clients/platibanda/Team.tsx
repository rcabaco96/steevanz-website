"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { PlatibandaAgent, PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda, platibandaWhatsappHref } from "@/content/platibanda/facts";
import { ChatIcon, ContactIcon, PhoneIcon } from "./icons";
import { Emblem, emblemOutline } from "./Logo";
import { platibandaSections } from "./sections";
import { SplitText } from "./react-bits/SplitText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The contact file the «Guardar contacto» button hands over (what the agent's digital business card does). */
export function agentVcard(a: PlatibandaAgent): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${a.familyName};${a.givenName};;;`,
    `FN:${a.name}`,
    `ORG:${platibanda.name}`,
    `TITLE:${a.role}`,
    `TEL;TYPE=CELL:${a.phone.replace(/\s/g, "")}`,
    `EMAIL:${a.email}`,
    `ADR;TYPE=WORK:;;${platibanda.street};${platibanda.locality};;${platibanda.postalCode};Portugal`,
    "NOTE:Contacto fictício de um site de demonstração.",
    "END:VCARD",
  ].join("\r\n");
}

/** A fixed pattern of squares standing for the QR printed on the back of the card (decorative, not a code). */
const qrCells = Array.from({ length: 81 }, (_, i) => ((i * 37 + (i % 7) * 11) % 5 < 2 ? 1 : 0));

function Card({ agent, back }: { agent: PlatibandaAgent; back: string }) {
  return (
    <div data-card className="relative aspect-[1.586] w-full [transform-style:preserve-3d] will-change-transform">
      {/* Front: the printed card. */}
      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl bg-ria p-5 text-cal shadow-[0_30px_50px_-28px_rgb(19_48_46/0.8)] [backface-visibility:hidden]">
        <span aria-hidden="true" className="absolute inset-y-0 right-0 w-3 bg-ocre" />
        <div className="flex items-center gap-2">
          <Emblem className="w-7" line="var(--color-cal)" />
          <span className="font-display text-lg">Platibanda</span>
        </div>
        <div>
          <p className="font-display text-[1.45rem] leading-tight">{agent.name}</p>
          <p className="text-[0.8rem] text-cal/75">{agent.role}</p>
          <p className="mt-2 text-[0.78rem] text-cal/85 tabular-nums">{agent.phone}</p>
        </div>
      </div>
      {/* Back: tap or QR. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-ocre p-5 text-ria [backface-visibility:hidden] [transform:rotateY(180deg)]"
      >
        <svg viewBox="0 0 64 64" className="h-[78%] shrink-0 opacity-90">
          <path d={emblemOutline} fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="26.5" y="41" width="11" height="19" fill="currentColor" />
        </svg>
        <div className="flex flex-col items-end gap-2">
          <div className="grid size-16 grid-cols-9 gap-px rounded-md bg-cal p-1.5">
            {qrCells.map((c, i) => (
              <span key={i} className={c ? "bg-ria" : "bg-transparent"} />
            ))}
          </div>
          <span className="pb-label text-[0.6rem]">{back}</span>
        </div>
      </div>
    </div>
  );
}

// The team, each with their «Cartão de visita digital». As the cards come up the page they turn over (GSAP scrub
// on rotateY): first the back — the house front, «Toque ou QR» — then the front with the name. Under each card,
// the same thing as a tap: «Guardar contacto» hands over the contact file. Reduced motion: the fronts, still.
export function Team({ copy }: { copy: PlatibandaCopy }) {
  const { team } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        (gsap.utils.selector(el)("[data-card]") as HTMLElement[]).forEach((card, i) => {
          gsap.fromTo(
            card,
            { rotateY: 180, rotateX: 8, y: 50 },
            {
              rotateY: 0,
              rotateX: 0,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: card, start: `top ${92 - i * 4}%`, end: `top ${52 - i * 4}%`, scrub: 0.6 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id={platibandaSections.team} ref={root} aria-labelledby="pb-team-title" className="relative bg-areia py-24 sm:py-32">
      <div aria-hidden="true" className="pb-grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[84rem] px-5 sm:px-8">
        <p className="pb-label mb-4 flex items-center gap-3 text-ocre-deep">
          <span aria-hidden="true" className="h-[3px] w-8 bg-ocre" />
          {team.eyebrow}
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="pb-team-title" className="font-display text-[clamp(2.2rem,7.5vw,4.6rem)] leading-[0.98] text-ria">
            <SplitText text={team.title} splitType="words" delay={60} /> <span className="text-telha">{team.titleItalic}</span>
          </h2>
          <p className="max-w-md leading-relaxed text-pedra">{team.intro}</p>
        </div>

        <ul className="mt-14 grid gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {team.list.map((a) => (
            <li key={a.name} className="[perspective:1200px]">
              <Card agent={a} back={team.cardBack} />
              <h3 className="mt-6 font-display text-2xl text-ria">{a.name}</h3>
              <p className="text-sm font-semibold text-ocre-deep">{a.role}</p>
              <p className="mt-2 leading-relaxed text-tinta/80">{a.text}</p>
              <p className="mt-1 text-sm text-pedra">
                {team.languages} {a.languages.toLowerCase()}.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`data:text/vcard;charset=utf-8,${encodeURIComponent(agentVcard(a))}`}
                  download={`${a.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-")}.vcf`}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-ria px-4 text-sm font-semibold text-cal transition-colors hover:bg-ria-2"
                >
                  <ContactIcon width={17} height={17} />
                  {team.save}
                </a>
                <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ria ring-1 ring-ria/25 hover:ring-ria/50">
                  <PhoneIcon width={16} height={16} />
                  {team.call}
                </a>
                <a
                  href={platibandaWhatsappHref(`Olá ${a.givenName}!`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ria ring-1 ring-ria/25 hover:ring-ria/50"
                >
                  <ChatIcon width={16} height={16} />
                  {team.whatsapp}
                  <span className="sr-only"> {copy.newTab}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-sm text-pedra">{team.note}</p>
      </div>
    </section>
  );
}
