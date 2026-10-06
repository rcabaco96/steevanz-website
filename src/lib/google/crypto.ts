/**
 * Secrets of the Google Business Profile connection.
 *
 * - Tokens are encrypted with AES-256-GCM before they reach Supabase. Stored format:
 *   `iv.tag.ciphertext`, each part base64. The business id is bound as additional authenticated
 *   data, so a token copied to another customer's row does not decrypt.
 * - The OAuth `state` is HMAC-signed (key derived from the same GOOGLE_TOKEN_KEY) and carries the
 *   panel slug, a nonce and an expiry. The callback also compares it with an httpOnly cookie (CSRF).
 *
 * Only node:crypto, so it can be tested with node --test.
 */
import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** GOOGLE_TOKEN_KEY: 32 random bytes, base64 (`openssl rand -base64 32`). Null when missing or invalid. */
export function parseTokenKey(value: string | undefined | null): Buffer | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const key = Buffer.from(trimmed, "base64");
  return key.length === 32 ? key : null;
}

export function encryptSecret(plain: string, key: Buffer, aad: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aad, "utf8"));
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString("base64")).join(".");
}

/** Throws when the value was tampered with, belongs to another business or uses another key. */
export function decryptSecret(stored: string, key: Buffer, aad: string): string {
  const parts = stored.split(".");
  if (parts.length !== 3) throw new Error("Invalid encrypted value");
  const [iv, tag, ciphertext] = parts.map((part) => Buffer.from(part, "base64"));
  if (iv.length !== 12 || tag.length !== 16) throw new Error("Invalid encrypted value");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAAD(Buffer.from(aad, "utf8"));
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

/** The OAuth state lives 10 minutes: enough to go through Google's consent screens. */
export const stateTtlSeconds = 600;

export interface OAuthState {
  slug: string;
  nonce: string;
  /** Expiry, seconds since the epoch. */
  exp: number;
}

/** A separate key for signing, so the encryption key is never used for two purposes. */
function stateKey(key: Buffer): Buffer {
  return createHmac("sha256", key).update("steevanz:google-oauth-state").digest();
}

const base64url = (value: Buffer | string) => Buffer.from(value).toString("base64url");

export function createState(slug: string, nowMs: number): OAuthState {
  return { slug, nonce: randomBytes(16).toString("base64url"), exp: Math.floor(nowMs / 1000) + stateTtlSeconds };
}

export function signState(state: OAuthState, key: Buffer): string {
  const body = base64url(JSON.stringify({ s: state.slug, n: state.nonce, e: state.exp }));
  const signature = createHmac("sha256", stateKey(key)).update(body).digest("base64url");
  return `${body}.${signature}`;
}

/** The state when the signature is valid and it has not expired; null otherwise. */
export function verifyState(token: string | null | undefined, key: Buffer, nowMs: number): OAuthState | null {
  if (!token || token.length > 1000) return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return null;
  const expected = createHmac("sha256", stateKey(key)).update(body).digest();
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { s?: unknown; n?: unknown; e?: unknown };
    if (typeof parsed.s !== "string" || typeof parsed.n !== "string" || typeof parsed.e !== "number") return null;
    if (parsed.e * 1000 <= nowMs) return null;
    return { slug: parsed.s, nonce: parsed.n, exp: parsed.e };
  } catch {
    return null;
  }
}

/** Constant-time comparison of the state Google sent back with the one in the cookie. */
export function sameState(fromGoogle: string | null | undefined, fromCookie: string | null | undefined): boolean {
  if (!fromGoogle || !fromCookie) return false;
  const a = Buffer.from(fromGoogle);
  const b = Buffer.from(fromCookie);
  return a.length === b.length && timingSafeEqual(a, b);
}
