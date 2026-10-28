import type { PrumoCopy } from "@/content/prumo/copy";
import { PlusIcon } from "./icons";
import { prumoSections } from "./sections";

// Questions before coming, as native <details> (readable and usable without JavaScript); the answers open by
// animating their height (CSS ::details-content, where the browser supports it). Then the health note: the site does
// not replace medical advice.
export function Faq({ copy }: { copy: PrumoCopy }) {
  const { faq, health } = copy;
  return (
    <section id={prumoSections.faq} aria-labelledby="pr-faq-title" className="bg-cal py-24 sm:py-32">
      <div className="mx-auto grid max-w-[80rem] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="pr-label mb-6 flex items-center gap-4 text-latao-fundo">
            <span aria-hidden="true" className="h-px w-10 bg-latao" />
            {faq.eyebrow}
          </p>
          <h2 id="pr-faq-title" className="font-display text-[clamp(2.6rem,9vw,5rem)] leading-[0.96]">
            {faq.title} <span className="text-latao-fundo italic">{faq.titleItalic}</span>
          </h2>
          <div className="mt-10 rounded-2xl bg-anca p-5">
            <h3 className="pr-label text-tinta">{health.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-pedra">{health.text}</p>
          </div>
        </div>
        <div className="border-t border-tinta/12">
          {faq.items.map((item) => (
            <details key={item.q} className="pr-faq group border-b border-tinta/12">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 font-display text-[1.35rem] leading-snug sm:text-[1.6rem]">
                {item.q}
                <span aria-hidden="true" className="pr-faq-icon grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-tinta/15 transition-[rotate,background-color] duration-500 group-hover:bg-anca">
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
