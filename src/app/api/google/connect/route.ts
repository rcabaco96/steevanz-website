import { NextResponse, type NextRequest } from "next/server";
import { createState, signState, stateTtlSeconds } from "@/lib/google/crypto";
import { buildAuthUrl, callbackPath, googleOAuthConfig, redirectUriFor, stateCookieName } from "@/lib/google/oauth";
import { tryCreateServiceClient } from "@/lib/supabase/service";

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * "Ligar ao Google" in the panel: GET /api/google/connect?slug=<slug> sends the customer to
 * Google's consent screen. The signed state (slug, nonce, 10 min expiry) also goes into an
 * httpOnly cookie that the callback compares (CSRF).
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  if (!slugPattern.test(slug) || slug.length > 60) return new Response("Painel não encontrado.", { status: 404 });
  const panel = (estado: string) => NextResponse.redirect(new URL(`/painel/${slug}/google?estado=${estado}`, request.nextUrl.origin));

  const config = googleOAuthConfig();
  if (!config) return panel("indisponivel");

  const client = tryCreateServiceClient();
  if (!client) return panel("indisponivel");
  const { data, error } = await client.from("review_businesses").select("id").eq("slug", slug).maybeSingle<{ id: string }>();
  if (error) return panel("erro");
  if (!data) return new Response("Painel não encontrado.", { status: 404 });

  const state = signState(createState(slug, Date.now()), config.tokenKey);
  const response = NextResponse.redirect(
    buildAuthUrl({ clientId: config.clientId, redirectUri: redirectUriFor(request.nextUrl.origin), state }),
  );
  response.cookies.set(stateCookieName, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: callbackPath,
    maxAge: stateTtlSeconds,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
