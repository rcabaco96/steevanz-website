"use client";

import { useId, useState, type FormEvent } from "react";
import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda, platibandaWhatsappHref } from "@/content/platibanda/facts";
import { visitMessage, type Listing } from "@/content/platibanda/listings";
import { ChatIcon, PhoneIcon } from "./icons";

// «Pedir visita» (or, for a holiday home, «Pedir disponibilidade»): opens WhatsApp with the property's reference and
// the visitor's choice already written. Nothing is sent or stored by the site.
export function VisitForm({ listing, copy }: { listing: Listing; copy: PlatibandaCopy }) {
  const v = copy.listing.visit;
  const holiday = listing.deal === "ferias";
  const id = useId();
  const [when, setWhen] = useState<string>(v.whenOptions[0]);
  const [dates, setDates] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    const extra = holiday ? `${dates.trim() ? `Datas: ${dates.trim()}. ` : ""}Nome: ${name.trim()}.` : `Prefiro: ${when.toLowerCase()}. Nome: ${name.trim()}.`;
    window.open(platibandaWhatsappHref(visitMessage(listing, extra)), "_blank", "noopener,noreferrer");
  };

  const field = "h-12 w-full rounded-xl border border-ria/15 bg-cal px-4 text-[1rem] text-ria placeholder:text-pedra/70 transition-colors hover:border-ria/40";
  return (
    <form id="pedir-visita" onSubmit={submit} noValidate className="scroll-mt-24 rounded-[1.6rem] bg-ria p-5 text-cal sm:p-7 pb-on-dark">
      <h2 className="font-display text-[1.8rem] leading-tight">{holiday ? v.holidayTitle : v.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-cal/75">{holiday ? v.holidayIntro : v.intro}</p>
      <p className="mt-3 text-xs text-cal/60">
        {copy.listing.ref} {listing.ref}
      </p>

      {holiday ? (
        <div className="mt-5">
          <label htmlFor={`${id}-dates`} className="pb-label mb-2 block text-cal/80">
            {v.dates}
          </label>
          <input id={`${id}-dates`} value={dates} onChange={(e) => setDates(e.target.value)} placeholder={v.datesPlaceholder} className={field} />
        </div>
      ) : (
        <fieldset className="mt-5">
          <legend className="pb-label mb-2 text-cal/80">{v.when}</legend>
          <div className="flex flex-wrap gap-2">
            {v.whenOptions.map((o) => (
              <label key={o} className="cursor-pointer">
                <input type="radio" name={`${id}-when`} value={o} checked={when === o} onChange={() => setWhen(o)} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center rounded-full bg-cal/10 px-4 text-sm font-semibold ring-1 ring-cal/20 transition-colors peer-checked:bg-ocre peer-checked:text-ria peer-checked:ring-ocre peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ocre">
                  {o}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-4">
        <label htmlFor={`${id}-name`} className="pb-label mb-2 block text-cal/80">
          {v.name}
        </label>
        <input
          id={`${id}-name`}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(false);
          }}
          placeholder={v.namePlaceholder}
          autoComplete="name"
          aria-invalid={error || undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className={field}
        />
        {error ? (
          <p id={`${id}-err`} role="alert" className="mt-2 text-sm font-semibold text-ocre">
            {v.error}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <button type="submit" className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ocre px-6 font-semibold text-ria transition-colors hover:bg-[#dd9d2e]">
          <ChatIcon width={18} height={18} />
          {holiday ? v.sendHoliday : v.send}
          <span className="sr-only"> {copy.newTab}</span>
        </button>
        <a href={platibanda.phoneHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-full font-semibold ring-1 ring-cal/30 hover:ring-cal/60">
          <PhoneIcon width={17} height={17} />
          {v.call} · {platibanda.phoneDisplay}
        </a>
      </div>
      <p className="mt-4 text-xs text-cal/60">{v.note}</p>
    </form>
  );
}
