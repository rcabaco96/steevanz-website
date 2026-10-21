import Image from "next/image";
import { fabios, fabiosImageSize } from "@/content/fabios-roadstop/facts";
import type { FabiosCopy } from "@/content/fabios-roadstop/copy";
import { ArrowIcon, PinIcon } from "./icons";
import type { FabiosLinks } from "./links";
import { PageHero } from "./PageHero";
import { Reveal } from "./Reveal";
import { Magnet } from "./react-bits/Magnet";
import { ScrollVelocity } from "./react-bits/ScrollVelocity";
import { Social } from "./Social";

export function AboutPage({ copy, links }: { copy: FabiosCopy; links: FabiosLinks }) {
  const { about } = copy;
  return (
    <>
      <PageHero
        eyebrow={about.eyebrow}
        title={about.title}
        titleScript={about.titleScript}
        intro={about.intro}
        image={fabios.media.interior}
        width={fabiosImageSize.interior.width}
        height={fabiosImageSize.interior.height}
      />

      <section aria-label={about.quoteBy} className="relative overflow-hidden bg-cream py-24 sm:py-36">
        <div className="mx-auto max-w-[70rem] px-4 text-center sm:px-8">
          <Reveal>
            <span aria-hidden="true" className="block font-display text-[8rem] leading-[0.6] text-cherry-bright sm:text-[12rem]">
              “
            </span>
            <blockquote className="font-display text-[clamp(2.4rem,8vw,6.2rem)] leading-[0.95] uppercase">
              <p>{about.quote}</p>
            </blockquote>
            <p className="mt-6 font-script text-4xl text-cherry sm:text-5xl">— {about.quoteBy}</p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="fr-story-title" className="relative bg-paper py-24 sm:py-32">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-4 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 id="fr-story-title" className="font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.9] uppercase">
              {fabios.name}
            </h2>
            <div className="mt-8 grid gap-6 text-lg leading-relaxed text-ink/85 sm:text-xl">
              {about.story.map((paragraph) => (
                <Reveal key={paragraph}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="relative grid content-start gap-6 lg:sticky lg:top-28 lg:self-start">
            <figure className="fr-polaroid -rotate-2">
              <Image
                src={fabios.media.lemonades}
                alt={about.galleryAlt.lemonades}
                width={fabiosImageSize.lemonades.width}
                height={fabiosImageSize.lemonades.height}
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="h-auto w-full"
              />
            </figure>
            <figure className="fr-polaroid ml-auto w-[78%] rotate-3">
              <Image
                src={fabios.media.facade}
                alt={about.galleryAlt.facade}
                width={fabiosImageSize.still.width}
                height={fabiosImageSize.still.height}
                sizes="(min-width: 1024px) 34vw, 78vw"
                className="h-auto w-full"
              />
            </figure>
          </div>
        </div>
      </section>

      <div className="bg-ink py-4 text-cream">
        <ScrollVelocity baseVelocity={-1.8}>
          {about.values.map((value) => (
            <span key={value.title} className="flex items-center font-display text-3xl uppercase sm:text-5xl">
              <span className="px-6">{value.title}</span>
              <span aria-hidden="true" className="text-cherry-bright">
                ✦
              </span>
            </span>
          ))}
        </ScrollVelocity>
      </div>

      <section aria-labelledby="fr-values-title" className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
          <h2 id="fr-values-title" className="sr-only">
            {about.values.map((v) => v.title).join(" · ")}
          </h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {about.values.map((value, i) => (
              <li key={value.title}>
                <Reveal delay={i * 90}>
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-booth-soft p-8 pt-12">
                    <div aria-hidden="true" className="fr-checker absolute inset-x-0 top-0 h-3 [--s:12px]" />
                    <span className="font-display text-6xl text-cherry-bright tabular-nums">0{i + 1}</span>
                    <h3 className="mt-3 font-display text-3xl uppercase">{value.title}</h3>
                    <p className="mt-2 text-lg text-ink/80">{value.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col items-start gap-6 rounded-[2rem] bg-night p-8 text-cream sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <p className="fr-neon fr-neon-flicker text-[clamp(2rem,6vw,3.8rem)] leading-none">{about.cta}</p>
            <div className="flex flex-wrap gap-3">
              <Magnet>
                <a href={links.menu} className="group inline-flex h-14 items-center gap-3 rounded-full bg-cherry pr-2 pl-6 text-lg font-bold transition-colors hover:bg-cherry-bright">
                  {copy.hero.menu}
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-cherry">
                    <ArrowIcon />
                  </span>
                </a>
              </Magnet>
              <a href={links.contact} className="inline-flex h-14 items-center gap-2 rounded-full px-6 text-lg font-bold ring-2 ring-cream/70 transition-colors hover:bg-cream hover:text-night">
                <PinIcon /> {copy.nav.contact}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Social copy={copy} />
    </>
  );
}
