import Image from "next/image";
import type { SeteChavesCopy } from "@/content/sete-chaves/copy";
import { seteChavesPhotos } from "@/content/sete-chaves/facts";
import { Reveal } from "./Reveal";
import { TagRing } from "./TagRing";

// The house in a few lines: the seven iron keys found behind the kitchen door, what stayed and what was added, the
// hosts (fictional, and the page says so), and three plain facts. The keys' photo sits in the key-tag frame.
export function Story({ copy }: { copy: SeteChavesCopy }) {
  const { story } = copy;
  const photo = seteChavesPhotos.molhoChaves;
  return (
    <section
      aria-labelledby="sc-story-title"
      className="relative bg-cal py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-[80rem] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-20">
        <div>
          <p className="sc-label mb-5 flex items-center gap-3 text-latao-deep">
            <span aria-hidden="true" className="h-px w-8 bg-latao/60" />
            {story.eyebrow}
          </p>
          <h2
            id="sc-story-title"
            className="max-w-[16ch] font-display text-[clamp(2.4rem,7vw,4.4rem)] leading-[0.98] tracking-[-0.02em]"
          >
            {story.title}
          </h2>
          <div className="mt-7 grid max-w-xl gap-4 text-[1.05rem] leading-relaxed text-tinta/80">
            {story.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-tinta/12 pt-6">
            {story.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-2">
                <dt className="text-[0.8rem] leading-snug text-pedra">
                  {fact.label}
                </dt>
                <dd className="order-first font-display text-[clamp(2.2rem,6vw,3.2rem)] leading-none text-latao-deep">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Reveal className="mx-auto w-full max-w-[22rem] lg:max-w-none">
          <figure>
            <div className="relative mt-[14%] aspect-[3/4]">
              <TagRing />
              <div className="sc-fob relative h-full w-full overflow-hidden bg-linho shadow-[0_40px_70px_-40px_rgb(38_44_51/0.6)]">
                <Image
                  src={photo.src}
                  alt={story.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 22rem"
                  className="object-cover"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-[6%] left-1/2 block size-[11%] -translate-x-1/2 rounded-full bg-cal shadow-[inset_0_2px_4px_rgb(0_0_0/0.3)]"
                />
              </div>
            </div>
            <figcaption className="mt-6 rounded-[1.2rem] bg-linho p-5">
              <p className="sc-label text-latao-deep">{story.hosts}</p>
              <p className="mt-2 leading-relaxed">{story.hostsText}</p>
              <p className="mt-2 text-xs text-pedra">{story.hostsNote}</p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
