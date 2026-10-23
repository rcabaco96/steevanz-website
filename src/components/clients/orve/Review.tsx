import type { OrveCopy } from "@/content/orve/copy";
import { orve } from "@/content/orve/facts";
import { PenIcon } from "./icons";
import { Reveal } from "./Reveal";

// An invitation to leave a Google review. Never stars, ratings, counts or quotes (owner's absolute rule): only the call.
export function Review({ copy }: { copy: OrveCopy }) {
  const { review } = copy;
  return (
    <section aria-labelledby="or-review-title" className="bg-nacar px-5 pt-20 sm:px-8 sm:pt-28">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[2rem] bg-linho px-6 py-12 text-center sm:px-12">
        <h2 id="or-review-title" className="font-display text-[clamp(2rem,6vw,3.2rem)] leading-tight italic">
          {review.title}
        </h2>
        <p className="max-w-md leading-relaxed text-pedra">{review.text}</p>
        <a
          href={orve.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-tinta px-6 text-[0.8rem] font-medium tracking-[0.14em] text-nacar uppercase transition-colors hover:bg-cobre"
        >
          <PenIcon width={17} height={17} />
          {review.button}
          <span className="sr-only"> {copy.newTab}</span>
        </a>
      </Reveal>
    </section>
  );
}
