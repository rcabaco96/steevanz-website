"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  /** What the button shows. */
  label: ReactNode;
  ariaLabel?: string;
  className?: string;
  /** The menu's content; call close() after a choice. Choices are elements with data-opt (arrow keys move between them). */
  children: (close: () => void) => ReactNode;
  menuClassName?: string;
}

/**
 * A button with a floating menu (native option lists cannot be styled or hold a date field). The menu
 * opens below the button, or above it when there is no room, and closes on Escape, a click outside,
 * scrolling or resizing.
 */
export function Dropdown({ label, ariaLabel, className = "", children, menuClassName = "" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; minWidth: number } | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const id = useId();

  const close = useCallback(
    (focusBack = true) => {
      setOpen(false);
      setPosition(null);
      if (focusBack) document.getElementById(`${id}-button`)?.focus();
    },
    [id],
  );

  useLayoutEffect(() => {
    if (!open || !button.current || !menu.current) return;
    const box = button.current.getBoundingClientRect();
    const height = menu.current.offsetHeight;
    const width = Math.max(menu.current.offsetWidth, box.width);
    const below = window.innerHeight - box.bottom;
    const top = below < height + 12 && box.top > below ? Math.max(8, box.top - height - 6) : box.bottom + 6;
    const left = Math.min(Math.max(8, box.left), window.innerWidth - width - 8);
    setPosition({ top, left, minWidth: Math.max(200, box.width) });
  }, [open]);

  // Focus the chosen option once the menu is placed and visible (a hidden menu cannot take focus), so the
  // arrow keys and Escape work straight away.
  useEffect(() => {
    if (!position || !menu.current) return;
    const chosen = menu.current.querySelector<HTMLElement>('[data-opt][aria-selected="true"]') ?? menu.current.querySelector<HTMLElement>("[data-opt]");
    chosen?.focus({ preventScroll: true });
  }, [position]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menu.current?.contains(target) && !button.current?.contains(target)) close(false);
    };
    const scrolled = (event: Event) => {
      // A phone may scroll the page to show the date field while it is being filled: keep the menu then.
      const typing = document.activeElement instanceof HTMLInputElement && menu.current?.contains(document.activeElement);
      if (!menu.current?.contains(event.target as Node) && !typing) close(false);
    };
    const resized = () => close(false);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("scroll", scrolled, true);
    window.addEventListener("resize", resized);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("scroll", scrolled, true);
      window.removeEventListener("resize", resized);
    };
  }, [open, close]);

  function keys(event: KeyboardEvent<HTMLDivElement>) {
    const options = [...(menu.current?.querySelectorAll<HTMLElement>("[data-opt]") ?? [])];
    const index = options.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      options[(index + 1) % options.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      options[(index - 1 + options.length) % options.length]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") close(false);
  }

  return (
    <>
      <button
        ref={button}
        id={`${id}-button`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={ariaLabel}
        onClick={() => (open ? close() : setOpen(true))}
        className={`group/dd inline-flex min-w-0 max-w-full cursor-pointer items-center justify-between gap-2.5 ${className}`}
      >
        <span className="min-w-0 truncate">{label}</span>
        <span aria-hidden="true" className={`size-1.5 shrink-0 border-r-[1.75px] border-b-[1.75px] border-current opacity-70 transition-transform ${open ? "translate-y-0.5 rotate-[225deg]" : "-translate-y-0.5 rotate-45"}`} />
      </button>
      {open
        ? createPortal(
            <div
              ref={menu}
              id={id}
              role="listbox"
              onKeyDown={keys}
              style={position ? { top: position.top, left: position.left, minWidth: position.minWidth } : { top: 0, left: 0, visibility: "hidden" }}
              className={`fixed z-50 flex max-h-[min(380px,60vh)] max-w-[min(340px,calc(100vw-24px))] flex-col gap-px overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 text-text shadow-[0_12px_32px_-8px_rgb(var(--shadow-color)/0.35),0_2px_6px_rgb(var(--shadow-color)/0.12)] ${menuClassName}`}
            >
              {children(() => close())}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/** One choice in a Dropdown menu. */
export function DropdownOption({ selected = false, onChoose, children, className = "" }: { selected?: boolean; onChoose: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      role="option"
      data-opt
      aria-selected={selected}
      onClick={onChoose}
      className={`flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm text-text outline-none hover:bg-surface-2 focus-visible:bg-surface-2 ${selected ? "font-semibold" : ""} ${className}`}
    >
      {children}
      {selected ? <span aria-hidden="true" className="ml-auto h-2.5 w-1.5 shrink-0 translate-x-[-2px] rotate-45 border-r-2 border-b-2 border-accent" /> : null}
    </button>
  );
}

export function DropdownHint({ children }: { children: ReactNode }) {
  return <p className="px-2.5 pt-2 pb-1 text-xs font-semibold tracking-[0.06em] text-subtle uppercase">{children}</p>;
}

export function DropdownSeparator() {
  return <hr className="mx-1.5 my-1 border-line" />;
}
