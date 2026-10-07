"use client";

import { useActionState, useEffect, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";
import { AlertIcon, Check } from "@/components/icons";
import type { ActionState } from "@/lib/action-state";
import { joinLoyalty, recoverCard, redeemWithCode, stampWithCode } from "@/lib/modules/loyalty/actions";
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

function useSavedCard(slug: string): string | null {
  return useSyncExternalStore(
    noop,
    () => {
      try {
        return window.localStorage.getItem(`cartao:${slug}`);
      } catch {
        return null;
      }
    },
    () => null,
  );
}

/** Keeps the card's address on this phone, so the join page can send the customer back to it. */
export function RememberCard({ slug, token }: { slug: string; token: string }) {
  useEffect(() => {
    try {
      window.localStorage.setItem(`cartao:${slug}`, token);
    } catch {
      // Private mode: the email with the link still works.
    }
  }, [slug, token]);
  return null;
}

export function JoinCardForm({ slug, terms, welcomeStamp }: { slug: string; terms: string; welcomeStamp: boolean }) {
  const [state, formAction] = useActionState(joinLoyalty, null);
  const saved = useSavedCard(slug);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      {saved ? (
        <a href={`/cartao/${slug}/${saved}`} className={brandButton}>
          Abrir o meu cartão
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
        <input name="name" required maxLength={60} autoComplete="name" className={publicInput} />
      </label>
      <label className={publicLabel}>
        Email (recomendado)
        <input name="email" type="email" maxLength={200} autoComplete="email" inputMode="email" placeholder="Recebe o link do cartão por email" className={publicInput} />
      </label>
      <label className={publicLabel}>
        Telemóvel
        <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={publicInput} />
      </label>
      <p className="-mt-2 text-xs text-subtle">Indique pelo menos um: serve para recuperar o cartão se mudar de telemóvel.</p>
      <label className="flex items-start gap-2.5 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand)]" />
        <span>{terms}</span>
      </label>
      <Message state={state} />
      <Submit label={welcomeStamp ? "Criar cartão e ganhar o 1.º carimbo" : "Criar o meu cartão"} pendingLabel="A criar…" secondary={Boolean(saved)} />
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

function CodeInput() {
  return (
    <label className={publicLabel}>
      Código da equipa
      <input
        name="code"
        type="password"
        inputMode="numeric"
        pattern="\d{6}"
        maxLength={6}
        required
        autoComplete="off"
        placeholder="••••••"
        className={`${publicInput} text-center text-2xl tracking-[0.5em]`}
      />
    </label>
  );
}

/** The team types its code on the customer's phone to stamp the card. */
export function StampWithCodeForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(stampWithCode, null);
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />
      <CodeInput />
      <Message state={state} />
      <Submit label="Dar carimbo" pendingLabel="A validar…" />
    </form>
  );
}

export function RedeemWithCodeForm({ token, rewardId, reward }: { token: string; rewardId: string; reward: string }) {
  const [state, formAction] = useActionState(redeemWithCode, null);
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="reward_id" value={rewardId} />
      <CodeInput />
      <Message state={state} />
      <Submit label={`Entregar: ${reward}`} pendingLabel="A validar…" />
    </form>
  );
}
