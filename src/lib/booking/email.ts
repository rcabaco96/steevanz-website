const resendEndpoint = "https://api.resend.com/emails";
const fromAddress = "Steevanz <mail@steevanz.com>";
const ownerAddress = "rcabaco@steevanz.com";

export interface EmailRow {
  label: string;
  value: string | null | undefined;
}

export interface OwnerEmail {
  subject: string;
  heading: string;
  rows: EmailRow[];
  replyTo?: string;
  adminUrl?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHtml({ heading, rows, adminUrl }: OwnerEmail): string {
  const body = rows
    .filter((row) => row.value)
    .map(
      (row) =>
        `<tr><td style="padding:8px 12px;color:#6f5d71;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(row.label)}</td><td style="padding:8px 12px;color:#1d1220;font-size:15px;white-space:pre-wrap">${escapeHtml(String(row.value))}</td></tr>`,
    )
    .join("");
  const link = adminUrl
    ? `<p style="margin:24px 0 0"><a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#7a2d60;color:#ffffff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">Abrir no painel</a></p>`
    : "";
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#fbf7f1;font-family:Arial,Helvetica,sans-serif"><div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7ddd0;border-radius:16px;padding:24px"><h1 style="margin:0 0 16px;font-size:20px;color:#1d1220">${escapeHtml(heading)}</h1><table style="border-collapse:collapse;width:100%">${body}</table>${link}</div></body></html>`;
}

function renderText({ heading, rows, adminUrl }: OwnerEmail): string {
  const lines = rows.filter((row) => row.value).map((row) => `${row.label}: ${row.value}`);
  return [heading, "", ...lines, ...(adminUrl ? ["", adminUrl] : [])].join("\n");
}

export async function sendOwnerEmail(email: OwnerEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not configured; owner notification skipped:", email.subject);
    return false;
  }
  try {
    const response = await fetch(resendEndpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromAddress,
        to: [ownerAddress],
        subject: email.subject,
        html: renderHtml(email),
        text: renderText(email),
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
