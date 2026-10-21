import Image from "next/image";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  titleScript: string;
  intro: string;
  image: string;
  width: number;
  height: number;
}

// The top of «Sobre nós» and «Contactos»: one of the diner's photos under the same TV treatment as the home.
export function PageHero({ eyebrow, title, titleScript, intro, image, width, height }: PageHeroProps) {
  return (
    <section className="relative isolate flex min-h-[540px] items-end overflow-hidden bg-night text-cream [height:78svh]">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={image} alt="" width={width} height={height} sizes="(max-width: 1023px) 250vw, 100vw" priority className="absolute inset-0 h-full w-full scale-105 object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#1f9bd7_0%,transparent_45%,#e2312b_100%)] opacity-40 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_23_38/0.7)_0%,rgb(13_23_38/0.25)_40%,rgb(13_23_38/0.95)_100%)]" />
        <div className="fr-scanlines" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="fr-grain" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-[90rem] px-4 pb-16 sm:px-8 sm:pb-24">
        <p className="fr-rise mb-4 flex items-center gap-2.5 text-xs font-bold tracking-[0.28em] uppercase sm:text-sm">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cherry-bright shadow-[0_0_12px_3px_rgb(255_59_82/0.8)]" />
          {eyebrow}
        </p>
        <h1 className="font-display text-[clamp(4rem,17vw,12rem)] leading-[0.85] uppercase">
          <span className="fr-rise fr-extrude block [animation-delay:100ms] [transform:skewX(-6deg)]">{title}</span>{" "}
          <span className="fr-rise -mt-[0.1em] block pl-[0.1em] font-script text-[0.7em] leading-[1.1] text-sun normal-case [animation-delay:260ms] [text-shadow:0_4px_0_#a3191b]">
            <span className="inline-block -rotate-[5deg]">{titleScript}</span>
          </span>
        </h1>
        <p className="fr-rise mt-5 max-w-xl text-lg leading-relaxed text-cream/90 sm:text-xl [animation-delay:400ms]">{intro}</p>
      </div>
      <div aria-hidden="true" className="fr-checker absolute inset-x-0 bottom-0 h-3 [--s:12px]" />
    </section>
  );
}
