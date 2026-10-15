"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import type { MenuDish, VideoMenuData } from "@/content/demo-menu";
import { dishPicture } from "@/lib/video-menus/rules";
import { poolSize, VideoPool, type PoolTarget } from "./VideoPool";
import { BunnyVideo, hasBunnyVideo } from "./BunnyVideo";
import { restingMotion, ShortCover, ShortsViewer, type ShortItem, type ViewerMotion } from "./VideoShorts";

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

/** The business's colours (Dolci e Salati's logo), for accents only: the page keeps the theme's text and background. */
const brand = { "--menu-accent": "#c23d7a", "--menu-accent-soft": "rgba(226, 99, 155, 0.14)" } as CSSProperties;

/**
 * In the grid every dish on screen plays (up to `focusCount`, the four of two rows; one player each).
 * Recomputed this soon after the scroll moves (ms).
 */
const focusAfter = 120;
const focusCount = 4;
/** The next row (in the scroll's direction) plays hidden, so it is moving as it appears. */
const aheadCount = poolSize - focusCount;
/** Changing collection: the panel stays until the new collection's videos play, at most this long (ms). */
const switchWaitMs = 2500;
/**
 * A new collection starts at its top (owner, 2026-10-14). At once: the page scrolls smoothly by
 * default, and a smooth scroll is dropped while the panel holds the page still (iPhone).
 */
const toTop = () => window.scrollTo({ top: 0, behavior: "instant" });
/** A card must be at least this much on screen to play. */
const focusMinRatio = 0.4;
/** The collections panel closes when dragged this share of its width to the right (or flicked). */
const sheetCloseShare = 0.3;
const sheetCloseSpeed = 0.5; // px per ms
const sheetSlideMs = 260;

/** Same targets (by what the pool uses), so an unchanged list never re-renders the pool. */
const sameTargets = (a: PoolTarget[], b: PoolTarget[]) =>
  a.length === b.length &&
  a.every((target, index) => {
    const other = b[index];
    return target.key === other.key && target.video === other.video && target.element === other.element && target.fixed === other.fixed && target.play === other.play && target.prime === other.prime && target.visible === other.visible;
  });

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/** A dish of the grid: its thumbnail, covered by one of the pool's players when it plays; a tap opens the collection full screen. */
function DishCard({
  id,
  order,
  dish,
  onSeen,
  onBox,
  onOpen,
}: {
  id: string;
  order: number;
  dish: MenuDish;
  onSeen: (id: string, order: number, ratio: number) => void;
  onBox: (id: string, box: HTMLDivElement | null) => void;
  onOpen: () => void;
}) {
  const holder = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = holder.current;
    onBox(id, element);
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => onSeen(id, order, entry.intersectionRatio), { threshold: [0, 0.25, 0.5, 0.6, 0.75, 0.9, 1] });
    observer.observe(element);
    return () => {
      observer.disconnect();
      onBox(id, null);
    };
  }, [id, order, onSeen, onBox]);
  return (
    <li className="flex flex-col gap-2">
      <button type="button" onClick={onOpen} aria-label={`Ver em ecrã inteiro: ${dish.name}`} className="block w-full text-left">
        <div ref={holder} className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-surface-2" style={{ clipPath: "inset(0 round 0.75rem)" }}>
          {hasBunnyVideo(dish.bunny) ? <BunnyVideo id={dish.bunny} thumbnail={dish.bunnyThumbnail} /> : dish.video ? <ShortCover video={dish.video} /> : null}
        </div>
      </button>
      <div className="flex flex-col gap-0.5 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <span className="min-w-0 text-sm leading-snug font-semibold text-text">{dish.name}</span>
          <span className="shrink-0 text-sm font-semibold" style={{ color: "var(--menu-accent)" }}>
            {euro.format(dish.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-xs leading-snug text-muted">{dish.description}</p>
      </div>
    </li>
  );
}

/** The dish plays in one of the pool's YouTube players (not its own Bunny video). */
const usesPool = (dish?: MenuDish) => Boolean(dish?.video && !hasBunnyVideo(dish.bunny));

/** Tiles of the mosaic opening: 4 columns of 7 rows, filling the screen (and beyond, it is tilted). */
const mosaicColumns = 4;
const mosaicTiles = 28;
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
function MosaicSplash({ logo, business, pictures, ready, onDone }: { logo: string; business: string; pictures: string[]; ready: boolean; onDone: () => void }) {
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
                  <img src={pictures[index % pictures.length]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
              </div>
            );
          })}
        </div>
        {/* A soft light behind the logo so it reads over the pictures. */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 46%, rgba(255,250,252,0.92) 0%, rgba(255,250,252,0.55) 26%, rgba(255,250,252,0) 52%)" }} />
      </div>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="menu-mosaic-mark flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={168} height={168} className="h-42 w-42 rounded-full shadow-[0_20px_60px_rgba(194,61,122,0.35)]" />
          <span className="display text-2xl" style={{ color: "#5f2a44" }}>
            {business}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * A digital menu in videos (owner, 2026-10-14): the business's logo and the collection on screen in
 * the bar, ☰ opens the list of collections (the first opens by default); a tap on a dish opens the
 * collection full screen, one dish per screen. Every video plays in a fixed pool of players
 * (VideoPool), never created again: the cards and slides hold thumbnails.
 */
export function VideoMenu({ menu, demo = false }: { menu: VideoMenuData; /** The demo page (/raza17raza): says its videos and prices are examples. */ demo?: boolean }) {
  const [active, setActive] = useState(menu.collections[0].id);
  // What the page opens on: the first collection's dishes (their players in the HTML, their pictures in the opening).
  const [opening] = useState(() => {
    const firstDishes = (menu.collections[0]?.dishes ?? []).map((key) => menu.dishes[key]).filter((dish) => Boolean(dish));
    // The dishes' pictures: their own (Bunny) video's, else their YouTube video's.
    const pictureOf = (dish: MenuDish) => dishPicture({ video_id: dish.video ?? null, bunny_video_id: hasBunnyVideo(dish.bunny) ? dish.bunny : null, bunny_thumbnail: dish.bunnyThumbnail });
    const pictures = firstDishes.map(pictureOf).filter((picture): picture is string => Boolean(picture));
    // Only YouTube dishes get pool players in the HTML (a Bunny one plays its own <video>).
    const first = firstDishes.slice(0, 4).flatMap((dish) => (!hasBunnyVideo(dish.bunny) && dish.video ? [dish.video] : []));
    return { first, pictures: pictures.length >= 4 ? pictures : Object.values(menu.dishes).map(pictureOf).filter((picture): picture is string => Boolean(picture)) };
  });
  const [sheet, setSheet] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; at: number; mode: "drag" | "scroll" | null } | null>(null);
  const [viewer, setViewer] = useState<number | null>(null);
  const [viewerTargets, setViewerTargetsState] = useState<PoolTarget[]>([]);
  const setViewerTargets = useCallback((next: PoolTarget[]) => setViewerTargetsState((previous) => (sameTargets(previous, next) ? previous : next)), []);
  const [gridTargets, setGridTargets] = useState<PoolTarget[]>([]);
  // The full screen dragged to close: the pool's player there moves with it.
  const [viewerMotion, setViewerMotion] = useState<ViewerMotion>(restingMotion);
  // The collection being switched to: the panel stays open until its videos play.
  const [switching, setSwitching] = useState<string | null>(null);
  // Targets (grid-<dish>) whose player is showing the video: from the pool.
  const [ready, setReady] = useState<string[]>([]);
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
    // that moment (a new collection, scrolled to its top, jumped down again).
    const restoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      [root.style.overscrollBehaviorY, document.body.style.overscrollBehaviorY] = before;
      window.history.scrollRestoration = restoration;
    };
  }, []);

  const closeViewer = useCallback(() => {
    setViewer(null);
    setViewerTargets([]);
    setViewerMotion(restingMotion);
  }, [setViewerTargets]);

  // The grid's playing dishes: how much of each card is on screen, and the most visible ones.
  const ratios = useRef(new Map<string, { order: number; ratio: number }>());
  const focusTimer = useRef<number | undefined>(undefined);
  const [focus, setFocus] = useState<{ visible: string[] }>({ visible: [] });
  // Which way the page last scrolled (the row ahead is below, or above).
  const scrollingUp = useRef(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      if (window.scrollY !== last) scrollingUp.current = window.scrollY < last;
      last = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const seen = useCallback((key: string, order: number, ratio: number) => {
    ratios.current.set(key, { order, ratio });
    window.clearTimeout(focusTimer.current);
    focusTimer.current = window.setTimeout(() => {
      // The most visible dishes; on a tie, the ones higher in the grid (the same row, side by side).
      const ranked = [...ratios.current]
        .filter(([, entry]) => entry.ratio >= focusMinRatio)
        .sort(([, a], [, b]) => b.ratio - a.ratio || a.order - b.order)
        .slice(0, focusCount)
        .sort(([, a], [, b]) => a.order - b.order);
      setFocus({ visible: ranked.map(([candidate]) => candidate) });
    }, focusAfter);
  }, []);
  const boxes = useRef(new Map<string, HTMLDivElement>());
  const onBox = useCallback((key: string, box: HTMLDivElement | null) => {
    if (box) boxes.current.set(key, box);
    else boxes.current.delete(key);
  }, []);

  const collection = menu.collections.find((candidate) => candidate.id === active) ?? menu.collections[0];
  const dishes = useMemo(() => collection.dishes.map((key) => ({ key, dish: menu.dishes[key] })), [collection, menu.dishes]);
  // Made once per collection: the full screen reacts to a new list (a new one each render looped).
  const items: ShortItem[] = useMemo(
    () =>
      dishes.map(({ key, dish }) => ({
        key,
        video: dish.video,
        bunny: dish.bunny,
        bunnyThumbnail: dish.bunnyThumbnail,
        title: dish.name,
        details: (
          <>
            <span className="font-semibold text-white">{euro.format(dish.price)}</span> · {dish.description}
          </>
        ),
      })),
    [dishes],
  );

  // What the grid asks of the pool: the dishes on screen playing and shown. Nothing pauses under the
  // collections panel: a video paused and played again shows YouTube's ⏸ on an iPhone. While switching
  // collection, the new videos load behind it.
  useEffect(() => {
    const target = (key: string, visible: boolean): PoolTarget[] => {
      const dish = menu.dishes[key];
      const element = boxes.current.get(key) ?? null;
      // A dish with its own (Bunny) video plays it in its card: no pool player.
      if (!dish?.video || hasBunnyVideo(dish.bunny)) return [];
      return element ? [{ key: `grid-${key}`, video: dish.video, element, fixed: false, play: visible, prime: !visible, visible }] : [];
    };
    // The row ahead: the next dishes in the list after those on screen (before them, scrolling up).
    // Not while switching collection (the dishes on screen load first).
    const keys = dishes.map(({ key }) => key);
    const orders = focus.visible.map((key) => keys.indexOf(key)).filter((order) => order >= 0);
    const ahead =
      switching || !orders.length
        ? []
        : Array.from({ length: aheadCount }, (_, step) => (scrollingUp.current ? Math.min(...orders) - 1 - step : Math.max(...orders) + 1 + step))
            .filter((order) => order >= 0 && order < keys.length)
            .map((order) => keys[order]);
    const next = [...focus.visible.flatMap((key) => target(key, true)), ...ahead.flatMap((key) => target(key, false))];
    setGridTargets((previous) => (sameTargets(previous, next) ? previous : next));
  }, [focus, menu.dishes, dishes, switching]);
  // While the full screen is open, the players it leaves keep playing grid dishes behind it (seen as
  // it is dragged away); the full screen's own videos first.
  const poolTargets = useMemo(() => {
    if (viewer === null || !viewerTargets.length) return gridTargets;
    const videos = new Set(viewerTargets.map((target) => target.video));
    const behind = gridTargets.filter((target) => !videos.has(target.video));
    return [...viewerTargets, ...behind].slice(0, poolSize);
  }, [viewer, viewerTargets, gridTargets]);

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

  // Another collection: its grid is built behind the panel and its videos start; the panel closes
  // once those on screen are playing (or after switchWaitMs), so the new grid appears already moving.
  const choose = (id: string) => {
    if (id === collection.id) {
      closeSheet();
      return;
    }
    ratios.current.clear();
    setFocus({ visible: [] });
    setActive(id);
    setSwitching(id);
    toTop();
  };
  useEffect(() => {
    if (!switching) return;
    const done = () => {
      toTop();
      setSwitching(null);
      closeSheet();
    };
    if (focus.visible.length && focus.visible.every((key) => !usesPool(menu.dishes[key]) || ready.includes(`grid-${key}`))) {
      done();
      return;
    }
    const timer = window.setTimeout(done, switchWaitMs);
    return () => window.clearTimeout(timer);
  }, [switching, focus, ready, closeSheet, menu.dishes]);

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
    <div style={brand} className="relative min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={menu.logo} alt={menu.business} width={44} height={44} className="h-11 w-11 shrink-0 rounded-full" />
          <button type="button" onClick={openSheet} className="flex min-w-0 flex-1 flex-col items-start text-left" aria-label={`Coleção: ${collection.name}. Mudar de coleção`}>
            <span className="text-xs text-muted">{menu.business}</span>
            <span className="flex max-w-full items-center gap-1 font-semibold text-text">
              <span className="truncate">{collection.name}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
          <button type="button" onClick={openSheet} aria-label="Abrir o menu" aria-expanded={sheet} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-text hover:bg-surface-2">
            <MenuIcon />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pt-5 pb-12">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h1 className="display text-2xl">{collection.name}</h1>
          <span className="text-sm text-muted">{dishes.length} pratos</span>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
          {dishes.map(({ key, dish }, index) => (
            <DishCard key={`${collection.id}-${key}`} id={key} order={index} dish={dish} onSeen={seen} onBox={onBox} onOpen={() => setViewer(index)} />
          ))}
        </ul>
        {demo ? <p className="mt-10 text-center text-xs text-subtle">Menu de demonstração: vídeos de banco de imagens e preços de exemplo.</p> : null}
      </main>

      {sheet ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            aria-label="Fechar o menu"
            onClick={closeSheet}
            className="menu-sheet-backdrop absolute inset-0 bg-black/40"
            style={{ opacity: sheetClosing ? 0 : Math.max(0, 1 - drag / 320), transition: dragging ? "none" : `opacity ${sheetSlideMs}ms ease` }}
          />
          <nav
            aria-label="Coleções do menu"
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
              <img src={menu.logo} alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
              <span className="flex-1 font-semibold text-text">{menu.business}</span>
              <button type="button" onClick={closeSheet} aria-label="Fechar o menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {menu.collections.map((option) => {
                const current = option.id === collection.id;
                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => choose(option.id)}
                      aria-current={current ? "page" : undefined}
                      className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-4 text-left font-semibold text-text"
                      style={current ? { background: "var(--menu-accent-soft)", color: "var(--menu-accent)" } : undefined}
                    >
                      <span>{option.name}</span>
                      {switching === option.id ? (
                        <span role="status" aria-label="A carregar os vídeos" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <span className="text-sm font-normal text-muted">{option.dishes.length}</span>
                      )}
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
                @{menu.instagram} no Instagram
              </a>
            ) : null}
          </nav>
        </div>
      ) : null}

      {viewer !== null ? (
        <ShortsViewer
          items={items}
          start={viewer}
          label={`${menu.business}: ${collection.name}`}
          onTargets={setViewerTargets}
          onMotion={setViewerMotion}
          onClose={closeViewer}
        />
      ) : null}
      <VideoPool targets={poolTargets} enabled motion={viewerMotion} onReady={setReady} first={opening.first} />
      <MosaicSplash
        logo={menu.logo}
        business={menu.business}
        pictures={opening.pictures}
        ready={focus.visible.length > 0 && focus.visible.every((key) => !usesPool(menu.dishes[key]) || ready.includes(`grid-${key}`))}
        onDone={opened}
      />
    </div>
  );
}
