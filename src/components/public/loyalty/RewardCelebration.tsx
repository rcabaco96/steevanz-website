"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { brandButton } from "../BrandFrame";

const noop = () => () => {};
const colours = ["var(--brand)", "#e2bd6c", "#f2d48c", "#7fc8a9", "#f29e9e", "#9ab8f2"];

/** Fixed positions (no randomness while rendering): spread across the width, falling at different paces. */
const pieces = Array.from({ length: 26 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  colour: colours[index % colours.length],
  delay: `${((index * 7) % 10) * 0.09}s`,
  fall: `${2.2 + ((index * 5) % 9) * 0.15}s`,
  drift: `${((index % 5) - 2) * 26}px`,
  spin: `${index % 2 ? 540 : -480}deg`,
}));

function GiftIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M3 9h18M12 9v11M12 9c-1.5-3.5-5-4-5-1.6C7 9 12 9 12 9Zm0 0c1.5-3.5 5-4 5-1.6C17 9 12 9 12 9Z" />
    </svg>
  );
}

/**
 * The first time a reward shows on this phone: a gift popping in, confetti and the reward's name.
 * Remembered per reward once closed, so it plays once; without motion it simply appears.
 */
export function RewardCelebration({ rewardId, label }: { rewardId: string; label: string }) {
  const key = `cartao-premio:${rewardId}`;
  const seen = useSyncExternalStore(
    noop,
    () => {
      try {
        return window.localStorage.getItem(key) !== null;
      } catch {
        return false;
      }
    },
    () => true,
  );
  const [closed, setClosed] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const open = !seen && !closed;

  const close = () => {
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      // Private mode: it may play again next time, which is fine.
    }
    setClosed(true);
  };

  useEffect(() => {
    if (!open) return;
    button.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close only writes this reward's key
  }, [open]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="premio-titulo" className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/55 px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {pieces.map((piece, index) => (
          <span
            key={index}
            className="confetti-piece"
            style={{ left: piece.left, background: piece.colour, "--delay": piece.delay, "--fall": piece.fall, "--drift": piece.drift, "--spin": piece.spin } as CSSProperties}
          />
        ))}
      </div>
      <div className="relative flex w-full max-w-sm flex-col items-center gap-4 rounded-[1.6rem] bg-surface p-7 text-center shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
        <span className="reward-pop grid h-24 w-24 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f2d48c,#c99a45_70%)] text-[#5a3d0c] shadow-[0_10px_30px_-10px_#c99a45]">
          <GiftIcon />
        </span>
        <div className="reward-rise flex flex-col gap-1.5">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Parabéns!</p>
          <h2 id="premio-titulo" className="display text-[2rem] leading-tight text-balance text-text">
            Ganhou: {label}
          </h2>
          <p className="text-muted">Quando quiser usar, mostre este cartão ao balcão.</p>
        </div>
        <button ref={button} type="button" onClick={close} className={`${brandButton} reward-rise`}>
          Ver o meu cartão
        </button>
      </div>
    </div>
  );
}
