/**
 * Reels shown on the hidden test page /raza17raza (owner, 2026-10-14): chosen by hand, one link per
 * reel. Only public reels: Instagram's own embed plays them, nothing is downloaded or stored (Meta's
 * oEmbed terms: display only).
 */
export interface ShowcaseReel {
  /** The Instagram account, without "@". */
  account: string;
  /** The business's name, as the card shows it. */
  name: string;
  /** The reel's link, e.g. "https://www.instagram.com/reel/ABC123xyz/". */
  url: string;
}

const dolciESalati = (code: string): ShowcaseReel => ({ account: "dolciesalati.ap", name: "Dolci e Salati", url: `https://www.instagram.com/reel/${code}/` });

export const showcaseReels: ShowcaseReel[] = [
  "DNtBG5sUCOr",
  "DNF6fL8uN2r",
  "DM-lbCEOei_",
  "DMdyAaOILFK",
  "DMYAiwcoUIy",
  "DMSlccII1RE",
  "DMSk-0-IlQE",
  "C9SuuWUoZBI",
  "CwU6cUgIwK_",
  "CwJIfVcoTpA",
  "CvCeJOzoWuC",
].map(dolciESalati);

/** "https://www.instagram.com/reel/ABC123/?igsh=…" → Instagram's embed page for that reel, or null. */
export function reelEmbedUrl(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:[A-Za-z0-9._]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) return null;
  const kind = match[1] === "p" ? "p" : "reel";
  return `https://www.instagram.com/${kind}/${match[2]}/embed/`;
}
