"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { LanguageFlag } from "@/components/menu/LanguageFlag";
import { htmlLang, locales, nativeNames, type Locale } from "@/lib/i18n";
import { switchLocalePath } from "@/lib/routes";

/**
 * The site's language button (owner, 2026-10-20), the same as the video menu's: the current flag; a tap
 * opens the six languages, each with its flag and its own name. Choosing one opens the same page in that
 * language. A button with a listbox: arrows, Home/End, Enter/Space choose, Esc closes and gives the focus back.
 */
export function LanguagePicker({ locale, label, buttonLabel }: { locale: Locale; label: string; buttonLabel: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();

  const show = (at: number) => {
    setActive(at);
    setOpen(true);
  };
  const hide = (focusButton: boolean) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  };
  const pick = (index: number) => {
    const target = locales[index];
    if (target === locale) {
      hide(true);
      return;
    }
    setOpen(false);
    // Another language is another root layout (Next loads it as a full page), keeping the query (e.g. ?produto=) and the anchor.
    router.push(`${switchLocalePath(pathname, target)}${window.location.search}${window.location.hash}`);
  };

  // Open: the list takes the focus; a tap or click outside closes it.
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onDown = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onListKey = (event: KeyboardEvent) => {
    const last = locales.length - 1;
    const moves: Record<string, number> = { ArrowDown: active === last ? 0 : active + 1, ArrowUp: active === 0 ? last : active - 1, Home: 0, End: last };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      hide(true);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const currentIndex = locales.indexOf(locale);
  return (
    <div ref={root} className="relative shrink-0">
      <button
        ref={button}
        type="button"
        onClick={() => (open ? hide(false) : show(currentIndex))}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            show(currentIndex);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-label={buttonLabel.replace("{language}", nativeNames[locale])}
        title={label}
        className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        <LanguageFlag language={locale} size={16} />
      </button>
      {open ? (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-${locales[active]}`}
          onKeyDown={onListKey}
          className="fixed inset-x-4 top-[4.25rem] z-50 rounded-2xl border border-line bg-bg p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] outline-none motion-safe:animate-[menu-in_0.2s_var(--ease-out-expo)] sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-56"
        >
          {locales.map((option, index) => {
            const selected = option === locale;
            return (
              <li
                key={option}
                id={`${id}-${option}`}
                role="option"
                aria-selected={selected}
                onClick={() => pick(index)}
                onPointerMove={() => setActive(index)}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-[15px] font-semibold select-none ${selected ? "text-accent-text" : "text-text"} ${index === active ? "bg-surface-2" : ""}`}
              >
                <LanguageFlag language={option} size={16} />
                <span lang={htmlLang[option]} className="min-w-0 flex-1 truncate">
                  {nativeNames[option]}
                </span>
                {selected ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
