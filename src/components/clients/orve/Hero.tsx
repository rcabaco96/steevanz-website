import type { OrveCopy } from "@/content/orve/copy";
import { orve } from "@/content/orve/facts";
import { HeroLens } from "./HeroLens";
import { ArrowIcon } from "./icons";
import { Wordmark } from "./Logo";
import { Magnet } from "./react-bits/Magnet";
import { orveSections } from "./sections";

// The film of a hydration mask, full screen; as the page scrolls it gathers into a dew drop (HeroLens).
// The «Descer» cue only shows on tall screens: on a phone with the browser bars it would run into the buttons.
export function Hero({ copy }: { copy: OrveCopy }) {
  const { hero } = copy;
  const m = orve.media;
  return (
    <HeroLens
      poster={m.heroPoster}
      posterPortrait={m.heroPortraitPoster}
      video={m.hero}
      videoPortrait={m.heroPortrait}
      alt={hero.alt}
      lensLine={hero.lens}
      ring={hero.ring}
    >
      <div
        data-hero-copy
        className="relative mx-auto flex w-full max-w-[64rem] flex-1 flex-col items-center justify-center px-5 pt-24 pb-20 text-center sm:px-8 [@media(max-height:760px)]:pt-20 [@media(max-height:760px)]:pb-8"
      >
        <p className="or-label or-rise text-nacar/85 [animation-delay:150ms]">{hero.kicker}</p>
        <div aria-hidden="true" className="or-rise mt-7 w-[min(58vw,19rem)] [animation-delay:350ms] sm:mt-9 [@media(max-height:700px)]:w-[min(46vw,15rem)]">
          <Wordmark id="or-mark-hero" className="w-full" accent="var(--color-argila)" />
        </div>
        <h1
          id="or-hero-title"
          className="or-rise mt-7 max-w-[16ch] font-display text-[clamp(2.1rem,8.6vw,4.6rem)] leading-[1.02] font-normal italic sm:mt-9 [animation-delay:600ms] [@media(max-height:700px)]:mt-5"
        >
          <span className="sr-only">{orve.name}: </span>
          {hero.title}
        </h1>
        <p className="or-rise mt-5 max-w-md text-[1rem] leading-relaxed text-nacar/85 sm:text-[1.08rem] [animation-delay:780ms]">{hero.lead}</p>

        <div className="or-rise mt-8 flex w-full flex-col items-stretch gap-3 min-[420px]:w-auto min-[420px]:flex-row min-[420px]:items-center [animation-delay:950ms] [@media(max-height:700px)]:mt-6">
          <Magnet className="w-full min-[420px]:w-auto">
            <a
              href={`#${orveSections.book}`}
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-cobre px-7 text-[0.85rem] font-medium tracking-[0.14em] text-nacar uppercase shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] transition-colors hover:bg-cobre-deep min-[420px]:w-auto"
            >
              {hero.book}
              <ArrowIcon width={18} height={18} />
            </a>
          </Magnet>
          <a
            href={`#${orveSections.rituals}`}
            className="inline-flex h-14 items-center justify-center rounded-full px-7 text-[0.85rem] font-medium tracking-[0.14em] uppercase ring-1 ring-nacar/50 backdrop-blur-sm transition-colors hover:bg-nacar/10"
          >
            {hero.prices}
          </a>
        </div>
        <p className="or-rise mt-6 inline-flex items-center gap-2 rounded-full bg-cacau/40 px-3 py-1.5 text-[0.7rem] tracking-[0.08em] text-nacar/80 [animation-delay:1100ms]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-argila" />
          {copy.demo}
        </p>
      </div>

      <div data-hero-cue className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center [@media(max-height:860px)]:hidden">
        <a href={`#${orveSections.rituals}`} className="or-rise pointer-events-auto flex flex-col items-center gap-2 text-[0.65rem] tracking-[0.3em] text-nacar/75 uppercase [animation-delay:1400ms]">
          {hero.scroll}
          <span aria-hidden="true" className="relative block h-12 w-px bg-nacar/25">
            <span className="or-cue absolute -left-[3px] top-0 block h-2.5 w-[7px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-argila" />
          </span>
        </a>
      </div>
    </HeroLens>
  );
}
