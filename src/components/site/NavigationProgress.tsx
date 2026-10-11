"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const showAfterMs = 150;
/** After this long a navigation that never finished (a download, a blocked page) stops showing. */
const giveUpMs = 15000;

const currentUrl = () => `${window.location.pathname}?${new URLSearchParams(window.location.search).toString()}`;

/** The internal page a click on this anchor goes to, or null when it isn't a page change we can follow. */
function destination(event: MouseEvent): { anchor: HTMLAnchorElement; url: string } | null {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return null;
  const target = new URL(anchor.href, window.location.href);
  if (target.origin !== window.location.origin) return null;
  // Files and redirects to other sites (exports, «Ligar com o Google») never land on a page here.
  if (target.pathname.startsWith("/api/") || target.pathname.includes("/export/")) return null;
  const url = `${target.pathname}?${target.searchParams.toString()}`;
  // Same page (or only a #section): nothing to wait for.
  if (url === currentUrl()) return null;
  return { anchor, url };
}

function Bar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const here = `${pathname}?${searchParams.toString()}`;
  // The page the navigation started from: while we're still on it, the next page is on its way.
  const [nav, setNav] = useState<{ id: number; from: string; shown: boolean } | null>(null);
  const pendingLink = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    let giveUp: number | undefined;
    const onClick = (event: MouseEvent) => {
      const found = destination(event);
      if (!found) return;
      pendingLink.current?.removeAttribute("data-nav-pending");
      found.anchor.setAttribute("data-nav-pending", "");
      pendingLink.current = found.anchor;
      const id = Date.now();
      setNav({ id, from: currentUrl(), shown: false });
      // Only waits longer than this get a bar: quick navigations show nothing at all.
      window.setTimeout(
        () => setNav((current) => (current?.id !== id ? current : current.from === currentUrl() ? { ...current, shown: true } : null)),
        showAfterMs,
      );
      window.clearTimeout(giveUp);
      giveUp = window.setTimeout(() => setNav(null), giveUpMs);
    };
    // Back from the browser's cache after leaving for another area of the site: nothing is loading.
    const onPageShow = () => setNav(null);
    document.addEventListener("click", onClick);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.clearTimeout(giveUp);
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  useEffect(() => {
    pendingLink.current?.removeAttribute("data-nav-pending");
    pendingLink.current = null;
  }, [here]);

  if (!nav?.shown) return null;
  const loading = nav.from === here;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      <div key={nav.id} className={`h-full origin-left bg-accent ${loading ? "nav-progress-run" : "nav-progress-done"}`} />
    </div>
  );
}

/**
 * The thin bar at the top of the screen while the next page loads, and the clicked link dimmed
 * (owner, 2026-10-11: «trava a página visualmente e leva o user a carregar novamente no mesmo
 * sítio»). Shows only after ~150 ms, so instant navigations show nothing. One per root layout.
 */
export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
