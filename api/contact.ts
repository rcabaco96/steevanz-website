export const config = { runtime: "edge" };

const TO_EMAIL = "rcabaco@steevanz.com";
const FROM_EMAIL = "Steevanz <mail@steevanz.com>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const company = String(payload.company ?? "").trim();
  const topic = String(payload.topic ?? "").trim();
  const message = String(payload.message ?? "").trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !emailPattern.test(email) || !message) {
    return jsonResponse({ error: "Missing or invalid fields" }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return jsonResponse({ error: "Email service is not configured" }, 500);
  }

  const html = `
    <h2>Novo contacto via steevanz.com</h2>
    <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${company ? `<p><strong>Empresa:</strong> ${escapeHtml(company)}</p>` : ""}
    ${topic ? `<p><strong>Tópico:</strong> ${escapeHtml(topic)}</p>` : ""}
    <p><strong>Mensagem:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: email,
      subject: `Novo contacto de ${name}${company ? ` (${company})` : ""}`,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error("Resend error:", resendResponse.status, errorText);
    return jsonResponse({ error: "Failed to send email" }, 502);
  }

  return jsonResponse({ ok: true }, 200);
}
