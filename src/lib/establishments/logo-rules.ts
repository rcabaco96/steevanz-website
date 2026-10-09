// The establishment's logo and the icon drawn from it (home screen and notifications of the queue
// ticket). Pure module: also used by the tests.

export const logoBucket = "establishment-logos";
export const logoMaxBytes = 2 * 1024 * 1024;

/** The icon sizes the icon route draws: notification, apple-touch-icon, manifest. */
export const iconSizes = [96, 180, 192, 512] as const;
export type IconSize = (typeof iconSizes)[number];

export function iconSize(value: string): IconSize | null {
  const size = Number(value);
  return (iconSizes as readonly number[]).includes(size) ? (size as IconSize) : null;
}

/**
 * The image type from its first bytes (never from the name or the browser's word for it).
 * WebP is recognised so it can be refused with a clear message: the icon renderer can't draw it,
 * so the settings page turns it into PNG before sending.
 */
export function imageTypeOf(bytes: Uint8Array): "png" | "jpeg" | "webp" | null {
  const starts = (signature: (number | null)[]) => bytes.length >= signature.length && signature.every((byte, index) => byte === null || bytes[index] === byte);
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (starts([0xff, 0xd8, 0xff])) return "jpeg";
  if (starts([0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50])) return "webp";
  return null;
}

const logoPathPattern = /^[0-9a-f-]{36}\/([A-Za-z0-9_-]+)\.(png|jpg)$/;

/** Where a new logo of this establishment is stored: "<id>/<random>.<ext>". */
export function logoPathFor(establishmentId: string, random: string, type: "png" | "jpeg"): string {
  return `${establishmentId}/${random}.${type === "png" ? "png" : "jpg"}`;
}

/** Only paths of this establishment's own folder (a stored path is never trusted to point elsewhere). */
export function ownsLogoPath(establishmentId: string, path: string | null | undefined): path is string {
  return Boolean(path && logoPathPattern.test(path) && path.startsWith(`${establishmentId}/`));
}

/** Changes with every new logo, so phones and caches fetch the new icon: the file's random name. */
export function logoVersion(path: string | null | undefined): string {
  return path?.match(logoPathPattern)?.[1] ?? "0";
}

/** The ticket's icon for the home screen, the manifest and the notifications. */
export function iconUrl(slug: string, size: IconSize, logoPath: string | null | undefined, maskable = false): string {
  const query = new URLSearchParams({ v: logoVersion(logoPath) });
  if (maskable) query.set("m", "1");
  return `/fila/${slug}/icon/${size}?${query}`;
}

export function logoPublicUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${logoBucket}/${path}`;
}

const smallWords = new Set(["a", "as", "o", "os", "e", "de", "da", "das", "do", "dos", "du", "the", "and", "&", "of"]);

/** One or two capital letters from the name ("Barbearia do Zé" → "BZ", "Tasca" → "T"). */
export function initialsOf(name: string): string {
  const words = name
    .normalize("NFC")
    .split(/[\s\-–—_/.,·|]+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);
  const main = words.filter((word) => !smallWords.has(word.toLowerCase()));
  const picked = (main.length ? main : words).slice(0, 2).map((word) => Array.from(word)[0]);
  return picked.join("").toLocaleUpperCase("pt-PT") || "?";
}

/** The establishment's colour when it is a proper "#rrggbb", else the Steevanz one. */
export function iconColor(accent: string | null | undefined): string {
  return accent && /^#[0-9a-fA-F]{6}$/.test(accent) ? accent : "#7a2d60";
}
