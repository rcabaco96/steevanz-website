"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { brandSecondaryButton } from "../BrandFrame";
import { notificationsSupported, notify, playChime, unlockAlerts, vibrate } from "./alerts";

const noop = () => () => {};

/**
 * Remembers this ticket on the phone and rings once when the status turns "called" (or when the
 * team calls again). Offers to switch on notifications while waiting.
 */
export function CallAlert({
  slug,
  token,
  status,
  calledAt,
  title,
  message,
}: {
  slug: string;
  token: string;
  status: string;
  calledAt: string | null;
  title: string;
  message: string;
}) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported" | null>(null);
  const supported = useSyncExternalStore(noop, notificationsSupported, () => false);
  const current = permission ?? (supported ? Notification.permission : "unsupported");

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
    notify(title, message);
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
