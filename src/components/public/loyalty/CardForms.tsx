"use client";

import { useActionState, useEffect, useMemo, useSyncExternalStore } from "react";
import { PhoneField } from "@/components/shared/PhoneField";
import { useFormStatus } from "react-dom";
import { AlertIcon, Check } from "@/components/icons";
import type { ActionState } from "@/lib/action-state";
import { joinLoyalty, recoverCard } from "@/lib/modules/loyalty/actions";
import { brandButton, brandSecondaryButton, publicInput, publicLabel } from "../BrandFrame";

function Submit({ label, pendingLabel, secondary = false }: { label: string; pendingLabel: string; secondary?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={secondary ? brandSecondaryButton : brandButton}>
      {pending ? <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
      {pending ? pendingLabel : label}
    </button>
  );
}

function Message({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p role={state.ok ? "status" : "alert"} className={`flex items-start gap-1.5 text-sm ${state.ok ? "text-success" : "text-danger"}`}>
      <span className="mt-0.5 shrink-0">{state.ok ? <Check size={15} /> : <AlertIcon size={15} />}</span>
      {state.message}
    </p>
  );
}

const noop = () => () => {};

/** A card opened on this phone: its link and the name on it. */
interface SavedCard {
  token: string;
  name: string;
}

const savedKey = (slug: string) => `cartoes:${slug}`;
const maxSaved = 6;

/**
 * The cards opened on this phone for one establishment, most recent first. Several fit (a family
 * sharing a phone, or a card opened from someone's link): opening one never forgets the others.
 */
function readSaved(slug: string): SavedCard[] {
  try {
    const list = JSON.parse(window.localStorage.getItem(savedKey(slug)) ?? "[]") as SavedCard[];
    const valid = Array.isArray(list) ? list.filter((item) => typeof item?.token === "string" && typeof item?.name === "string") : [];
    // Before the list there was only one card per establishment.
    const legacy = window.localStorage.getItem(`cartao:${slug}`);
    return legacy && !valid.some((item) => item.token === legacy) ? [...valid, { token: legacy, name: "" }] : valid;
  } catch {
    return [];
  }
}

function useSavedCards(slug: string): SavedCard[] {
  // The raw text as the snapshot (a stable value), parsed below.
  const raw = useSyncExternalStore(
    noop,
    () => {
      try {
        return `${window.localStorage.getItem(savedKey(slug)) ?? ""}|${window.localStorage.getItem(`cartao:${slug}`) ?? ""}`;
      } catch {
        return "";
      }
    },
    () => "",
  );
  return useMemo(() => (raw ? readSaved(slug) : []), [raw, slug]);
}

/** Keeps the card's address on this phone (with the others), so the join page can send the customer back to it. */
export function RememberCard({ slug, token, name }: { slug: string; token: string; name: string }) {
  useEffect(() => {
    try {
      const list = [{ token, name }, ...readSaved(slug).filter((item) => item.token !== token)].slice(0, maxSaved);
      window.localStorage.setItem(savedKey(slug), JSON.stringify(list));
      window.localStorage.removeItem(`cartao:${slug}`);
    } catch {
      // Private mode: the email with the link still works.
    }
  }, [slug, token, name]);
  return null;
}

export function JoinCardForm({ slug, terms, welcomeStamp }: { slug: string; terms: string; welcomeStamp: boolean }) {
  const [state, formAction] = useActionState(joinLoyalty, null);
  const saved = useSavedCards(slug);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      {saved.length ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text">{saved.length === 1 ? "Cartão aberto neste telemóvel" : "Cartões abertos neste telemóvel"}</p>
          {saved.map((card) => (
            <a key={card.token} href={`/cartao/${slug}/${card.token}`} className={saved.length === 1 ? brandButton : brandSecondaryButton}>
              {card.name ? `Abrir o cartão de ${card.name}` : "Abrir o meu cartão"}
            </a>
          ))}
          <p className="mt-2 text-sm text-muted">Ou crie um cartão novo:</p>
        </div>
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
        <input name="name" required maxLength={60} autoComplete="name" className={publicInput} />
      </label>
      <label className={publicLabel}>
        Email (recomendado)
        <input name="email" type="email" maxLength={200} autoComplete="email" inputMode="email" className={publicInput} />
        <span className="text-xs font-normal text-subtle">Enviamos-lhe o link do cartão: é assim que o recupera se mudar de telemóvel.</span>
      </label>
      <PhoneField
        label="Telemóvel (opcional)"
        hint="Se um dia vier sem telemóvel, diga o número ao balcão e recebe o carimbo na mesma."
        labelClassName={publicLabel}
        inputClassName={publicInput}
      />
      <label className="flex items-start gap-2.5 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand)]" />
        <span>{terms}</span>
      </label>
      <Message state={state} />
      <Submit label={welcomeStamp ? "Criar cartão e ganhar o 1.º carimbo" : "Criar o meu cartão"} pendingLabel="A criar…" secondary={saved.length > 0} />
    </form>
  );
}

export function RecoverForm({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(recoverCard, null);
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="slug" value={slug} />
      <label className={publicLabel}>
        Email do cartão
        <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" className={publicInput} />
      </label>
      <Message state={state} />
      <Submit label="Enviar o link do cartão" pendingLabel="A enviar…" secondary />
    </form>
  );
}
