import { connection } from "next/server";
import { adminEmails } from "@/lib/supabase/env";
import { getSession, isAuthConfigured } from "@/lib/auth/session";

export type AdminContext =
  | { state: "unconfigured" }
  | { state: "anonymous" }
  | { state: "forbidden"; email: string }
  | { state: "admin"; email: string };

export function isAdminConfigured(): boolean {
  return isAuthConfigured() && adminEmails().length > 0;
}

export async function getAdminContext(): Promise<AdminContext> {
  await connection();
  if (!isAdminConfigured()) {
    console.error("[admin] Supabase or ADMIN_EMAILS not configured");
    return { state: "unconfigured" };
  }
  const session = await getSession();
  switch (session.state) {
    case "admin":
      return { state: "admin", email: session.email };
    case "client":
      return { state: "forbidden", email: session.email };
    default:
      return { state: session.state };
  }
}

export class AdminAccessError extends Error {
  constructor() {
    super("Acesso não autorizado");
    this.name = "AdminAccessError";
  }
}

export async function requireAdmin(): Promise<string> {
  const context = await getAdminContext();
  if (context.state !== "admin") throw new AdminAccessError();
  return context.email;
}
