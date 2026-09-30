import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";

const otpTypes: EmailOtpType[] = ["magiclink", "email", "signup", "invite", "recovery", "email_change"];

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const failure = NextResponse.redirect(new URL("/admin/login?erro=link", origin));

  const supabase = await createAuthClient();
  if (!supabase) return failure;

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (tokenHash && type && otpTypes.includes(type)) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
      if (error) throw error;
    } else {
      return failure;
    }
  } catch (error) {
    console.error("[admin] auth callback failed:", error instanceof Error ? error.message : error);
    return failure;
  }

  return NextResponse.redirect(new URL("/admin", origin));
}
