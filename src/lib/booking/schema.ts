import { z } from "zod";
import type { FormField } from "@/content/booking";
import { isProductId } from "@/content/products";
import { sectors } from "@/content/sectors";
import { leadKinds } from "./types";

export const otherSectorValue = "other";
const sectorValues = new Set<string>([...sectors.map((sector) => sector.id), otherSectorValue]);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value.length ? value : null));

const trackingText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value.slice(0, 300) : null));

const phonePattern = /^\+?[\d\s().-]{9,20}$/;

function isValidPhone(value: string): boolean {
  return phonePattern.test(value) && value.replace(/\D/g, "").length >= 9;
}

const contactShape = {
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().max(200).pipe(z.email()),
  businessName: optionalText(160),
  sector: z
    .string()
    .trim()
    .refine((value) => value === "" || sectorValues.has(value))
    .transform((value) => (value.length ? value : null)),
  message: optionalText(2000),
  productId: z
    .string()
    .trim()
    .refine((value) => value === "" || isProductId(value))
    .transform((value) => (value.length ? value : null)),
  locale: z.enum(["pt", "en"]),
  consent: z.literal("on"),
  utm_source: trackingText,
  utm_medium: trackingText,
  utm_campaign: trackingText,
  utm_term: trackingText,
  utm_content: trackingText,
  referrer: trackingText,
};

export const bookingSubmissionSchema = z.object({
  ...contactShape,
  phone: z.string().trim().refine(isValidPhone),
  slotStart: z.string().trim().min(10).max(40),
});

export const leadSubmissionSchema = z.object({
  ...contactShape,
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidPhone(value))
    .transform((value) => (value.length ? value : null)),
  kind: z.enum(leadKinds),
});

export type BookingSubmission = z.infer<typeof bookingSubmissionSchema>;
export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

export const bookingFormKeys = [
  "name",
  "email",
  "phone",
  "businessName",
  "sector",
  "message",
  "productId",
  "locale",
  "consent",
  "slotStart",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "referrer",
] as const;

export const leadFormKeys = [
  "name",
  "email",
  "phone",
  "businessName",
  "sector",
  "message",
  "productId",
  "locale",
  "consent",
  "kind",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "referrer",
] as const;

const formFieldNames = new Set<string>([
  "name",
  "email",
  "phone",
  "businessName",
  "sector",
  "message",
  "consent",
  "productId",
  "slotStart",
  "kind",
]);

export function fieldErrorsFrom(error: z.ZodError): FormField[] {
  const fields = new Set<FormField>();
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (formFieldNames.has(key)) fields.add(key as FormField);
  }
  return [...fields];
}

export function formDataToObject(formData: FormData, keys: readonly string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of keys) {
    const value = formData.get(key);
    result[key] = typeof value === "string" ? value : "";
  }
  return result;
}
