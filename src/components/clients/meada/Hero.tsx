import type { MeadaCopy } from "@/content/meada/copy";
import { meada } from "@/content/meada/facts";
import { HeroTag } from "./HeroTag";
import { ArrowIcon } from "./icons";
import { Magnet } from "./react-bits/Magnet";
import { meadaSections } from "./sections";

// The loom film, full screen; as the page scrolls it is cut down to a kraft hang tag tied with red thread (HeroTag).
// The «Descer» cue only shows on tall screens: on a phone with the browser bars it would run into the buttons.
export function Hero({ copy }: { copy: MeadaCopy }) {
  const { hero } = copy;
  const m = meada.media;
  return (
    <HeroTag
      poster={m.heroPoster}
      posterPortrait={m.heroPortraitPoster}
      video={m.hero}
      videoPortrait={m.heroPortrait}
      alt={hero.alt}
      tagTop={hero.tagTop}
      tagLine={hero.tagLine}
      tagNumber={hero.tagPrice}
    >
      <div
        data-hero-copy
        className="relative mx-auto flex w-full max-w-[72rem] flex-1 flex-col justify-end px-5 pt-24 pb-16 sm:px-8 sm:pb-20 [@media(max-height:700px)]:pb-8"
      >
        <p className="md-rise md-label flex items-center gap-3 text-algodao/85 [animation-delay:150ms]">
          <span aria-hidden="true" className="md-stitch md-stitch-light w-10" />
          {hero.kicker}
        </p>
        <h1
          id="md-hero-title"
          className="md-rise mt-6 max-w-[15ch] font-display text-[clamp(2.3rem,9vw,5.6rem)] leading-[1.0] [animation-delay:350ms] [@media(max-height:700px)]:mt-4 [@media(max-height:700px)]:text-[clamp(2.1rem,8vw,4rem)]"
        >
          <span className="sr-only">{meada.name}: </span>
          {hero.title}
        </h1>
        <p className="md-rise mt-5 max-w-lg text-[1rem] leading-relaxed text-algodao/85 sm:text-[1.1rem] [animation-delay:550ms]">{hero.lead}</p>

        <div className="md-rise mt-8 flex w-full flex-col items-stretch gap-3 min-[440px]:w-auto min-[440px]:flex-row min-[440px]:items-center [animation-delay:750ms] [@media(max-height:700px)]:mt-6">
          <Magnet className="w-full min-[440px]:w-auto">
            <a
              href={`#${meadaSections.shop}`}
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-fio px-7 font-mono text-[0.82rem] tracking-[0.14em] text-algodao uppercase shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] transition-colors hover:bg-fio-2 min-[440px]:w-auto"
            >
              {hero.shop}
              <ArrowIcon width={18} height={18} />
            </a>
          </Magnet>
          <a
            href={`#${meadaSections.visit}`}
            className="inline-flex h-14 items-center justify-center rounded-full px-7 font-mono text-[0.82rem] tracking-[0.14em] uppercase ring-1 ring-algodao/55 backdrop-blur-sm transition-colors hover:bg-algodao/10"
          >
            {hero.visit}
          </a>
        </div>
        <p className="md-rise mt-6 inline-flex items-center gap-2 self-start rounded-full bg-grafite/45 px-3 py-1.5 text-[0.7rem] tracking-[0.06em] text-algodao/85 [animation-delay:900ms]">
          <span aria-hidden="true" className="font-mono text-fio">✕</span>
          {copy.demo}
        </p>
      </div>

      <div data-hero-cue className="pointer-events-none absolute right-6 bottom-8 z-10 hidden sm:block [@media(max-height:860px)]:hidden">
        <a href={`#${meadaSections.shop}`} className="md-rise pointer-events-auto flex flex-col items-center gap-3 font-mono text-[0.65rem] tracking-[0.24em] text-algodao/80 uppercase [animation-delay:1200ms]">
          {hero.scroll}
          <span aria-hidden="true" className="md-cue block h-14 w-[2px] text-kraft" />
        </a>
      </div>
    </HeroTag>
  );
}
