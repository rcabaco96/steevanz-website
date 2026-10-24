import type { RiscaCopy } from "@/content/risca/copy";
import { risca } from "@/content/risca/facts";
import { HeroCover } from "./HeroCover";
import { ArrowIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { riscaSections } from "./sections";

// The salon film, full screen, with the headline set like a magazine's; as the page scrolls it becomes the cover
// (HeroCover). The «Descer» cue only shows on tall screens: on a phone with the browser bars it would run into the
// buttons.
export function Hero({ copy }: { copy: RiscaCopy }) {
  const { hero } = copy;
  const m = risca.media;
  return (
    <HeroCover
      poster={m.heroPoster}
      posterPortrait={m.heroPortraitPoster}
      video={m.hero}
      videoPortrait={m.heroPortrait}
      alt={hero.alt}
      cover={hero.cover}
    >
      <div
        data-hero-copy
        className="relative mx-auto flex w-full max-w-[92rem] flex-1 flex-col justify-end px-5 pt-24 pb-10 sm:px-8 sm:pb-16 [@media(max-height:700px)]:pb-6"
      >
        <p className="rc-label rc-rise flex items-center gap-3 text-gesso/85 [animation-delay:150ms]">
          <span aria-hidden="true" className="h-[2px] w-8 bg-vermelhao" />
          {hero.kicker}
        </p>
        <h1 id="rc-hero-title" className="mt-4 sm:mt-6">
          <span className="sr-only">{risca.name}: </span>
          <span className="rc-display rc-rise block text-[clamp(4rem,21vw,12.5rem)] [animation-delay:300ms] [@media(max-height:700px)]:text-[clamp(3.4rem,17vw,9rem)]">
            {hero.titleTop}
          </span>
          <span className="rc-serif rc-rise -mt-[0.12em] block text-[clamp(3.6rem,18vw,10.5rem)] leading-[0.9] text-vermelhao [animation-delay:450ms] [@media(max-height:700px)]:text-[clamp(3rem,15vw,8rem)]">
            {hero.titleSerif}
          </span>
        </h1>
        <div className="mt-5 flex flex-col gap-6 sm:mt-7 md:flex-row md:items-end md:justify-between">
          <p className="rc-rise max-w-md text-[1rem] leading-relaxed text-gesso/88 sm:text-[1.08rem] [animation-delay:600ms]">{hero.lead}</p>
          <div className="rc-rise flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row min-[420px]:items-center [animation-delay:750ms]">
            <Magnet className="w-full min-[420px]:w-auto">
              <a
                href={`#${riscaSections.book}`}
                className="rc-slant inline-flex h-14 w-full items-center justify-center gap-3 bg-vermelhao pr-10 pl-7 text-[0.85rem] font-bold tracking-[0.16em] text-tinta uppercase transition-colors hover:bg-gesso min-[420px]:w-auto"
              >
                {hero.book}
                <ArrowIcon width={18} height={18} />
              </a>
            </Magnet>
            <a
              href={`#${riscaSections.services}`}
              className="inline-flex h-14 items-center justify-center px-7 text-[0.85rem] font-bold tracking-[0.16em] uppercase ring-1 ring-gesso/55 backdrop-blur-sm transition-colors hover:bg-gesso hover:text-tinta"
            >
              {hero.prices}
            </a>
          </div>
        </div>
        <p className="rc-rise mt-6 inline-flex w-fit items-center gap-2 bg-tinta/55 px-3 py-1.5 text-[0.7rem] tracking-[0.08em] text-gesso/85 [animation-delay:900ms]">
          <span aria-hidden="true" className="h-[2px] w-3 bg-vermelhao" />
          {copy.demo}
        </p>
      </div>

      <div data-hero-cue className="pointer-events-none absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 lg:flex [@media(max-height:760px)]:hidden">
        <a href={`#${riscaSections.services}`} className="rc-rise pointer-events-auto flex flex-col items-center gap-3 text-[0.62rem] tracking-[0.3em] text-gesso/80 uppercase [animation-delay:1200ms]">
          <span className="[writing-mode:vertical-rl]">{hero.scroll}</span>
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-gesso/25">
            <span className="rc-cue absolute top-0 left-0 block h-5 w-px bg-vermelhao" />
          </span>
        </a>
      </div>
    </HeroCover>
  );
}
