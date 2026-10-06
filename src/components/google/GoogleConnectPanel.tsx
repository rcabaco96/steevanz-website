"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";
import { Check, MapPinIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { chooseGoogleLocationAction, disconnectGoogleAction } from "@/lib/google/actions";

type LocationChoice = { name: string; title: string; address: string | null; placeId: string | null };

const fallbackError = "Não foi possível guardar. Tente outra vez.";

/**
 * The Google account manages several locations (or none matched this customer): radio cards with
 * the name and address of each, then "Confirmar". The server action revalidates the panel, so the
 * header and this page switch to "connected" on their own.
 */
export function GoogleLocationChooser({ slug, options }: { slug: string; options: LocationChoice[] }) {
  const router = useRouter();
  const groupId = useId();
  const [selected, setSelected] = useState(options.length === 1 ? options[0].name : "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function confirm() {
    if (!selected) {
      setMessage("Escolha primeiro o seu negócio na lista.");
      return;
    }
    setMessage(null);
    startTransition(async () => {
      const result = await chooseGoogleLocationAction(slug, selected).catch(() => ({ ok: false, message: fallbackError }));
      if (!result.ok) {
        setMessage(result.message ?? fallbackError);
        return;
      }
      router.replace(`/painel/${slug}/google?estado=ligado`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-4" aria-busy={pending}>
      <fieldset className="flex flex-col gap-2.5" disabled={pending}>
        <legend className="mb-2.5 text-sm text-muted">Qual destes é o seu negócio?</legend>
        {options.map((option) => {
          const checked = selected === option.name;
          return (
            <label
              key={option.name}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring sm:p-4 ${
                checked ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-line-strong"
              }`}
            >
              <input
                type="radio"
                name={groupId}
                value={option.name}
                checked={checked}
                onChange={() => setSelected(option.name)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${checked ? "border-accent bg-accent text-accent-contrast" : "border-line-strong"}`}
              >
                {checked ? <Check size={12} strokeWidth={3} /> : null}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-semibold break-words text-text">{option.title}</span>
                {option.address ? (
                  <span className="flex items-start gap-1 text-sm break-words text-muted">
                    <MapPinIcon size={14} className="mt-0.5 shrink-0" />
                    {option.address}
                  </span>
                ) : (
                  <span className="text-sm text-subtle">Sem morada no Google</span>
                )}
              </span>
            </label>
          );
        })}
      </fieldset>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <button type="button" onClick={confirm} disabled={pending} className={buttonClasses("primary", "md", "w-full sm:w-auto")}>
          {pending ? "A guardar…" : "Confirmar o meu negócio"}
        </button>
        <p role="status" className="text-sm text-danger empty:hidden">
          {message}
        </p>
      </div>
    </div>
  );
}

/** "Desligar", with an inline confirmation (friendlier than window.confirm on phones). */
export function GoogleDisconnectButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function disconnect() {
    setMessage(null);
    startTransition(async () => {
      const result = await disconnectGoogleAction(slug).catch(() => ({ ok: false, message: fallbackError }));
      if (!result.ok) {
        setMessage(result.message ?? fallbackError);
        return;
      }
      setConfirming(false);
      router.replace(`/painel/${slug}/google`, { scroll: false });
    });
  }

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className={buttonClasses("secondary", "sm", "self-start")}>
        Desligar
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-danger/30 bg-danger-soft p-3.5 sm:p-4" aria-busy={pending}>
      <p className="text-sm text-text">
        <strong>Desligar o Google?</strong> As reviews que já temos ficam guardadas, mas as próximas voltam a ser lidas do Google Maps (mais devagar) e o perfil deixa de
        estar verificado. Pode voltar a ligar quando quiser.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={disconnect} disabled={pending} className={buttonClasses("primary", "sm", "bg-danger! text-bg! shadow-none!")}>
          {pending ? "A desligar…" : "Sim, desligar"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} disabled={pending} className={buttonClasses("ghost", "sm")}>
          Cancelar
        </button>
      </div>
      <p role="status" className="text-sm text-danger empty:hidden">
        {message}
      </p>
    </div>
  );
}

/**
 * Right after linking, the first read of the history runs in the background: re-reads this page
 * (Supabase only, never Google) every 10 s, for up to 5 minutes, until last_sync_at is set.
 */
export function GoogleImportWatcher() {
  const router = useRouter();
  useEffect(() => {
    let rounds = 0;
    const timer = window.setInterval(() => {
      rounds += 1;
      if (rounds > 30) window.clearInterval(timer);
      else router.refresh();
    }, 10_000);
    return () => window.clearInterval(timer);
  }, [router]);
  return null;
}
