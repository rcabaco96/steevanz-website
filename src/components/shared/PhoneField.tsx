"use client";

import { AO, BE, BR, CH, CV, DE, ES, FR, GB, IE, IT, LU, MZ, NL, PT, US } from "country-flag-icons/react/3x2";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { normalizePhone, phoneCountries, phoneError, splitPhone } from "@/lib/phone";

/** Only the flags in the list, so the page does not carry every country's. */
const flags: Record<string, typeof PT> = { AO, BE, BR, CH, CV, DE, ES, FR, GB, IE, IT, LU, MZ, NL, PT, US };

const choices = [...phoneCountries.map((country) => ({ ...country, label: `${country.name} +${country.dial}` })), { code: "", name: "Outro país", dial: "", label: "Outro país" }];

function CountryFlag({ code }: { code: string }) {
  const Flag = code ? flags[code] : null;
  if (!Flag) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
      </svg>
    );
  }
  return <Flag aria-hidden="true" className="h-[0.84rem] w-5 shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgb(0_0_0/0.12)]" />;
}

/**
 * The country of a phone number: a button with the flag and the dialling code, and a list with every
 * country's flag (a native select cannot show images). Keyboard: arrows, Home/End, Enter or Space to
 * choose, Escape to close, and the first letter of a country to jump to it.
 */
function CountryPicker({ dial, onChange, className }: { dial: string; onChange: (dial: string) => void; className: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const current = choices.find((item) => item.dial === dial) ?? choices[0];

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    list.current?.focus();
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const show = () => {
    setActive(Math.max(0, choices.indexOf(current)));
    setOpen(true);
  };
  const choose = (index: number) => {
    onChange(choices[index].dial);
    setOpen(false);
    button.current?.focus();
  };
  const onListKey = (event: KeyboardEvent) => {
    const last = choices.length - 1;
    if (event.key === "ArrowDown") setActive((index) => Math.min(last, index + 1));
    else if (event.key === "ArrowUp") setActive((index) => Math.max(0, index - 1));
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(last);
    else if (event.key === "Enter" || event.key === " ") choose(active);
    else if (event.key === "Escape") {
      setOpen(false);
      button.current?.focus();
    } else if (event.key === "Tab") setOpen(false);
    else if (/^[a-z]$/i.test(event.key)) {
      const letter = event.key.toLowerCase();
      const next = choices.findIndex((item, index) => index > active && item.name.toLowerCase().startsWith(letter));
      const first = choices.findIndex((item) => item.name.toLowerCase().startsWith(letter));
      if (next >= 0 || first >= 0) setActive(next >= 0 ? next : first);
      return;
    } else return;
    event.preventDefault();
  };

  return (
    <div ref={root} className="relative">
      <input type="hidden" name="phone_country" value={dial} />
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`País do número: ${current.label}`}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            show();
          }
        }}
        className={className}
      >
        <span className="flex items-center gap-2">
          <CountryFlag code={current.code} />
          <span className="tabular-nums">{current.dial ? `+${current.dial}` : "Outro"}</span>
          <svg aria-hidden="true" viewBox="0 0 12 12" className={`ml-auto h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
          </svg>
        </span>
      </button>
      {open ? (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label="País do número"
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onListKey}
          className="absolute top-full left-0 z-30 mt-1.5 max-h-72 w-64 overflow-y-auto rounded-xl border border-line bg-surface p-1 text-sm text-text shadow-[0_12px_32px_-12px_rgb(var(--shadow-color)/0.35)] focus:outline-none"
        >
          {choices.map((item, index) => (
            <li
              key={item.code || "other"}
              id={`${id}-${index}`}
              data-index={index}
              role="option"
              aria-selected={item.dial === dial}
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(index)}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 ${index === active ? "bg-surface-2" : ""} ${item.dial === dial ? "font-semibold" : ""}`}
            >
              <CountryFlag code={item.code} />
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              {item.dial ? <span className="tabular-nums text-muted">+{item.dial}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * A phone number with its country (Portugal first). Portuguese numbers must have 9 digits starting
 * with 9, 2 or 3; other countries 6 to 14 digits; «Outro país» takes the number with its own +code.
 * The browser shows the message before sending; the server checks the same rule (normalizePhone).
 * Sends "phone" and "phone_country" (the dialling code).
 */
export function PhoneField({
  label,
  defaultValue,
  required = false,
  hint,
  labelClassName,
  inputClassName,
  hintClassName = "text-xs font-normal text-subtle",
}: {
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  hint?: string;
  labelClassName: string;
  inputClassName: string;
  hintClassName?: string;
}) {
  const id = useId();
  const initial = splitPhone(defaultValue);
  const [dial, setDial] = useState(initial.dial);
  const input = useRef<HTMLInputElement>(null);

  const check = (value: string, code: string) => {
    input.current?.setCustomValidity(value.trim() && !normalizePhone(value, code) ? phoneError(code) : "");
  };

  return (
    <div className={labelClassName}>
      <label htmlFor={id}>{label}</label>
      <div className="flex gap-2">
        <div className="w-32 shrink-0">
          <CountryPicker
            dial={dial}
            onChange={(code) => {
              setDial(code);
              check(input.current?.value ?? "", code);
            }}
            className={inputClassName}
          />
        </div>
        <div className="min-w-0 flex-1">
          <input
            ref={input}
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={24}
            required={required}
            defaultValue={initial.number}
            placeholder={dial ? undefined : "+ indicativo e número"}
            onChange={(event) => check(event.target.value, dial)}
            onInvalid={(event) => check(event.currentTarget.value, dial)}
            className={inputClassName}
          />
        </div>
      </div>
      {hint ? <span className={hintClassName}>{hint}</span> : null}
    </div>
  );
}
