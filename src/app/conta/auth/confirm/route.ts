import type { NextRequest } from "next/server";
import { openEmailLink } from "@/lib/auth/confirm";

// Sign-in, confirmation and password links from our emails (any device or browser).
export function GET(request: NextRequest) {
  return openEmailLink(request);
}
