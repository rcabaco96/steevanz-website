import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export type PanelAccess = "allowed" | "anonymous" | "denied";

export interface OwnedPanel {
  slug: string;
  name: string;
}

/**
 * Who may open /painel/<slug>: admins see every panel, a client only the panels assigned to
 * their account in /admin/reviews. Unknown slugs are "denied" too, so a client can't tell a
 * panel that exists apart from one that doesn't.
 */
export async function panelAccess(slug: string): Promise<PanelAccess> {
  const session = await getSession();
  if (session.state === "admin") return "allowed";
  if (session.state !== "client") return "anonymous";
  const client = tryCreateServiceClient();
  if (!client) return "denied";
  const { data, error } = await client.from("review_businesses").select("owner_id").eq("slug", slug).maybeSingle<{ owner_id: string | null }>();
  if (error) {
    console.error("[painel] access check failed:", error.message);
    return "denied";
  }
  return data?.owner_id === session.user.id ? "allowed" : "denied";
}

/** For pages: sends visitors without a session to sign in, and returns whether the panel can be shown. */
export async function requirePanelPage(slug: string, path: string): Promise<boolean> {
  const access = await panelAccess(slug);
  if (access === "anonymous") redirect(`/conta/entrar?next=${encodeURIComponent(path)}`);
  return access === "allowed";
}

/** For API routes: a JSON error response when the panel can't be used, otherwise null. */
export async function panelApiDenied(slug: string): Promise<Response | null> {
  const access = await panelAccess(slug);
  if (access === "allowed") return null;
  const headers = { "Cache-Control": "no-store" };
  return access === "anonymous"
    ? Response.json({ status: "error", message: "A sessão expirou. Entre novamente." }, { status: 401, headers })
    : Response.json({ status: "error", message: "Painel não encontrado." }, { status: 404, headers });
}

/** Review panels assigned to an account, for the client area. */
export async function listOwnedPanels(userId: string): Promise<OwnedPanel[]> {
  const client = tryCreateServiceClient();
  if (!client) return [];
  const { data, error } = await client.from("review_businesses").select("slug, name").eq("owner_id", userId).order("name");
  if (error) throw new Error(`listOwnedPanels: ${error.message}`);
  return (data ?? []) as OwnedPanel[];
}
