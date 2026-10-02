const resendEndpoint = "https://api.resend.com/emails";
const fromAddress = "Steevanz <mail@steevanz.com>";
const ownerAddress = "rcabaco@steevanz.com";

export interface EmailRow {
  label: string;
  value: string | null | undefined;
}

export interface EmailTable {
  title: string;
  head: string[];
  rows: string[][];
  foot?: [string, string][];
}

export interface OwnerEmail {
  subject: string;
  heading: string;
  rows: EmailRow[];
  tables?: EmailTable[];
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

const cellStyle = "padding:8px 12px;font-size:14px;border-top:1px solid #efe6db";

function renderTableHtml({ title, head, rows, foot = [] }: EmailTable): string {
  const align = (index: number) => (index === 0 ? "left" : "right");
  const headCells = head
    .map(
      (cell, index) =>
        `<th style="padding:8px 12px;color:#6f5d71;font-size:12px;font-weight:600;text-align:${align(index)}">${escapeHtml(cell)}</th>`,
    )
    .join("");
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${row.map((cell, index) => `<td style="${cellStyle};color:#1d1220;text-align:${align(index)};white-space:pre-line">${escapeHtml(cell)}</td>`).join("")}</tr>`,
    )
    .join("");
  const footRows = foot
    .map(([label, value], index) => {
      const weight = index === foot.length - 1 ? 700 : 400;
      return `<tr><td colspan="${head.length - 1}" style="${cellStyle};color:#6f5d71;text-align:right">${escapeHtml(label)}</td><td style="${cellStyle};color:#1d1220;font-weight:${weight};text-align:right;white-space:nowrap">${escapeHtml(value)}</td></tr>`;
    })
    .join("");
  return `<h2 style="margin:28px 0 8px;font-size:16px;color:#1d1220">${escapeHtml(title)}</h2><table style="border-collapse:collapse;width:100%"><thead><tr>${headCells}</tr></thead><tbody>${bodyRows}${footRows}</tbody></table>`;
}

function renderTableText({ title, rows, foot = [] }: EmailTable): string[] {
  return ["", title.toUpperCase(), ...rows.map((row) => `- ${row.join(" | ")}`), ...foot.map(([label, value]) => `  ${label}: ${value}`)];
}

function renderHtml({ heading, rows, tables = [], adminUrl }: OwnerEmail): string {
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
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#fbf7f1;font-family:Arial,Helvetica,sans-serif"><div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7ddd0;border-radius:16px;padding:24px"><h1 style="margin:0 0 16px;font-size:20px;color:#1d1220">${escapeHtml(heading)}</h1><table style="border-collapse:collapse;width:100%">${body}</table>${tables.map(renderTableHtml).join("")}${link}</div></body></html>`;
}

function renderText({ heading, rows, tables = [], adminUrl }: OwnerEmail): string {
  const lines = rows.filter((row) => row.value).map((row) => `${row.label}: ${row.value}`);
  return [heading, "", ...lines, ...tables.flatMap(renderTableText), ...(adminUrl ? ["", adminUrl] : [])].join("\n");
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
