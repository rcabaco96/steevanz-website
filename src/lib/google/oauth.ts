/**
 * Google OAuth 2.0 for the Business Profile connection (web server flow, offline access).
 *
 * Env: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_TOKEN_KEY (32 bytes, base64).
 * The redirect URI is always `${origin}/api/google/callback`, origin taken from the request, so
 * localhost and every Vercel domain work as long as they are registered in Google Cloud.
 *
 * Only relative imports, so the pure parts can be tested with node --test.
 */
import { parseTokenKey } from "./crypto.ts";

export const businessManageScope = "https://www.googleapis.com/auth/business.manage";
export const oauthScopes = ["openid", "email", businessManageScope] as const;

/** httpOnly cookie holding the signed state between /api/google/connect and the callback. */
export const stateCookieName = "steevanz_google_oauth";
export const callbackPath = "/api/google/callback";

const authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const tokenEndpoint = "https://oauth2.googleapis.com/token";
const revokeEndpoint = "https://oauth2.googleapis.com/revoke";

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  /** AES-256-GCM key for tokens; also signs the OAuth state. */
  tokenKey: Buffer;
}

export function googleOAuthConfig(env: Record<string, string | undefined> = process.env): GoogleOAuthConfig | null {
  const clientId = env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  const tokenKey = parseTokenKey(env.GOOGLE_TOKEN_KEY);
  if (!clientId || !clientSecret || !tokenKey) return null;
  return { clientId, clientSecret, tokenKey };
}

/** True when the three env vars are set (and the key is 32 bytes): the panel can offer "Ligar ao Google". */
export function googleOAuthConfigured(): boolean {
  return googleOAuthConfig() !== null;
}

export class GoogleNotConfiguredError extends Error {
  constructor() {
    super("Google OAuth is not configured");
    this.name = "GoogleNotConfiguredError";
  }
}

export function requireGoogleOAuthConfig(): GoogleOAuthConfig {
  const config = googleOAuthConfig();
  if (!config) throw new GoogleNotConfiguredError();
  return config;
}

export const redirectUriFor = (origin: string) => `${origin.replace(/\/+$/, "")}${callbackPath}`;

export function buildAuthUrl(options: { clientId: string; redirectUri: string; state: string }): string {
  const url = new URL(authEndpoint);
  url.search = new URLSearchParams({
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    response_type: "code",
    scope: oauthScopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state: options.state,
  }).toString();
  return url.toString();
}

/** Raw token endpoint answer (https://developers.google.com/identity/protocols/oauth2/web-server). */
export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
  token_type?: string;
}

/** Error from oauth2.googleapis.com (`invalid_grant` = the refresh token was revoked or expired). */
export class GoogleTokenError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, description: string) {
    super(`Google token error ${status} ${code}: ${description}`);
    this.name = "GoogleTokenError";
    this.status = status;
    this.code = code;
  }
}

async function tokenRequest(params: Record<string, string>): Promise<TokenResponse> {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await response.json().catch(() => ({}))) as Partial<TokenResponse> & { error?: string; error_description?: string };
  if (!response.ok || !body.access_token) {
    throw new GoogleTokenError(response.status, body.error ?? "unknown_error", body.error_description ?? "");
  }
  return { ...body, access_token: body.access_token, expires_in: Number(body.expires_in ?? 3600) };
}

export function exchangeCode(config: GoogleOAuthConfig, code: string, redirectUri: string): Promise<TokenResponse> {
  return tokenRequest({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
}

export function refreshAccessToken(config: GoogleOAuthConfig, refreshToken: string): Promise<TokenResponse> {
  return tokenRequest({
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
  });
}

/** Best effort: revoking the refresh token also revokes its access tokens. */
export async function revokeToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(revokeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token }).toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Email of the Google account from the id_token. The token comes straight from Google's token
 * endpoint over TLS, so (per OpenID Connect) its signature does not need to be checked here.
 */
export function emailFromIdToken(idToken: string | undefined | null): string | null {
  const payload = idToken?.split(".")[1];
  if (!payload) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: unknown };
    return typeof claims.email === "string" && claims.email.includes("@") ? claims.email.toLowerCase() : null;
  } catch {
    return null;
  }
}

/** Fallback when there is no id_token: the OpenID Connect userinfo endpoint. */
export async function fetchUserEmail(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { email?: unknown };
    return typeof body.email === "string" ? body.email.toLowerCase() : null;
  } catch {
    return null;
  }
}

/** Scopes actually granted (the user can untick "manage your business" on the consent screen). */
export function grantedScopes(scope: string | undefined): string[] {
  return (scope ?? "").split(/\s+/).filter(Boolean);
}
