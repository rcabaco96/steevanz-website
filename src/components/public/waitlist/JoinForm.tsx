"use client";

import { useActionState, useEffect, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";
import { AlertIcon } from "@/components/icons";
import { joinWaitlist } from "@/lib/modules/waitlist/actions";
import { brandButton, publicInput, publicLabel } from "../BrandFrame";
import { unlockAlerts } from "./alerts";

export interface JoinOption {
  id: string;
  label: string;
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={brandButton}>
      {pending ? <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
      {pending ? "A entrar…" : label}
    </button>
  );
}

const noop = () => () => {};

/** The last place this phone had in this queue, to go back to it instead of joining twice. */
function useSavedTicket(slug: string): string | null {
  return useSyncExternalStore(
    noop,
    () => {
      try {
        return window.localStorage.getItem(`fila:${slug}`);
      } catch {
        return null;
      }
    },
    () => null,
  );
}

export function JoinForm({
  slug,
  askParty,
  maxParty,
  services,
  staff,
  submitLabel,
  who,
}: {
  slug: string;
  who: { question: string; any: string };
  askParty: boolean;
  maxParty: number;
  services: JoinOption[];
  staff: JoinOption[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(joinWaitlist, null);
  const saved = useSavedTicket(slug);
  // Reading the QR again (e.g. at the door when called) goes straight back to the live ticket. The
  // ticket page forgets it on this phone once the turn is over.
  useEffect(() => {
    if (saved) window.location.replace(`/fila/${slug}/${saved}?voltou=1`);
  }, [saved, slug]);

  return (
    <form action={formAction} onSubmit={() => unlockAlerts()} className="flex flex-col gap-4">
      {saved ? (
        <a href={`/fila/${slug}/${saved}`} className="rounded-2xl border border-[var(--brand)]/40 bg-[color-mix(in_oklab,var(--brand)_8%,var(--surface))] px-4 py-3.5 text-center font-semibold text-text hover:brightness-105">
          Já está na fila? Ver a sua senha
        </a>
      ) : null}
      <input type="hidden" name="slug" value={slug} />
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input name="website_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className={publicLabel}>
        Nome
        <input name="name" required maxLength={60} autoComplete="given-name" placeholder="O seu nome" className={publicInput} />
      </label>
      {askParty ? (
        <label className={publicLabel}>
          Quantas pessoas?
          <select name="party" required defaultValue="2" className={publicInput}>
            {Array.from({ length: maxParty }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "pessoa" : "pessoas"}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {services.length ? (
        <label className={publicLabel}>
          Serviço
          <select name="service" required className={publicInput}>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {staff.length ? (
        <label className={publicLabel}>
          {who.question}
          <select name="staff" defaultValue="" className={publicInput}>
            <option value="">{who.any} (mais rápido)</option>
            {staff.map((person) => (
              <option key={person.id} value={person.id}>
                {person.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className={publicLabel}>
        Email (opcional)
        <input name="email" type="email" maxLength={200} autoComplete="email" inputMode="email" placeholder="Recomendado: avisamos também por email" className={publicInput} />
      </label>
      {state && !state.ok ? (
        <p role="alert" className="flex items-center gap-1.5 text-sm text-danger">
          <AlertIcon size={15} />
          {state.message}
        </p>
      ) : null}
      <Submit label={submitLabel} />
      <p className="text-xs text-subtle">
        O nome e o email servem só para esta fila e são apagados ao fim de 30 dias.
      </p>
    </form>
  );
}
