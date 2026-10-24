"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import { FobMark } from "./Logo";
import { preloaderSeenKey as seenKey } from "./preloader-gate";

gsap.registerPlugin(useGSAP);

/** A keyhole, centred on (0, 0), in the overlay's units. */
const keyhole =
  "M0 -19A10.5 10.5 0 0 1 6.4 -0.6L9.5 22H-9.5L-6.4 -0.6A10.5 10.5 0 0 1 0 -19Z";

// The first visit of a session opens on the schist of the night: the brass key tag swings on its nail and comes to
// rest, the name rises under it; then the key turns a quarter like in a lock, becomes a keyhole, and the keyhole
// opens until the whole house is behind it. Shown once per tab session; never with reduced motion or without
// JavaScript (the layout's <head> hides it before the first paint, so it never flashes: ./preloader-gate.ts).
export function Preloader({ name, line }: { name: string; line: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const html = document.documentElement;
      if (!el || html.classList.contains("sc-seen")) return;
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {}
      const q = gsap.utils.selector(el);
      html.classList.add("sc-loading");
      const done = () => {
        html.classList.remove("sc-loading");
        html.classList.add("sc-seen");
        window.dispatchEvent(new Event("sc:revealed"));
      };
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: done,
      });
      tl.fromTo(
        q("[data-fob]"),
        { rotate: 34 },
        { rotate: 0, duration: 1.9, ease: "elastic.out(1, 0.32)" },
        0.05,
      )
        .fromTo(
          q("[data-fob-wrap]"),
          { y: -40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0,
        )
        .fromTo(
          q("[data-name]"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          0.45,
        )
        .fromTo(
          q("[data-line]"),
          { opacity: 0, letterSpacing: "0.6em" },
          { opacity: 0.75, letterSpacing: "0.3em", duration: 0.9 },
          0.8,
        )
        .to(
          q("[data-name], [data-line]"),
          { opacity: 0, y: -10, duration: 0.35, ease: "power2.in" },
          2.05,
        )
        // The key turns a quarter, like in a lock, and shrinks into the keyhole.
        .to(
          q("[data-fob]"),
          { rotate: 90, scale: 0.35, duration: 0.55, ease: "power3.inOut" },
          2.05,
        )
        .to(q("[data-fob-wrap]"), { opacity: 0, duration: 0.2 }, 2.45)
        .set(q("[data-hole]"), { opacity: 1 }, 2.5)
        .set(q("[data-solid]"), { opacity: 0 }, 2.5)
        .to(
          q("[data-hole]"),
          { scale: 80, duration: 1.15, ease: "expo.in" },
          2.65,
        )
        .set(el, { display: "none" });
      return () => {
        tl.kill();
        html.classList.remove("sc-loading");
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="sc-pre fixed inset-0 z-[80] overflow-hidden"
    >
      <svg
        data-hole
        viewBox="-1000 -1000 2000 2000"
        className="absolute top-1/2 left-1/2 size-[260vmax] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-0 will-change-transform"
      >
        <path
          d={`M-1000 -1000H1000V1000H-1000Z ${keyhole}`}
          fillRule="evenodd"
          fill="var(--color-xisto)"
        />
      </svg>
      <div data-solid className="sc-on-dark absolute inset-0 bg-xisto text-cal">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_45%,rgb(173_129_57/0.2),transparent_70%)]" />
        {/* The tag hangs with its middle on the centre of the screen, where the keyhole will open. */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%]">
          <div data-fob-wrap className="flex flex-col items-center">
            <span className="block size-2.5 rounded-full bg-cal/70 shadow-[0_2px_0_rgb(0_0_0/0.4)]" />
            <div
              data-fob
              className="-mt-1 origin-[50%_4%] will-change-transform"
              style={{ ["--sc-hole" as string]: "var(--color-xisto)" }}
            >
              <FobMark
                className="h-[clamp(7rem,22vh,10rem)] w-auto drop-shadow-[0_18px_24px_rgb(0_0_0/0.45)]"
                gradientId="sc-brass-pre"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(50%+clamp(4.2rem,13vh,6rem))] flex flex-col items-center px-6 text-center">
          <p
            data-name
            className="font-display text-[clamp(2.4rem,9vw,3.6rem)] leading-none opacity-0"
          >
            {name}
          </p>
          <p data-line className="sc-label mt-4 text-latao-claro opacity-0">
            {line}
          </p>
        </div>
      </div>
    </div>
  );
}
