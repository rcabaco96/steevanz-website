"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { savePushSubscription, sendTestPush } from "@/lib/modules/waitlist/actions";
import { brandSecondaryButton } from "../BrandFrame";
import {
  iosNeedsHomeScreen,
  notificationsSupported,
  notify,
  playChime,
  pushSupported,
  registerQueueWorker,
  subscribePush,
  unlockAlerts,
  vibrate,
  type PushFailure,
} from "./alerts";

const noop = () => () => {};

const pushMessages: Record<PushFailure | "dismissed", string> = {
  unsupported: "Este navegador não recebe notificações com a página fechada. Mantenha-a aberta: toca quando for a sua vez.",
  denied: "As notificações estão bloqueadas para esta senha. Ligue-as nas definições do telemóvel (Notificações) e toque em «Tentar de novo».",
  dismissed: "Para ser avisado, toque em «Permitir» quando o telemóvel perguntar.",
  worker: "Não foi possível preparar os avisos neste telemóvel.",
  subscribe: "O telemóvel não aceitou ligar os avisos.",
  save: "Não foi possível guardar os avisos. Verifique a ligação à internet.",
};

/** Subscribes this phone to push for the ticket and keeps it on the server, or says why not. */
async function startPush(pushKey: string, token: string): Promise<{ ok: true } | { ok: false; reason: PushFailure }> {
  const outcome = await subscribePush(pushKey);
  if (!outcome.ok) {
    if (outcome.detail) console.warn("[fila] push:", outcome.reason, outcome.detail);
    return outcome;
  }
  const saved = await savePushSubscription(token, outcome.subscription).catch(() => ({ ok: false }));
  return saved.ok ? { ok: true } : { ok: false, reason: "save" };
}

/** Partilhar on iPhone: a square with an arrow going up. */
function ShareIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="inline h-[1.15em] w-[1.15em] -translate-y-px align-middle" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M8 7l4-4 4 4" />
      <path d="M8 11H6.5A1.5 1.5 0 0 0 5 12.5v7A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5H16" />
    </svg>
  );
}

/** iPhone in a Safari tab: push only exists once the ticket is on the home screen. */
function IphoneSteps({ onTestSound }: { onTestSound: () => void }) {
  const steps = [
    <>
      Toque em Partilhar <ShareIcon /> <span className="text-muted">(no iOS 26, primeiro em «•••»)</span>.
    </>,
    <>
      Escolha «Adicionar ao ecrã principal», com «Abrir como app web» ligado, e toque em «Adicionar».
    </>,
    <>Abra a senha a partir do novo ícone no ecrã principal e toque em «Ativar avisos neste telemóvel».</>,
  ];
  return (
    <section aria-labelledby="iphone-avisos" className="card flex flex-col gap-4 p-5">
      <h2 id="iphone-avisos" className="text-base font-semibold text-text">
        Para receber a notificação no iPhone
      </h2>
      <ol className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-3 text-sm text-text">
            <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-semibold text-[var(--brand-text)]">
              {index + 1}
            </span>
            <span className="pt-1">{step}</span>
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted">Até lá, mantenha esta página aberta: toca quando for a sua vez.</p>
      <button type="button" className={brandSecondaryButton} onClick={onTestSound}>
        Testar o som do aviso
      </button>
    </section>
  );
}

/** Push is on: a small button asks the server for a test notification, to see it arrive. */
function TestPush({ token, onGone }: { token: string; onGone: (message: string) => void }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={pending}
        aria-busy={pending}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-text transition-colors hover:bg-surface-2 disabled:opacity-60"
        onClick={() =>
          startTransition(async () => {
            const answer = await sendTestPush(token).catch(() => ({ ok: false, message: "Sem ligação. Tente de novo.", gone: false }));
            setResult(answer);
            if (answer.gone) onGone(answer.message);
          })
        }
      >
        {pending ? <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
        {pending ? "A enviar…" : "Enviar notificação de teste"}
      </button>
      {result ? (
        <p role={result.ok ? "status" : "alert"} className={`text-center text-sm ${result.ok ? "text-muted" : "text-danger"}`}>
          {result.message}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Remembers this ticket on the phone and rings once when the status turns "called" (or when the
 * team calls again). Offers to switch on notifications while waiting: with web push, the phone is
 * told even with the page closed (on iPhone, once the page is on the home screen).
 */
export function CallAlert({
  slug,
  token,
  status,
  calledAt,
  title,
  message,
  pushKey,
  hasPush,
}: {
  slug: string;
  token: string;
  status: string;
  calledAt: string | null;
  title: string;
  message: string;
  /** The server's VAPID public key (null when push is not set up). */
  pushKey: string | null;
  /** This ticket already has a push subscription. */
  hasPush: boolean;
}) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported" | null>(null);
  const [pushOn, setPushOn] = useState(hasPush);
  /** Switching push on: in progress, or the reason it failed (shown with «Tentar de novo»). */
  const [phase, setPhase] = useState<"working" | { error: string } | null>(null);
  const supported = useSyncExternalStore(noop, notificationsSupported, () => false);
  const canPush = useSyncExternalStore(noop, pushSupported, () => false);
  const needsHomeScreen = useSyncExternalStore(noop, iosNeedsHomeScreen, () => false);
  const current = permission ?? (supported ? Notification.permission : "unsupported");
  const usePush = canPush && Boolean(pushKey);
  // Allowed already (an earlier ticket) but not subscribed yet: the effect below is subscribing.
  const autoStarting = usePush && status === "waiting" && !pushOn && phase === null && current === "granted";

  // The worker ready before the tap, so the subscription follows the permission prompt quickly.
  useEffect(() => {
    if (usePush && status === "waiting") registerQueueWorker();
  }, [usePush, status]);

  // Notifications already allowed on this phone (an earlier ticket): subscribe this one too.
  useEffect(() => {
    if (status !== "waiting" || hasPush || !canPush || !pushKey || Notification.permission !== "granted") return;
    let live = true;
    startPush(pushKey, token).then((result) => {
      if (!live) return;
      if (result.ok) setPushOn(true);
      else setPhase({ error: pushMessages[result.reason] });
    });
    return () => {
      live = false;
    };
  }, [status, hasPush, canPush, pushKey, token]);

  useEffect(() => {
    try {
      if (status === "waiting" || status === "called") window.localStorage.setItem(`fila:${slug}`, token);
      else window.localStorage.removeItem(`fila:${slug}`);
    } catch {
      // Private mode: the link in the address bar still works.
    }
  }, [slug, token, status]);

  useEffect(() => {
    if (status !== "called" || !calledAt) return;
    const key = `fila-alerta:${token}:${calledAt}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Without storage it may ring again after a reload, which is acceptable.
    }
    playChime();
    vibrate();
    notify(title, message, `fila-${token}`);
    const original = document.title;
    let flip = false;
    const timer = window.setInterval(() => {
      flip = !flip;
      document.title = flip ? `🔔 ${title}` : original;
    }, 1000);
    const stop = () => {
      window.clearInterval(timer);
      document.title = original;
    };
    window.addEventListener("focus", stop, { once: true });
    const timeout = window.setTimeout(stop, 60_000);
    return () => {
      stop();
      window.clearTimeout(timeout);
    };
  }, [status, calledAt, token, title, message]);

  const testSound = () => {
    unlockAlerts();
    playChime();
  };

  /** The tap on «Ativar avisos» / «Tentar de novo»: permission, subscription, saved on the server. */
  const enablePush = async () => {
    unlockAlerts();
    if (!pushKey) return;
    setPhase("working");
    let answer = Notification.permission;
    if (answer === "default") answer = await Notification.requestPermission();
    setPermission(answer);
    if (answer !== "granted") {
      playChime();
      setPhase({ error: pushMessages[answer === "denied" ? "denied" : "dismissed"] });
      return;
    }
    const result = await startPush(pushKey, token);
    if (result.ok) {
      setPushOn(true);
      setPhase(null);
    } else setPhase({ error: pushMessages[result.reason] });
  };

  if (status !== "waiting") return null;

  // iPhone in a Safari tab: steps to put the ticket on the home screen, where push exists.
  if (needsHomeScreen && !canPush) return <IphoneSteps onTestSound={testSound} />;

  if (usePush) {
    if (pushOn) {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm text-muted">Avisos ligados: recebe uma notificação quando for a sua vez, mesmo com esta página fechada.</p>
          <TestPush
            token={token}
            onGone={(text) => {
              setPushOn(false);
              setPhase({ error: text });
            }}
          />
        </div>
      );
    }
    const working = phase === "working" || autoStarting;
    const error = phase && phase !== "working" ? phase.error : null;
    return (
      <div className="flex flex-col gap-3" aria-busy={working}>
        {error ? (
          <p role="alert" className="rounded-2xl bg-danger-soft px-4 py-3 text-center text-sm text-danger">
            {error}
          </p>
        ) : null}
        <button type="button" disabled={working} className={brandSecondaryButton} onClick={enablePush}>
          {working ? <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : null}
          {working ? "A ligar os avisos…" : error ? "Tentar de novo" : "Ativar avisos neste telemóvel"}
        </button>
        {error && current === "denied" ? (
          <button type="button" className="text-center text-sm font-semibold text-muted hover:text-text" onClick={testSound}>
            Testar o som do aviso
          </button>
        ) : null}
      </div>
    );
  }

  // No push here (old browser, or push not set up): the open page rings and notifies.
  if (current === "granted") {
    return <p className="text-center text-sm text-muted">Avisos ligados neste telemóvel. Não feche esta página.</p>;
  }
  return (
    <button
      type="button"
      className={brandSecondaryButton}
      onClick={async () => {
        unlockAlerts();
        if (current === "unsupported" || current === "denied") {
          playChime();
          setPermission(current);
          return;
        }
        setPermission(await Notification.requestPermission());
      }}
    >
      {current === "denied" || current === "unsupported" ? "Testar o som do aviso" : "Ativar avisos neste telemóvel"}
    </button>
  );
}
