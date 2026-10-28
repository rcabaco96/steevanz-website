import type { PonteiroCopy } from "@/content/ponteiro/copy";
import { ponteiro } from "@/content/ponteiro/facts";
import { PenIcon } from "./icons";
import { Reveal } from "./Reveal";

// An invitation to leave a Google review. Never stars, ratings, counts or quotes (owner's absolute rule): only the call.
export function Review({ copy }: { copy: PonteiroCopy }) {
  const { review } = copy;
  return (
    <section aria-labelledby="pn-review-title" className="bg-papel px-5 pt-20 sm:px-8 sm:pt-28">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[1.8rem] border-2 border-dashed border-tinta/20 px-4 py-12 text-center sm:px-12">
        <h2 id="pn-review-title" className="font-display text-[clamp(2.2rem,6vw,3.4rem)] leading-tight">
          {review.title}
        </h2>
        <p className="max-w-md leading-relaxed text-tinta/75">{review.text}</p>
        <a
          href={ponteiro.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-tinta px-5 font-semibold whitespace-nowrap text-papel transition-colors hover:bg-ginja sm:px-6"
        >
          <PenIcon width={18} height={18} />
          {review.button}
          <span className="sr-only"> {copy.newTab}</span>
        </a>
      </Reveal>
    </section>
  );
}
