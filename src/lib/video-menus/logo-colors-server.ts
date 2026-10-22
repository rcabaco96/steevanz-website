import "server-only";
import sharp from "sharp";
import { colorsFromRgb, neutralMenuColors, pickLogoColor, type MenuColors } from "./logo-colors";

const siteOrigin = "https://www.steevanz.com";
/** One reading per logo address while the server lives (a new logo has a new address: uploads get new names). */
const cache = new Map<string, Promise<MenuColors>>();

async function read(logoUrl: string): Promise<MenuColors> {
  const response = await fetch(new URL(logoUrl, siteOrigin), { cache: "force-cache" });
  if (!response.ok) throw new Error(`logo ${response.status}`);
  const { data } = await sharp(Buffer.from(await response.arrayBuffer()))
    .resize(64, 64, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const color = pickLogoColor(data);
  return color ? colorsFromRgb(color) : neutralMenuColors;
}

/** The menu's colours from its logo (see ./logo-colors.ts); the neutral ones when it has none or it can't be read. */
export function menuColorsFromLogo(logoUrl: string | null | undefined): Promise<MenuColors> {
  if (!logoUrl) return Promise.resolve(neutralMenuColors);
  let colors = cache.get(logoUrl);
  if (!colors) {
    colors = read(logoUrl).catch((reason) => {
      console.warn("[menus] logo colours not read:", logoUrl, reason instanceof Error ? reason.message : reason);
      cache.delete(logoUrl);
      return neutralMenuColors;
    });
    cache.set(logoUrl, colors);
  }
  return colors;
}
