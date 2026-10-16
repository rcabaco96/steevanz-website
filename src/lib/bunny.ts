import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { siteUrl } from "@/lib/site";

/**
 * Bunny Stream (owner, 2026-10-15): the menu's dishes can carry their own video, uploaded from the
 * admin straight to Bunny (TUS, signed here) and played as a plain MP4 on the public menu. The keys
 * live only in the server's environment: BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY (the
 * library's key: create, delete, sign uploads) and BUNNY_STREAM_READONLY_KEY (webhook signatures).
 */

const apiBase = "https://video.bunnycdn.com";
export const bunnyTusEndpoint = `${apiBase}/tusupload`;
/** An upload signature stays valid this long (s). */
const uploadTtlSeconds = 6 * 60 * 60;

export interface BunnyConfig {
  libraryId: string;
  apiKey: string;
  readOnlyKey: string;
}

export function bunnyConfig(): BunnyConfig | null {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID?.trim();
  const apiKey = process.env.BUNNY_STREAM_API_KEY?.trim();
  const readOnlyKey = process.env.BUNNY_STREAM_READONLY_KEY?.trim();
  return libraryId && apiKey && readOnlyKey ? { libraryId, apiKey, readOnlyKey } : null;
}

export class BunnyError extends Error {}

function config(): BunnyConfig {
  const value = bunnyConfig();
  if (!value) throw new BunnyError("Bunny Stream não está configurado (faltam variáveis de ambiente).");
  return value;
}

/** Creates an empty video in the library (to upload into); returns its id (guid). */
export async function createBunnyVideo(title: string): Promise<string> {
  const { libraryId, apiKey } = config();
  const response = await fetch(`${apiBase}/library/${libraryId}/videos`, {
    method: "POST",
    headers: { AccessKey: apiKey, "Content-Type": "application/json", Accept: "application/json" },
    // The thumbnail from the first frame (ms): the menu shows it until the video plays from there.
    body: JSON.stringify({ title: title.slice(0, 200), thumbnailTime: 0 }),
    cache: "no-store",
  });
  if (!response.ok) throw new BunnyError(`Bunny create video: HTTP ${response.status}`);
  const data = (await response.json()) as { guid?: string };
  if (!data.guid) throw new BunnyError("Bunny create video: no guid");
  return data.guid;
}

/** Deletes a video from the library; a video that is already gone counts as deleted. */
export async function deleteBunnyVideo(videoId: string): Promise<void> {
  const { libraryId, apiKey } = config();
  const response = await fetch(`${apiBase}/library/${libraryId}/videos/${encodeURIComponent(videoId)}`, {
    method: "DELETE",
    headers: { AccessKey: apiKey, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok && response.status !== 404) throw new BunnyError(`Bunny delete video: HTTP ${response.status}`);
}

/**
 * The small picture (px): a grid card is ~170 px wide × the screen's density, 9:16. A wide video is cut
 * to its centre, as the card shows it (object-cover).
 */
const smallThumbnail = { width: 540, height: 960 };

/**
 * Gives a finished video a small picture (owner, 2026-10-16): Bunny's own thumbnail is the video's full
 * size (up to 4K, ~270 KB) for a card of ~170 px. It is cut to 540×960 (~30 KB) and set as the
 * video's thumbnail; Bunny keeps it under a new name (thumbnail_<hash>.jpg), which is returned.
 */
export async function setSmallBunnyThumbnail(videoId: string): Promise<string> {
  const { libraryId, apiKey } = config();
  const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE?.trim();
  if (!pullZone) throw new BunnyError("Bunny Stream: falta NEXT_PUBLIC_BUNNY_PULL_ZONE.");
  // The pull zone refuses requests without a referrer.
  const original = await fetch(`https://${pullZone}.b-cdn.net/${encodeURIComponent(videoId)}/thumbnail.jpg`, { headers: { Referer: `${siteUrl}/` }, cache: "no-store" });
  if (!original.ok) throw new BunnyError(`Bunny thumbnail: HTTP ${original.status}`);
  const { default: sharp } = await import("sharp");
  const small = await sharp(Buffer.from(await original.arrayBuffer()))
    .resize({ ...smallThumbnail, fit: "cover", position: "centre" })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
  const video = `${apiBase}/library/${libraryId}/videos/${encodeURIComponent(videoId)}`;
  const set = await fetch(`${video}/thumbnail`, { method: "POST", headers: { AccessKey: apiKey, "Content-Type": "image/jpeg" }, body: new Uint8Array(small), cache: "no-store" });
  if (!set.ok) throw new BunnyError(`Bunny set thumbnail: HTTP ${set.status}`);
  const info = await fetch(video, { headers: { AccessKey: apiKey, Accept: "application/json" }, cache: "no-store" });
  if (!info.ok) throw new BunnyError(`Bunny video: HTTP ${info.status}`);
  const name = ((await info.json()) as { thumbnailFileName?: string }).thumbnailFileName;
  if (!name || !/^thumbnail[A-Za-z0-9_-]*\.(jpg|jpeg|png|webp)$/.test(name)) throw new BunnyError(`Bunny thumbnail name: ${name}`);
  return name;
}

export interface TusCredentials {
  endpoint: string;
  libraryId: string;
  videoId: string;
  /** Unix seconds. */
  expire: number;
  signature: string;
}

/** Signs a TUS upload of one video: sha256(libraryId + apiKey + expiration + videoId), valid 6 h. */
export function signBunnyUpload(videoId: string, now = Date.now()): TusCredentials {
  const { libraryId, apiKey } = config();
  const expire = Math.floor(now / 1000) + uploadTtlSeconds;
  const signature = createHash("sha256").update(`${libraryId}${apiKey}${expire}${videoId}`).digest("hex");
  return { endpoint: bunnyTusEndpoint, libraryId, videoId, expire, signature };
}

/**
 * A webhook really from Bunny: HMAC-SHA256 of the raw body with the library's read-only key, in
 * x-bunnystream-signature (v1, hmac-sha256), compared in constant time.
 */
export function verifyBunnyWebhook(rawBody: string, headers: Headers, readOnlyKey = bunnyConfig()?.readOnlyKey): boolean {
  if (!readOnlyKey) return false;
  if (headers.get("x-bunnystream-signature-version")?.trim().toLowerCase() !== "v1") return false;
  if (headers.get("x-bunnystream-signature-algorithm")?.trim().toLowerCase() !== "hmac-sha256") return false;
  const given = headers.get("x-bunnystream-signature")?.trim();
  if (!given) return false;
  const digest = createHmac("sha256", readOnlyKey).update(rawBody, "utf8").digest();
  // Hex (Bunny's documented form); base64 accepted too.
  const candidates = [/^[0-9a-f]+$/i.test(given) ? Buffer.from(given, "hex") : null, Buffer.from(given, "base64")];
  return candidates.some((candidate) => candidate !== null && candidate.length === digest.length && timingSafeEqual(candidate, digest));
}

/** Bunny's video statuses as the webhook sends them. */
export const bunnyStatus = {
  created: 0,
  uploaded: 1,
  processing: 2,
  finished: 3,
  resolutionFinished: 4,
  failed: 5,
  presignedUploadStarted: 6,
  presignedUploadFinished: 7,
  presignedUploadFailed: 8,
} as const;
