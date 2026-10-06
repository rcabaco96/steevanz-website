import { cache } from "react";
import type { GoogleLinkStatus } from "@/lib/google/connection";
import { tryCreateServiceClient } from "@/lib/supabase/service";

export type { GoogleLinkStatus };

const statuses: readonly GoogleLinkStatus[] = ["not_connected", "pending_location", "connected", "error"];

/**
 * Google link status of a customer, for the panel header (bar and badge). Only reads one column
 * from Supabase, never Google. Cached per request, so the header's two slots share one query.
 * Null when the business doesn't exist or Supabase can't be read (the header then shows nothing).
 */
export const getPanelGoogleStatus = cache(async (slug: string): Promise<GoogleLinkStatus | null> => {
  const client = tryCreateServiceClient();
  if (!client) return null;
  const { data, error } = await client.from("review_businesses").select("google_link_status").eq("slug", slug).maybeSingle<{ google_link_status: string | null }>();
  if (error) {
    console.error(`[google] link status for ${slug}:`, error.message);
    return null;
  }
  if (!data) return null;
  const status = data.google_link_status as GoogleLinkStatus;
  return statuses.includes(status) ? status : "not_connected";
});

export const googlePagePath = (slug: string) => `/painel/${slug}/google`;
export const googleConnectPath = (slug: string) => `/api/google/connect?slug=${encodeURIComponent(slug)}`;
