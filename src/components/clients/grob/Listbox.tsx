"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export interface ListboxOption {
  value: string;
  label: string;
}

type Tone = "light" | "dark";

const tones: Record<Tone, { trigger: string; placeholder: string; pop: string; option: string; active: string; selected: string }> = {
  light: {
    trigger: "bg-white text-tinta ring-1 ring-tinta/15 focus-visible:ring-2 focus-visible:ring-relva",
    placeholder: "text-cinza/80",
    pop: "bg-white text-tinta ring-1 ring-tinta/10 shadow-[0_24px_50px_-20px_rgb(6_38_21/0.45)]",
    option: "text-tinta",
    active: "bg-relva/10",
    selected: "bg-relva text-white",
  },
  dark: {
    trigger: "bg-[#164a2b] text-giz ring-1 ring-giz/15 focus-visible:ring-2 focus-visible:ring-relva-claro",
    placeholder: "text-giz/55",
    pop: "bg-[#0f3a22] text-giz ring-1 ring-giz/15 shadow-[0_24px_50px_-18px_rgb(0_0_0/0.65)]",
    option: "text-giz",
    active: "bg-giz/10",
    selected: "bg-relva-claro text-pavilhao",
  },
};

// Uma lista de escolha própria do site (dono, 2026-11-02: «dropdown muito podre»), no lugar do <select> do sistema:
// o botão parece um campo, a lista abre por baixo (ou por cima, se não houver espaço), com cantos redondos, a
// opção escolhida em verde com um visto. Teclado completo (↑/↓, Home/End, escrever para saltar, Enter/Espaço, Esc,
// Tab), ARIA combobox + listbox + option com aria-activedescendant, fecha ao tocar fora. Um campo escondido guarda o
// valor para o formulário e para a validação («required»).
export function Listbox({
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  tone = "light",
  labelId,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: ListboxOption[];
  placeholder: string;
  required?: boolean;
  tone?: Tone;
  labelId?: string;
}) {
  const id = useId();
  const listId = `${id}-lista`;
  const s = tones[tone];
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [above, setAbove] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const selectedIndex = options.findIndex((o) => o.value === value);
  const current = selectedIndex >= 0 ? options[selectedIndex] : null;

  const show = () => {
    const el = trigger.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const need = Math.min(options.length * 44 + 16, 320);
      const container = el.closest("[role=dialog]")?.getBoundingClientRect();
      const bottom = container ? container.bottom : window.innerHeight;
      const top = container ? container.top : 0;
      setAbove(bottom - r.bottom < need && r.top - top > bottom - r.bottom);
    }
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
    trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(`${id}-op-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    if (event.key === "Escape") {
      // Fecha só a lista, não a gaveta à volta.
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") setActive((a) => Math.min(last, a + 1));
    else if (event.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(last);
    else if (event.key === "Enter" || event.key === " ") choose(active);
    else if (event.key.length === 1) {
      const now = event.timeStamp;
      typed.current.text = now - typed.current.at > 600 ? event.key.toLowerCase() : typed.current.text + event.key.toLowerCase();
      typed.current.at = now;
      const found = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text));
      if (found >= 0) setActive(found);
      return;
    } else return;
    event.preventDefault();
  };

  return (
    <div ref={root} className="relative mt-1">
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={open ? `${id}-op-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        className={`flex h-[2.875rem] w-full items-center justify-between gap-2 rounded-xl px-3.5 text-left text-[0.98rem] outline-none ${s.trigger}`}
      >
        <span className={`truncate ${current ? "" : s.placeholder}`}>{current ? current.label : placeholder}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className={`h-2 w-3 shrink-0 transition-transform duration-[var(--gb-dur)] ease-[var(--gb-ease)] ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      {/* O valor para o formulário e para a validação do browser. */}
      <input
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        value={value}
        required={required}
        onChange={() => {}}
        onInvalid={() => show()}
        className="pointer-events-none absolute bottom-0 left-4 h-px w-px opacity-0"
      />
      <AnimatePresence>
        {open ? (
          <m.ul
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: above ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: above ? 4 : -4 }}
            transition={{ duration: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
            className={`gb-scroll-hidden absolute inset-x-0 z-20 max-h-80 overflow-y-auto rounded-[0.9rem] p-1.5 ${above ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"} ${s.pop}`}
          >
            {options.map((option, i) => {
              const selected = option.value === value;
              return (
                <li
                  key={option.value}
                  id={`${id}-op-${i}`}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={`flex h-11 cursor-pointer items-center justify-between gap-3 rounded-[0.6rem] px-3 text-[0.95rem] font-medium transition-colors ${s.option} ${
                    selected ? s.selected : i === active ? s.active : ""
                  }`}
                >
                  {option.label}
                  {selected ? (
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </li>
              );
            })}
          </m.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
