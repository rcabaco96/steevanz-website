"use client";

import { useId, useState, type FormEvent } from "react";
import type { PlatibandaCopy } from "@/content/platibanda/copy";
import { platibanda, platibandaWhatsappHref } from "@/content/platibanda/facts";
import { ChatIcon, PhoneIcon } from "./icons";

// A short request that opens WhatsApp with the message already written (nothing is sent or stored by the site).
export function ContactForm({ copy }: { copy: PlatibandaCopy }) {
  const f = copy.contact.form;
  const id = useId();
  const [reason, setReason] = useState<string>(f.reasons[0]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    const text = `Olá! Chamo-me ${name.trim()}. Assunto: ${reason}.${message.trim() ? ` ${message.trim()}` : ""}`;
    window.open(platibandaWhatsappHref(text), "_blank", "noopener,noreferrer");
  };

  const field = "w-full rounded-xl border border-ria/15 bg-cal px-4 text-[1rem] text-ria placeholder:text-pedra/70 transition-colors hover:border-ria/40";
  return (
    <form onSubmit={submit} noValidate className="rounded-[1.6rem] bg-areia p-5 sm:p-7">
      <h3 className="font-display text-2xl text-ria">{f.title}</h3>
      <fieldset className="mt-5">
        <legend className="pb-label mb-2 text-ria/80">{f.reasonLabel}</legend>
        <div className="flex flex-wrap gap-2">
          {f.reasons.map((r) => (
            <label key={r} className="cursor-pointer">
              <input type="radio" name={`${id}-reason`} value={r} checked={reason === r} onChange={() => setReason(r)} className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full bg-cal px-4 text-sm font-semibold text-ria ring-1 ring-ria/15 transition-colors peer-checked:bg-ria peer-checked:text-cal peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-telha">
                {r}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5">
        <label htmlFor={`${id}-name`} className="pb-label mb-2 block text-ria/80">
          {f.name}
        </label>
        <input
          id={`${id}-name`}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(false);
          }}
          placeholder={f.namePlaceholder}
          autoComplete="name"
          aria-invalid={error || undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`${field} h-12`}
        />
        {error ? (
          <p id={`${id}-err`} role="alert" className="mt-2 text-sm font-semibold text-telha-deep">
            {f.error}
          </p>
        ) : null}
      </div>
      <div className="mt-4">
        <label htmlFor={`${id}-msg`} className="pb-label mb-2 block text-ria/80">
          {f.message}
        </label>
        <textarea id={`${id}-msg`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={f.messagePlaceholder} rows={3} className={`${field} py-3`} />
      </div>
      <div className="mt-5 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center">
        <button type="submit" className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-telha px-6 font-semibold text-cal transition-colors hover:bg-telha-deep">
          <ChatIcon width={18} height={18} />
          {f.send}
          <span className="sr-only"> {copy.newTab}</span>
        </button>
        <a href={platibanda.phoneHref} className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-5 font-semibold text-ria ring-1 ring-ria/25 hover:ring-ria/50">
          <PhoneIcon width={17} height={17} />
          {f.call}
        </a>
      </div>
      <p className="mt-4 text-xs text-pedra">{f.note}</p>
    </form>
  );
}
