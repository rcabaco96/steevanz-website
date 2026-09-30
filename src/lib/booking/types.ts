export const pipelineStatuses = ["new", "contacted", "scheduled", "closed", "lost", "cancelled"] as const;
export type PipelineStatus = (typeof pipelineStatuses)[number];

export const leadKinds = ["info_request", "waitlist"] as const;
export type LeadKind = (typeof leadKinds)[number];

export function isPipelineStatus(value: string): value is PipelineStatus {
  return (pipelineStatuses as readonly string[]).includes(value);
}

export function isLeadKind(value: string): value is LeadKind {
  return (leadKinds as readonly string[]).includes(value);
}

export interface TrackingFields {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
}

export interface ContactFields {
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  sector: string | null;
  message: string | null;
}

export interface BookingRow extends ContactFields, TrackingFields {
  id: string;
  product_id: string | null;
  slot_start: string;
  slot_end: string;
  locale: string;
  status: PipelineStatus;
  admin_notes: string | null;
  consent_at: string;
  created_at: string;
  updated_at: string;
}

export interface LeadRow extends ContactFields, TrackingFields {
  id: string;
  product_id: string | null;
  kind: LeadKind;
  locale: string;
  status: PipelineStatus;
  admin_notes: string | null;
  consent_at: string;
  created_at: string;
  updated_at: string;
}

export const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export type UtmKey = (typeof utmKeys)[number];

export const honeypotField = "company_website";
