"use client";

import dynamic from "next/dynamic";
import { memo, startTransition, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import { preload } from "react-dom";
import { formatMenuPrice, languageLocales, localizeMenu, menuText, type MenuLanguage } from "@/lib/video-menus/i18n";
import { bunnyThumbnail, type MenuDish, type VideoMenuData } from "@/lib/video-menus/rules";
import { AddToOrder, type MenuOrderingConfig } from "./AddToOrder";
import { BunnyVideo, bunnyEarlyScript, hasBunnyVideo } from "./BunnyVideo";
import { LanguagePicker } from "./LanguagePicker";
import { chooseMenuLanguage, useMenuLanguage } from "./menu-language";
import { hideIfBroken, pictureGuard } from "./safe-picture";
import { ShortsViewer, type ShortItem } from "./VideoShorts";

/** Ordering: its code comes only on a table's page (/m/<token>) or a demo menu's link with demo orders, after the menu. */
const TableOrdering = dynamic(() => import("./ordering/TableOrdering"), { ssr: false });

/** The business's colours (Dolci e Salati's logo), for accents only: the page keeps the theme's text and background. */
const brand = { "--menu-accent": "#c23d7a", "--menu-accent-soft": "rgba(226, 99, 155, 0.14)" } as CSSProperties;

/** A section's place in the page (☰ scrolls to it). */
const sectionId = (id: string) => `seccao-${id}`;
/** A section counts as the one on screen once its start is above this share of the screen. */
const sectionLine = 0.35;
/** The collections panel closes when dragged this share of its width to the right (or flicked). */
const sheetCloseShare = 0.3;
const sheetCloseSpeed = 0.5; // px per ms
const sheetSlideMs = 260;

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/**
 * A dish of the grid: its own video over its picture; a tap opens it full screen. Drawn
 * again only when its own props change (redrawing every card as the page scrolled made the scroll
 * stutter on an iPhone, 2026-10-16).
 */
const DishCard = memo(function DishCard({
  order,
  dishKey,
  dish,
  orderable,
  language,
  onStarted,
  onOpen,
}: {
  order: number;
  dishKey: string;
  dish: MenuDish;
  /** The menu's language (the dish comes already in it): the price's format and the labels. */
  language: MenuLanguage;
  /** A table's menu: «Adicionar» under the dish (its count is its own, the card isn't redrawn). */
  orderable: boolean;
  /** One of the first cards shows its video playing (the opening ends once they do). */
  onStarted: (order: number) => void;
  onOpen: (order: number) => void;
}) {
  const early = order < earlyCards;
  return (
    <li className="flex flex-col gap-2">
      <button type="button" onClick={() => onOpen(order)} aria-label={menuText[language].fullScreen(dish.name)} className="block w-full text-left">
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-surface-2" style={{ clipPath: "inset(0 round 0.75rem)" }}>
          {hasBunnyVideo(dish.bunny) ? <BunnyVideo id={dish.bunny} thumbnail={dish.bunnyThumbnail} early={early} onShown={early ? () => onStarted(order) : undefined} /> : null}
        </div>
      </button>
      <div className="flex flex-col gap-0.5 px-0.5">
        {/* A word too long to sit beside the price (German, 320 px) sends the price to the next line instead of being cut. */}
        <div className="flex flex-wrap items-start justify-between gap-x-2">
          <span className="flex-[1_1_0%] text-sm leading-snug font-semibold break-words hyphens-auto text-text">{dish.name}</span>
          <span className="ml-auto shrink-0 text-sm font-semibold" style={{ color: "var(--menu-accent)" }}>
            {formatMenuPrice(dish.price, language)}
          </span>
        </div>
        <p className="line-clamp-2 text-xs leading-snug break-words hyphens-auto text-muted">{dish.description}</p>
      </div>
      {orderable ? (
        <div className="mt-auto">
          <AddToOrder dish={dishKey} name={dish.name} language={language} />
        </div>
      ) : null}
    </li>
  );
});

/** The first cards (a phone's first screen): on an iPhone their videos start loading with the page. */
const earlyCards = 4;

/** Tiles of the mosaic opening: 4 columns of 7 rows, filling the screen (and beyond, it is tilted). */
const mosaicColumns = 4;
const mosaicTiles = 28;
/**
 * The mosaic repeats this many dishes' pictures, asked for first and before everything else (the page's
 * head preloads them): with one picture per dish (26) asked at a low priority with the page's code and
 * the cards', its tiles were still empty at 1.8 s and mostly at 3.2 s (2026-10-19).
 */
const mosaicPictures = 12;
/**
 * The mosaic's ending starts once it has shown this long and the videos on screen are playing (owner, 2026-10-14: «quando acabar a animação os vídeos estejam a dar»), or at the
 * latest at mosaicWaitMax; it takes mosaicExitMs (ms).
 */
const mosaicExitAt = 2050;
const mosaicWaitMax = 2600;
const mosaicExitMs = 700;

/**
 * The opening (owner, 2026-10-14, back to the mosaic's first ending: the circle of «B», a mask redrawn
 * every frame, stuttered on an iPhone while the videos loaded): the dishes' thumbnails rise into a
 * tilted mosaic from the centre outwards, the logo comes into focus over them, then everything zooms
 * in and fades into the menu. Opacity and transforms only. The videos load and play behind it.
 */
function MosaicSplash({ logo, pictures, ready, onDone }: { logo: string; pictures: string[]; ready: boolean; onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");
  const [waited, setWaited] = useState<"no" | "enough" | "max">("no");
  const rows = Math.ceil(mosaicTiles / mosaicColumns);

  useEffect(() => {
    const enough = window.setTimeout(() => setWaited("enough"), mosaicExitAt);
    const max = window.setTimeout(() => setWaited("max"), mosaicWaitMax);
    return () => {
      window.clearTimeout(enough);
      window.clearTimeout(max);
    };
  }, []);
  // Once it leaves it keeps leaving (a video buffering again later does not bring it back).
  if (phase === "in" && (waited === "max" || (waited === "enough" && ready))) setPhase("out");
  useEffect(() => {
    if (phase !== "out") return;
    const end = window.setTimeout(() => {
      setPhase("done");
      onDone();
    }, mosaicExitMs);
    return () => window.clearTimeout(end);
  }, [phase, onDone]);

  if (phase === "done") return null;
  for (const picture of [logo, ...pictures]) preload(picture, { as: "image", fetchPriority: "high" });
  const out = phase === "out";
  return (
    <div aria-hidden="true" className={`fixed inset-0 z-[100] overflow-hidden ${out ? "menu-mosaic-out" : ""}`} style={{ background: "#fbe3ee" }}>
      <div className="absolute inset-0">
        <div className="menu-mosaic absolute grid gap-2.5" style={{ gridTemplateColumns: `repeat(${mosaicColumns}, minmax(0, 1fr))` }}>
          {Array.from({ length: mosaicTiles }, (_, index) => {
            // From the centre outwards.
            const distance = Math.hypot((index % mosaicColumns) - (mosaicColumns - 1) / 2, Math.floor(index / mosaicColumns) - (rows - 1) / 2);
            return (
              <div key={index} className="menu-mosaic-tile relative aspect-[9/16] overflow-hidden rounded-2xl bg-white/60 shadow-lg" style={{ animationDelay: `${Math.round(distance * 110)}ms` }}>
                {pictures.length ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img ref={hideIfBroken} src={pictures[index % pictures.length]} alt="" fetchPriority="high" decoding="async" {...pictureGuard} className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
              </div>
            );
          })}
        </div>
        {/* A soft light behind the logo so it reads over the pictures. */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 46%, rgba(255,250,252,0.92) 0%, rgba(255,250,252,0.55) 26%, rgba(255,250,252,0) 52%)" }} />
      </div>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        {/* Only the logo: it already is the name (owner, 2026-10-19). */}
        <div className="menu-mosaic-mark flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={hideIfBroken} src={logo} alt="" width={168} height={168} fetchPriority="high" {...pictureGuard} className="h-42 w-42 rounded-full shadow-[0_20px_60px_rgba(194,61,122,0.35)]" />
        </div>
      </div>
    </div>
  );
}

/**
 * A digital menu in videos (owner, 2026-10-14): the business's logo and the section on screen in the
 * bar. Every collection is on the page, one section after the other (owner, 2026-10-19; no «Todos»):
 * ☰ lists them and scrolls to one. A tap on a dish opens it full screen, one dish per screen, and a
 * swipe goes on through the dishes in the page's order. Every dish plays its own video (BunnyVideo) in
 * its card and in its slide; YouTube's players are gone (owner, 2026-10-16).
 */
export function VideoMenu({
  menu: source,
  demo = false,
  ordering,
}: {
  menu: VideoMenuData;
  /** Demo menus (isDemoMenu): say their videos and prices are examples. */
  demo?: boolean;
  /** A table's page with ordering on (or a demo menu's link with demo orders): «Adicionar» on each dish and the order. */
  ordering?: MenuOrderingConfig;
}) {
  const orderable = Boolean(ordering);
  // The menu in the customer's language (owner, 2026-10-19): drawn in Portuguese on the server, then in
  // the language picked on the phone; only the words change (the cards keep their keys and videos).
  const language = useMenuLanguage();
  const menu = useMemo(() => localizeMenu(source, language), [source, language]);
  const text = menuText[language];
  useEffect(() => {
    document.documentElement.lang = languageLocales[language];
  }, [language]);
  const sections = menu.collections;
  const labelled = useMemo(() => sections.filter((section) => section.name), [sections]);
  // Every card of the page in its order (a dish in several collections is in each section), and where
  // each section's cards start in it.
  const page = useMemo(() => {
    const cards: { section: string; key: string }[] = [];
    const starts: number[] = [];
    for (const section of sections) {
      starts.push(cards.length);
      for (const key of section.dishes) if (menu.dishes[key]) cards.push({ section: section.id, key });
    }
    return { cards, starts };
  }, [sections, menu.dishes]);
  // Full screen: the dishes in the page's order from the one tapped on, never the same dish twice in a
  // row (the end of a section and the start of the next); `at` maps a card to its slide.
  const sequence = useMemo(() => {
    const slides: { section: string; key: string }[] = [];
    const at: number[] = [];
    for (const card of page.cards) {
      if (slides.length && slides[slides.length - 1].key === card.key) {
        at.push(slides.length - 1);
        continue;
      }
      at.push(slides.length);
      slides.push(card);
    }
    return { slides, at };
  }, [page]);
  // The section on screen (in the bar and highlighted in ☰).
  const [onScreen, setOnScreen] = useState(sections[0].id);
  // What the page opens on: its first dishes (their pictures in the opening).
  const [opening] = useState(() => {
    const pictureOf = (dish: MenuDish) => (hasBunnyVideo(dish.bunny) ? bunnyThumbnail(dish.bunny, dish.bunnyThumbnail) : null);
    const pictures = [...new Set(page.cards.map((card) => pictureOf(menu.dishes[card.key])).filter((picture): picture is string => Boolean(picture)))];
    return {
      pictures: pictures.slice(0, mosaicPictures),
      // The cards whose videos the opening waits for (it leaves at the latest at mosaicWaitMax).
      awaited: Math.min(earlyCards, page.cards.length),
    };
  });
  const [sheet, setSheet] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; at: number; mode: "drag" | "scroll" | null } | null>(null);
  // The card opened full screen (its place in the page).
  const [viewer, setViewer] = useState<number | null>(null);
  // A section chosen in ☰: the page scrolls to it once the panel has gone (an iPhone drops a smooth
  // scroll while the panel holds the page still).
  const jump = useRef<string | null>(null);
  // The first cards showing their videos playing: the opening ends once they all do (owner,
  // 2026-10-14: «quando acabar a animação os vídeos estejam a dar»).
  const started = useRef(new Set<number>());
  const [startedCount, setStartedCount] = useState(0);
  const onStarted = useCallback((order: number) => {
    started.current.add(order);
    setStartedCount(started.current.size);
  }, []);
  // The videos on screen load and start, muted and hidden, while the opening plays (owner,
  // 2026-10-14): when it ends they are already playing. Nothing waits for the opening's end.
  const opened = useCallback(() => {}, []);

  // No «pull to refresh» on this page: in a long menu of videos it reloaded the page by accident (owner, 2026-10-14).
  useEffect(() => {
    const root = document.documentElement;
    const before = [root.style.overscrollBehaviorY, document.body.style.overscrollBehaviorY];
    root.style.overscrollBehaviorY = "none";
    document.body.style.overscrollBehaviorY = "none";
    // The panel and the full screen close through «back»: the browser would put back the scroll of
    // that moment (a section chosen in ☰, scrolled to, jumped back).
    const restoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      [root.style.overscrollBehaviorY, document.body.style.overscrollBehaviorY] = before;
      window.history.scrollRestoration = restoration;
    };
  }, []);

  const closeViewer = useCallback(() => setViewer(null), []);

  const current = sections.find((section) => section.id === onScreen) ?? sections[0];
  // Made once: the full screen reacts to a new list (a new one each render looped).
  const items: ShortItem[] = useMemo(
    () =>
      sequence.slides.map(({ section, key }) => ({ section, key, dish: menu.dishes[key] })).map(({ section, key, dish }) => ({
        key: `${section}-${key}`,
        bunny: dish.bunny,
        bunnyThumbnail: dish.bunnyThumbnail,
        title: dish.name,
        details: (
          <>
            <span className="font-semibold text-white">{formatMenuPrice(dish.price, language)}</span> · {dish.description}
          </>
        ),
        action: orderable ? <AddToOrder dish={key} name={dish.name} tone="dark" language={language} /> : undefined,
      })),
    [sequence, menu.dishes, orderable, language],
  );

  // The section on screen: the last one whose start is above sectionLine of the screen, watched by an
  // observer on each section's first line (no work on every scroll event).
  useEffect(() => {
    const starts = [...document.querySelectorAll<HTMLElement>("[data-section-start]")];
    if (starts.length < 2) return;
    const above = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const line = entry.rootBounds ? entry.rootBounds.bottom : window.innerHeight * sectionLine;
          above.set(entry.target.getAttribute("data-section-start") ?? "", entry.isIntersecting || entry.boundingClientRect.top < line);
        }
        let last = sections[0].id;
        for (const section of sections) if (above.get(section.id)) last = section.id;
        startTransition(() => setOnScreen(last));
      },
      { rootMargin: `0px 0px -${Math.round((1 - sectionLine) * 100)}% 0px` },
    );
    for (const start of starts) observer.observe(start);
    return () => observer.disconnect();
  }, [sections]);

  // The panel takes a step in the history (owner's iPhone: «back» with it open left the page and
  // reloaded the players): «back» closes it, and closing it otherwise takes that step back.
  const sheetEntry = useRef(false);
  const openSheet = () => {
    setSheet(true);
    window.history.pushState({ menuSheet: true }, "");
    sheetEntry.current = true;
  };
  const hideSheet = useCallback(() => {
    setSheetClosing(true);
    window.setTimeout(() => {
      setSheet(false);
      setSheetClosing(false);
      setDrag(0);
    }, sheetSlideMs);
  }, []);
  const closeSheet = useCallback(() => {
    if (sheetEntry.current) window.history.back();
    else hideSheet();
  }, [hideSheet]);
  useEffect(() => {
    const onPop = () => {
      if (!sheetEntry.current) return;
      sheetEntry.current = false;
      hideSheet();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [hideSheet]);

  // The collections panel: Esc closes it and the page behind stays put.
  useEffect(() => {
    if (!sheet) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeSheet();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet, closeSheet]);

  // A section chosen in ☰: the panel closes and the page scrolls to the section's start, under the bar
  // (at once with reduced motion).
  const choose = (id: string) => {
    jump.current = id;
    setOnScreen(id);
    closeSheet();
  };
  useEffect(() => {
    const id = jump.current;
    if (sheet || !id) return;
    jump.current = null;
    const target = document.getElementById(sectionId(id));
    if (!target) return;
    const bar = document.querySelector("header")?.getBoundingClientRect().height ?? 64;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - bar - 12), behavior: reduced ? "instant" : "smooth" });
  }, [sheet]);

  // Dragging the panel to the right closes it, following the finger (vertical moves scroll its list).
  const onSheetTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY, at: performance.now(), mode: null };
  };
  const onSheetTouchMove = (event: TouchEvent) => {
    const start = dragStart.current;
    if (!start) return;
    const touch = event.touches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (!start.mode && Math.max(Math.abs(dx), Math.abs(dy)) > 8) start.mode = Math.abs(dx) > Math.abs(dy) && dx > 0 ? "drag" : "scroll";
    if (start.mode === "drag") {
      setDragging(true);
      setDrag(Math.max(0, dx));
    }
  };
  const onSheetTouchEnd = (event: TouchEvent) => {
    const start = dragStart.current;
    dragStart.current = null;
    setDragging(false);
    if (!start || start.mode !== "drag") return;
    const width = (event.currentTarget as HTMLElement).offsetWidth || 1;
    const speed = drag / Math.max(1, performance.now() - start.at);
    if (drag > width * sheetCloseShare || speed > sheetCloseSpeed) closeSheet();
    else setDrag(0);
  };

  return (
    <div style={brand} lang={languageLocales[language]} className="relative min-h-dvh">
      {/* First in the page: the phone paints it before the menu under it (owner, 2026-10-16: at the end
          of the HTML, the grid showed for an instant before the opening). */}
      <MosaicSplash
        logo={menu.logo}
        pictures={opening.pictures}
        ready={startedCount >= opening.awaited}
        onDone={opened}
      />
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={hideIfBroken} src={menu.logo} alt={menu.business} width={44} height={44} {...pictureGuard} className="h-11 w-11 shrink-0 rounded-full" />
          <button type="button" onClick={openSheet} className="flex min-w-0 flex-1 flex-col items-start text-left" aria-label={labelled.length ? text.sectionAria(current.name || text.otherDishes) : text.openMenu}>
            <span className="text-xs text-muted">{menu.business}</span>
            <span className="flex max-w-full items-center gap-1 font-semibold text-text">
              <span className="truncate">{current.name || text.menu}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
          <LanguagePicker language={language} onChoose={chooseMenuLanguage} />
          <button type="button" onClick={openSheet} aria-label={text.openMenu} aria-expanded={sheet} className="-ml-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-text hover:bg-surface-2">
            <MenuIcon />
          </button>
        </div>
      </header>

      <main className={`mx-auto w-full max-w-5xl px-4 pt-5 ${orderable ? "pb-28" : "pb-12"}`}>
        <h1 className="sr-only">{menu.business}</h1>
        {sections.map((section, index) => {
          const cards = page.cards.slice(page.starts[index], page.starts[index + 1] ?? page.cards.length);
          return (
            <section key={section.id} id={sectionId(section.id)} aria-label={section.name || undefined} className={index ? "mt-10" : undefined}>
              <div data-section-start={section.id} aria-hidden="true" />
              {section.name ? (
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h2 className="display min-w-0 text-2xl break-words hyphens-auto">{section.name}</h2>
                  <span className="shrink-0 text-sm text-muted">{text.dishes(cards.length)}</span>
                </div>
              ) : null}
              <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
                {cards.map(({ key }, position) => (
                  <DishCard
                    key={`${section.id}-${key}`}
                    order={page.starts[index] + position}
                    dishKey={key}
                    dish={menu.dishes[key]}
                    orderable={orderable}
                    language={language}
                    onStarted={onStarted}
                    onOpen={setViewer}
                  />
                ))}
              </ul>
            </section>
          );
        })}
        {/* In the page's HTML only (React doesn't run it again): iPhone, the first cards' videos start with the page. */}
        <script dangerouslySetInnerHTML={{ __html: bunnyEarlyScript }} />
        {demo ? <p className="mt-10 text-center text-xs text-subtle">{text.demo}</p> : null}
      </main>

      {sheet ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            aria-label={text.closeMenu}
            onClick={closeSheet}
            className="menu-sheet-backdrop absolute inset-0 bg-black/40"
            style={{ opacity: sheetClosing ? 0 : Math.max(0, 1 - drag / 320), transition: dragging ? "none" : `opacity ${sheetSlideMs}ms ease` }}
          />
          <nav
            aria-label={text.sections}
            onTouchStart={onSheetTouchStart}
            onTouchMove={onSheetTouchMove}
            onTouchEnd={onSheetTouchEnd}
            className="menu-sheet absolute inset-y-0 right-0 flex w-[min(85vw,22rem)] touch-pan-y flex-col bg-bg shadow-2xl"
            style={{
              transform: sheetClosing ? "translateX(100%)" : `translateX(${drag}px)`,
              transition: dragging ? "none" : `transform ${sheetSlideMs}ms cubic-bezier(0.32, 0.72, 0, 1)`,
            }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={hideIfBroken} src={menu.logo} alt="" width={40} height={40} {...pictureGuard} className="h-10 w-10 rounded-full" />
              <span className="flex-1 font-semibold text-text">{menu.business}</span>
              <button type="button" onClick={closeSheet} aria-label={text.closeMenu} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {labelled.map((option) => {
                const selected = option.id === current.id;
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => choose(option.id)}
                      aria-current={selected ? "location" : undefined}
                      className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-4 text-left font-semibold text-text"
                      style={selected ? { background: "var(--menu-accent-soft)", color: "var(--menu-accent)" } : undefined}
                    >
                      <span>{option.name}</span>
                      <span className="text-sm font-normal text-muted">{option.dishes.length}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {menu.instagram ? (
              <a
                href={`https://www.instagram.com/${menu.instagram}/`}
                target="_blank"
                rel="noopener"
                className="border-t border-line px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-sm font-semibold"
                style={{ color: "var(--menu-accent)" }}
              >
                {text.instagram(menu.instagram)}
              </a>
            ) : null}
          </nav>
        </div>
      ) : null}

      {ordering ? <TableOrdering config={ordering} dishes={menu.dishes} /> : null}

      {viewer !== null ? (
        <ShortsViewer items={items} start={sequence.at[viewer] ?? 0} label={menu.business} closeLabel={text.close} slideLabel={text.slideAria} onClose={closeViewer} />
      ) : null}
    </div>
  );
}
