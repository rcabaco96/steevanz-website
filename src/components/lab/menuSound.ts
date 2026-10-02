"use client";

/**
 * Menu open/close sound, synthesised with Web Audio (no audio files): a short ~1 kHz
 * swell that snaps into a crisp 2 kHz click, then a faint airy shimmer that blooms and
 * fades over ~1.5 s. Same sound on open and close. Off when the visitor mutes it.
 */

const SOUND_KEY = "steevanz-sound";

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

export function soundEnabled(): boolean {
  if (sessionOff !== null) return !sessionOff;
  try {
    return localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

let sessionOff: boolean | null = null;
const listeners = new Set<() => void>();

export function setSoundEnabled(on: boolean) {
  sessionOff = !on;
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    // Not persisted in private mode; applies for this visit only.
  }
  listeners.forEach((listener) => listener());
}

/** For useSyncExternalStore: re-render when the sound setting changes. */
export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function context(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  noise = ctx.createBuffer(1, ctx.sampleRate * 1.6, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return ctx;
}

function tone(ac: AudioContext, out: AudioNode, freq: number, start: number, peak: number, attack: number, release: number, level: number) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(level, start + attack);
  gain.gain.setValueAtTime(level, start + attack + peak);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + peak + release);
  osc.connect(gain).connect(out);
  osc.start(start);
  osc.stop(start + attack + peak + release + 0.05);
}

/**
 * Browsers keep page audio locked until the visitor's first click, tap or key press
 * (scrolling doesn't count). Unlock on that first gesture, wherever it happens, so the
 * hover ticks (menu, timeline) work from then on, not only after the menu was opened.
 */
function unlockOnFirstGesture() {
  const events = ["pointerdown", "keydown", "touchend"] as const;
  const unlock = () => {
    const ac = context();
    if (ac && ac.state === "suspended") void ac.resume();
    events.forEach((name) => window.removeEventListener(name, unlock, true));
  };
  events.forEach((name) => window.addEventListener(name, unlock, { capture: true, passive: true }));
}

if (typeof window !== "undefined") unlockOnFirstGesture();

export function playMenuSound() {
  if (!soundEnabled()) return;
  const ac = context();
  if (!ac || !noise) return;
  if (ac.state === "suspended") void ac.resume();
  const t = ac.currentTime + 0.01;

  const master = ac.createGain();
  master.gain.value = 0.55;
  master.connect(ac.destination);

  // 1. Swell: a soft 980 Hz tone rising into the click.
  tone(ac, master, 980, t, 0, 0.1, 0.03, 0.05);
  tone(ac, master, 2940, t + 0.04, 0, 0.06, 0.03, 0.008);

  // 2. Click: bright 1.96 kHz ping with a tiny noise transient, gone in ~70 ms.
  tone(ac, master, 1960, t + 0.1, 0.004, 0.003, 0.07, 0.16);
  tone(ac, master, 980, t + 0.1, 0, 0.003, 0.05, 0.05);
  const tick = ac.createBufferSource();
  tick.buffer = noise;
  const tickBand = ac.createBiquadFilter();
  tickBand.type = "bandpass";
  tickBand.frequency.value = 4800;
  tickBand.Q.value = 1.2;
  const tickGain = ac.createGain();
  tickGain.gain.setValueAtTime(0.0001, t + 0.1);
  tickGain.gain.exponentialRampToValueAtTime(0.09, t + 0.102);
  tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
  tick.connect(tickBand).connect(tickGain).connect(master);
  tick.start(t + 0.1, 0, 0.06);

  // 3. Shimmer tail: faint 1 kHz / 3 kHz partials and airy high noise, blooming then fading.
  tone(ac, master, 1000, t + 0.34, 0.08, 0.36, 0.7, 0.012);
  tone(ac, master, 3000, t + 0.38, 0.05, 0.32, 0.6, 0.008);
  const air = ac.createBufferSource();
  air.buffer = noise;
  const airHigh = ac.createBiquadFilter();
  airHigh.type = "bandpass";
  airHigh.frequency.value = 6800;
  airHigh.Q.value = 0.7;
  const airGain = ac.createGain();
  airGain.gain.setValueAtTime(0.0001, t + 0.34);
  airGain.gain.exponentialRampToValueAtTime(0.016, t + 0.72);
  airGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
  air.connect(airHigh).connect(airGain).connect(master);
  air.start(t + 0.34, 0.2, 1.2);

  window.setTimeout(() => master.disconnect(), 1700);
}

let lastHover = 0;

/** Hover tick for menu rows and the timeline: two tiny ~6 kHz noise clicks 10 ms apart (~15 ms total). */
export function playHoverSound() {
  if (!soundEnabled()) return;
  const now = performance.now();
  if (now - lastHover < 45) return;
  lastHover = now;
  // Silent until the first gesture has unlocked audio (see unlockOnFirstGesture).
  const ac = ctx;
  if (!ac || !noise || ac.state !== "running") return;
  const t = ac.currentTime + 0.005;
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 5800;
  band.Q.value = 1.6;
  const out = ac.createGain();
  out.gain.value = 0.5;
  band.connect(out).connect(ac.destination);
  for (const [at, level] of [[0, 0.12], [0.01, 0.3]] as const) {
    const src = ac.createBufferSource();
    src.buffer = noise;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, t + at);
    gain.gain.exponentialRampToValueAtTime(level, t + at + 0.0008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + at + 0.005);
    src.connect(gain).connect(band);
    src.start(t + at, Math.random() * 1.2, 0.01);
  }
  window.setTimeout(() => out.disconnect(), 200);
}
