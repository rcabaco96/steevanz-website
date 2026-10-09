"use client";

// Alerts when the customer is called, without SMS: a sound, a vibration and a browser
// notification. Browsers only allow sound after a tap, so the first tap on the page (joining, or
// "Ativar avisos") unlocks the audio for the rest of the visit.

let audio: AudioContext | null = null;

export function unlockAlerts(): void {
  try {
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

/** The same tag as the push notification, so a phone that gets both shows one. */
export function notify(title: string, body: string, tag = "steevanz-fila"): void {
  try {
    if (notificationsSupported() && Notification.permission === "granted") new Notification(title, { body, tag, requireInteraction: true });
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

/** Subscribes this browser to push for the queue tickets (permission must already be granted). */
export async function subscribePush(publicKey: string): Promise<PushSubscriptionJSON | null> {
  try {
    await navigator.serviceWorker.register("/fila-sw.js", { scope: "/fila/" });
    const registration = await navigator.serviceWorker.ready;
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) }));
    return subscription.toJSON();
  } catch {
    return null;
  }
}
