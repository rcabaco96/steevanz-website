import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";
import { isAdminUser, safeNextPath } from "./session";

const otpTypes: EmailOtpType[] = ["magiclink", "email", "signup", "invite", "recovery", "email_change"];

/**
 * Opens a link from one of our emails: checks the one-time token on the server (verifyOtp with the
 * token hash needs no PKCE code verifier, so it works on any device or browser), sets the session
 * cookies and goes to a safe `next`. `?code=` (PKCE links Supabase sent before) is still accepted.
 */
export async function openEmailLink(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");
  const type = otpTypes.find((item) => item === rawType) ?? null;
  const next = safeNextPath(searchParams.get("next"), "");

  const failure = () => {
    const url = new URL("/conta/link-invalido", origin);
    if (type) url.searchParams.set("tipo", type);
    if (next) url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  };

  const supabase = await createAuthClient();
  if (!supabase) return NextResponse.redirect(new URL("/conta/entrar", origin));

  try {
    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
      if (error) throw error;
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else {
      return failure();
    }
  } catch (error) {
    const reason = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    console.error("[auth] email link failed:", reason, error instanceof Error ? error.message : error);
    return failure();
  }

  if (type === "recovery") return NextResponse.redirect(new URL("/conta/nova-password", origin));
  const { data } = await supabase.auth.getUser();
  const home = data.user && isAdminUser(data.user) ? "/admin" : "/conta";
  return NextResponse.redirect(new URL(next || home, origin));
}
