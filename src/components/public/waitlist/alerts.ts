"use client";

// Alerts when the customer is called, without SMS: a sound, a vibration and a browser
// notification. Browsers only allow sound after a tap, so the first tap on the page (joining, or
// "Ativar avisos") unlocks the audio for the rest of the visit.

let audio: AudioContext | null = null;

export function unlockAlerts(): void {
  try {
    // iPhone mutes Web Audio with the ring/silent switch unless the page asks for "playback"
    // (Safari 17+), like a video would; older iPhones ignore this and stay muted on silent.
    const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
    if (session && session.type !== "playback") session.type = "playback";
    const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return;
    audio ??= new Context();
    if (audio.state === "suspended") void audio.resume();
    // A silent tick keeps iOS from blocking later sounds.
    const gain = audio.createGain();
    gain.gain.value = 0;
    const oscillator = audio.createOscillator();
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.01);
  } catch {
    // No audio on this device: the vibration and the notification still work.
  }
}

/** Three rising beeps. */
export function playChime(): void {
  try {
    if (!audio) unlockAlerts();
    if (!audio) return;
    // iOS suspends the audio while the page was in the background: wake it before the beeps.
    if (audio.state !== "running") void audio.resume();
    const start = audio.currentTime + 0.05;
    [660, 880, 1100].forEach((frequency, index) => {
      const oscillator = audio!.createOscillator();
      const gain = audio!.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      const at = start + index * 0.28;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.35, at + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.25);
      oscillator.connect(gain).connect(audio!.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.26);
    });
  } catch {
    // Ignore: other alerts still fire.
  }
}

export function vibrate(): void {
  try {
    navigator.vibrate?.([300, 150, 300, 150, 600]);
  } catch {
    // Not supported (iOS): ignore.
  }
}

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * The same tag as the push notification, so a phone that gets both shows one. Through the service
 * worker when there is one (Android Chrome and iPhone from the home screen refuse `new Notification`).
 */
export function notify(title: string, body: string, tag = "steevanz-fila"): void {
  try {
    if (!notificationsSupported() || Notification.permission !== "granted") return;
    const options = { body, tag, requireInteraction: true, icon: "/apple-icon.png", badge: "/fila-badge.png" };
    const worker = "serviceWorker" in navigator ? navigator.serviceWorker.getRegistration("/fila/") : Promise.resolve(undefined);
    worker
      .then((registration) => {
        if (registration) return registration.showNotification(title, options);
        new Notification(title, options);
      })
      .catch(() => {
        // Some browsers allow neither: the page itself still alerts.
      });
  } catch {
    // Some browsers only allow notifications from a service worker: the page itself still alerts.
  }
}

/** Web push (a notification even with the page closed): Android, computers, and iPhone from the home screen. */
export function pushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/** iPhone or iPad in the browser (not opened from the home screen): push needs the page added there first. */
export function iosNeedsHomeScreen(): boolean {
  if (typeof window === "undefined") return false;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = (navigator as unknown as { standalone?: boolean }).standalone === true || window.matchMedia("(display-mode: standalone)").matches;
  return ios && !standalone;
}

function keyBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let index = 0; index < raw.length; index++) bytes[index] = raw.charCodeAt(index);
  return bytes;
}

const workerPath = "/fila-sw.js";
const workerScope = "/fila/";

/**
 * Registers the queue's service worker ahead of the tap on "Ativar avisos", so subscribing right
 * after the permission prompt is quick (iPhone ties the subscription to that tap).
 */
export function registerQueueWorker(): void {
  try {
    if (pushSupported()) void navigator.serviceWorker.register(workerPath, { scope: workerScope }).catch(() => {});
  } catch {
    // Subscribing tries again and reports the error.
  }
}

/** Why switching push on failed, for the message on the ticket page. */
export type PushFailure = "unsupported" | "denied" | "worker" | "subscribe" | "save";

export type PushOutcome = { ok: true; subscription: PushSubscriptionJSON } | { ok: false; reason: PushFailure; detail?: string };

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((byte, index) => byte === b[index]);
}

function errorText(error: unknown): string {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

/**
 * Subscribes this browser to push for the queue tickets (permission must already be granted), and
 * says why when it can't. The ticket (/fila/slug/token) is inside the worker's scope (/fila/), so
 * the registration becomes active for it; it is awaited directly, with a time limit, instead of
 * waiting forever on `navigator.serviceWorker.ready`.
 */
export async function subscribePush(publicKey: string): Promise<PushOutcome> {
  if (!pushSupported()) return { ok: false, reason: "unsupported" };
  if (Notification.permission === "denied") return { ok: false, reason: "denied" };
  let registration: ServiceWorkerRegistration;
  try {
    registration = (await navigator.serviceWorker.getRegistration(workerScope)) ?? (await navigator.serviceWorker.register(workerPath, { scope: workerScope }));
    if (!registration.active) {
      const worker = registration.installing ?? registration.waiting;
      if (worker) {
        await withTimeout(
          new Promise<void>((resolve) => {
            worker.addEventListener("statechange", () => {
              if (worker.state === "activated") resolve();
            });
          }),
          10_000,
        );
      }
    }
  } catch (error) {
    return { ok: false, reason: "worker", detail: errorText(error) };
  }
  try {
    const key = keyBytes(publicKey);
    let subscription = await registration.pushManager.getSubscription();
    // A subscription made with another server key can't receive our pushes: replace it.
    const previousKey = subscription?.options.applicationServerKey;
    if (subscription && previousKey && !sameBytes(new Uint8Array(previousKey), key)) {
      await subscription.unsubscribe();
      subscription = null;
    }
    subscription ??= await withTimeout(registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key }), 20_000);
    return { ok: true, subscription: subscription.toJSON() };
  } catch (error) {
    // The permission may have been turned off meanwhile (TypeScript remembers the earlier check).
    if ((Notification.permission as NotificationPermission) === "denied") return { ok: false, reason: "denied", detail: errorText(error) };
    return { ok: false, reason: "subscribe", detail: errorText(error) };
  }
}
