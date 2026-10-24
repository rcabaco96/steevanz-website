import type { RiscaCopy } from "@/content/risca/copy";
import { risca } from "@/content/risca/facts";
import { PenIcon } from "./icons";

// An invitation to leave a Google review. Never stars, ratings, counts or quotes (owner's absolute rule): only the call.
export function Review({ copy }: { copy: RiscaCopy }) {
  const { review } = copy;
  return (
    <section aria-labelledby="rc-review-title" className="bg-gesso px-5 pb-8 sm:px-8">
      <div className="mx-auto grid max-w-[92rem] gap-6 border-y-2 border-tinta py-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
        <div>
          <h2 id="rc-review-title" className="text-[clamp(2.6rem,9vw,5.6rem)] leading-[0.9]">
            <span className="rc-serif">{review.title}</span>
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-cinza">{review.text}</p>
        </div>
        <a
          href={risca.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rc-slant inline-flex h-14 w-fit items-center gap-3 bg-tinta pr-10 pl-6 text-[0.82rem] font-bold tracking-[0.14em] text-gesso uppercase transition-colors hover:bg-vermelhao hover:text-tinta"
        >
          <PenIcon width={18} height={18} />
          {review.button}
          <span className="sr-only"> {copy.newTab}</span>
        </a>
      </div>
    </section>
  );
}
