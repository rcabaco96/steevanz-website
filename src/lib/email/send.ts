/**
 * The only way the site sends email: through Resend, always from a steevanz.com address.
 * Supabase Auth never sends anything itself (sign-in, confirmation and password emails are built
 * by the site too, see src/lib/auth/email-links.ts).
 */

const resendEndpoint = "https://api.resend.com/emails";

/** Notifications use mail@; sign-in, confirmation and password emails use noreply@. */
export const senders = {
  mail: "Steevanz <mail@steevanz.com>",
  noreply: "Steevanz <noreply@steevanz.com>",
} as const;

export type Sender = keyof typeof senders;

export interface OutgoingEmail {
  from?: Sender;
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail(email: OutgoingEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not configured; email skipped:", email.subject);
    return false;
  }
  try {
    const response = await fetch(resendEndpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: senders[email.from ?? "mail"],
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("[email] Resend responded", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] Resend request failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
