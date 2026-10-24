import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda } from "@/content/platibanda/facts";
import { PenIcon } from "./icons";
import { Reveal } from "./Reveal";

// An invitation to leave a Google review. Never stars, ratings, counts or quotes (owner's absolute rule): only the call.
export function Review({ copy }: { copy: PlatibandaCopy }) {
  const { review } = copy;
  return (
    <section aria-labelledby="pb-review-title" className="bg-cal px-5 pt-20 sm:px-8 sm:pt-28">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[1.6rem] bg-sal px-6 py-12 text-center sm:px-12">
        <h2 id="pb-review-title" className="font-display text-[clamp(2rem,6vw,3.2rem)] leading-tight text-ria">
          {review.title}
        </h2>
        <p className="max-w-md leading-relaxed text-tinta/80">{review.text}</p>
        <a
          href={platibanda.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-ria px-6 text-[0.95rem] font-semibold text-cal transition-colors hover:bg-telha"
        >
          <PenIcon width={17} height={17} />
          {review.button}
          <span className="sr-only"> {copy.newTab}</span>
        </a>
      </Reveal>
    </section>
  );
}
