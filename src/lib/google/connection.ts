/**
 * The customer's Google Business Profile connection (contract:
 * supabase/migrations/20261004150000_google_business_connections.sql).
 *
 * review_businesses.google_link_status:
 * - not_connected: never connected or disconnected.
 * - pending_location: authorized, but we could not tell which of the account's locations is this
 *   customer (several or none matched): the customer picks one (location_options).
 * - connected: account + location stored; reviews can come from the official API.
 * - error: last_error says why (Portuguese, shown in the panel).
 *
 * Only relative imports and type imports, so the pure parts can be tested with node --test.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { decryptSecret, encryptSecret } from "./crypto.ts";
import { describeGoogleError, listAccounts, listLocations, type GbpLocation } from "./gbp-api.ts";
import { businessManageScope, emailFromIdToken, fetchUserEmail, googleOAuthConfig, grantedScopes, revokeToken, type GoogleOAuthConfig, type TokenResponse } from "./oauth.ts";

export type GoogleLinkStatus = "not_connected" | "pending_location" | "connected" | "error";

export interface LocationOption {
  /** `accounts/{id}` the location belongs to. */
  account: string;
  /** `locations/{id}` */
  name: string;
  title: string;
  address: string | null;
  placeId: string | null;
}

export interface GoogleLink {
  status: GoogleLinkStatus;
  email: string | null;
  locationTitle: string | null;
  linkedAt: string | null;
  lastSyncAt: string | null;
  lastError: string | null;
  /** Locations to choose from while status is pending_location. */
  options: { name: string; title: string; address: string | null; placeId: string | null }[] | null;
}

export const emptyGoogleLink: GoogleLink = {
  status: "not_connected",
  email: null,
  locationTitle: null,
  linkedAt: null,
  lastSyncAt: null,
  lastError: null,
  options: null,
};

/** At most this many locations are offered to choose from (agencies can manage thousands). */
export const maxLocationOptions = 100;

export function formatAddress(address: GbpLocation["storefrontAddress"]): string | null {
  if (!address) return null;
  const city = [address.postalCode, address.locality].filter(Boolean).join(" ");
  const parts = [...(address.addressLines ?? []), city].map((part) => part?.trim()).filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export function toLocationOption(account: string, location: GbpLocation): LocationOption {
  return {
    account,
    name: location.name,
    title: location.title?.trim() || location.name,
    address: formatAddress(location.storefrontAddress),
    placeId: location.metadata?.placeId ?? null,
  };
}

const sameTitle = (a: string, b: string) => a.trim().toLocaleLowerCase("pt-PT") === b.trim().toLocaleLowerCase("pt-PT");

export type LocationMatch = { kind: "one"; option: LocationOption } | { kind: "ambiguous" } | { kind: "none" };

/**
 * Which location is this customer: the Google place id first (metadata.placeId equals
 * review_businesses.place_id or google_place_id), else the exact title (case-insensitive).
 * Only a single match counts; otherwise the customer chooses.
 */
export function matchLocation(options: LocationOption[], business: { placeIds: (string | null | undefined)[]; name: string }): LocationMatch {
  const placeIds = new Set(business.placeIds.filter((id): id is string => Boolean(id)));
  const byPlace = options.filter((option) => option.placeId && placeIds.has(option.placeId));
  if (byPlace.length === 1) return { kind: "one", option: byPlace[0] };
  if (byPlace.length > 1) return { kind: "ambiguous" };
  const byTitle = options.filter((option) => sameTitle(option.title, business.name));
  if (byTitle.length === 1) return { kind: "one", option: byTitle[0] };
  return byTitle.length > 1 ? { kind: "ambiguous" } : { kind: "none" };
}

interface ConnectionRow {
  google_email: string | null;
  location_title: string | null;
  location_options: LocationOption[] | null;
  refresh_token_enc: string | null;
  last_sync_at: string | null;
  last_error: string | null;
}

/** State of the connection for the panel. Only reads Supabase. */
export async function loadGoogleLink(client: SupabaseClient, businessId: string): Promise<GoogleLink> {
  try {
    const [business, connection] = await Promise.all([
      client
        .from("review_businesses")
        .select("google_link_status, google_linked_at")
        .eq("id", businessId)
        .maybeSingle<{ google_link_status: GoogleLinkStatus | null; google_linked_at: string | null }>(),
      client
        .from("google_connections")
        .select("google_email, location_title, location_options, last_sync_at, last_error")
        .eq("business_id", businessId)
        .maybeSingle<Omit<ConnectionRow, "refresh_token_enc">>(),
    ]);
    if (business.error) throw new Error(business.error.message);
    if (connection.error) throw new Error(connection.error.message);
    const row = connection.data;
    const status = business.data?.google_link_status ?? "not_connected";
    return {
      status,
      email: row?.google_email ?? null,
      locationTitle: status === "connected" ? (row?.location_title ?? null) : null,
      linkedAt: business.data?.google_linked_at ?? null,
      lastSyncAt: row?.last_sync_at ?? null,
      lastError: row?.last_error ?? null,
      options:
        status === "pending_location" && row?.location_options
          ? row.location_options.map(({ name, title, address, placeId }) => ({ name, title, address, placeId }))
          : null,
    };
  } catch (error) {
    // The panel keeps working (as "not connected") if the migration is missing or Supabase hiccups.
    console.error("[google] loadGoogleLink failed:", error instanceof Error ? error.message : error);
    return emptyGoogleLink;
  }
}

async function setStatus(client: SupabaseClient, businessId: string, status: GoogleLinkStatus) {
  const { error } = await client
    .from("review_businesses")
    .update({ google_link_status: status, google_linked_at: status === "connected" ? new Date().toISOString() : null })
    .eq("id", businessId);
  if (error) throw new Error(error.message);
}

async function updateConnection(client: SupabaseClient, businessId: string, changes: Record<string, unknown>) {
  const { error } = await client
    .from("google_connections")
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq("business_id", businessId);
  if (error) throw new Error(error.message);
}

/** Saves the error for the panel and marks the connection as failed. */
export async function markConnectionError(client: SupabaseClient, businessId: string, message: string) {
  await updateConnection(client, businessId, { last_error: message.slice(0, 500) });
  await setStatus(client, businessId, "error");
}

export type ConnectOutcome = "ligado" | "escolher" | "erro";

export interface ConnectBusiness {
  id: string;
  name: string;
  place_id: string | null;
  google_place_id: string | null;
}

/**
 * Second half of the OAuth callback: stores the (encrypted) tokens, lists the locations the
 * Google account manages and links the customer's one. Never throws: failures end as status
 * "error" with a Portuguese last_error.
 */
export async function completeConnection(client: SupabaseClient, config: GoogleOAuthConfig, business: ConnectBusiness, tokens: TokenResponse): Promise<ConnectOutcome> {
  const businessId = business.id;
  const scopes = grantedScopes(tokens.scope);
  const email = emailFromIdToken(tokens.id_token) ?? (await fetchUserEmail(tokens.access_token));

  try {
    const { data: previous, error: previousError } = await client
      .from("google_connections")
      .select("refresh_token_enc")
      .eq("business_id", businessId)
      .maybeSingle<{ refresh_token_enc: string | null }>();
    if (previousError) throw new Error(previousError.message);
    // Google only sends a refresh token on consent; keep the previous one if it did not.
    const refreshTokenEnc = tokens.refresh_token ? encryptSecret(tokens.refresh_token, config.tokenKey, businessId) : (previous?.refresh_token_enc ?? null);

    const now = new Date().toISOString();
    const { error: saveError } = await client.from("google_connections").upsert(
      {
        business_id: businessId,
        google_email: email,
        account_name: null,
        location_name: null,
        location_title: null,
        location_place_id: null,
        location_options: null,
        refresh_token_enc: refreshTokenEnc,
        access_token_enc: encryptSecret(tokens.access_token, config.tokenKey, businessId),
        access_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        scopes,
        connected_at: now,
        last_error: null,
        updated_at: now,
      },
      { onConflict: "business_id" },
    );
    if (saveError) throw new Error(saveError.message);
  } catch (error) {
    console.error("[google] could not store the connection:", error instanceof Error ? error.message : error);
    await setStatus(client, businessId, "error").catch(() => undefined);
    return "erro";
  }

  try {
    if (!scopes.includes(businessManageScope)) {
      await markConnectionError(client, businessId, "Não deu autorização para gerir o Perfil da Empresa. Volte a ligar a conta e deixe marcada essa opção no ecrã do Google.");
      return "erro";
    }

    const options: LocationOption[] = [];
    for (const account of await listAccounts(tokens.access_token)) {
      for (const location of await listLocations(tokens.access_token, account.name)) options.push(toLocationOption(account.name, location));
    }
    if (!options.length) {
      await markConnectionError(client, businessId, "Esta conta Google não gere nenhum Perfil da Empresa. Ligue a conta Google que gere o perfil do seu negócio no Google.");
      return "erro";
    }

    const match = matchLocation(options, { placeIds: [business.place_id, business.google_place_id], name: business.name });
    if (match.kind === "one") {
      await linkLocation(client, businessId, match.option);
      return "ligado";
    }
    const sorted = [...options].sort((a, b) => a.title.localeCompare(b.title, "pt-PT")).slice(0, maxLocationOptions);
    await updateConnection(client, businessId, { location_options: sorted });
    await setStatus(client, businessId, "pending_location");
    return "escolher";
  } catch (error) {
    console.error("[google] connection failed:", error instanceof Error ? error.message : error);
    await markConnectionError(client, businessId, describeGoogleError(error)).catch(() => undefined);
    return "erro";
  }
}

async function linkLocation(client: SupabaseClient, businessId: string, option: LocationOption) {
  await updateConnection(client, businessId, {
    account_name: option.account,
    location_name: option.name,
    location_title: option.title,
    location_place_id: option.placeId,
    location_options: null,
    last_error: null,
  });
  await setStatus(client, businessId, "connected");
}

/** The customer picked one of the offered locations (status pending_location). */
export async function chooseLocation(client: SupabaseClient, businessId: string, locationName: string): Promise<{ ok: boolean; message?: string }> {
  const { data, error } = await client
    .from("google_connections")
    .select("location_options")
    .eq("business_id", businessId)
    .maybeSingle<{ location_options: LocationOption[] | null }>();
  if (error) throw new Error(error.message);
  const option = data?.location_options?.find((entry) => entry.name === locationName);
  if (!option) return { ok: false, message: "Esse perfil já não está disponível. Volte a ligar a conta Google." };
  await linkLocation(client, businessId, option);
  return { ok: true };
}

/** Revokes the authorization at Google (best effort), deletes the tokens and marks "not connected". */
export async function disconnect(client: SupabaseClient, businessId: string): Promise<void> {
  const { data, error } = await client
    .from("google_connections")
    .select("refresh_token_enc")
    .eq("business_id", businessId)
    .maybeSingle<{ refresh_token_enc: string | null }>();
  if (error) throw new Error(error.message);
  const config = googleOAuthConfig();
  if (data?.refresh_token_enc && config) {
    try {
      await revokeToken(decryptSecret(data.refresh_token_enc, config.tokenKey, businessId));
    } catch (revokeError) {
      console.error("[google] revoke failed:", revokeError instanceof Error ? revokeError.message : revokeError);
    }
  }
  const { error: deleteError } = await client.from("google_connections").delete().eq("business_id", businessId);
  if (deleteError) throw new Error(deleteError.message);
  await setStatus(client, businessId, "not_connected");
}
