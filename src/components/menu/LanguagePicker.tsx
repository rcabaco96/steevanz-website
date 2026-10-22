"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { languageLocales, languageNames, menuLanguages, menuText, type MenuLanguage } from "@/lib/video-menus/i18n";
import { LanguageFlag } from "./LanguageFlag";

/**
 * The language button of the menu's bar (owner, 2026-10-19): the current flag; a tap opens the six
 * languages, each with its flag and its own name. A button with a listbox: arrows, Home/End,
 * Enter/Space choose, Esc closes and gives the focus back.
 */
export function LanguagePicker({ language, onChoose }: { language: MenuLanguage; onChoose: (language: MenuLanguage) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const text = menuText[language];

  const show = (at: number) => {
    setActive(at);
    setOpen(true);
  };
  const hide = (focusButton: boolean) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  };
  const pick = (index: number) => {
    onChoose(menuLanguages[index]);
    hide(true);
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
    const last = menuLanguages.length - 1;
    const moves: Record<string, number> = { ArrowDown: active === last ? 0 : active + 1, ArrowUp: active === 0 ? last : active - 1, Home: 0, End: last };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(active);
    } else if (event.key === "Escape") {
      // Only the list closes (the page's other Esc handlers aren't open meanwhile).
      event.preventDefault();
      event.stopPropagation();
      hide(true);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const currentIndex = menuLanguages.indexOf(language);
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
        aria-label={text.languageAria(languageNames[language])}
        className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-[var(--menu-accent)] focus-visible:outline-none"
      >
        <LanguageFlag language={language} size={16} />
      </button>
      {open ? (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={text.language}
          aria-activedescendant={`${id}-${menuLanguages[active]}`}
          onKeyDown={onListKey}
          className="menu-lang-list absolute top-full right-0 z-50 mt-2 w-[min(13.5rem,calc(100vw-2rem))] rounded-2xl border border-line bg-bg p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] outline-none"
        >
          {menuLanguages.map((option, index) => {
            const selected = option === language;
            return (
              <li
                key={option}
                id={`${id}-${option}`}
                role="option"
                aria-selected={selected}
                onClick={() => pick(index)}
                onPointerMove={() => setActive(index)}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-text select-none ${index === active ? "bg-surface-2" : ""}`}
                style={selected ? { color: "var(--menu-accent-text)" } : undefined}
              >
                <LanguageFlag language={option} size={16} />
                <span lang={languageLocales[option]} className="min-w-0 flex-1 truncate">
                  {languageNames[option]}
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
