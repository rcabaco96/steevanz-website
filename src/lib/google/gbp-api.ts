/**
 * Google Business Profile APIs used by the connection.
 *
 * - Accounts: My Business Account Management API (v1).
 * - Locations: My Business Business Information API (v1). Location names are `locations/{id}`.
 * - Reviews and replies: Google My Business API v4, path `accounts/{a}/locations/{l}/reviews`.
 *
 * Every API needs to be enabled in the Google Cloud project AND Google must approve the project
 * for Business Profile API access (default quota is 0 until then). Errors are turned into clear
 * Portuguese messages by `describeGoogleError`.
 *
 * Only relative imports and type imports, so the pure parts can be tested with node --test.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { decryptSecret, encryptSecret } from "./crypto.ts";
import { GoogleTokenError, refreshAccessToken, type GoogleOAuthConfig } from "./oauth.ts";

const accountsApi = "https://mybusinessaccountmanagement.googleapis.com/v1";
const businessInfoApi = "https://mybusinessbusinessinformation.googleapis.com/v1";
const reviewsApi = "https://mybusiness.googleapis.com/v4";

/** An error answer of a Google API, with the reason Google gives (e.g. SERVICE_DISABLED). */
export class GoogleApiError extends Error {
  readonly status: number;
  readonly reason: string | null;
  readonly googleMessage: string;
  /** Google answers with a quota of 0 while the project is not approved for the API. */
  readonly quotaLimitZero: boolean;

  constructor(status: number, reason: string | null, googleMessage: string, quotaLimitZero = false) {
    super(`Google API ${status}${reason ? ` ${reason}` : ""}: ${googleMessage}`);
    this.name = "GoogleApiError";
    this.status = status;
    this.reason = reason;
    this.googleMessage = googleMessage;
    this.quotaLimitZero = quotaLimitZero;
  }
}

interface GoogleErrorBody {
  error?: {
    code?: number;
    message?: string;
    status?: string;
    errors?: { reason?: string }[];
    details?: { "@type"?: string; reason?: string; metadata?: Record<string, string> }[];
  };
}

export function parseGoogleError(status: number, body: unknown): GoogleApiError {
  const error = (body as GoogleErrorBody | null)?.error;
  const info = error?.details?.find((detail) => detail.reason);
  const reason = info?.reason ?? error?.errors?.find((entry) => entry.reason)?.reason ?? error?.status ?? null;
  const quotaLimitZero = info?.metadata?.quota_limit_value === "0";
  return new GoogleApiError(status, reason, error?.message ?? "", quotaLimitZero);
}

/** Message shown to the customer when Google has not approved the Steevanz project yet. */
export const awaitingApprovalMessage =
  "A aplicação Steevanz ainda está à espera da aprovação do Google para usar a API do Perfil da Empresa. A sua autorização ficou registada: assim que o Google aprovar, volte a ligar a conta.";

const reconnectMessage = "A autorização do Google expirou ou foi retirada. Volte a ligar a conta Google.";

/** Plain Portuguese explanation of a failed Google call, for google_connections.last_error. */
export function describeGoogleError(error: unknown): string {
  if (error instanceof GoogleTokenError) {
    if (error.code === "invalid_grant") return reconnectMessage;
    if (error.code === "invalid_client" || error.code === "unauthorized_client") return "A ligação ao Google está mal configurada do lado da Steevanz. Já fomos avisados.";
    return "O Google não aceitou a autorização. Tente ligar a conta outra vez.";
  }
  if (error instanceof GoogleApiError) {
    const reason = (error.reason ?? "").toUpperCase();
    const text = error.googleMessage.toLowerCase();
    const notEnabled =
      reason === "SERVICE_DISABLED" ||
      reason === "ACCESSNOTCONFIGURED" ||
      text.includes("has not been used in project") ||
      text.includes("is disabled") ||
      text.includes("not been approved");
    if ((error.status === 403 || error.status === 429) && (notEnabled || error.quotaLimitZero)) return awaitingApprovalMessage;
    if (error.status === 403 && reason === "ACCESS_TOKEN_SCOPE_INSUFFICIENT")
      return "Não deu autorização para gerir o Perfil da Empresa. Volte a ligar a conta e deixe marcada essa opção no ecrã do Google.";
    if (error.status === 401) return reconnectMessage;
    if (error.status === 403)
      return "O Google recusou o pedido. Ou a aplicação Steevanz ainda aguarda a aprovação do Google, ou esta conta Google já não gere o perfil da empresa.";
    if (error.status === 404) return "O perfil da empresa já não existe ou deixou de estar acessível com esta conta Google.";
    if (error.status === 429) return "O Google limitou temporariamente os pedidos. Tente de novo daqui a alguns minutos.";
    if (error.status >= 500) return "O Google está com problemas neste momento. Tente de novo mais tarde.";
    return "O Google devolveu um erro inesperado. Tente de novo mais tarde.";
  }
  return "Não foi possível falar com o Google. Tente de novo mais tarde.";
}

/** True when the stored authorization is no longer usable and the customer must connect again. */
export function needsReconnect(error: unknown): boolean {
  return (error instanceof GoogleTokenError && error.code === "invalid_grant") || (error instanceof GoogleApiError && error.status === 401);
}

async function googleRequest<T>(accessToken: string, url: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const response = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) throw parseGoogleError(response.status, body);
  return (body ?? {}) as T;
}

// ---------------------------------------------------------------------------------------------
// Accounts and locations
// ---------------------------------------------------------------------------------------------

export interface GbpAccount {
  /** `accounts/{id}` */
  name: string;
  accountName?: string;
  type?: string;
}

export interface GbpLocation {
  /** `locations/{id}` */
  name: string;
  title?: string;
  storefrontAddress?: { addressLines?: string[]; locality?: string; postalCode?: string; regionCode?: string };
  metadata?: { placeId?: string; mapsUri?: string };
}

/** Safety caps: an agency account can manage thousands of locations. */
const maxPages = 50;

export async function listAccounts(accessToken: string): Promise<GbpAccount[]> {
  const accounts: GbpAccount[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < maxPages; page++) {
    const query = new URLSearchParams({ pageSize: "20", ...(pageToken ? { pageToken } : {}) });
    const body = await googleRequest<{ accounts?: GbpAccount[]; nextPageToken?: string }>(accessToken, `${accountsApi}/accounts?${query}`);
    accounts.push(...(body.accounts ?? []));
    pageToken = body.nextPageToken;
    if (!pageToken) break;
  }
  return accounts;
}

export async function listLocations(accessToken: string, accountName: string): Promise<GbpLocation[]> {
  const locations: GbpLocation[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < maxPages; page++) {
    const query = new URLSearchParams({
      readMask: "name,title,storefrontAddress,metadata",
      pageSize: "100",
      ...(pageToken ? { pageToken } : {}),
    });
    const body = await googleRequest<{ locations?: GbpLocation[]; nextPageToken?: string }>(accessToken, `${businessInfoApi}/${accountName}/locations?${query}`);
    locations.push(...(body.locations ?? []));
    pageToken = body.nextPageToken;
    if (!pageToken) break;
  }
  return locations;
}

// ---------------------------------------------------------------------------------------------
// Reviews (v4)
// ---------------------------------------------------------------------------------------------

export type StarRating = "STAR_RATING_UNSPECIFIED" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";

/**
 * A review as the v4 API returns it. `reviewer` (displayName, profilePhotoUrl) is part of the
 * answer but is never read or stored: Steevanz does not keep personal data of reviewers.
 */
export interface GbpReview {
  /** `accounts/{a}/locations/{l}/reviews/{reviewId}` */
  name: string;
  reviewId: string;
  starRating: StarRating;
  comment?: string;
  createTime: string;
  updateTime: string;
  reviewReply?: { comment?: string; updateTime?: string };
}

export interface GbpReviewsPage {
  reviews?: GbpReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
}

/** v4 path of a location: `accounts/{a}/locations/{l}` (the Business Information API only gives `locations/{l}`). */
export function v4LocationPath(accountName: string, locationName: string): string {
  return `${accountName.replace(/\/+$/, "")}/${locationName.replace(/^\/+/, "")}`;
}

export interface ListReviewsOptions {
  accessToken: string;
  pageToken?: string;
  orderBy?: "updateTime desc" | "rating" | "rating desc";
  /** 1–50 */
  pageSize?: number;
}

/** One page of reviews of `accounts/{a}/locations/{l}`. */
export function listReviews(locationPath: string, options: ListReviewsOptions): Promise<GbpReviewsPage> {
  const query = new URLSearchParams({
    pageSize: String(Math.min(50, Math.max(1, options.pageSize ?? 50))),
    orderBy: options.orderBy ?? "updateTime desc",
    ...(options.pageToken ? { pageToken: options.pageToken } : {}),
  });
  return googleRequest<GbpReviewsPage>(options.accessToken, `${reviewsApi}/${locationPath}/reviews?${query}`);
}

/**
 * Publishes (or replaces) the owner's reply to a review: PUT v4 `{reviewPath}/reply`, where
 * reviewPath is `accounts/{a}/locations/{l}/reviews/{reviewId}` (GbpReview.name). Google limits
 * replies to 4096 bytes. Not wired to the panel yet: "Aceitar" in Respostas still only approves.
 */
export function putReply(accessToken: string, reviewPath: string, comment: string): Promise<{ comment?: string; updateTime?: string }> {
  return googleRequest(accessToken, `${reviewsApi}/${reviewPath}/reply`, { method: "PUT", body: { comment } });
}

// ---------------------------------------------------------------------------------------------
// Access tokens
// ---------------------------------------------------------------------------------------------

/** Refresh one minute early so a token never expires in the middle of a sync. */
const expiryMarginMs = 60_000;

/**
 * A valid access token for a business: the cached one (encrypted in google_connections) while it
 * lasts, else a new one from the refresh token, cached again. Throws GoogleTokenError
 * (`invalid_grant`) when the customer revoked access.
 */
export async function accessTokenFor(client: SupabaseClient, config: GoogleOAuthConfig, businessId: string): Promise<string> {
  const { data, error } = await client
    .from("google_connections")
    .select("refresh_token_enc, access_token_enc, access_expires_at")
    .eq("business_id", businessId)
    .maybeSingle<{ refresh_token_enc: string | null; access_token_enc: string | null; access_expires_at: string | null }>();
  if (error) throw new Error(error.message);
  if (!data?.refresh_token_enc) throw new GoogleTokenError(400, "invalid_grant", "No refresh token stored");

  if (data.access_token_enc && data.access_expires_at && Date.parse(data.access_expires_at) - expiryMarginMs > Date.now()) {
    try {
      return decryptSecret(data.access_token_enc, config.tokenKey, businessId);
    } catch {
      // Key rotated or value damaged: fall through and refresh.
    }
  }

  const refreshToken = decryptSecret(data.refresh_token_enc, config.tokenKey, businessId);
  const tokens = await refreshAccessToken(config, refreshToken);
  const { error: saveError } = await client
    .from("google_connections")
    .update({
      access_token_enc: encryptSecret(tokens.access_token, config.tokenKey, businessId),
      access_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      // Google rarely rotates the refresh token, but when it does the old one stops working.
      ...(tokens.refresh_token ? { refresh_token_enc: encryptSecret(tokens.refresh_token, config.tokenKey, businessId) } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("business_id", businessId);
  if (saveError) console.error("[google] could not cache access token:", saveError.message);
  return tokens.access_token;
}
