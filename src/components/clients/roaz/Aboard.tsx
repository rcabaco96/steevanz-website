import type { ReactNode } from "react";
import type { RoazCopy } from "@/content/roaz/copy";
import { BagIcon, CalendarIcon, LifebuoyIcon, WaveIcon } from "./icons";
import { Reveal } from "./Reveal";
import { roazSections } from "./sections";

const icons: Record<string, ReactNode> = {
  mar: <WaveIcon width={26} height={26} />,
  cancelar: <CalendarIcon width={26} height={26} />,
  seguranca: <LifebuoyIcon width={26} height={26} />,
  levar: <BagIcon width={26} height={26} />,
};

// Before boarding: sea conditions and what happens when the trip can't go out, cancelling, safety on board, what to
// bring — an example policy, said to be one — and the licences and insurance as PLACEHOLDERS only («(n.º RNAAT)»):
// the business is fictional and no number may be invented.
export function Aboard({ copy }: { copy: RoazCopy }) {
  const { aboard } = copy;
  return (
    <section id={roazSections.aboard} aria-labelledby="rz-aboard-title" className="relative bg-sal py-24 sm:py-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="rz-label mb-5 text-ocre">{aboard.eyebrow}</p>
            <h2 id="rz-aboard-title" className="rz-title text-[clamp(2.8rem,10vw,6.4rem)] text-fundo">
              {aboard.title} <span className="block text-falesia-deep">{aboard.titleLine}</span>
            </h2>
          </div>
          <p className="max-w-lg text-[1.05rem] leading-[1.75] text-pedra">{aboard.intro}</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aboard.blocks.map((block, i) => (
            <li key={block.id}>
              <Reveal delay={i * 90} className="h-full">
                <div className="flex h-full flex-col rounded-[1.5rem] bg-areia p-6">
                  <span className="grid size-12 place-items-center rounded-full bg-fundo text-falesia">{icons[block.id]}</span>
                  <h3 className="mt-5 font-display text-[1.7rem] leading-none font-extrabold uppercase">{block.title}</h3>
                  <p className="mt-3 text-[0.97rem] leading-relaxed text-tinta/85">{block.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-6">
          <div className="rounded-[1.5rem] border border-dashed border-tinta/25 p-6 sm:p-8">
            <h3 className="rz-label text-ocre">{aboard.licencesTitle}</h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {aboard.licences.map((licence) => (
                <li key={licence} className="flex items-start gap-3 text-[0.97rem] leading-snug">
                  <span aria-hidden="true" className="mt-2 block size-1.5 shrink-0 rounded-full bg-falesia-deep" />
                  {licence}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-pedra">{aboard.licencesNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
