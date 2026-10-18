// One video plays on the page at a time. Every video that *wants* to play (visible, active, granted by
// its section) calls request(); the highest priority wins (ties: the most recent request). Everything
// pauses while the tab is hidden and the winner resumes when it comes back.

type Want = { priority: number; order: number };

const wanting = new Map<HTMLVideoElement, Want>();
let current: HTMLVideoElement | null = null;
let counter = 0;
let listening = false;

function elect() {
  let best: HTMLVideoElement | null = null;
  let bestWant: Want | null = null;
  for (const [el, want] of wanting) {
    if (
      !bestWant ||
      want.priority > bestWant.priority ||
      (want.priority === bestWant.priority && want.order > bestWant.order)
    ) {
      best = el;
      bestWant = want;
    }
  }
  if (current && current !== best && !current.paused) current.pause();
  current = best;
  if (best && document.visibilityState === "visible" && best.paused) best.play().catch(() => {});
}

function listen() {
  if (listening || typeof document === "undefined") return;
  listening = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") current?.pause();
    else elect();
  });
}

export const videoDirector = {
  /** Ask to play `el`. If it wins, whatever was playing pauses. */
  request(el: HTMLVideoElement, priority = 0) {
    listen();
    wanting.set(el, { priority, order: ++counter });
    elect();
  },
  /** `el` no longer wants to play (off screen, inactive, unmounted). */
  release(el: HTMLVideoElement) {
    wanting.delete(el);
    if (!el.paused) el.pause();
    if (current === el) current = null;
    elect();
  },
  isCurrent(el: HTMLVideoElement) {
    return current === el;
  },
};
