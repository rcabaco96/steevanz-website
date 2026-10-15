"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Most visitors arrive from a plate on the table and want the menu: once the hero's button has scrolled
// away, a «Ver o menu» pill waits at the bottom of the screen. It steps aside whenever another menu button
// (data-menu-cta) or the footer is on screen.

export function FloatingMenu({ href, label }: { href: string; label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = [...document.querySelectorAll("[data-menu-cta], footer")];
    if (!targets.length) return;
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setShow(onScreen.size === 0 && window.scrollY > 200);
    });
    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Link
        href={href}
        tabIndex={show ? 0 : -1}
        aria-hidden={!show}
        className={`${show ? "pointer-events-auto" : ""} inline-flex min-h-13 items-center gap-3 rounded-full bg-[var(--dz-cta-bg)] py-2 pr-6 pl-2 text-[var(--dz-cta-fg)] shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)] active:scale-95`}
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--dz-dot)] text-[var(--dz-dot-fg)]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
          </svg>
        </span>
        <span className="text-base font-semibold">{label}</span>
      </Link>
    </div>
  );
}
