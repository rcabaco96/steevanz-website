import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { PlusIcon } from "./icons";
import { ponteiroSections } from "./sections";

// Questions before coming, as native <details> (readable and usable without JavaScript); the answers open by
// animating their height (CSS ::details-content, where the browser supports it).
export function Faq({ copy }: { copy: PonteiroCopy }) {
  const { faq } = copy;
  return (
    <section id={ponteiroSections.faq} aria-labelledby="pn-faq-title" className="bg-papel py-24 sm:py-32">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="pn-label mb-5 flex items-center gap-4 text-ginja">
            <span aria-hidden="true" className="h-px w-10 bg-ginja/50" />
            {faq.eyebrow}
          </p>
          <h2 id="pn-faq-title" className="font-display text-[clamp(2.8rem,10vw,5.6rem)] leading-[0.92]">
            {faq.title} <span className="text-ginja italic">{faq.titleItalic}</span>
          </h2>
        </div>
        <div className="border-t border-tinta/12">
          {faq.items.map((item) => (
            <details key={item.q} className="pn-faq group border-b border-tinta/12">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-5 font-display text-[1.45rem] leading-snug sm:text-[1.75rem]">
                {item.q}
                <span
                  aria-hidden="true"
                  className="pn-faq-icon grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-tinta/15 transition-[rotate,background-color] duration-500 group-hover:bg-gema"
                >
                  <PlusIcon width={18} height={18} />
                </span>
              </summary>
              <p className="max-w-xl pb-6 leading-relaxed text-tinta/75">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
