import type { NextRequest } from "next/server";
import { openEmailLink } from "@/lib/auth/confirm";

// Same as /conta/auth/confirm; admin emails get this address so the link reads as the admin's.
export function GET(request: NextRequest) {
  return openEmailLink(request);
}
