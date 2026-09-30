import { kindLabels, productLabel, sectorLabel, statusLabels } from "@/lib/booking/labels";
import type { BookingRow, LeadRow } from "@/lib/booking/types";
import { site } from "@/lib/site";

type Cell = string | number | null | undefined;

const separator = ";";

function escapeCell(value: Cell): string {
  if (value === null || value === undefined) return "";
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[";\n\r,]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(header: string[], rows: Cell[][]): string {
  const lines = [header, ...rows].map((row) => row.map(escapeCell).join(separator));
  return `﻿${lines.join("\r\n")}\r\n`;
}

const lisbonDateTime = new Intl.DateTimeFormat("sv-SE", {
  timeZone: site.timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function lisbonTimestamp(iso: string | null | undefined): string {
  if (!iso) return "";
  return lisbonDateTime.format(new Date(iso));
}

const trackingHeader = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "referrer"];

function trackingCells(row: BookingRow | LeadRow): Cell[] {
  return [row.utm_source, row.utm_medium, row.utm_campaign, row.utm_term, row.utm_content, row.referrer];
}

export function bookingsCsv(rows: BookingRow[]): string {
  return toCsv(
    [
      "id",
      "inicio",
      "fim",
      "estado",
      "produto",
      "nome",
      "email",
      "telemovel",
      "negocio",
      "setor",
      "mensagem",
      "idioma",
      "notas",
      ...trackingHeader,
      "consentimento",
      "criado",
      "atualizado",
    ],
    rows.map((row) => [
      row.id,
      lisbonTimestamp(row.slot_start),
      lisbonTimestamp(row.slot_end),
      statusLabels[row.status],
      productLabel(row.product_id),
      row.name,
      row.email,
      row.phone,
      row.business_name,
      sectorLabel(row.sector),
      row.message,
      row.locale,
      row.admin_notes,
      ...trackingCells(row),
      lisbonTimestamp(row.consent_at),
      lisbonTimestamp(row.created_at),
      lisbonTimestamp(row.updated_at),
    ]),
  );
}

export function leadsCsv(rows: LeadRow[]): string {
  return toCsv(
    [
      "id",
      "tipo",
      "estado",
      "produto",
      "nome",
      "email",
      "telemovel",
      "negocio",
      "setor",
      "mensagem",
      "idioma",
      "notas",
      ...trackingHeader,
      "consentimento",
      "criado",
      "atualizado",
    ],
    rows.map((row) => [
      row.id,
      kindLabels[row.kind],
      statusLabels[row.status],
      productLabel(row.product_id),
      row.name,
      row.email,
      row.phone,
      row.business_name,
      sectorLabel(row.sector),
      row.message,
      row.locale,
      row.admin_notes,
      ...trackingCells(row),
      lisbonTimestamp(row.consent_at),
      lisbonTimestamp(row.created_at),
      lisbonTimestamp(row.updated_at),
    ]),
  );
}
