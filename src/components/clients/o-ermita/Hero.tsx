import Image from "next/image";
import { ermita, ermitaImageSize } from "@/content/o-ermita/facts";
import type { ErmitaCopy } from "@/content/o-ermita/copy";
import { HeroParallax } from "./HeroParallax";
import { ChatIcon, PhoneIcon, PinIcon } from "./icons";
import { RestauranteLine, Skyline, Wordmark } from "./Logo";
import { Magnet } from "./react-bits/Magnet";
import { ermitaSections } from "./sections";

// The marble doorway between the two basins, full screen, drifting slowly (Ken Burns) and sinking as the page
// scrolls. Over it, the logo draws its skyline and the restaurant's own line («Sabores do Alentejo num convento
// histórico»).
export function Hero({ copy }: { copy: ErmitaCopy }) {
  const { hero } = copy;
  const media = (
    <>
      <div className="oe-kenburns absolute inset-0">
        <Image
          src={ermita.media.portal}
          alt={hero.alt}
          width={ermitaImageSize.wide.width}
          height={ermitaImageSize.wide.height}
          sizes="(max-width: 767px) 220vw, 100vw"
          priority
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[50%_45%]"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(15_22_36/0.72)_0%,rgb(15_22_36/0.28)_30%,rgb(15_22_36/0.38)_60%,rgb(15_22_36/0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_50%,transparent_40%,rgb(10_14_24/0.45)_100%)]" />
    </>
  );

  return (
    <section aria-labelledby="oe-hero-title" className="relative isolate overflow-hidden bg-noite text-cal">
      <HeroParallax
        media={media}
        className="relative mx-auto flex w-full max-w-[60rem] flex-1 flex-col items-center justify-center px-5 pt-24 pb-28 text-center sm:px-8"
      >
        <p className="oe-eyebrow oe-rise text-cal/85 [animation-delay:100ms]">{hero.kicker}</p>

        <div aria-hidden="true" className="mt-7 flex w-[min(78vw,30rem)] flex-col items-center sm:mt-9">
          <div className="oe-wipe w-[94%] self-start">
            <div>
              <div>
                <Skyline className="w-full" />
              </div>
            </div>
          </div>
          <Wordmark className="oe-rise mt-[6.5%] w-full [animation-delay:500ms]" />
          <RestauranteLine className="oe-rise mt-[6.3%] w-[29.7%] [animation-delay:800ms]" />
        </div>

        <h1 id="oe-hero-title" className="oe-rise mt-8 max-w-[22ch] font-serif text-[clamp(1.9rem,7.4vw,3.6rem)] leading-[1.05] font-medium italic sm:mt-10 [animation-delay:1000ms]">
          <span className="sr-only">{ermita.name}: </span>
          {hero.title}
        </h1>
        <p className="oe-rise mt-4 max-w-md text-[0.95rem] leading-relaxed text-cal/85 sm:text-base [animation-delay:1150ms]">{hero.lead}</p>

        <div className="oe-rise mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center [animation-delay:1300ms]">
          <Magnet className="w-full sm:w-auto">
            <a
              href={ermita.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-cal px-4 text-[0.74rem] font-semibold tracking-[0.12em] whitespace-nowrap min-[360px]:px-7 min-[360px]:text-[0.8rem] min-[360px]:tracking-[0.18em] text-azulejo-deep uppercase shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] transition-colors hover:bg-white sm:w-auto"
            >
              <ChatIcon width={18} height={18} />
              {hero.whatsapp}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </Magnet>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <a
              href={ermita.phoneHref}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-3 text-[0.74rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase ring-1 sm:px-5 sm:text-[0.8rem] sm:tracking-[0.18em] ring-cal/45 backdrop-blur-sm transition-colors hover:bg-cal/10"
            >
              <PhoneIcon width={17} height={17} className="max-[359px]:hidden" />
              {hero.call}
            </a>
            <a
              href={ermita.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-3 text-[0.74rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase ring-1 sm:px-5 sm:text-[0.8rem] sm:tracking-[0.18em] ring-cal/45 backdrop-blur-sm transition-colors hover:bg-cal/10"
            >
              <PinIcon width={17} height={17} className="max-[359px]:hidden" />
              {hero.directions}
              <span className="sr-only"> {copy.newTab}</span>
            </a>
          </div>
        </div>
      </HeroParallax>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center sm:bottom-7">
        <a
          href={`#${ermitaSections.house}`}
          className="oe-rise pointer-events-auto flex flex-col items-center gap-2 text-[0.65rem] font-semibold tracking-[0.3em] text-cal/75 uppercase [animation-delay:1600ms]"
        >
          {hero.scroll}
          <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-cal/20">
            <span className="oe-cue absolute inset-0 bg-cal" />
          </span>
        </a>
      </div>
    </section>
  );
}
