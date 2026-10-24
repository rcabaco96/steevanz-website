import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda } from "@/content/platibanda/facts";
import { HeroFacade } from "./HeroFacade";
import { ArrowIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { platibandaSections } from "./sections";

// The river film, full screen; as the page scrolls it closes into the front of a house (HeroFacade).
// The «Descer» cue only shows on tall screens: on a phone with the browser bars it would run into the buttons.
export function Hero({ copy }: { copy: PlatibandaCopy }) {
  const { hero } = copy;
  const m = platibanda.media;
  return (
    <HeroFacade
      poster={m.heroPoster}
      posterPortrait={m.heroPortraitPoster}
      video={m.hero}
      videoPortrait={m.heroPortrait}
      alt={hero.alt}
      line={hero.line}
    >
      <div
        data-hero-copy
        className="relative mx-auto flex w-full max-w-[72rem] flex-1 flex-col justify-end px-5 pt-24 pb-14 sm:px-8 sm:pb-20 [@media(max-height:700px)]:pb-8"
      >
        <p className="pb-label pb-rise text-cal/90 [animation-delay:150ms]">{hero.kicker}</p>
        <h1
          id="pb-hero-title"
          className="pb-rise mt-5 max-w-[13ch] font-display text-[clamp(2.5rem,10.5vw,6.2rem)] leading-[0.98] tracking-[-0.015em] [animation-delay:350ms] [@media(max-height:700px)]:text-[clamp(2.2rem,9vw,4rem)]"
        >
          <span className="sr-only">{platibanda.name}: </span>
          {hero.title}
        </h1>
        <p className="pb-rise mt-5 max-w-md text-[1.02rem] leading-relaxed text-cal/88 sm:text-[1.1rem] [animation-delay:550ms]">{hero.lead}</p>

        <div className="pb-rise mt-8 flex w-full flex-col items-stretch gap-3 min-[420px]:w-auto min-[420px]:flex-row min-[420px]:items-center [animation-delay:700ms] [@media(max-height:700px)]:mt-6">
          <Magnet className="w-full min-[420px]:w-auto">
            <a
              href={`#${platibandaSections.listings}`}
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ocre px-7 text-[0.95rem] font-semibold text-ria shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] transition-colors hover:bg-[#dd9d2e] min-[420px]:w-auto"
            >
              {hero.primary}
              <ArrowIcon width={18} height={18} />
            </a>
          </Magnet>
          <a
            href={`#${platibandaSections.sell}`}
            className="inline-flex h-14 items-center justify-center rounded-full px-7 text-[0.95rem] font-semibold ring-1 ring-cal/55 backdrop-blur-sm transition-colors hover:bg-cal/10"
          >
            {hero.secondary}
          </a>
        </div>
        <p className="pb-rise mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ria/50 px-3 py-1.5 text-[0.72rem] tracking-[0.04em] text-cal/85 [animation-delay:900ms]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-ocre" />
          {copy.demo}
        </p>
      </div>

      <div data-hero-cue className="pointer-events-none absolute right-8 bottom-8 z-10 hidden [@media(min-height:861px)_and_(min-width:640px)]:flex">
        <a href={`#${platibandaSections.listings}`} className="pb-rise pointer-events-auto flex flex-col items-center gap-2 text-[0.68rem] font-semibold tracking-[0.3em] text-cal/80 uppercase [animation-delay:1200ms]">
          {hero.scroll}
          <span aria-hidden="true" className="relative block h-12 w-px bg-cal/30">
            <span className="pb-cue absolute -left-[4px] top-0 block size-[9px] rotate-45 bg-ocre" />
          </span>
        </a>
      </div>
    </HeroFacade>
  );
}
