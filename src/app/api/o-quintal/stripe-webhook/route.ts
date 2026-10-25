import { formatEuros } from "@/content/o-quintal/products";
import { sendEmail } from "@/lib/email/send";
import { orderEmailText, verifyStripeSignature, type CompletedSession } from "@/lib/o-quintal/checkout";
import { adminEmails } from "@/lib/supabase/env";

// Stripe's webhook for O Quintal's shop. Events to send (Stripe dashboard → Developers → Webhooks):
// checkout.session.completed and checkout.session.async_payment_succeeded. The signature is checked with
// STRIPE_WEBHOOK_SECRET; a paid order is logged and emailed to ADMIN_EMAILS (+ O_QUINTAL_ORDER_EMAILS, the
// business's own address once the owner adds it). No database yet (no migrations without the owner's OK).

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

function recipients(): string[] {
  const extra = (process.env.O_QUINTAL_ORDER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([...adminEmails(), ...extra])];
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[o-quintal] STRIPE_WEBHOOK_SECRET is not configured; webhook refused");
    return new Response(null, { status: 503 });
  }
  const raw = await request.text();
  if (!verifyStripeSignature(raw, request.headers.get("stripe-signature"), secret)) {
    console.warn("[o-quintal] webhook with an invalid signature refused");
    return new Response(null, { status: 400 });
  }

  let event: { type?: string; data?: { object?: CompletedSession } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  const session = event.data?.object;
  const paidNow = event.type === "checkout.session.completed" && session?.payment_status === "paid";
  const paidLater = event.type === "checkout.session.async_payment_succeeded";
  if (!session || session.metadata?.loja !== "o-quintal" || !(paidNow || paidLater)) return new Response(null, { status: 200 });

  const text = orderEmailText(session, formatEuros);
  console.log("[o-quintal] paid order\n" + text);
  const to = recipients();
  if (to.length) {
    const sent = await sendEmail({
      to,
      subject: `O Quintal · nova encomenda paga${typeof session.amount_total === "number" ? ` (${formatEuros(session.amount_total)})` : ""}`,
      text,
      html: `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:14px;line-height:1.5;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
      ...(session.customer_details?.email ? { replyTo: session.customer_details.email } : {}),
    });
    // A failed email must not hide the order: Stripe retries the event when we don't answer 2xx.
    if (!sent) return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 200 });
}
