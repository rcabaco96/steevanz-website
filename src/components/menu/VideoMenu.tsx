"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent } from "react";
import type { MenuDish, VideoMenuData } from "@/content/demo-menu";
import { VideoPool, type PoolTarget } from "./VideoPool";
import { ShortCover, ShortsViewer, type ShortItem } from "./VideoShorts";

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

/** The business's colours (Dolci e Salati's logo), for accents only: the page keeps the theme's text and background. */
const brand = { "--menu-accent": "#c23d7a", "--menu-accent-soft": "rgba(226, 99, 155, 0.14)" } as CSSProperties;

/**
 * In the grid every dish on screen plays (up to `focusCount`, the four of two rows; owner 2026-10-14:
 * «devem começar logo os vídeos que aparecem no ecrã»), once the scroll has stopped this long (ms), in
 * the players of the pool (VideoPool).
 */
const focusAfter = 350;
const focusCount = 4;
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
    return target.key === other.key && target.video === other.video && target.element === other.element && target.fixed === other.fixed && target.play === other.play && target.visible === other.visible;
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
          <ShortCover video={dish.video} />
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

/**
 * The opening (owner, 2026-10-14, «B»: a circular reveal): on the business's colours, the logo comes
 * into focus (blur to sharp) with its name; then a circle opens from the logo like a lens and reveals
 * the menu behind, while the logo grows and fades. ~2 s. The circle is a mask whose radius is a
 * registered CSS property (--menu-reveal); where that isn't supported, the cover leaves after 3 s.
 * Drawn by the server, so it covers the page from the first frame; `onDone` lets the videos start.
 */
function MenuSplash({ logo, business, onDone }: { logo: string; business: string; onDone: () => void }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => {
    setDone(true);
    onDone();
  }, [onDone]);
  useEffect(() => {
    const timer = window.setTimeout(finish, 3000);
    return () => window.clearTimeout(timer);
  }, [finish]);
  if (done) return null;
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[100]">
      <div
        className="menu-splash-bg absolute inset-0"
        onAnimationEnd={(event) => event.target === event.currentTarget && finish()}
        style={{ background: "radial-gradient(circle at 50% 45%, #ffffff 0%, #fde7f0 55%, #f6c9dc 100%)" }}
      />
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="menu-splash-mark flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={176} height={176} className="h-44 w-44 rounded-full shadow-[0_18px_50px_rgba(194,61,122,0.28)]" />
          <span className="display text-2xl" style={{ color: "#5f2a44" }}>
            {business}
          </span>
        </div>
      </div>
    </div>
  );
}

/** The openings tried (owner, 2026-10-14): «C» the mosaic of dishes, «B» the circular reveal. */
export type MenuOpening = "mosaic" | "reveal";

/** Tiles of the mosaic opening: 4 columns of 7 rows, filling the screen (and beyond, it is tilted). */
const mosaicColumns = 4;
const mosaicTiles = 28;

/**
 * The opening «C» (owner, 2026-10-14): the dishes' thumbnails rise into a tilted mosaic, from the
 * centre outwards, the logo comes into focus over them, then everything zooms in and fades into the
 * menu. ~2.2 s, opacity and transforms only. The thumbnails are YouTube's (the ones the cards show).
 */
function MosaicSplash({ logo, business, videos, onDone }: { logo: string; business: string; videos: string[]; onDone: () => void }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => {
    setDone(true);
    onDone();
  }, [onDone]);
  useEffect(() => {
    const timer = window.setTimeout(finish, 3200);
    return () => window.clearTimeout(timer);
  }, [finish]);
  if (done) return null;
  const rows = Math.ceil(mosaicTiles / mosaicColumns);
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden" style={{ background: "#fbe3ee" }}>
      <div className="menu-mosaic-scene absolute inset-0" onAnimationEnd={(event) => event.target === event.currentTarget && finish()}>
        <div className="menu-mosaic absolute grid gap-2.5" style={{ gridTemplateColumns: `repeat(${mosaicColumns}, minmax(0, 1fr))` }}>
          {Array.from({ length: mosaicTiles }, (_, index) => {
            const column = index % mosaicColumns;
            const row = Math.floor(index / mosaicColumns);
            // From the centre outwards.
            const distance = Math.hypot(column - (mosaicColumns - 1) / 2, row - (rows - 1) / 2);
            return (
              <div key={index} className="menu-mosaic-tile relative aspect-[9/16] overflow-hidden rounded-2xl bg-white/60 shadow-lg" style={{ animationDelay: `${Math.round(distance * 70)}ms` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${videos[index % videos.length]}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            );
          })}
        </div>
        {/* A soft light behind the logo so it reads over the pictures. */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 46%, rgba(255,250,252,0.92) 0%, rgba(255,250,252,0.55) 26%, rgba(255,250,252,0) 52%)" }} />
        <div className="absolute inset-0 grid place-items-center">
          <div className="menu-mosaic-mark flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={168} height={168} className="h-42 w-42 rounded-full shadow-[0_20px_60px_rgba(194,61,122,0.35)]" />
            <span className="display text-2xl" style={{ color: "#5f2a44" }}>
              {business}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A digital menu in videos (owner, 2026-10-14): the business's logo and the collection on screen in
 * the bar, ☰ opens the list of collections (the first opens by default); a tap on a dish opens the
 * collection full screen, one dish per screen. Every video plays in a fixed pool of 3 players
 * (VideoPool), never created again: the cards and slides hold thumbnails.
 */
export function VideoMenu({ menu, openingStyle = "mosaic" }: { menu: VideoMenuData; openingStyle?: MenuOpening }) {
  const [active, setActive] = useState(menu.collections[0].id);
  const [sheet, setSheet] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; at: number; mode: "drag" | "scroll" | null } | null>(null);
  const [viewer, setViewer] = useState<number | null>(null);
  const [viewerTargets, setViewerTargetsState] = useState<PoolTarget[]>([]);
  const setViewerTargets = useCallback((next: PoolTarget[]) => setViewerTargetsState((previous) => (sameTargets(previous, next) ? previous : next)), []);
  const [gridTargets, setGridTargets] = useState<PoolTarget[]>([]);
  const [sound, setSound] = useState(false);
  // No video starts while the opening plays (it would take the phone's attention from the animation).
  const [opening, setOpening] = useState(true);
  const opened = useCallback(() => setOpening(false), []);

  // No «pull to refresh» on this page: in a long menu of videos it reloaded the page by accident (owner, 2026-10-14).
  useEffect(() => {
    const root = document.documentElement;
    const before = [root.style.overscrollBehaviorY, document.body.style.overscrollBehaviorY];
    root.style.overscrollBehaviorY = "none";
    document.body.style.overscrollBehaviorY = "none";
    return () => {
      [root.style.overscrollBehaviorY, document.body.style.overscrollBehaviorY] = before;
    };
  }, []);

  const closeViewer = useCallback(() => {
    setViewer(null);
    setViewerTargets([]);
    setSound(false);
  }, [setViewerTargets]);

  // The grid's playing row: how much of each card is on screen, the winners picked once the scroll rests.
  const ratios = useRef(new Map<string, { order: number; ratio: number }>());
  const focusTimer = useRef<number | undefined>(undefined);
  const [focus, setFocus] = useState<string[]>([]);
  const seen = useCallback((key: string, order: number, ratio: number) => {
    ratios.current.set(key, { order, ratio });
    window.clearTimeout(focusTimer.current);
    focusTimer.current = window.setTimeout(() => {
      // The most visible dishes; on a tie, the ones higher in the grid (the same row, side by side).
      const ranked = [...ratios.current]
        .filter(([, entry]) => entry.ratio >= focusMinRatio)
        .sort(([, a], [, b]) => b.ratio - a.ratio || a.order - b.order)
        .slice(0, focusCount)
        .map(([candidate]) => candidate);
      setFocus(ranked);
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
        title: dish.name,
        details: (
          <>
            <span className="font-semibold text-white">{euro.format(dish.price)}</span> · {dish.description}
          </>
        ),
      })),
    [dishes],
  );

  // What the grid asks of the pool: its playing row, paused while the collections panel is open.
  useEffect(() => {
    const next = focus.flatMap((key): PoolTarget[] => {
      const dish = menu.dishes[key];
      const element = boxes.current.get(key) ?? null;
      return dish && element ? [{ key: `grid-${key}`, video: dish.video, element, fixed: false, play: !sheet, visible: !sheet }] : [];
    });
    setGridTargets((previous) => (sameTargets(previous, next) ? previous : next));
  }, [focus, sheet, menu.dishes]);
  // While the full screen opens, the grid's players stay as they are until it says what it wants (no pause).
  const poolTargets = viewer !== null && viewerTargets.length ? viewerTargets : gridTargets;

  const closeSheet = useCallback(() => {
    setSheetClosing(true);
    window.setTimeout(() => {
      setSheet(false);
      setSheetClosing(false);
      setDrag(0);
    }, sheetSlideMs);
  }, []);

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

  const choose = (id: string) => {
    ratios.current.clear();
    setFocus([]);
    setActive(id);
    closeSheet();
    window.scrollTo({ top: 0 });
  };

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
          <button type="button" onClick={() => setSheet(true)} className="flex min-w-0 flex-1 flex-col items-start text-left" aria-label={`Coleção: ${collection.name}. Mudar de coleção`}>
            <span className="text-xs text-muted">{menu.business}</span>
            <span className="flex max-w-full items-center gap-1 font-semibold text-text">
              <span className="truncate">{collection.name}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>
          <button type="button" onClick={() => setSheet(true)} aria-label="Abrir o menu" aria-expanded={sheet} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-text hover:bg-surface-2">
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
        <p className="mt-10 text-center text-xs text-subtle">Menu de demonstração: vídeos de canais de culinária no YouTube e preços de exemplo.</p>
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
          sound={sound}
          onSound={() => setSound((on) => !on)}
          onTargets={setViewerTargets}
          onClose={closeViewer}
        />
      ) : null}
      <VideoPool targets={poolTargets} sound={sound} enabled={!opening} />
      {openingStyle === "reveal" ? (
        <MenuSplash logo={menu.logo} business={menu.business} onDone={opened} />
      ) : (
        <MosaicSplash logo={menu.logo} business={menu.business} videos={Object.values(menu.dishes).map((dish) => dish.video)} onDone={opened} />
      )}
    </div>
  );
}
