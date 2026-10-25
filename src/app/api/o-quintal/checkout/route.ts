import { oQuintalShop } from "@/content/o-quintal/facts";
import { oQuintalPreviewBase } from "@/content/o-quintal/routes";
import {
  buildCheckoutSessionParams,
  createCheckoutSession,
  parseCheckoutRequest,
  priceOrder,
  stripeKeyAllowed,
} from "@/lib/o-quintal/checkout";

// O Quintal's shop → Stripe Checkout (hosted page). The browser sends ids, choices and quantities only; prices
// come from the catalogue (src/content/o-quintal/products.ts). Without a usable Stripe key the shop shows
// «Pagamentos online em breve» (GET answers { enabled: false }) and POST answers 503.

function stripeKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return stripeKeyAllowed(key, process.env.VERCEL_ENV) ? key : null;
}

export function GET() {
  return Response.json({ enabled: stripeKey() !== null }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const key = stripeKey();
  if (!key) return Response.json({ error: "Os pagamentos online estarão disponíveis em breve.", comingSoon: true }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }
  const parsed = parseCheckoutRequest(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const priced = priceOrder(parsed.request.lines);
  if (!priced.ok) return Response.json({ error: priced.error }, { status: 409 });
  if (priced.order.subtotalCents < oQuintalShop.minimumCents) {
    return Response.json({ error: "O valor da encomenda é demasiado baixo para pagamento online." }, { status: 409 });
  }

  const origin = new URL(request.url).origin;
  const shopBase = parsed.request.mode === "domain" ? origin : `${origin}${oQuintalPreviewBase}`;
  const params = buildCheckoutSessionParams(priced.order, {
    shopBase,
    fulfilment: parsed.request.fulfilment,
    deliveryFeeCents: oQuintalShop.deliveryFeeCents,
  });
  try {
    const url = await createCheckoutSession(params, key, (input, init) => fetch(input, { ...init, cache: "no-store" }));
    return Response.json({ url });
  } catch (reason) {
    console.error("[o-quintal] checkout session failed:", reason instanceof Error ? reason.message : reason);
    return Response.json({ error: "Não foi possível abrir o pagamento. Tente novamente dentro de momentos." }, { status: 502 });
  }
}
