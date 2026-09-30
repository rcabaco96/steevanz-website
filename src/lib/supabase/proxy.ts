import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicSupabaseConfig } from "./env";

export async function refreshAdminSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const config = publicSupabaseConfig();
  if (!config) return response;

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers ?? {})) response.headers.set(key, value);
      },
    },
  });

  try {
    await supabase.auth.getClaims();
  } catch (error) {
    console.error("[admin] session refresh failed:", error instanceof Error ? error.message : error);
  }
  return response;
}
