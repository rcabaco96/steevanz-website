import type { RoazCopy } from "@/content/roaz/copy";
import { roaz } from "@/content/roaz/facts";
import { PenIcon } from "./icons";
import { Reveal } from "./Reveal";

// An invitation to leave a Google review. Never stars, ratings, counts or quotes (owner's absolute rule): only the call.
export function Review({ copy }: { copy: RoazCopy }) {
  const { review } = copy;
  return (
    <section aria-labelledby="rz-review-title" className="bg-sal px-5 pt-20 sm:px-8 sm:pt-28">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[2rem] bg-areia px-6 py-12 text-center sm:px-12">
        <h2 id="rz-review-title" className="rz-title text-[clamp(2.3rem,7vw,3.8rem)] text-fundo">
          {review.title}
        </h2>
        <p className="max-w-md leading-relaxed text-pedra">{review.text}</p>
        <a
          href={roaz.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-fundo px-5 font-display text-[1.05rem] whitespace-nowrap sm:px-6 sm:text-[1.1rem] font-bold tracking-[0.08em] text-sal uppercase transition-colors hover:bg-fundo-3"
        >
          <PenIcon width={17} height={17} />
          {review.button}
          <span className="sr-only"> {copy.newTab}</span>
        </a>
      </Reveal>
    </section>
  );
}
