"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";
import { seteChavesCopy as copy } from "@/content/sete-chaves/copy";
import {
  seteChavesPhotos,
  seteChavesPrice,
  seteChavesUnits,
  type SeteChavesUnit,
} from "@/content/sete-chaves/facts";
import { ArrowIcon, BedIcon, CheckIcon, UsersIcon } from "./icons";
import { FobMark } from "./Logo";
import { pickKeyEvent, seteChavesSections } from "./sections";
import { scrollToY } from "./SmoothScroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const roomAnchor = (unit: SeteChavesUnit) => `chave-${unit.key}`;

function pickKey(id: string) {
  window.dispatchEvent(new CustomEvent(pickKeyEvent, { detail: id }));
}

// THE KEY BOARD. At the entrance of the house the seven keys hang on a schist board, one hook each. On a large screen
// the board is held (GSAP pin + scrub) and scrolling takes the keys off one by one: the tag lifts off its hook and its
// room slides open over the last one, like a door pushed aside. Each key is also a link to its room. On phones, with
// reduced motion and without JavaScript the rooms are a plain list of cards, each with its tag swinging as it passes.
// Every price is an example, per night, without VAT, with «+ IVA» beside it.
export function Rooms() {
  const { rooms } = copy;
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const n = seteChavesUnits.length;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)",
        () => {
          el.classList.add("sc-board-on");
          const photos = q("[data-room-photo]");
          const infos = Array.from({ length: n }, (_, i) =>
            q(`[data-room="${i}"] [data-room-info]`),
          );
          gsap.set(photos.slice(1), { clipPath: "inset(0% 0% 0% 100%)" });
          gsap.set(infos.slice(1), { autoAlpha: 0, y: 24 });
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () => `+=${(n - 1) * window.innerHeight * 0.75}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const index = Math.min(
                  n - 1,
                  Math.max(0, Math.round(self.progress * (n - 1))),
                );
                setActive((current) => (current === index ? current : index));
              },
            },
          });
          trigger.current = tl.scrollTrigger ?? null;
          for (let i = 1; i < n; i++) {
            const at = i - 1 + 0.12;
            tl.to(
              infos[i - 1],
              { autoAlpha: 0, y: -18, duration: 0.3, ease: "power1.in" },
              at,
            )
              .to(
                photos[i],
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: 0.7,
                  ease: "power2.inOut",
                },
                at,
              )
              .fromTo(
                q(`[data-room-img="${i}"]`),
                { scale: 1.12, xPercent: 6 },
                { scale: 1, xPercent: 0, duration: 0.8, ease: "power2.out" },
                at,
              )
              .to(
                infos[i],
                { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
                at + 0.4,
              );
          }
          tl.to({}, { duration: 0.15 });
          return () => {
            el.classList.remove("sc-board-on");
            trigger.current = null;
            setActive(0);
          };
        },
      );

      // Phones and tablets: each card's key swings on its hook as it scrolls past.
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 679px) and (prefers-reduced-motion: no-preference)",
        () => {
          for (const tag of q("[data-card-fob]")) {
            gsap.fromTo(
              tag,
              { rotate: -16 },
              {
                rotate: 10,
                ease: "none",
                scrollTrigger: {
                  trigger: tag,
                  start: "top bottom",
                  end: "bottom 25%",
                  scrub: 0.5,
                },
              },
            );
          }
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  const goTo = (event: MouseEvent, index: number) => {
    const st = trigger.current;
    if (!st) return;
    event.preventDefault();
    scrollToY(st.start + ((st.end - st.start) * index) / (n - 1) + 2);
  };

  return (
    <section
      ref={root}
      id={seteChavesSections.rooms}
      aria-labelledby="sc-rooms-title"
      className="sc-on-dark relative overflow-hidden bg-xisto text-cal"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_30%,rgb(173_129_57/0.12),transparent_70%)]"
      />
      <div className="sc-board-stage relative mx-auto grid max-w-[88rem] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-14 [.sc-board-on_&]:py-0">
        <div className="flex flex-col justify-center [.sc-board-on_&]:pt-16">
          <p className="sc-label mb-5 flex items-center gap-3 text-latao-claro">
            <span aria-hidden="true" className="h-px w-8 bg-latao-claro/60" />
            {rooms.eyebrow}
          </p>
          <h2
            id="sc-rooms-title"
            className="font-display text-[clamp(2.6rem,8vw,4.6rem)] leading-[0.95] tracking-[-0.02em]"
          >
            {rooms.title}
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-cal/75">
            {rooms.intro}
          </p>

          {/* The board: a key per hook. */}
          <nav
            aria-label={rooms.boardLabel}
            className="mt-9 rounded-[1.4rem] bg-xisto-2 px-3 pt-4 pb-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_24px_50px_-30px_rgb(0_0_0/0.8)] sm:px-5"
          >
            <ol className="grid grid-cols-7 gap-1">
              {seteChavesUnits.map((unit, i) => {
                const on = active === i;
                return (
                  <li key={unit.id} className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className="block size-2 rounded-full bg-cal/40 shadow-[0_1px_0_rgb(0_0_0/0.5)]"
                    />
                    <a
                      href={`#${roomAnchor(unit)}`}
                      onClick={(event) => goTo(event, i)}
                      aria-current={on ? "true" : undefined}
                      className="group -mt-0.5 flex min-h-14 w-full flex-col items-center"
                    >
                      <span className="sr-only">
                        {rooms.keyLabel(unit.key)}: {unit.name}
                      </span>
                      <span
                        className={`block origin-[50%_0] transition-[translate,rotate,opacity,filter] duration-500 ease-[var(--ease-chave)] ${
                          on
                            ? "-translate-y-1 rotate-[-8deg]"
                            : "[.sc-board-on_&]:opacity-55 group-hover:rotate-[6deg]"
                        }`}
                      >
                        <FobMark
                          number={unit.key}
                          gradientId={`sc-brass-board-${unit.key}`}
                          className="h-[clamp(2.6rem,9vw,3.6rem)] w-auto drop-shadow-[0_8px_8px_rgb(0_0_0/0.35)]"
                          style={{
                            ["--sc-hole" as string]: "var(--color-xisto-2)",
                          }}
                        />
                      </span>
                      <span
                        className={`mt-1.5 hidden text-[0.68rem] leading-tight transition-opacity xl:block ${on ? "opacity-100" : "opacity-50"}`}
                      >
                        {unit.name}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
          <p className="mt-4 text-xs text-cal/55">
            {copy.vatNote} {rooms.photoNote}
          </p>
        </div>

        <div className="sc-board-rooms grid gap-16 sm:gap-20 [.sc-board-on_&]:block">
          {seteChavesUnits.map((unit, i) => (
            <Room key={unit.id} unit={unit} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Room({ unit, index }: { unit: SeteChavesUnit; index: number }) {
  const { rooms, plusVat, perNight } = copy;
  const photo = seteChavesPhotos[unit.photo];
  return (
    <article
      id={roomAnchor(unit)}
      aria-labelledby={`sc-room-${unit.id}`}
      data-room={index}
      className="sc-room relative flex flex-col [.sc-board-on_&]:pt-24 [.sc-board-on_&]:pb-10"
    >
      {/* Phones: heading first, then the photo, then the details (owner's mobile order). */}
      <header
        data-room-info
        className="mb-5 flex items-end justify-between gap-4 [.sc-board-on_&]:mb-4"
      >
        <div>
          <p className="sc-label text-latao-claro">
            {rooms.keyLabel(unit.key)} · {unit.kind}
          </p>
          <h3
            id={`sc-room-${unit.id}`}
            className="mt-2 font-display text-[clamp(2.2rem,8vw,3rem)] leading-none [.sc-board-on_&]:text-[clamp(2.2rem,3.2vw,3rem)]"
          >
            {unit.name}
          </h3>
        </div>
      </header>

      <div
        data-room-photo
        className="relative overflow-hidden rounded-[1.6rem] bg-xisto-2 [.sc-board-on_&]:min-h-0 [.sc-board-on_&]:flex-[1_1_0%]"
      >
        <div
          data-room-img={index}
          className="relative aspect-[4/3] h-full w-full will-change-transform sm:aspect-[16/10] [.sc-board-on_&]:aspect-auto"
        >
          <Image
            src={photo.src}
            alt={unit.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(38_44_51/0.45))]"
        />
        {/* The room's key, hanging over the corner of its photo. */}
        <span
          data-card-fob
          aria-hidden="true"
          className="absolute top-0 right-5 block origin-[50%_0] [.sc-board-on_&]:hidden"
        >
          <FobMark
            number={unit.key}
            ring={false}
            gradientId={`sc-brass-card-${unit.key}`}
            className="h-16 w-auto drop-shadow-[0_10px_10px_rgb(0_0_0/0.35)]"
            style={{ ["--sc-hole" as string]: "var(--color-xisto)" }}
          />
        </span>
      </div>

      <div
        data-room-info
        className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] sm:gap-8 [.sc-board-on_&]:mt-7"
      >
        <div>
          <p className="leading-relaxed text-cal/80">{unit.text}</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.92rem] text-cal/85">
            <li className="flex items-center gap-2">
              <UsersIcon width={17} height={17} className="text-latao-claro" />{" "}
              {rooms.guests(unit.guests)}
            </li>
            <li className="flex items-center gap-2">
              <BedIcon width={17} height={17} className="text-latao-claro" />{" "}
              {unit.beds}
            </li>
            <li className="text-cal/60">{unit.size}</li>
          </ul>
          <ul className="mt-4 grid grid-cols-1 gap-1.5 text-[0.9rem] text-cal/75 min-[420px]:grid-cols-2">
            {unit.amenities.map((a) => (
              <li key={a} className="flex items-start gap-2">
                <CheckIcon
                  width={16}
                  height={16}
                  className="mt-0.5 shrink-0 text-latao-claro"
                />
                {a}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 rounded-[1.4rem] bg-xisto-2/80 p-5">
          <p className="sc-label text-cal/60">{rooms.from}</p>
          <dl className="grid gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-cal/70">{rooms.low}</dt>
              <dd className="text-right">
                <span className="font-display text-[1.9rem] leading-none">
                  {seteChavesPrice(unit.priceLow)}
                </span>{" "}
                <span className="text-[0.7rem] font-semibold tracking-[0.1em] text-latao-claro">
                  {plusVat}
                </span>
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-cal/70">{rooms.peak}</dt>
              <dd className="text-right">
                <span className="font-display text-[1.9rem] leading-none">
                  {seteChavesPrice(unit.pricePeak)}
                </span>{" "}
                <span className="text-[0.7rem] font-semibold tracking-[0.1em] text-latao-claro">
                  {plusVat}
                </span>
              </dd>
            </div>
          </dl>
          <p className="text-xs text-cal/60">
            {perNight} ·{" "}
            {unit.breakfast === "incluído"
              ? rooms.breakfastIncluded
              : rooms.breakfastOptional}
          </p>
          <a
            href={`#${seteChavesSections.book}`}
            onClick={() => pickKey(unit.id)}
            className="sc-brass mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[0.78rem] font-semibold tracking-[0.12em] text-tinta uppercase transition-[filter] hover:brightness-110"
          >
            {rooms.book}
            <ArrowIcon width={16} height={16} />
          </a>
        </div>
      </div>
    </article>
  );
}
