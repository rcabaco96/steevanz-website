import { isShortMapsLink, parseMapsPlaceLink, placeIdFromFid, writeReviewLink } from "./maps-link";

/** Google's hosts for Maps and review links (google.pt/maps, maps.app.goo.gl, g.page…). */
export const googleHosts = /(^|\.)google\.[a-z.]+$|(^|\.)goo\.gl$|(^|\.)g\.page$/;

/** A short Maps link (maps.app.goo.gl…) → the full place link it redirects to (a plain request, no API). */
export async function resolveMapsLink(url: string): Promise<string> {
  let current = url;
  for (let hop = 0; hop < 5 && isShortMapsLink(current); hop++) {
    const response = await fetch(current, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(10_000) });
    const next = response.headers.get("location");
    if (!next) break;
    current = new URL(next, current).toString();
  }
  // A redirect can stop at Google's consent page, with the place link as its "continue" parameter.
  const parsed = new URL(current);
  const resume = parsed.searchParams.get("continue");
  return /(^|\.)consent\./.test(parsed.hostname) && resume ? resume : current;
}

/**
 * A place's Maps link as pasted (full or short) → the link to open it and its write-a-review link.
 * Null when it is not an https Google link. Without a place in the link (or when the short link can't
 * be followed), the pasted link is kept and there is no review link.
 */
export async function mapsPlaceLinks(link: string): Promise<{ mapsUrl: string; reviewUrl: string | null } | null> {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !googleHosts.test(url.hostname)) return null;
  const place = parseMapsPlaceLink(await resolveMapsLink(link).catch(() => link));
  const placeId = place ? placeIdFromFid(place.fid) : null;
  return { mapsUrl: (place?.cleanUrl ?? link).slice(0, 1000), reviewUrl: placeId ? writeReviewLink(placeId) : null };
}
