"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";

const noop = () => () => {};

/** Small four-point glints around the reward, placed by hand (no randomness while rendering). */
const glints = [
  { top: "-0.4rem", left: "12%", size: "0.7rem", delay: "0.35s" },
  { top: "18%", right: "-0.35rem", size: "0.55rem", delay: "0.55s" },
  { bottom: "22%", left: "-0.35rem", size: "0.5rem", delay: "0.75s" },
  { top: "-0.3rem", right: "22%", size: "0.45rem", delay: "0.95s" },
];

function Glint({ size }: { size: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: size, height: size }} fill="currentColor">
      <path d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0Z" />
    </svg>
  );
}

/**
 * A reward moment arriving the first time this phone sees it (a reward won, or handed over): it
 * rises in with a soft glow and a few glints, then stays still. Remembered per `id` (the reward and
 * the moment); without motion it simply shows.
 */
export function RewardReveal({ id, className = "", children }: { id: string; className?: string; children: ReactNode }) {
  const key = `cartao-premio:${id}`;
  const seen = useSyncExternalStore(
    noop,
    () => {
      try {
        return window.localStorage.getItem(key) !== null;
      } catch {
        return true;
      }
    },
    () => true,
  );

  useEffect(() => {
    if (seen) return;
    // Remembered once it has played (the page refreshes every few seconds and must not replay it).
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(key, "1");
      } catch {
        // Private mode: it may play again next time, which is fine.
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [seen, key]);

  if (seen) return <>{children}</>;
  return (
    <div className={`reward-reveal relative ${className}`}>
      {children}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 text-[#e2bd6c]">
        {glints.map(({ size, delay, ...place }, index) => (
          <span key={index} className="reward-glint absolute" style={{ ...place, animationDelay: delay }}>
            <Glint size={size} />
          </span>
        ))}
      </span>
    </div>
  );
}
