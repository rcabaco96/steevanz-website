"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { savePushSubscription } from "@/lib/modules/waitlist/actions";
import { brandSecondaryButton } from "../BrandFrame";
import { iosNeedsHomeScreen, notificationsSupported, notify, playChime, pushSupported, subscribePush, unlockAlerts, vibrate } from "./alerts";

const noop = () => () => {};

/** Subscribes this phone to push for the ticket; true when the server kept the subscription. */
async function startPush(pushKey: string | null, token: string): Promise<boolean> {
  if (!pushKey || !pushSupported()) return false;
  const subscription = await subscribePush(pushKey);
  return Boolean(subscription && (await savePushSubscription(token, subscription)).ok);
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
  const supported = useSyncExternalStore(noop, notificationsSupported, () => false);
  const canPush = useSyncExternalStore(noop, pushSupported, () => false);
  const needsHomeScreen = useSyncExternalStore(noop, iosNeedsHomeScreen, () => false);
  const current = permission ?? (supported ? Notification.permission : "unsupported");

  // Notifications already allowed on this phone (an earlier ticket): subscribe this one too, silently.
  useEffect(() => {
    if (status !== "waiting" || hasPush || !canPush || !pushKey || Notification.permission !== "granted") return;
    let live = true;
    startPush(pushKey, token).then((ok) => {
      if (ok && live) setPushOn(true);
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

  if (status !== "waiting") return null;
  if (current === "granted") {
    return (
      <p className="text-center text-sm text-muted">
        {pushOn ? "Avisos ligados: recebe uma notificação quando for a sua vez, mesmo com esta página fechada." : "Avisos ligados neste telemóvel. Não feche esta página."}
      </p>
    );
  }
  return (
    <>
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
          const answer = await Notification.requestPermission();
          setPermission(answer);
          if (answer === "granted" && (await startPush(pushKey, token))) setPushOn(true);
        }}
      >
        {current === "denied" || current === "unsupported" ? "Testar o som do aviso" : "Ativar avisos neste telemóvel"}
      </button>
      {/* iPhone in the browser has no push: it comes once the page is on the home screen. */}
      {needsHomeScreen && !canPush ? (
        <p className="text-center text-xs text-subtle">No iPhone, para ser avisado com a página fechada: botão Partilhar, «Adicionar ao ecrã principal», e abra a senha a partir daí.</p>
      ) : null}
    </>
  );
}
