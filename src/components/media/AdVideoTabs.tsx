"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AdVideo, type AdVideoProps } from "./AdVideo";

// A product's ads when there is more than one (content/product-ads.ts, `variants`; owner, 2026-10-22, first on the
// online bookings page: «Restaurante» and «Cabeleireiro»). Small pill tabs above the phone frame, then one panel
// with the active video only: the others are never rendered, so they never download. Switching stops the
// previous video and drops its source (no download left running); the frame keeps its 9:16 size, so nothing
// moves. Keyboard: arrows (and Home/End) move between the tabs and select them, Tab goes into the video.

export interface AdVideoTab {
  id: string;
  tab: string;
  src: string;
  poster: string;
  label: string;
}

export function AdVideoTabs({ variants, label, copy }: { variants: AdVideoTab[]; label: string; copy: AdVideoProps["copy"] }) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = variants[active] ?? variants[0];
  const panelId = `${baseId}-panel`;
  const tabId = (index: number) => `${baseId}-tab-${index}`;

  const select = (index: number, focus = false) => {
    if (focus) tabsRef.current[index]?.focus();
    if (index === active) return;
    const video = panelRef.current?.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    setActive(index);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = variants.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? (active + 1) % variants.length
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (active - 1 + variants.length) % variants.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        role="tablist"
        aria-label={label}
        className="inline-flex max-w-full gap-1 rounded-full border border-line bg-surface/80 p-1 shadow-sm backdrop-blur"
      >
        {variants.map((variant, index) => {
          const selected = index === active;
          return (
            <button
              key={variant.id}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId(index)}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={onKeyDown}
              className={`min-h-11 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                selected ? "bg-accent text-accent-contrast" : "text-muted hover:bg-accent-soft hover:text-accent-text"
              }`}
            >
              {variant.tab}
            </button>
          );
        })}
      </div>
      <div ref={panelRef} role="tabpanel" id={panelId} aria-labelledby={tabId(active)}>
        <AdVideo key={current.id} src={current.src} poster={current.poster} label={current.label} copy={copy} />
      </div>
    </div>
  );
}
