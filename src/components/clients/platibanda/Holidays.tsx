"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda } from "@/content/platibanda/facts";
import { facadeIn, polygon } from "./facade";
import { ArrowIcon, ClockIcon, KeyIcon, WifiIcon } from "./icons";
import { Emblem } from "./Logo";
import { platibandaSections } from "./sections";
import { SplitText } from "./react-bits/SplitText";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const facadeClip = polygon(facadeIn(0, 0, 100, 100));
const pinQuery = "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/** The guide on the phone's screen: an example for a fictional holiday home, drawn in HTML (an illustration). */
function GuideScreen({ guide }: { guide: PlatibandaCopy["holidays"]["guide"] }) {
  return (
    <div data-guide className="will-change-transform">
      <div className="bg-ria px-4 pt-9 pb-5 text-cal">
        <div className="flex items-center justify-between">
          <Emblem className="w-7" line="var(--color-cal)" />
          <div className="flex gap-1">
            {guide.langs.map((l, i) => (
              <span key={l} className={`rounded-full px-1.5 py-0.5 text-[0.55rem] font-semibold ${i === 0 ? "bg-ocre text-ria" : "bg-cal/12"}`}>
                {l}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-4 font-display text-[1.3rem] leading-tight">{guide.house}</p>
        <p className="text-[0.68rem] text-cal/70">{guide.place}</p>
        <p className="mt-2 text-[0.72rem] text-cal/85">{guide.welcome}</p>
      </div>
      <div className="space-y-2.5 bg-cal px-3 py-3 text-ria">
        <div className="rounded-xl bg-areia p-3">
          <p className="flex items-center gap-1.5 text-[0.62rem] font-semibold tracking-[0.14em] text-ocre-deep uppercase">
            <WifiIcon width={13} height={13} /> {guide.wifiLabel}
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="text-[0.72rem] leading-snug">
              <p className="font-semibold">{guide.wifiNetwork}</p>
              <p className="tracking-[0.2em] text-pedra">{guide.wifiPassword}</p>
            </div>
            <span className="rounded-full bg-ria px-2.5 py-1 text-[0.6rem] font-semibold text-cal">{guide.copy}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <p className="flex items-start gap-1.5 rounded-xl bg-areia p-2.5 text-[0.62rem] leading-snug">
            <KeyIcon width={13} height={13} className="mt-px shrink-0 text-telha" /> {guide.checkin}
          </p>
          <p className="flex items-start gap-1.5 rounded-xl bg-areia p-2.5 text-[0.62rem] leading-snug">
            <ClockIcon width={13} height={13} className="mt-px shrink-0 text-telha" /> {guide.checkout}
          </p>
        </div>
        {guide.sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-ria/10 p-3">
            <p className="text-[0.74rem] font-semibold">{s.title}</p>
            <p className="mt-0.5 text-[0.66rem] leading-snug text-pedra">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Phone({ guide, label }: { guide: PlatibandaCopy["holidays"]["guide"]; label: string }) {
  return (
    <div role="img" aria-label={label} className="relative mx-auto w-[min(68vw,16.5rem)]">
      <div className="relative aspect-[9/19] overflow-hidden rounded-[2.4rem] bg-tinta p-[9px] shadow-[0_40px_70px_-30px_rgb(19_48_46/0.7)]">
        <div aria-hidden="true" className="relative h-full overflow-hidden rounded-[1.9rem] bg-cal">
          <GuideScreen guide={guide} />
          <span className="absolute top-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-tinta" />
        </div>
      </div>
    </div>
  );
}

// Holidays and the «Guia digital»: the agency's holiday homes come with a digital guide the guest opens with a tap
// of the phone on a plate at the door (or its QR). Large screens: the scene holds still (GSAP pin + scrub) while the
// guide scrolls by itself on the phone's screen and each of its four parts lights up on the left; behind the phone
// the pool of a holiday home moves inside a house front. Phones: heading and text, then the phone (its guide
// scrolling with the page), then the four parts. Reduced motion: everything still.
export function Holidays({ copy }: { copy: PlatibandaCopy }) {
  const { holidays } = copy;
  const root = useRef<HTMLElement>(null);
  const films = useRef<(HTMLVideoElement | null)[]>([]);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);

  useEffect(() => {
    if (!motionOk) return;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const v = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      }
    });
    films.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, [motionOk]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      const travel = (guide: HTMLElement) => () => -Math.max(0, guide.scrollHeight - (guide.parentElement?.clientHeight ?? 0) + 8);

      mm.add(pinQuery, () => {
        const guide = q("[data-lg-phone] [data-guide]")[0] as HTMLElement;
        const points = q("[data-point]") as HTMLElement[];
        el.classList.add("is-armed");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=160%", pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(q("[data-lg-phone]"), { y: 120, rotate: 4 }, { y: 0, rotate: -2, duration: 0.25, ease: "power2.out" }, 0)
          .fromTo(q("[data-pool]"), { scale: 0.86, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.25 }, 0)
          .fromTo(guide, { y: 0 }, { y: travel(guide), duration: 0.75 }, 0.2);
        points.forEach((p, i) => {
          tl.fromTo(p, { opacity: 0.3, x: -12 }, { opacity: 1, x: 0, duration: 0.08 }, 0.22 + i * 0.16);
        });
        tl.to({}, { duration: 0.05 });
        return () => el.classList.remove("is-armed");
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 699px) and (prefers-reduced-motion: no-preference)", () => {
        const phone = q("[data-sm-phone]")[0] as HTMLElement;
        const guide = q("[data-sm-phone] [data-guide]")[0] as HTMLElement;
        gsap.fromTo(guide, { y: 0 }, { y: travel(guide), ease: "none", scrollTrigger: { trigger: phone, start: "top 75%", end: "bottom 25%", scrub: 0.5, invalidateOnRefresh: true } });
        gsap.fromTo(phone, { rotate: 5, y: 40 }, { rotate: -2, y: 0, ease: "none", scrollTrigger: { trigger: phone, start: "top bottom", end: "center center", scrub: 0.5 } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const pool = (i: number) => (
    <div data-pool className="absolute inset-0 overflow-hidden bg-ria-2 will-change-transform" style={{ clipPath: facadeClip }}>
      <Image src={platibanda.media.poolPoster} alt={holidays.videoAlt} fill sizes="(min-width: 1024px) 26rem, 80vw" className="object-cover" />
      {motionOk ? (
        <video
          ref={(node) => {
            films.current[i] = node;
          }}
          src={platibanda.media.pool}
          poster={platibanda.media.poolPoster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  );

  return (
    <section id={platibandaSections.holidays} ref={root} aria-labelledby="pb-holidays-title" className="pb-on-dark relative overflow-hidden bg-ria text-cal">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-2.5 bg-anil" />
      <div className="relative mx-auto grid max-w-[84rem] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16 lg:py-20">
        <div>
          <p className="pb-label mb-4 flex items-center gap-3 text-ocre">
            <span aria-hidden="true" className="h-[3px] w-8 bg-ocre" />
            {holidays.eyebrow}
          </p>
          <h2 id="pb-holidays-title" className="font-display text-[clamp(2.2rem,7vw,4.2rem)] leading-[0.98]">
            <SplitText text={holidays.title} splitType="words" delay={60} /> <span className="text-ocre">{holidays.titleItalic}</span>
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-cal/80">{holidays.intro}</p>

          {/* Phones: the phone right after the text. */}
          <div className="relative mx-auto mt-12 max-w-sm lg:hidden">
            <div className="relative mx-auto aspect-[4/5] w-[86%]">{pool(0)}</div>
            <div data-sm-phone className="relative -mt-[78%] will-change-transform">
              <Phone guide={holidays.guide} label={holidays.phoneLabel} />
            </div>
            <p className="mt-4 text-center text-xs text-cal/60">{holidays.note}</p>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2">
            {holidays.points.map((p, i) => (
              <li key={p.title} data-point className="border-t border-cal/15 pt-4">
                <p className="flex items-baseline gap-3 font-display text-xl">
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-ocre">0{i + 1}</span>
                  {p.title}
                </p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-cal/72">{p.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-xl rounded-2xl bg-ria-2 px-5 py-4 text-sm leading-relaxed text-cal/80">{holidays.never}</p>
          <a
            href={`#${platibandaSections.listings}`}
            className="mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-ocre px-7 font-semibold text-ria transition-colors hover:bg-[#dd9d2e]"
          >
            {holidays.cta}
            <ArrowIcon width={18} height={18} />
          </a>
        </div>

        {/* Large screens: the pool in a house front, the phone in front of it. */}
        <div className="relative hidden lg:block">
          <div className="relative mx-auto aspect-[4/5] w-[min(100%,26rem)]">{pool(1)}</div>
          <div data-lg-phone className="absolute inset-x-0 top-[12%] will-change-transform">
            <Phone guide={holidays.guide} label={holidays.phoneLabel} />
          </div>
          <p className="mt-6 text-center text-xs text-cal/60">{holidays.note}</p>
        </div>
      </div>
    </section>
  );
}
