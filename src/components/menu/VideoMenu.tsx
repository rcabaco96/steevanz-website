"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { MenuDish, VideoMenuData } from "@/content/demo-menu";
import { lastPosition, ShortPlayer, ShortsViewer, type ShortItem } from "./VideoShorts";

const euro = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

/** The business's colours (Dolci e Salati's logo), for accents only: the page keeps the theme's text and background. */
const brand = { "--menu-accent": "#c23d7a", "--menu-accent-soft": "rgba(226, 99, 155, 0.14)" } as CSSProperties;

/**
 * In the grid only one video plays: the dish most on screen, once the scroll has stopped this long
 * (ms). Several YouTube players at once, made and dropped while scrolling, made iPhones reload the
 * page (owner, 2026-10-14).
 */
const focusAfter = 350;
/** A card must be at least this much on screen to be the one that plays. */
const focusMinRatio = 0.6;

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/** A dish of the grid: its video plays (muted) when it is the one in focus; a tap opens the collection full screen. */
function DishCard({ id, dish, playing, onSeen, onOpen }: { id: string; dish: MenuDish; playing: boolean; onSeen: (id: string, ratio: number) => void; onOpen: () => void }) {
  const holder = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => onSeen(id, entry.intersectionRatio), { threshold: [0, 0.25, 0.5, 0.6, 0.75, 0.9, 1] });
    observer.observe(element);
    return () => observer.disconnect();
  }, [id, onSeen]);
  return (
    <li className="flex flex-col gap-2">
      <button type="button" onClick={onOpen} aria-label={`Ver em ecrã inteiro: ${dish.name}`} className="block w-full text-left">
        <div ref={holder} className="relative aspect-[9/16] w-full overflow-hidden rounded-xl" style={{ clipPath: "inset(0 round 0.75rem)" }}>
          <ShortPlayer video={dish.video} title={dish.name} load={playing} active={playing} sound={false} />
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
 * The opening (owner, 2026-10-14): the business's logo grows in on its colours, its name follows,
 * then the whole thing fades away over the menu (~1.6 s). Drawn by the server, so it covers the page
 * from the first frame while the videos start loading behind it.
 */
function MenuSplash({ logo, business }: { logo: string; business: string }) {
  const [done, setDone] = useState(false);
  if (done) return null;
  return (
    <div
      aria-hidden="true"
      onAnimationEnd={(event) => event.target === event.currentTarget && setDone(true)}
      className="menu-splash fixed inset-0 z-[100] grid place-items-center"
      style={{ background: "radial-gradient(circle at 50% 42%, #ffffff 0%, #fde7f0 55%, #f8cfe0 100%)" }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={176} height={176} className="menu-splash-logo h-44 w-44 rounded-full shadow-[0_18px_50px_rgba(194,61,122,0.25)]" />
        <span className="menu-splash-name display text-2xl" style={{ color: "#5f2a44" }}>
          {business}
        </span>
      </div>
    </div>
  );
}

/**
 * A digital menu in videos (owner, 2026-10-14): the business's logo and the collection on screen in
 * the bar, ☰ opens the list of collections, «Todos» first; a tap on a dish opens the collection full
 * screen, one dish per screen.
 */
export function VideoMenu({ menu }: { menu: VideoMenuData }) {
  const [active, setActive] = useState(menu.collections[0].id);
  const [sheet, setSheet] = useState(false);
  const [viewer, setViewer] = useState<{ start: number; startAt: number } | null>(null);
  const closeViewer = useCallback(() => setViewer(null), []);
  // The grid's single playing card: how much of each card is on screen, the winner picked once the scroll rests.
  const ratios = useRef(new Map<string, number>());
  const focusTimer = useRef<number | undefined>(undefined);
  const [focus, setFocus] = useState<string | null>(null);
  const seen = useCallback((key: string, ratio: number) => {
    ratios.current.set(key, ratio);
    window.clearTimeout(focusTimer.current);
    focusTimer.current = window.setTimeout(() => {
      let best: string | null = null;
      let bestRatio = focusMinRatio;
      for (const [candidate, value] of ratios.current) if (value >= bestRatio && (best === null || value > bestRatio)) [best, bestRatio] = [candidate, value];
      setFocus(best);
    }, focusAfter);
  }, []);

  const collection = menu.collections.find((candidate) => candidate.id === active) ?? menu.collections[0];
  const dishes = collection.dishes.map((key) => ({ key, dish: menu.dishes[key] }));
  const items: ShortItem[] = dishes.map(({ key, dish }) => ({
    key,
    video: dish.video,
    title: dish.name,
    details: (
      <>
        <span className="font-semibold text-white">{euro.format(dish.price)}</span> · {dish.description}
      </>
    ),
  }));

  // The collections panel: Esc closes it and the page behind stays put.
  useEffect(() => {
    if (!sheet) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet]);

  const choose = (id: string) => {
    ratios.current.clear();
    setFocus(null);
    setActive(id);
    setSheet(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div style={brand} className="min-h-dvh">
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
            <DishCard
              key={`${collection.id}-${key}`}
              id={key}
              dish={dish}
              // While the full screen or the collections panel is open, the grid plays nothing (memory).
              playing={focus === key && viewer === null && !sheet}
              onSeen={seen}
              // The full screen carries on where the card's video was.
              onOpen={() => setViewer({ start: index, startAt: focus === key ? lastPosition(dish.video) : 0 })}
            />
          ))}
        </ul>
        <p className="mt-10 text-center text-xs text-subtle">Menu de demonstração: vídeos de canais de culinária no YouTube e preços de exemplo.</p>
      </main>

      {sheet ? (
        <div className="fixed inset-0 z-[80]">
          <button type="button" aria-label="Fechar o menu" onClick={() => setSheet(false)} className="absolute inset-0 bg-black/40" />
          <nav aria-label="Coleções do menu" className="absolute inset-y-0 right-0 flex w-[min(85vw,22rem)] flex-col bg-bg shadow-2xl">
            <div className="flex items-center gap-3 border-b border-line px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={menu.logo} alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
              <span className="flex-1 font-semibold text-text">{menu.business}</span>
              <button type="button" onClick={() => setSheet(false)} aria-label="Fechar o menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-2">
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
        <ShortsViewer items={items} start={viewer.start} startAt={viewer.startAt} label={`${menu.business}: ${collection.name}`} onClose={closeViewer} />
      ) : null}
      <MenuSplash logo={menu.logo} business={menu.business} />
    </div>
  );
}
