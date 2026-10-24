import type { PrumoCopy } from "@/content/prumo/copy";
import { prumo } from "@/content/prumo/facts";
import { PenIcon } from "./icons";
import { Reveal } from "./Reveal";

// An invitation to leave a Google review. Never stars, ratings, counts or quotes (owner's absolute rule): only the call.
export function Review({ copy }: { copy: PrumoCopy }) {
  const { review } = copy;
  return (
    <section aria-labelledby="pr-review-title" className="bg-cal px-5 pt-20 sm:px-8 sm:pt-28">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[2rem] bg-nevoa-2 px-6 py-12 text-center sm:px-12">
        <h2 id="pr-review-title" className="font-display text-[clamp(2rem,6vw,3.2rem)] leading-tight">
          {review.title}
        </h2>
        <p className="max-w-md leading-relaxed text-pedra">{review.text}</p>
        <a
          href={prumo.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-ardosia px-6 font-semibold text-cal transition-colors hover:bg-ardosia-3"
        >
          <PenIcon width={17} height={17} />
          {review.button}
          <span className="sr-only"> {copy.newTab}</span>
        </a>
      </Reveal>
    </section>
  );
}
