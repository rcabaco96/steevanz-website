import type { PrumoCopy } from "@/content/prumo/copy";
import { prumo } from "@/content/prumo/facts";
import { HeroAxis } from "./HeroAxis";
import { ArrowIcon } from "./icons";
import { Bob, Wordmark } from "./Logo";
import { Magnet } from "./react-bits/Magnet";
import { prumoSections } from "./sections";

// The film of a physiotherapy assessment, full screen; as the page scrolls it narrows into a column that comes into
// plumb (HeroAxis). The «Descer» cue only shows on tall screens: on a phone with the browser bars it would run into
// the buttons.
export function Hero({ copy }: { copy: PrumoCopy }) {
  const { hero } = copy;
  const m = prumo.media;
  return (
    <HeroAxis
      poster={m.heroPoster}
      posterPortrait={m.heroPortraitPoster}
      video={m.hero}
      videoPortrait={m.heroPortrait}
      alt={hero.alt}
      axisLine={hero.axisLine}
      marks={hero.axisMarks}
    >
      <div
        data-hero-copy
        className="relative mx-auto flex w-full max-w-[64rem] flex-1 flex-col items-center justify-center px-5 pt-24 pb-16 text-center [text-shadow:0_2px_22px_rgb(15_22_28/0.45)] sm:px-8 [@media(max-height:760px)]:pt-20 [@media(max-height:760px)]:pb-8"
      >
        <div aria-hidden="true" className="pr-rise w-[min(46vw,15rem)] [animation-delay:150ms] [@media(max-height:700px)]:w-[min(38vw,11rem)]">
          <Wordmark short className="w-full" ink="var(--color-cal)" />
        </div>
        <p className="pr-label pr-rise mt-6 text-cal/85 [animation-delay:300ms] [@media(max-height:700px)]:mt-4">{hero.kicker}</p>
        <h1
          id="pr-hero-title"
          className="pr-rise mt-5 max-w-[17ch] font-display text-[clamp(2.15rem,8.4vw,4.7rem)] leading-[1.02] font-normal tracking-[-0.01em] [animation-delay:500ms] [@media(max-height:700px)]:mt-3"
        >
          <span className="sr-only">{prumo.name}: </span>
          {hero.title} <span className="text-latao-claro italic">{hero.titleItalic}</span>
        </h1>
        <p className="pr-rise mt-5 max-w-md text-[1rem] leading-relaxed text-cal/88 sm:text-[1.08rem] [animation-delay:700ms] [@media(max-height:700px)]:mt-3">
          {hero.lead}
        </p>

        <div className="pr-rise mt-8 flex w-full flex-col items-stretch gap-3 min-[420px]:w-auto min-[420px]:flex-row min-[420px]:items-center [animation-delay:880ms] [@media(max-height:700px)]:mt-5">
          <Magnet className="w-full min-[420px]:w-auto">
            <a
              href={`#${prumoSections.book}`}
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-cal px-7 text-[0.98rem] font-semibold text-ardosia shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] transition-colors hover:bg-white min-[420px]:w-auto"
            >
              {hero.book}
              <ArrowIcon width={18} height={18} />
            </a>
          </Magnet>
          <a
            href={`#${prumoSections.disciplines}`}
            className="inline-flex h-14 items-center justify-center rounded-full px-7 text-[0.98rem] font-semibold ring-1 ring-cal/55 backdrop-blur-sm transition-colors hover:bg-cal/10"
          >
            {hero.prices}
          </a>
        </div>
        <p className="pr-rise mt-6 inline-flex items-center gap-2 rounded-full bg-ardosia/45 px-3 py-1.5 text-[0.72rem] tracking-[0.06em] text-cal/85 [animation-delay:1050ms]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-latao-claro" />
          {copy.demo}
        </p>
      </div>

      <div data-hero-cue className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center [@media(max-height:860px)]:hidden">
        <a href={`#${prumoSections.disciplines}`} className="pr-rise pointer-events-auto flex flex-col items-center gap-1 text-[0.68rem] font-semibold tracking-[0.26em] text-cal/80 uppercase [animation-delay:1300ms]">
          {hero.scroll}
          <span aria-hidden="true" className="pr-sway flex flex-col items-center">
            <span className="block h-9 w-px bg-cal/45" />
            <Bob className="-mt-px h-6 w-auto" color="var(--color-latao-claro)" />
          </span>
        </a>
      </div>
    </HeroAxis>
  );
}
