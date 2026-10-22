// The menu's accent colours always come from the business's own logo (owner, 2026-10-22: «mete as cores dos botões e
// assim do menu sempre a partir do logo»; O Ermita's cobalt menu was showing the old fixed pink). The logo is read on
// the server when the page is built (sharp), its main colour picked and made readable:
//  - accent: buttons with white text and accents on the light theme (contrast ≥ 4.5 against white);
//  - accentOnDark: accent text on the dark theme (contrast ≥ 4.5 against the dark background);
//  - soft / glow: the same colour, transparent, for selected rows and the splash's shadow.
// Pure colour logic here (tested in tests/menu-logo-colors.test.mjs); reading the file in menuColorsFromLogo.

export interface MenuColors {
  accent: string;
  accentOnDark: string;
  soft: string;
  glow: string;
}

type Rgb = [number, number, number];

/** The dark theme's background (globals.css, [data-theme="dark"] --bg). */
const darkBackground: Rgb = [0x12, 0x0a, 0x14];

function luminance([r, g, b]: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function toHsl([r, g, b]: Rgb): [number, number, number] {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === rr ? (gg - bb) / d + (gg < bb ? 6 : 0) : max === gg ? (bb - rr) / d + 2 : (rr - gg) / d + 4;
  return [h * 60, s, l];
}

function mix([r, g, b]: Rgb, [r2, g2, b2]: Rgb, amount: number): Rgb {
  return [r + (r2 - r) * amount, g + (g2 - g) * amount, b + (b2 - b) * amount].map((c) => Math.round(c)) as Rgb;
}

const hex = (rgb: Rgb) => `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
const rgba = ([r, g, b]: Rgb, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

/**
 * The logo's main colour from its pixels (RGBA, 4 bytes each): the most present hue among the coloured pixels
 * (transparent, near-white and grey pixels left out), weighted by how colourful each pixel is. A logo without colour
 * (black, grey) gives its darkest common ink. Null when there's nothing to pick (an empty or white logo).
 */
export function pickLogoColor(pixels: Uint8Array | number[]): Rgb | null {
  const buckets = new Map<number, { weight: number; r: number; g: number; b: number }>();
  let inkWeight = 0;
  const ink = [0, 0, 0];
  for (let i = 0; i + 3 < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue;
    const rgb: Rgb = [pixels[i], pixels[i + 1], pixels[i + 2]];
    const [h, s, l] = toHsl(rgb);
    if (l > 0.9) continue;
    if (s >= 0.22 && l >= 0.1 && l <= 0.85) {
      const key = Math.round(h / 15) % 24;
      const weight = s;
      const bucket = buckets.get(key) ?? { weight: 0, r: 0, g: 0, b: 0 };
      bucket.weight += weight;
      bucket.r += rgb[0] * weight;
      bucket.g += rgb[1] * weight;
      bucket.b += rgb[2] * weight;
      buckets.set(key, bucket);
    } else if (l <= 0.6) {
      inkWeight += 1;
      ink[0] += rgb[0];
      ink[1] += rgb[1];
      ink[2] += rgb[2];
    }
  }
  const ranked = [...buckets.values()].sort((a, b) => b.weight - a.weight);
  const colorOf = (b: { weight: number; r: number; g: number; b: number }) => [b.r / b.weight, b.g / b.weight, b.b / b.weight].map((c) => Math.round(c)) as Rgb;
  const best = ranked[0];
  // A few coloured pixels (an outline's antialiasing) don't beat a clearly black logo.
  if (best && best.weight >= Math.max(8, inkWeight * 0.08)) {
    // A light main colour would turn muddy once darkened for white text (Lobo do Mar's coral went brown, 2026-10-23):
    // a deep colour of the same logo that already reads well wins, when it is a real part of the logo.
    const top = colorOf(best);
    if (contrast(top, [255, 255, 255]) < 3) {
      const deep = ranked.slice(1).find((b) => b.weight >= best.weight * 0.3 && contrast(colorOf(b), [255, 255, 255]) >= 4.5);
      if (deep) return colorOf(deep);
    }
    return top;
  }
  if (inkWeight) return ink.map((c) => Math.round(c / inkWeight)) as Rgb;
  return null;
}

/** The menu's colours from the logo's colour, readable on both themes. */
export function colorsFromRgb(color: Rgb): MenuColors {
  let accent = color;
  for (let step = 1; contrast(accent, [255, 255, 255]) < 4.5 && step <= 20; step += 1) accent = mix(color, [0, 0, 0], step * 0.05);
  let onDark = color;
  for (let step = 1; contrast(onDark, darkBackground) < 4.5 && step <= 20; step += 1) onDark = mix(color, [255, 255, 255], step * 0.05);
  return { accent: hex(accent), accentOnDark: hex(onDark), soft: rgba(accent, 0.14), glow: rgba(accent, 0.35) };
}

/** Used when a menu has no logo or it can't be read: a neutral ink, never another business's colour. */
export const neutralMenuColors: MenuColors = colorsFromRgb([58, 52, 60]);
