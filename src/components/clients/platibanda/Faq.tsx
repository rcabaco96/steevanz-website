import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { PlusIcon } from "./icons";
import { platibandaSections } from "./sections";

// Questions, as native <details> (they work without JavaScript); the answers open by animating to «auto».
export function Faq({ copy }: { copy: PlatibandaCopy }) {
  const { faq } = copy;
  return (
    <section id={platibandaSections.faq} aria-labelledby="pb-faq-title" className="bg-cal py-24 sm:py-32">
      <div className="mx-auto grid max-w-[84rem] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <p className="pb-label mb-4 flex items-center gap-3 text-ocre-deep">
            <span aria-hidden="true" className="h-[3px] w-8 bg-ocre" />
            {faq.eyebrow}
          </p>
          <h2 id="pb-faq-title" className="font-display text-[clamp(2.2rem,7vw,4rem)] leading-[0.98] text-ria">
            {faq.title} <span className="text-telha">{faq.titleItalic}</span>
          </h2>
        </div>
        <div className="border-t border-ria/15">
          {faq.list.map((item) => (
            <details key={item.q} className="pb-faq group border-b border-ria/15">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-4 font-display text-[1.2rem] leading-snug text-ria sm:text-[1.35rem]">
                {item.q}
                <span className="pb-faq-icon grid size-10 shrink-0 place-items-center rounded-full bg-areia text-ria transition-[rotate] duration-500">
                  <PlusIcon width={18} height={18} />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-tinta/80">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
