"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { RoazCopy } from "@/content/roaz/copy";
import { roaz } from "@/content/roaz/facts";
import { UserPlusIcon } from "./icons";
import { Wordmark } from "./Logo";
import { roazSections } from "./sections";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The skipper's contact as a vCard (fictional person; the number belongs to no one). */
function vcard(name: string, role: string): string {
  const [first, ...rest] = name.split(" ");
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${rest.join(" ")};${first};;;`,
    `FN:${name}`,
    `ORG:${roaz.fullName}`,
    `TITLE:${role}`,
    `TEL;TYPE=CELL:${roaz.phoneHref.replace("tel:", "")}`,
    `EMAIL:${roaz.email}`,
    `ADR;TYPE=WORK:;;${roaz.street};${roaz.locality};;${roaz.postalCode};Portugal`,
    "END:VCARD",
    "",
  ].join("\r\n");
}

// The skipper's «Cartão de visita digital»: the card turns over as the page scrolls (rotateY, scrubbed) — the
// logo on the front, the skipper's details and code on the back — and «Guardar contacto» saves the contact to the
// phone, as the real product's page does. The skipper is fictional and the page says so.
export function Skipper({ copy }: { copy: RoazCopy }) {
  const { skipper } = copy;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap.fromTo(
          q("[data-card]"),
          { rotateY: 0, rotateX: 8, y: 30 },
          { rotateY: 180, rotateX: 0, y: 0, ease: "power1.inOut", scrollTrigger: { trigger: q("[data-stage]")[0], start: "top 80%", end: "center 40%", scrub: 0.8 } },
        );
      });
      // Reduced motion: the back (the details) shows straight away.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(gsap.utils.selector(root)("[data-card]"), { rotateY: 180 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const save = () => {
    const blob = new Blob([vcard(skipper.name, skipper.role)], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "duarte-sequeira-roaz.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section ref={root} id={roazSections.skipper} aria-labelledby="rz-skipper-title" className="relative overflow-hidden bg-areia py-24 sm:py-32">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <p className="rz-label mb-5 text-ocre">{skipper.eyebrow}</p>
          <h2 id="rz-skipper-title" className="rz-title text-[clamp(2.6rem,9vw,5.8rem)] text-fundo">
            {skipper.title} <span className="block text-falesia-deep">{skipper.titleLine}</span>
          </h2>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-[1.75] text-pedra">{skipper.intro}</p>
        </div>

        <div data-stage className="flex flex-col items-center gap-6 [perspective:1400px] lg:row-span-2">
          <div data-card className="rz-card-3d relative aspect-[1.586] w-full max-w-[24rem] will-change-transform">
            {/* Front: the logo. */}
            <div className="rz-face absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.25rem] bg-fundo p-6 text-sal shadow-[0_30px_60px_-30px_rgb(6_48_58/0.8)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-radial-gradient(circle_at_100%_120%,transparent_0_22px,var(--color-agua)_22px_23px)]" />
              <Wordmark className="relative w-32" />
              <div className="relative flex items-end justify-between">
                <span className="rz-label text-[0.7rem] text-agua-claro">{skipper.front}</span>
                <span className="rz-label text-[0.62rem] text-sal/60">{skipper.tap}</span>
              </div>
            </div>
            {/* Back: the skipper. */}
            <div className="rz-face rz-face-back absolute inset-0 flex justify-between gap-4 overflow-hidden rounded-[1.25rem] bg-sal p-6 text-tinta shadow-[0_30px_60px_-30px_rgb(6_48_58/0.6)]">
              <div className="flex min-w-0 flex-col justify-between">
                <div>
                  <p className="font-display text-[1.9rem] leading-none font-extrabold uppercase">{skipper.name}</p>
                  <p className="rz-label mt-1.5 text-[0.66rem] text-ocre">{skipper.role}</p>
                </div>
                <div className="text-[0.85rem] leading-relaxed">
                  <p className="font-semibold">{roaz.phoneDisplay}</p>
                  <p className="text-pedra">{roaz.email}</p>
                  <p className="text-pedra">{roaz.locality}</p>
                </div>
              </div>
              <div aria-hidden="true" className="grid size-20 shrink-0 grid-cols-[repeat(9,1fr)] gap-[1.5px] self-end rounded-md bg-white p-1.5">
                {Array.from({ length: 81 }, (_, i) => (
                  <span key={i} className={`${((i * 37) ^ (Math.floor(i / 9) * 23)) % 7 < 3 || [0, 1, 9, 10, 7, 8, 16, 17, 63, 64, 72, 73].includes(i) ? "bg-fundo" : ""}`} />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-pedra">{skipper.note}</p>
        </div>

        <div>
          <button
            type="button"
            onClick={save}
            className="inline-flex h-14 items-center gap-3 rounded-full bg-fundo px-7 font-display text-[1.2rem] font-bold tracking-[0.08em] text-sal uppercase transition-colors hover:bg-fundo-3"
          >
            <UserPlusIcon width={20} height={20} />
            {skipper.save}
          </button>
          <p className="mt-3 text-sm text-pedra">{skipper.saveNote}</p>
          <p className="rz-label mt-6 inline-flex rounded-full bg-sal px-4 py-2 text-[0.7rem] text-ocre">{skipper.product}</p>
        </div>
      </div>
    </section>
  );
}
