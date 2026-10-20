// The contact file behind «Guardar contacto» (/c/<slug>/vcard): vCard 3.0, the version iPhone and Android
// contacts both import. UTF-8, CRLF line ends, long lines folded at 75 bytes without splitting a character.
// Relative imports with extensions keep this module runnable by `node --test` (tests/business-card.test.mjs).
import { phoneForLink, socialLabels, whatsappLink, type BusinessCard } from "../../content/business-cards.ts";

/** Escapes a text value (RFC 2426 §4): backslash, comma, semicolon and line breaks. */
export function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n");
}

/** Folds a content line at 75 bytes; each continuation line starts with one space. */
export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    // The first line holds 75 bytes; continuation lines 74 plus the leading space.
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export interface VCardPhoto {
  /** Base64 of the image bytes. */
  base64: string;
  type: "JPEG" | "PNG";
}

export function buildVCard(card: BusinessCard, photo?: VCardPhoto): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(`N:${escapeText(card.familyName)};${escapeText(card.givenName)};;;`);
  lines.push(`FN:${escapeText(card.name)}`);
  if (card.company) lines.push(`ORG:${escapeText(card.company)}`);
  if (card.role) lines.push(`TITLE:${escapeText(card.role)}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL,VOICE:${phoneForLink(card.phone)}`);
  if (card.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${card.email}`);
  if (card.website) lines.push(`URL;TYPE=WORK:${card.website}`);
  // Labelled links (Apple's item grouping): iPhone shows «Instagram», «LinkedIn», «WhatsApp»; Android keeps the links.
  let item = 0;
  const labelled = (url: string, label: string) => {
    item += 1;
    lines.push(`item${item}.URL:${url}`, `item${item}.X-ABLabel:${escapeText(label)}`);
  };
  if (card.whatsapp) labelled(whatsappLink(card.whatsapp), "WhatsApp");
  for (const social of card.socials ?? []) labelled(social.url, socialLabels[social.network]);
  if (card.address?.lines.length) {
    lines.push(`ADR;TYPE=WORK:;;${escapeText(card.address.lines.join(", "))};;;;`);
  }
  if (photo) lines.push(`PHOTO;ENCODING=b;TYPE=${photo.type}:${photo.base64}`);
  lines.push("END:VCARD");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

/** «rogerio-cabaco.vcf»: the slug is ASCII, so the file name needs no encoding. */
export function vcardFileName(card: BusinessCard): string {
  return `${card.slug}.vcf`;
}
