import { sendOwnerEmail } from "@/lib/booking/email";
import { requestOrigin } from "@/lib/booking/request";
import { isAdminEmail } from "@/lib/supabase/env";
import type { createServiceClient } from "@/lib/supabase/service";
import { findProfileByEmail } from "./queries";

type Client = ReturnType<typeof createServiceClient>;

export type AccessState = "no_email" | "not_invited" | "invited" | "active";

export interface OwnerAccount {
  email: string;
  lastSignInAt: string | null;
}

/** Where a business stands: no email yet → account without invite → invite sent → signed in at least once. */
export function accessState(business: { owner_id?: string | null; invite_sent_at?: string | null }, owner?: OwnerAccount | null): AccessState {
  if (!business.owner_id) return "no_email";
  if (owner?.lastSignInAt) return "active";
  return business.invite_sent_at ? "invited" : "not_invited";
}

export const accessLabels: Record<AccessState, string> = {
  no_email: "Sem acesso: falta email",
  not_invited: "Convite por enviar",
  invited: "Convite enviado",
  active: "Ativo",
};

export class ClientAccessError extends Error {}

/**
 * The login account for this email: the existing one, or a new one created silently (no password,
 * no email sent; the email counts as confirmed because the admin vouches for it). Admin emails are
 * refused: a panel belongs to a client account.
 */
export async function ensureClientAccount(
  client: Client,
  details: { email: string; fullName?: string | null; businessName?: string | null; phone?: string | null },
): Promise<string> {
  const email = details.email.trim().toLowerCase();
  if (isAdminEmail(email)) throw new ClientAccessError("Esse email é de um admin. Use o email do dono do negócio.");
  const existing = await findProfileByEmail(email);
  if (existing) return existing.id;
  const { data, error } = await client.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: details.fullName ?? undefined, business_name: details.businessName ?? undefined, phone: details.phone ?? undefined },
  });
  if (error || !data.user) {
    // Created in the meantime (or an auth user without a profile): use it.
    const again = await findProfileByEmail(email);
    if (again) return again.id;
    throw new Error(`createUser: ${error?.message ?? "no user"}`);
  }
  return data.user.id;
}

/** Email and last sign-in of the owner account, for the admin. */
export async function loadOwnerAccount(client: Client, ownerId: string): Promise<OwnerAccount | null> {
  const { data, error } = await client.auth.admin.getUserById(ownerId);
  if (error || !data.user?.email) return null;
  return { email: data.user.email, lastSignInAt: data.user.last_sign_in_at ?? null };
}

/**
 * Sends the owner a Steevanz email with a sign-in link that opens their panel (no password needed;
 * it works on any device). The link expires with Supabase's email link lifetime.
 */
export async function sendPanelInvite(client: Client, business: { name: string; slug: string }, email: string): Promise<boolean> {
  const { data, error } = await client.auth.admin.generateLink({ type: "magiclink", email });
  if (error || !data.properties?.hashed_token) throw new Error(`generateLink: ${error?.message ?? "no token"}`);
  const query = new URLSearchParams({
    token_hash: data.properties.hashed_token,
    type: data.properties.verification_type || "magiclink",
    next: `/painel/${business.slug}`,
  });
  const origin = await requestOrigin();
  const link = `${origin}/conta/auth/callback?${query}`;
  return sendOwnerEmail({
    to: [email],
    subject: `O painel de reviews de ${business.name} está pronto`,
    heading: "O seu painel de reviews Steevanz",
    rows: [
      { label: "Negócio", value: business.name },
      {
        label: "Como entrar",
        value: `Carregue no botão para entrar no painel, sem palavra-passe. O link é pessoal e válido durante 24 horas. Depois, entre sempre que quiser em ${origin}/conta/entrar com «Receber link de entrada por email».`,
      },
    ],
    adminUrl: link,
    linkLabel: "Entrar no seu painel",
  });
}
