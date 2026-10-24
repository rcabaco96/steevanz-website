import type { SeteChavesCopy } from "@/content/sete-chaves/copy";
import { seteChaves } from "@/content/sete-chaves/facts";
import { PenIcon } from "./icons";
import { FobMark } from "./Logo";
import { Reveal } from "./Reveal";

// An invitation to leave a Google review. Never stars, ratings, counts or quotes (owner's absolute rule): only the call.
export function Review({ copy }: { copy: SeteChavesCopy }) {
  const { review } = copy;
  return (
    <section
      aria-labelledby="sc-review-title"
      className="bg-cal px-5 pt-20 sm:px-8 sm:pt-28"
    >
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[2rem] bg-linho px-6 py-12 text-center sm:px-12">
        <FobMark
          ring={false}
          gradientId="sc-brass-review"
          className="sc-sway h-14 w-auto"
          style={{ ["--sc-hole" as string]: "var(--color-linho)" }}
        />
        <h2
          id="sc-review-title"
          className="font-display text-[clamp(2rem,6vw,3.2rem)] leading-tight"
        >
          {review.title}
        </h2>
        <p className="max-w-md leading-relaxed text-pedra">{review.text}</p>
        <a
          href={seteChaves.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-xisto px-6 text-[0.78rem] font-semibold tracking-[0.12em] text-cal uppercase transition-colors hover:bg-tinta"
        >
          <PenIcon width={17} height={17} />
          {review.button}
          <span className="sr-only"> {copy.newTab}</span>
        </a>
      </Reveal>
    </section>
  );
}
