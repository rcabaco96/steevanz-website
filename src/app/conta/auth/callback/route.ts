import type { NextRequest } from "next/server";
import { openEmailLink } from "@/lib/auth/confirm";

// Links sent before /conta/auth/confirm existed (Supabase's ?code= and our first ?token_hash= ones).
export function GET(request: NextRequest) {
  return openEmailLink(request);
}
