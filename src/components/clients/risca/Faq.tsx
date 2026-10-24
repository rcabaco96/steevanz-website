import type { RiscaCopy } from "@/content/risca/copy";
import { PlusIcon } from "./icons";
import { riscaSections } from "./sections";

// Questions before booking: native <details> (works without JavaScript), the answer opening by its height.
export function Faq({ copy }: { copy: RiscaCopy }) {
  const { faq } = copy;
  return (
    <section id={riscaSections.faq} aria-labelledby="rc-faq-title" className="bg-gesso py-24 sm:py-32">
      <div className="mx-auto grid max-w-[92rem] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <div>
          <p className="rc-label mb-5 flex items-center gap-4 text-vermelhao-escuro">
            <span aria-hidden="true" className="h-[2px] w-10 bg-vermelhao" />
            {faq.eyebrow}
          </p>
          <h2 id="rc-faq-title" className="text-[clamp(3rem,11vw,7rem)] leading-[0.86]">
            <span className="rc-display block">{faq.title}</span>
            <span className="rc-serif block text-[0.86em]">{faq.titleSerif}</span>
          </h2>
        </div>
        <div className="border-t-2 border-tinta">
          {faq.list.map((item) => (
            <details key={item.q} className="rc-faq group border-b border-tinta/15">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-[1.08rem] font-semibold sm:text-[1.2rem]">
                {item.q}
                <span className="rc-faq-icon grid size-10 shrink-0 place-items-center bg-papel transition-[rotate,background-color] duration-500 group-hover:bg-vermelhao">
                  <PlusIcon width={18} height={18} />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-cinza">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
