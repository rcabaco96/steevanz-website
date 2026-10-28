"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda } from "@/content/platibanda/facts";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Words that light up in ochre instead of whitewash. */
const keyWords = /^(platibanda|barra|porta|chave)/i;

// The house's credo, held on screen (GSAP pin + scrub): a narrow doorway in the dark opens wide onto Tavira seen from
// above (a film), then dims, and the sentence lights up word by word as the page scrolls — the words of the house
// front (platibanda, barra, porta, chave) in ochre (the React Bits ScrollReveal idea, done with ScrollTrigger).
// Without JavaScript or with reduced motion: the still frame and the sentence fully lit.
export function Manifesto({ copy }: { copy: PlatibandaCopy }) {
  const { manifesto } = copy;
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const motionOk = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(reducedQuery).matches, () => false);
  const words = manifesto.text.split(" ");

  useEffect(() => {
    const el = film.current;
    if (!el || !motionOk) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const spans = q("[data-word]") as HTMLElement[];
        el.classList.add("is-armed");
        let lit = -1;
        const light = (progress: number) => {
          const n = Math.round(progress * spans.length);
          if (n === lit) return;
          lit = n;
          spans.forEach((s, i) => s.classList.toggle("is-lit", i < n));
        };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=180%", pin: true, scrub: 0.6, anticipatePin: 1 },
        });
        const words = { p: 0 };
        tl.fromTo(q("[data-window]"), { clipPath: "inset(26% 41% 0% 41%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.35, ease: "power2.inOut" }, 0)
          .fromTo(q("[data-window-film]"), { scale: 1.25 }, { scale: 1, duration: 0.35 }, 0)
          .fromTo(q("[data-dim]"), { opacity: 0.15 }, { opacity: 0.78, duration: 0.2 }, 0.3)
          .fromTo(words, { p: 0 }, { p: 1, duration: 0.55, onUpdate: () => light(words.p) }, 0.38)
          .to({}, { duration: 0.1 });
        return () => {
          el.classList.remove("is-armed");
          spans.forEach((s) => s.classList.remove("is-lit"));
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="pb-manifesto-title" className="pb-on-dark relative isolate flex min-h-svh items-center overflow-hidden bg-ria text-cal">
      <div data-window className="absolute inset-0 overflow-hidden will-change-[clip-path]">
        <div data-window-film className="absolute inset-0 will-change-transform">
          <Image src={platibanda.media.townPoster} alt={manifesto.alt} fill sizes="100vw" className="object-cover" />
          {motionOk ? (
            <video
              ref={film}
              src={platibanda.media.town}
              poster={platibanda.media.townPoster}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div data-dim className="absolute inset-0 bg-ria opacity-[0.78]" />
      </div>

      <div className="relative mx-auto w-full max-w-[64rem] px-5 py-24 sm:px-8">
        <h2 id="pb-manifesto-title" className="pb-label mb-6 flex items-center gap-3 text-ocre">
          <span aria-hidden="true" className="h-[3px] w-8 bg-ocre" />
          {manifesto.eyebrow}
        </h2>
        <p className="font-display text-[clamp(1.55rem,5.4vw,3.4rem)] leading-[1.18]">
          {words.map((word, i) => (
            <span key={i}>
              <span data-word className={`pb-word ${keyWords.test(word) ? "is-key" : ""}`}>
                {word}
              </span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
