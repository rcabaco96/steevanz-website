import type { FerragialCopy } from "@/content/ferragial/copy";
import { ferragial } from "@/content/ferragial/facts";
import { PenIcon } from "./icons";
import { Reveal } from "./Reveal";

// An invitation to leave a Google review. Never stars, ratings, counts or quotes (owner's absolute rule): only the call.
export function Review({ copy }: { copy: FerragialCopy }) {
  const { review } = copy;
  return (
    <section aria-labelledby="fg-review-title" className="bg-cal px-5 pt-24 sm:px-8 sm:pt-32">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 border-y border-tinta/15 py-14 text-center">
        <h2 id="fg-review-title" className="font-display text-[clamp(2rem,6vw,3.4rem)] leading-tight">
          {review.title}
        </h2>
        <p className="max-w-md leading-relaxed text-pedra">{review.text}</p>
        <a
          href={ferragial.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-tinto px-6 text-[0.78rem] font-semibold tracking-[0.12em] text-cal uppercase transition-colors hover:bg-mosto"
        >
          <PenIcon width={17} height={17} />
          {review.button}
          <span className="sr-only"> {copy.newTab}</span>
        </a>
      </Reveal>
    </section>
  );
}
