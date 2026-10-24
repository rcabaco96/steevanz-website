import type { RoazCopy } from "@/content/roaz/copy";
import { PlusIcon } from "./icons";
import { roazSections } from "./sections";

// Questions before booking, as native <details> (readable and usable without JavaScript); the answers open by
// animating their height (CSS ::details-content, where the browser supports it).
export function Faq({ copy }: { copy: RoazCopy }) {
  const { faq } = copy;
  return (
    <section id={roazSections.faq} aria-labelledby="rz-faq-title" className="bg-sal py-24 sm:py-32">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="rz-label mb-5 text-ocre">{faq.eyebrow}</p>
          <h2 id="rz-faq-title" className="rz-title text-[clamp(2.8rem,10vw,6rem)] text-fundo">
            {faq.title} <span className="block text-falesia-deep">{faq.titleLine}</span>
          </h2>
        </div>
        <div className="border-t border-tinta/12">
          {faq.items.map((item) => (
            <details key={item.q} className="rz-faq group border-b border-tinta/12">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 font-display text-[1.45rem] leading-tight font-bold uppercase sm:text-[1.75rem]">
                {item.q}
                <span aria-hidden="true" className="rz-faq-icon grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-tinta/15 transition-[rotate,background-color] duration-500 group-hover:bg-areia">
                  <PlusIcon width={18} height={18} />
                </span>
              </summary>
              <p className="max-w-xl pb-6 leading-relaxed text-pedra">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
