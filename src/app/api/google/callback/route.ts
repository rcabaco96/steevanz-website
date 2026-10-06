import { after, NextResponse, type NextRequest } from "next/server";
import { completeConnection, markConnectionError, type ConnectBusiness } from "@/lib/google/connection";
import { sameState, verifyState } from "@/lib/google/crypto";
import { describeGoogleError } from "@/lib/google/gbp-api";
import { syncFromGoogleBusiness } from "@/lib/google/gbp-sync";
import { callbackPath, exchangeCode, googleOAuthConfig, redirectUriFor, stateCookieName } from "@/lib/google/oauth";
import { tryCreateServiceClient } from "@/lib/supabase/service";

/** Room for the first whole-history import, which runs after the redirect (after()). */
export const maxDuration = 300;

function plain(message: string, status: number) {
  return new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

/**
 * Google sends the customer back here after the consent screen. Checks the signed state against
 * the cookie, exchanges the code, stores the encrypted tokens and links the customer's location,
 * then returns to /painel/<slug>/google?estado=ligado | escolher | erro | cancelado.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const config = googleOAuthConfig();
  if (!config) return plain("A ligação ao Google não está disponível de momento.", 503);

  const stateParam = params.get("state");
  const state = verifyState(stateParam, config.tokenKey, Date.now());
  if (!state) return plain("O pedido de ligação ao Google expirou ou é inválido. Volte ao painel e carregue outra vez em «Ligar ao Google».", 400);

  const panel = (estado: string) => {
    const response = NextResponse.redirect(new URL(`/painel/${state.slug}/google?estado=${estado}`, request.nextUrl.origin));
    response.cookies.set(stateCookieName, "", { httpOnly: true, sameSite: "lax", secure: request.nextUrl.protocol === "https:", path: callbackPath, maxAge: 0 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  };

  // CSRF: the state must be the one this browser received from /api/google/connect.
  if (!sameState(stateParam, request.cookies.get(stateCookieName)?.value)) return panel("erro");

  const googleError = params.get("error");
  if (googleError) return panel(googleError === "access_denied" ? "cancelado" : "erro");
  const code = params.get("code");
  if (!code) return panel("erro");

  const client = tryCreateServiceClient();
  if (!client) return panel("erro");
  const { data: business, error } = await client
    .from("review_businesses")
    .select("id, name, place_id, google_place_id")
    .eq("slug", state.slug)
    .maybeSingle<ConnectBusiness>();
  if (error || !business) return panel("erro");

  let tokens;
  try {
    tokens = await exchangeCode(config, code, redirectUriFor(request.nextUrl.origin));
  } catch (exchangeError) {
    console.error("[google] code exchange failed:", exchangeError instanceof Error ? exchangeError.message : exchangeError);
    try {
      // The row may not exist yet: create it so the panel can show why it failed.
      await client.from("google_connections").upsert({ business_id: business.id, updated_at: new Date().toISOString() }, { onConflict: "business_id" });
      await markConnectionError(client, business.id, describeGoogleError(exchangeError));
    } catch {
      // The redirect still tells the customer it failed.
    }
    return panel("erro");
  }

  const outcome = await completeConnection(client, config, business, tokens);
  // First read of the whole history through the official API (free), after the redirect is sent.
  if (outcome === "ligado") after(() => syncFromGoogleBusiness(client, business.id, "full").then(() => undefined));
  return panel(outcome);
}
