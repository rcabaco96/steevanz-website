import type { MeadaCopy } from "@/content/meada/copy";
import { PlusIcon } from "./icons";
import { meadaSections } from "./sections";

// Questions before ordering, as native <details> (readable and usable without JavaScript); the answers open by
// animating their height (CSS ::details-content, where the browser supports it).
export function Faq({ copy }: { copy: MeadaCopy }) {
  const { faq } = copy;
  return (
    <section id={meadaSections.faq} aria-labelledby="md-faq-title" className="bg-algodao py-24 sm:py-32">
      <div className="mx-auto grid max-w-[80rem] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="md-label mb-6 flex items-center gap-3 text-fio">
            <span aria-hidden="true" className="md-stitch w-10" />
            {faq.eyebrow}
          </p>
          <h2 id="md-faq-title" className="font-display text-[clamp(2.6rem,9vw,5rem)] leading-[0.96]">
            {faq.title} <span className="block text-fio">{faq.titleItalic}</span>
          </h2>
        </div>
        <div className="border-t border-dashed border-tinta/25">
          {faq.items.map((item) => (
            <details key={item.q} className="md-faq group border-b border-dashed border-tinta/25">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 font-display text-[1.25rem] leading-snug sm:text-[1.5rem]">
                {item.q}
                <span aria-hidden="true" className="md-faq-icon grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-tinta/15 transition-[rotate,background-color] duration-500 group-hover:bg-cru">
                  <PlusIcon width={18} height={18} />
                </span>
              </summary>
              <p className="max-w-xl pb-6 leading-relaxed text-cinza">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
