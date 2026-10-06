import { NextResponse, type NextRequest } from "next/server";

// Legacy magic-link callback: links already sent keep working.
export function GET(request: NextRequest) {
  const url = new URL("/conta/auth/callback", request.nextUrl.origin);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url);
}
