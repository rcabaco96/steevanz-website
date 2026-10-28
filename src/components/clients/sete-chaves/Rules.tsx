import type { SeteChavesCopy } from "@/content/sete-chaves/copy";
import { CheckIcon } from "./icons";
import { Reveal } from "./Reveal";
import { seteChavesSections } from "./sections";

// House rules, check-in and check-out: six small plates screwed to the schist (two brass screws each), the hour or
// the rule in Gloock, the reason underneath; then the rest as a short list.
export function Rules({ copy }: { copy: SeteChavesCopy }) {
  const { rules } = copy;
  return (
    <section
      id={seteChavesSections.rules}
      aria-labelledby="sc-rules-title"
      className="sc-on-dark relative bg-xisto py-24 text-cal sm:py-32"
    >
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <p className="sc-label mb-5 flex items-center gap-3 text-latao-claro">
          <span aria-hidden="true" className="h-px w-8 bg-latao-claro/60" />
          {rules.eyebrow}
        </p>
        <h2
          id="sc-rules-title"
          className="max-w-[18ch] font-display text-[clamp(2.4rem,7vw,4.2rem)] leading-[0.98] tracking-[-0.02em]"
        >
          {rules.title}
        </h2>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {rules.items.map((item, i) => (
            <li key={item.label}>
              <Reveal delay={(i % 3) * 90} className="h-full">
                <div className="relative h-full rounded-[1.2rem] bg-xisto-2 px-6 pt-7 pb-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]">
                  <span
                    aria-hidden="true"
                    className="sc-brass absolute top-3 left-3 block size-2 rounded-full"
                  />
                  <span
                    aria-hidden="true"
                    className="sc-brass absolute top-3 right-3 block size-2 rounded-full"
                  />
                  <p className="sc-label text-cal/60">{item.label}</p>
                  <p className="mt-2 font-display text-[clamp(2rem,6vw,2.6rem)] leading-none text-latao-claro">
                    {item.value}
                  </p>
                  <p className="mt-3 leading-relaxed text-cal/75">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <ul className="mt-10 grid gap-2.5 text-cal/80 sm:grid-cols-3 sm:gap-6">
          {rules.more.map((line) => (
            <li key={line} className="flex items-start gap-3">
              <CheckIcon
                width={18}
                height={18}
                className="mt-0.5 shrink-0 text-latao-claro"
              />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
