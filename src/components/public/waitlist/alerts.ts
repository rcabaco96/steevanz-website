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

export function notify(title: string, body: string): void {
  try {
    if (notificationsSupported() && Notification.permission === "granted") new Notification(title, { body, tag: "steevanz-fila", requireInteraction: true });
  } catch {
    // Some browsers only allow notifications from a service worker: the page itself still alerts.
  }
}
