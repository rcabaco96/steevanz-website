import type { MeadaCopy } from "@/content/meada/copy";
import { meada } from "@/content/meada/facts";
import { PenIcon } from "./icons";
import { Reveal } from "./Reveal";

// An invitation to leave a Google review. Never stars, ratings, counts or quotes (owner's absolute rule): only the call.
export function Review({ copy }: { copy: MeadaCopy }) {
  const { review } = copy;
  return (
    <section aria-labelledby="md-review-title" className="bg-algodao px-5 pt-20 sm:px-8 sm:pt-28">
      <Reveal className="md-kraft md-tag mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 pt-16 pb-12 text-center text-tinta sm:px-12">
        <span aria-hidden="true" className="-mt-8 mb-2 size-5 rounded-full bg-algodao ring-4 ring-kraft-2/40" />
        <h2 id="md-review-title" className="font-display text-[clamp(1.9rem,5.6vw,3rem)] leading-tight">
          {review.title}
        </h2>
        <p className="max-w-md leading-relaxed text-tinta/80">{review.text}</p>
        <a
          href={meada.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-grafite px-6 font-mono text-[0.78rem] tracking-[0.12em] text-algodao uppercase transition-colors hover:bg-fio"
        >
          <PenIcon width={17} height={17} />
          {review.button}
          <span className="sr-only"> {copy.newTab}</span>
        </a>
      </Reveal>
    </section>
  );
}
