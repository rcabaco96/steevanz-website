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

/** A card kept on this phone: its link and the name on it. */
interface SavedCard {
  token: string;
  name: string;
}

const savedKey = (slug: string) => `cartoes:${slug}`;
const maxSaved = 6;
const savedEvent = "cartoes-guardados";

/** Re-reads the saved cards when this page changes them, or another tab does. */
function subscribeSaved(onChange: () => void) {
  window.addEventListener(savedEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(savedEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The cards kept on this phone for one establishment, most recent first (a family sharing a phone keeps several). */
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

function writeSaved(slug: string, list: SavedCard[]) {
  try {
    if (list.length) window.localStorage.setItem(savedKey(slug), JSON.stringify(list.slice(0, maxSaved)));
    else window.localStorage.removeItem(savedKey(slug));
    window.localStorage.removeItem(`cartao:${slug}`);
    window.dispatchEvent(new Event(savedEvent));
  } catch {
    // Private mode: the email with the link still works.
  }
}

function useSavedCards(slug: string): SavedCard[] {
  // The raw text as the snapshot (a stable value), parsed below.
  const raw = useSyncExternalStore(
    subscribeSaved,
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

/**
 * Whether this card is kept on this phone (so the join page opens it again). A card created here is
 * kept on its own; one opened from a link (a friend's, or one's own on someone else's phone) only
 * when the person asks, and any can be forgotten.
 */
export function CardOnThisPhone({ slug, token, name, createdHere }: { slug: string; token: string; name: string; createdHere: boolean }) {
  const saved = useSavedCards(slug);
  const kept = saved.some((item) => item.token === token);
  const keep = () => writeSaved(slug, [{ token, name }, ...readSaved(slug).filter((item) => item.token !== token)]);
  const forget = () => writeSaved(slug, readSaved(slug).filter((item) => item.token !== token));

  useEffect(() => {
    if (createdHere) writeSaved(slug, [{ token, name }, ...readSaved(slug).filter((item) => item.token !== token)]);
  }, [createdHere, slug, token, name]);

  if (kept) {
    return (
      <p className="text-center text-sm text-subtle">
        Guardado neste telemóvel.{" "}
        <button type="button" onClick={forget} className="font-semibold text-muted underline-offset-2 hover:text-text hover:underline">
          Esquecer
        </button>
      </p>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <button type="button" onClick={keep} className="inline-flex min-h-10 items-center rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-text transition-colors hover:bg-surface-2">
        Guardar neste telemóvel
      </button>
      <p className="text-xs text-subtle">Só se o telemóvel for seu: fica a abrir este cartão a partir da página do estabelecimento.</p>
    </div>
  );
}

export function JoinCardForm({ slug, businessName, welcomeStamp }: { slug: string; businessName: string; welcomeStamp: boolean }) {
  const [state, formAction] = useActionState(joinLoyalty, null);
  const saved = useSavedCards(slug);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      {saved.length ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text">{saved.length === 1 ? "Cartão guardado neste telemóvel" : "Cartões guardados neste telemóvel"}</p>
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
      <Message state={state} />
      <Submit label={welcomeStamp ? "Criar cartão e ganhar o 1.º carimbo" : "Criar o meu cartão"} pendingLabel="A criar…" secondary={saved.length > 0} />
      <p className="text-xs text-subtle">
        Ao criar o cartão, aceita que {businessName} guarde o seu nome e contacto só para gerir o cartão. Pode pedir para os apagar a qualquer momento.
      </p>
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
