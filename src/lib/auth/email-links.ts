import { createHash } from "node:crypto";
import type { GenerateLinkParams, SupabaseClient } from "@supabase/supabase-js";
import { after } from "next/server";
import { sendOwnerEmail, type OwnerEmail } from "@/lib/booking/email";
import { requestOrigin } from "@/lib/booking/request";
import { siteUrl } from "@/lib/site";
import { isAdminEmail } from "@/lib/supabase/env";
import { authLinkValidityText } from "./link-validity";

/**
 * Sign-in, confirmation and password emails, built and sent by the site (Resend, from
 * noreply@steevanz.com). Supabase Auth only makes the one-time token (admin generateLink, which
 * never sends anything); the link points straight at our /conta/auth/confirm route, which checks the
 * token on the server. No PKCE code verifier is involved, so the link works on any device or browser.
 */

export type EmailOutcome = "sent" | "none" | "failed";

/** One email per address per minute (sign-in, confirmation and password emails together). */
export const authEmailCooldownSeconds = 60;

function hostOf(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).host;
  } catch {
    return null;
  }
}

function trustedHosts(): Set<string> {
  const hosts = [
    hostOf(siteUrl),
    hostOf(process.env.VERCEL_URL),
    hostOf(process.env.VERCEL_BRANCH_URL),
    hostOf(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  ].filter((host): host is string => Boolean(host));
  for (const host of [...hosts]) hosts.push(host.startsWith("www.") ? host.slice(4) : `www.${host}`);
  return new Set(hosts);
}

/**
 * The site address to put in email links: the one the request came from when it is one of ours
 * (production, this Vercel deployment, localhost), otherwise the production address. A forged
 * Origin/Host can never make us email a token to someone else's site.
 */
export async function linkOrigin(): Promise<string> {
  const origin = await requestOrigin();
  try {
    const url = new URL(origin);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return url.origin;
    if (url.protocol === "https:" && trustedHosts().has(url.host)) return url.origin;
  } catch {}
  return siteUrl;
}

function cooldownKey(email: string): string {
  return createHash("sha256").update(`auth-email:${email.trim().toLowerCase()}`).digest("hex");
}

/** 0 when an email may go to this address now, otherwise the seconds left. Claimed even for unknown emails. */
export async function claimAuthEmail(client: SupabaseClient, email: string): Promise<number> {
  const { data, error } = await client.rpc("auth_email_claim", { p_key: cooldownKey(email), p_seconds: authEmailCooldownSeconds });
  if (error) {
    console.error("[auth] email cooldown unavailable:", error.message);
    return 0;
  }
  return typeof data === "number" ? data : 0;
}

export async function releaseAuthEmail(client: SupabaseClient, email: string): Promise<void> {
  const { error } = await client.rpc("auth_email_release", { p_key: cooldownKey(email) });
  if (error) console.error("[auth] email cooldown release failed:", error.message);
}

export function cooldownMessage(seconds: number): string {
  const wait = seconds === 1 ? "1 segundo" : `${seconds} segundos`;
  return `Acabámos de enviar um email para este endereço. Aguarde ${wait} antes de pedir outro e veja também a pasta de spam.`;
}

/** Sends after the response, so known and unknown emails answer equally fast; a failed send frees the address again. */
export function deliverLater(client: SupabaseClient, email: string, task: () => Promise<EmailOutcome>): void {
  after(async () => {
    const outcome = await task().catch((error: unknown) => {
      console.error("[auth] email failed:", error instanceof Error ? error.message : error);
      return "failed" as const;
    });
    if (outcome === "failed") await releaseAuthEmail(client, email);
  });
}

const verifyTypes = new Set(["signup", "invite", "magiclink", "recovery"]);

/** Our own confirm link for a token made by generateLink (admins land on the admin twin of the route). */
export function confirmUrl(origin: string, email: string, token: { hashed_token: string; verification_type: string }, next: string): string {
  const type = verifyTypes.has(token.verification_type) ? token.verification_type : "magiclink";
  const query = new URLSearchParams({ token_hash: token.hashed_token, type });
  if (next) query.set("next", next);
  const path = isAdminEmail(email) ? "/admin/auth/confirm" : "/conta/auth/confirm";
  return `${origin}${path}?${query}`;
}

type LinkResult = { ok: true; url: string } | { ok: false; code: string };

/** Makes the one-time token with the service role (Supabase sends nothing) and turns it into our link. */
export async function generateEmailLink(client: SupabaseClient, params: GenerateLinkParams, origin: string, next: string): Promise<LinkResult> {
  const { data, error } = await client.auth.admin.generateLink(params);
  const token = data?.properties;
  if (error || !token?.hashed_token) {
    return { ok: false, code: error?.code ?? error?.message ?? "no_token" };
  }
  return { ok: true, url: confirmUrl(origin, params.email, token, next) };
}

async function hasAccount(client: SupabaseClient, email: string): Promise<boolean | null> {
  const { data, error } = await client.from("profiles").select("id").eq("email", email).maybeSingle();
  if (error) {
    console.error("[auth] account lookup failed:", error.message);
    return null;
  }
  return Boolean(data);
}

function authEmail(email: string, content: Omit<OwnerEmail, "to" | "from" | "rows" | "showUrl"> & { rows?: OwnerEmail["rows"] }): Promise<boolean> {
  return sendOwnerEmail({ rows: [], ...content, to: [email], from: "noreply", showUrl: true });
}

/**
 * A sign-in link, for existing accounts only: unknown emails get nothing (generateLink would create
 * the account, so the account is looked up first). «existing» is the email for someone who tried to
 * register with an email that already has an account.
 */
export async function sendSignInLink(
  client: SupabaseClient,
  email: string,
  options: { origin: string; next: string; variant?: "signin" | "existing" },
): Promise<EmailOutcome> {
  const known = await hasAccount(client, email);
  if (known === null) return "failed";
  if (!known) return "none";
  const link = await generateEmailLink(client, { type: "magiclink", email }, options.origin, options.next);
  if (!link.ok) {
    console.error("[auth] sign-in link failed:", link.code);
    return "failed";
  }
  const existing = options.variant === "existing";
  const sent = await authEmail(email, {
    subject: existing ? "Já tem conta na Steevanz" : "O seu link para entrar na Steevanz",
    heading: existing ? "Já tem conta na Steevanz" : "Entrar na Steevanz",
    intro: existing
      ? [
          "Alguém, provavelmente você, tentou criar uma conta Steevanz com este email, mas já existe uma conta com ele.",
          "Carregue no botão para entrar, sem palavra-passe. Depois, se quiser, pode definir uma nova palavra-passe no seu perfil.",
        ]
      : ["Recebemos um pedido para entrar na sua conta Steevanz com este email.", "Carregue no botão para entrar, sem palavra-passe."],
    adminUrl: link.url,
    linkLabel: "Entrar na minha conta",
    note: `${authLinkValidityText} Pode abri-lo em qualquer dispositivo. Se não foi você que pediu, ignore este email: a sua conta continua segura.`,
  });
  return sent ? "sent" : "failed";
}

/** A link to set a new password; unknown emails get nothing. */
export async function sendRecoveryLink(client: SupabaseClient, email: string, origin: string): Promise<EmailOutcome> {
  const link = await generateEmailLink(client, { type: "recovery", email }, origin, "/conta/nova-password");
  if (!link.ok) {
    if (link.code === "user_not_found") return "none";
    console.error("[auth] recovery link failed:", link.code);
    return "failed";
  }
  const sent = await authEmail(email, {
    subject: "Defina uma nova palavra-passe na Steevanz",
    heading: "Nova palavra-passe",
    intro: ["Recebemos um pedido para definir uma nova palavra-passe na sua conta Steevanz.", "Carregue no botão para escolher a nova palavra-passe."],
    adminUrl: link.url,
    linkLabel: "Definir nova palavra-passe",
    note: `${authLinkValidityText} Se não foi você que pediu, ignore este email: a palavra-passe atual continua a funcionar.`,
  });
  return sent ? "sent" : "failed";
}

export type SignupOutcome = "sent" | "exists" | "weak_password" | "failed";

/** Creates the (unconfirmed) account and emails the confirmation link. */
export async function sendSignupConfirmation(
  client: SupabaseClient,
  details: { email: string; password: string; fullName: string; data: Record<string, string | undefined> },
  origin: string,
): Promise<SignupOutcome> {
  const { email, password, fullName, data } = details;
  const link = await generateEmailLink(client, { type: "signup", email, password, options: { data } }, origin, "/conta");
  if (!link.ok) {
    if (link.code === "email_exists" || link.code === "user_already_exists") return "exists";
    if (link.code === "weak_password") return "weak_password";
    console.error("[auth] signup link failed:", link.code);
    return "failed";
  }
  const firstName = fullName.split(/\s+/)[0];
  const sent = await authEmail(email, {
    subject: "Confirme o seu email na Steevanz",
    heading: "Confirme o seu email",
    intro: [`Olá${firstName ? `, ${firstName}` : ""}! Obrigado por criar conta na Steevanz.`, "Carregue no botão para confirmar o seu email e ativar a conta."],
    adminUrl: link.url,
    linkLabel: "Confirmar email",
    note: `${authLinkValidityText} Pode abri-lo em qualquer dispositivo. Se não foi você que criou esta conta, ignore este email.`,
  });
  return sent ? "sent" : "failed";
}
