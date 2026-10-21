import Image from "next/image";
import { fabios, fabiosImageSize } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy } from "@/content/fabios-roadstop/copy";
import { HeroParallax } from "./HeroParallax";
import { HeroVideo } from "./HeroVideo";
import { ArrowIcon, PhoneIcon, PinIcon, StarIcon } from "./icons";
import type { FabiosLinks } from "./links";
import { CircularText } from "./react-bits/CircularText";
import { Magnet } from "./react-bits/Magnet";
import { RotatingText } from "./react-bits/RotatingText";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";

interface HeroProps {
  copy: FabiosCopy;
  links: FabiosLinks;
}

export function Hero({ copy, links }: HeroProps) {
  const { hero } = copy;
  return (
    <section aria-labelledby="fr-hero-title" className="relative isolate flex min-h-[620px] flex-col overflow-hidden bg-night text-cream [height:100svh]">
      {/* The film as it is (owner, 2026-10-21: no grain, no scanlines, less darkening), with a light duotone and only
          the shade the text needs. The poster below is the same file as the video's poster (unoptimized: one
          download, the first frame). */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={fabios.media.poster}
          alt=""
          width={fabiosImageSize.poster.width}
          height={fabiosImageSize.poster.height}
          sizes="100vw"
          priority
          fetchPriority="high"
          unoptimized
          className="absolute inset-0 h-full w-full object-cover"
        />
        <HeroVideo label={hero.videoLabel} />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#1f9bd7_0%,transparent_42%,transparent_60%,#e2312b_100%)] opacity-25 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_23_38/0.5)_0%,rgb(13_23_38/0.05)_28%,rgb(13_23_38/0.2)_55%,rgb(13_23_38/0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,transparent_45%,rgb(0_0_0/0.3)_100%)]" />
      </div>

      <HeroParallax className="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end px-4 pt-24 pb-28 sm:px-8 sm:pb-32 lg:pb-36">
        <div className="absolute top-20 right-4 sm:top-28 sm:right-8 lg:top-32 lg:right-12">
          <CircularText
            id="fr-badge"
            text={hero.badge}
            className="fr-pop h-[5.8rem] w-[5.8rem] [animation-delay:900ms] sm:h-36 sm:w-36 lg:h-44 lg:w-44"
            textClassName="fill-cream font-sans text-[8.6px] font-bold tracking-[0.18em] uppercase"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-cherry text-sun shadow-[0_0_30px_rgb(226_49_43/0.65)] sm:h-16 sm:w-16 lg:h-20 lg:w-20">
              <StarIcon className="h-5 w-5 sm:h-8 sm:w-8" />
            </span>
          </CircularText>
        </div>

        <p className="fr-rise mb-4 flex items-start gap-2.5 text-[0.72rem] font-bold tracking-[0.26em] text-cream/90 uppercase sm:items-center sm:text-sm">
          <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cherry-bright shadow-[0_0_12px_3px_rgb(255_59_82/0.8)] sm:mt-0" />
          <span>
            {hero.kicker.split(" · ").map((part, i) => (
              <span key={part} className="block sm:inline">
                {i > 0 ? <span className="hidden sm:inline"> · </span> : null}
                {part}
              </span>
            ))}
          </span>
        </p>

        <h1 id="fr-hero-title" className="relative select-none">
          <span className="fr-rise fr-extrude block origin-bottom-left font-display text-[clamp(5.2rem,26vw,17.5rem)] leading-[0.82] tracking-[-0.01em] uppercase [animation-delay:120ms] [transform:skewX(-7deg)]">
            Fabio&apos;s
          </span>
          <span className="sr-only"> </span>
          <span className="fr-rise -mt-[0.18em] block pl-[0.15em] font-script text-[clamp(3.3rem,15vw,9.8rem)] leading-[1] text-sun [animation-delay:320ms] [text-shadow:0_4px_0_#a3191b,0_10px_30px_rgb(0_0_0/0.5)]">
            <span className="inline-block -rotate-[6deg]">Roadstop</span>
          </span>
        </h1>

        <p className="fr-rise mt-5 max-w-xl text-[1.32rem] leading-tight font-bold sm:text-3xl [animation-delay:480ms]">
          {hero.craving}{" "}
          <RotatingText words={copy.dishes.items.map((d) => d.name.toLowerCase())} className="text-sun" />
        </p>
        <p className="fr-rise mt-3 max-w-md text-[0.98rem] leading-relaxed text-cream/85 sm:text-lg [animation-delay:560ms]">
          {hero.lead}
        </p>

        <div className="fr-rise mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3 [animation-delay:680ms]">
          <Magnet>
            <a
              href={links.menu}
              className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-cherry pr-2 pl-6 text-lg font-bold text-cream shadow-[0_14px_34px_-10px_rgb(226_49_43/0.9)] ring-1 ring-white/20 transition-colors hover:bg-cherry-bright"
            >
              {hero.menu}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-cherry transition-transform duration-500 group-hover:rotate-[-45deg]">
                <ArrowIcon />
              </span>
            </a>
          </Magnet>
          <a
            href={fabios.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2 rounded-full bg-white/10 px-5 font-bold text-cream ring-1 ring-white/35 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <PinIcon width={18} height={18} />
            {hero.directions}
            <span className="sr-only"> {copy.newTab}</span>
          </a>
          <a
            href={fabios.phoneHref}
            className="inline-flex h-14 items-center gap-2 rounded-full bg-white/10 px-5 font-bold text-cream ring-1 ring-white/35 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <PhoneIcon width={18} height={18} />
            {hero.call}
          </a>
        </div>
      </HeroParallax>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div aria-hidden="true" className="fr-checker h-3 [--s:12px]" />
        <ScrollVelocity baseVelocity={2.2} className="bg-cherry py-3 sm:py-4">
          {copy.marquee.map((word) => (
            <span key={word} className="flex items-center font-display text-2xl tracking-wide text-cream uppercase sm:text-4xl">
              <span className="fr-chrome px-5 sm:px-8">{word}</span>
              <StarIcon className="h-4 w-4 text-sun sm:h-5 sm:w-5" />
            </span>
          ))}
        </ScrollVelocity>
      </div>
    </section>
  );
}
