"use server";

import { after } from "next/server";
import type { FormField } from "@/content/booking";
import { tryCreateServiceClient } from "@/lib/supabase/service";
import { getAvailability } from "./availability";
import { sendOwnerEmail, type EmailRow } from "./email";
import { formatSlotRange } from "./format";
import { kindLabels, productLabel, sectorLabel } from "./labels";
import { isRateLimited, requestOrigin } from "./request";
import {
  bookingFormKeys,
  bookingSubmissionSchema,
  fieldErrorsFrom,
  formDataToObject,
  leadFormKeys,
  leadSubmissionSchema,
  type BookingSubmission,
  type LeadSubmission,
} from "./schema";
import { findSlot, type DayAvailability } from "./slots";
import { honeypotField } from "./types";

type FailureCode = "validation" | "slot_taken" | "unavailable" | "rate_limited" | "generic";

export type BookingActionState =
  | { status: "idle" }
  | { status: "error"; code: FailureCode; fields: FormField[]; days?: DayAvailability[] }
  | { status: "success"; start: string; end: string; reference: string };

export type LeadActionState =
  | { status: "idle" }
  | { status: "error"; code: FailureCode; fields: FormField[] }
  | { status: "success" };

function trackingColumns(data: BookingSubmission | LeadSubmission) {
  return {
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    utm_term: data.utm_term,
    utm_content: data.utm_content,
    referrer: data.referrer,
  };
}

function contactEmailRows(data: BookingSubmission | LeadSubmission): EmailRow[] {
  return [
    { label: "Nome", value: data.name },
    { label: "Email", value: data.email },
    { label: "Telemóvel", value: data.phone },
    { label: "Negócio", value: data.businessName },
    { label: "Setor", value: sectorLabel(data.sector) },
    { label: "Produto", value: productLabel(data.productId) },
    { label: "Mensagem", value: data.message },
    { label: "Idioma", value: data.locale.toUpperCase() },
    { label: "Origem", value: [data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join(" / ") },
    { label: "Referrer", value: data.referrer },
  ];
}

export async function submitBooking(_previous: BookingActionState, formData: FormData): Promise<BookingActionState> {
  const raw = formDataToObject(formData, bookingFormKeys);
  const honeypot = formData.get(honeypotField);
  if (typeof honeypot === "string" && honeypot.trim()) {
    const start = new Date(raw.slotStart || Date.now()).toISOString();
    return { status: "success", start, end: start, reference: "ok" };
  }

  const parsed = bookingSubmissionSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", code: "validation", fields: fieldErrorsFrom(parsed.error) };
  const data = parsed.data;

  const client = tryCreateServiceClient();
  if (!client) return { status: "error", code: "unavailable", fields: [] };

  if (await isRateLimited(client, "booking")) return { status: "error", code: "rate_limited", fields: [] };

  const availability = await getAvailability(client);
  if (!availability.ok) return { status: "error", code: "unavailable", fields: [] };

  const slot = findSlot(availability.days, data.slotStart);
  if (!slot) return { status: "error", code: "slot_taken", fields: ["slotStart"], days: availability.days };

  const { data: inserted, error } = await client
    .from("bookings")
    .insert({
      product_id: data.productId,
      slot_start: slot.start,
      slot_end: slot.end,
      name: data.name,
      email: data.email,
      phone: data.phone,
      business_name: data.businessName,
      sector: data.sector,
      message: data.message,
      locale: data.locale,
      consent_at: new Date().toISOString(),
      ...trackingColumns(data),
    })
    .select("id")
    .single();

  if (error || !inserted) {
    if (error?.code === "23505") {
      const refreshed = await getAvailability(client);
      return {
        status: "error",
        code: "slot_taken",
        fields: ["slotStart"],
        days: refreshed.ok ? refreshed.days : availability.days,
      };
    }
    console.error("[booking] insert failed:", error?.message);
    return { status: "error", code: "generic", fields: [] };
  }

  const bookingId = String(inserted.id);
  const origin = await requestOrigin();
  const when = formatSlotRange(slot.start, slot.end, "pt", availability.timeZone);
  after(async () => {
    await sendOwnerEmail({
      subject: `Nova demonstração: ${data.name} · ${when}`,
      heading: "Nova demonstração agendada",
      replyTo: data.email,
      adminUrl: origin ? `${origin}/admin/bookings/${bookingId}` : undefined,
      rows: [{ label: "Quando", value: when }, ...contactEmailRows(data)],
    });
  });

  return { status: "success", start: slot.start, end: slot.end, reference: bookingId };
}

export async function submitLead(_previous: LeadActionState, formData: FormData): Promise<LeadActionState> {
  const raw = formDataToObject(formData, leadFormKeys);
  const honeypot = formData.get(honeypotField);
  if (typeof honeypot === "string" && honeypot.trim()) return { status: "success" };

  const parsed = leadSubmissionSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", code: "validation", fields: fieldErrorsFrom(parsed.error) };
  const data = parsed.data;

  const client = tryCreateServiceClient();
  if (!client) return { status: "error", code: "unavailable", fields: [] };

  if (await isRateLimited(client, "lead")) return { status: "error", code: "rate_limited", fields: [] };

  const { data: inserted, error } = await client
    .from("leads")
    .insert({
      product_id: data.productId,
      kind: data.kind,
      name: data.name,
      email: data.email,
      phone: data.phone,
      business_name: data.businessName,
      sector: data.sector,
      message: data.message,
      locale: data.locale,
      consent_at: new Date().toISOString(),
      ...trackingColumns(data),
    })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("[lead] insert failed:", error?.message);
    return { status: "error", code: "generic", fields: [] };
  }

  const leadId = String(inserted.id);
  const origin = await requestOrigin();
  after(async () => {
    await sendOwnerEmail({
      subject: `${kindLabels[data.kind]}: ${data.name}${data.productId ? ` · ${productLabel(data.productId)}` : ""}`,
      heading: `Novo pedido: ${kindLabels[data.kind]}`,
      replyTo: data.email,
      adminUrl: origin ? `${origin}/admin/leads/${leadId}` : undefined,
      rows: [{ label: "Tipo", value: kindLabels[data.kind] }, ...contactEmailRows(data)],
    });
  });

  return { status: "success" };
}
