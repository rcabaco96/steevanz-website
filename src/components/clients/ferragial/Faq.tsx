import type { FerragialCopy } from "@/content/ferragial/copy";
import { PlusIcon } from "./icons";
import { ferragialSections } from "./sections";

// Questions before coming, as native <details> (readable and usable without JavaScript); the answers open by
// animating their height (CSS ::details-content, where the browser supports it).
export function Faq({ copy }: { copy: FerragialCopy }) {
  const { faq } = copy;
  return (
    <section id={ferragialSections.faq} aria-labelledby="fg-faq-title" className="bg-cal py-24 sm:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="fg-label mb-5 flex items-center gap-3 text-barro">
            <span aria-hidden="true" className="h-px w-10 bg-barro/60" />
            {faq.eyebrow}
          </p>
          <h2 id="fg-faq-title" className="font-display text-[clamp(2.6rem,9vw,5rem)] leading-[0.95]">
            {faq.title} <span className="text-tinto">{faq.titleAccent}</span>
          </h2>
        </div>
        <div className="border-t border-tinta/15">
          {faq.items.map((item) => (
            <details key={item.q} className="fg-faq group border-b border-tinta/15">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 font-display text-[1.3rem] leading-snug sm:text-[1.55rem]">
                {item.q}
                <span
                  aria-hidden="true"
                  className="fg-faq-icon grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-tinta/15 transition-[rotate,background-color] duration-500 group-hover:bg-cal-2"
                >
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
