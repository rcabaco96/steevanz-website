import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { kindDefaults } from "@/lib/establishments/kinds";
import { isUuid } from "@/lib/establishments/store";
import type { EstablishmentRow } from "@/lib/establishments/types";
import { createServiceClient } from "@/lib/supabase/service";
import { tokenPattern } from "../common";
import { cardCodeFrom, normalizeCardCode, type Milestone } from "./rules";

export interface LoyaltyProgramRow {
  establishment_id: string;
  active: boolean;
  stamps_required: number;
  reward: string;
  /** Rewards along the way, before the full card (up to 3). */
  milestones: Milestone[];
  /** «1 carimbo por visita a partir de X €»: shown to customers and staff, applied by the team. */
  min_spend_cents: number | null;
  welcome_stamp: boolean;
  cooldown_minutes: number;
  reward_valid_days: number | null;
  staff_code_hash: string | null;
  staff_code_salt: string | null;
  staff_code_set_at: string | null;
  terms: string | null;
  updated_at: string;
}

export interface LoyaltyCardRow {
  id: string;
  establishment_id: string;
  token: string;
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  consent_at: string;
  stamps: number;
  last_stamp_at: string | null;
  failed_code_attempts: number;
  locked_until: string | null;
  created_at: string;
}

export interface LoyaltyRewardRow {
  id: string;
  card_id: string;
  establishment_id: string;
  earned_at: string;
  expires_at: string | null;
  redeemed_at: string | null;
  /** The reward's text when it was earned (changing the rewards later never changes it). */
  label: string | null;
  /** The stamp that gave it (a milestone or the full card). */
  at_stamp: number | null;
}

export async function ensureProgram(establishment: EstablishmentRow): Promise<LoyaltyProgramRow> {
  const client = createServiceClient();
  const { data, error } = await client.from("loyalty_programs").select("*").eq("establishment_id", establishment.id).maybeSingle();
  if (error) throw new Error(`loyalty program: ${error.message}`);
  if (data) return data as LoyaltyProgramRow;
  const { data: created, error: insertError } = await client
    .from("loyalty_programs")
    .upsert(
      (({ stampsRequired, reward, milestones, minSpendCents }) => ({
        establishment_id: establishment.id,
        stamps_required: stampsRequired,
        reward,
        milestones,
        min_spend_cents: minSpendCents,
      }))(kindDefaults[establishment.kind].loyalty),
      { onConflict: "establishment_id" },
    )
    .select("*")
    .single();
  if (insertError) throw new Error(`loyalty program insert: ${insertError.message}`);
  return created as LoyaltyProgramRow;
}

export function hashStaffCode(code: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${code}`).digest("hex");
}

export function newStaffCodeHash(code: string): { staff_code_hash: string; staff_code_salt: string } {
  const salt = randomBytes(16).toString("hex");
  return { staff_code_hash: hashStaffCode(code, salt), staff_code_salt: salt };
}

export function staffCodeMatches(program: LoyaltyProgramRow, code: string): boolean {
  if (!program.staff_code_hash || !program.staff_code_salt) return false;
  const given = Buffer.from(hashStaffCode(code, program.staff_code_salt), "hex");
  const stored = Buffer.from(program.staff_code_hash, "hex");
  return given.length === stored.length && timingSafeEqual(given, stored);
}

export function newCardCode(): string {
  return cardCodeFrom(randomBytes(6));
}

export async function getCardByToken(token: string): Promise<LoyaltyCardRow | null> {
  if (!tokenPattern.test(token)) return null;
  const { data, error } = await createServiceClient().from("loyalty_cards").select("*").eq("token", token).maybeSingle();
  if (error) throw new Error(`getCardByToken: ${error.message}`);
  return data as LoyaltyCardRow | null;
}

export async function getCard(establishmentId: string, cardId: string): Promise<LoyaltyCardRow | null> {
  if (!isUuid(cardId)) return null;
  const { data, error } = await createServiceClient().from("loyalty_cards").select("*").eq("id", cardId).eq("establishment_id", establishmentId).maybeSingle();
  if (error) throw new Error(`getCard: ${error.message}`);
  return data as LoyaltyCardRow | null;
}

/** Rewards not yet used and not expired, oldest first. */
export async function availableRewards(cardIds: string[]): Promise<LoyaltyRewardRow[]> {
  if (!cardIds.length) return [];
  const { data, error } = await createServiceClient()
    .from("loyalty_rewards")
    .select("*")
    .in("card_id", cardIds)
    .is("redeemed_at", null)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("earned_at");
  if (error) throw new Error(`availableRewards: ${error.message}`);
  return (data ?? []) as LoyaltyRewardRow[];
}

/** A reward used in the last 10 minutes (to confirm it on the customer's card). */
export async function recentlyRedeemed(cardId: string): Promise<LoyaltyRewardRow | null> {
  const { data, error } = await createServiceClient()
    .from("loyalty_rewards")
    .select("*")
    .eq("card_id", cardId)
    .gte("redeemed_at", new Date(Date.now() - 10 * 60_000).toISOString())
    .order("redeemed_at", { ascending: false })
    .limit(1);
  if (error) throw new Error(`recentlyRedeemed: ${error.message}`);
  return (data?.[0] as LoyaltyRewardRow | undefined) ?? null;
}

/** Staff search: the card code (with or without the space), or part of the name, email or phone. */
export async function searchCards(establishmentId: string, term: string): Promise<LoyaltyCardRow[]> {
  const client = createServiceClient();
  const code = normalizeCardCode(term);
  if (code.length === 6) {
    const { data, error } = await client.from("loyalty_cards").select("*").eq("establishment_id", establishmentId).eq("code", code).limit(1);
    if (error) throw new Error(`searchCards: ${error.message}`);
    if (data?.length) return data as LoyaltyCardRow[];
  }
  const clean = term.replace(/[%,()*]/g, " ").trim().slice(0, 60);
  if (clean.length < 2) return [];
  // Phones are stored as "+351 912 345 678": "912345678" or "912 345" still find them.
  const digits = clean.replace(/\D/g, "");
  const phoneLike = /^[\d\s+.-]+$/.test(clean) && digits.length >= 3 ? digits.split("").join("%") : clean;
  const { data, error } = await client
    .from("loyalty_cards")
    .select("*")
    .eq("establishment_id", establishmentId)
    .or(`name.ilike.%${clean}%,email.ilike.%${clean}%,phone.ilike.%${phoneLike}%`)
    .order("last_stamp_at", { ascending: false, nullsFirst: false })
    .limit(20);
  if (error) throw new Error(`searchCards: ${error.message}`);
  return (data ?? []) as LoyaltyCardRow[];
}

export async function recentCards(establishmentId: string, limit = 50): Promise<LoyaltyCardRow[]> {
  const { data, error } = await createServiceClient()
    .from("loyalty_cards")
    .select("*")
    .eq("establishment_id", establishmentId)
    .order("last_stamp_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`recentCards: ${error.message}`);
  return (data ?? []) as LoyaltyCardRow[];
}

export interface LoyaltyStats {
  days: number;
  cards: number;
  newCards: number;
  stamps: number;
  activeCards: number;
  rewardsEarned: number;
  rewardsRedeemed: number;
  /** Cards that came back at least once after joining (2+ stamp events). */
  returning: number;
}

export async function loadLoyaltyStats(establishmentId: string, days = 30): Promise<LoyaltyStats> {
  const client = createServiceClient();
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const [cards, newCards, events] = await Promise.all([
    client.from("loyalty_cards").select("id", { count: "exact", head: true }).eq("establishment_id", establishmentId),
    client.from("loyalty_cards").select("id", { count: "exact", head: true }).eq("establishment_id", establishmentId).gte("created_at", since),
    client.from("loyalty_events").select("card_id, kind, amount, source").eq("establishment_id", establishmentId).gte("created_at", since).limit(20000),
  ]);
  for (const result of [cards, newCards, events]) if (result.error) throw new Error(`loadLoyaltyStats: ${result.error.message}`);
  const rows = (events.data ?? []) as { card_id: string; kind: string; amount: number; source: string | null }[];
  const stampsByCard = new Map<string, number>();
  let stamps = 0;
  let earned = 0;
  let redeemed = 0;
  for (const row of rows) {
    if (row.kind === "stamp" && row.source !== "migration") {
      stamps += row.amount;
      stampsByCard.set(row.card_id, (stampsByCard.get(row.card_id) ?? 0) + 1);
    }
    // A stamp removed by mistake no longer counts.
    if (row.kind === "adjust" && row.amount < 0 && row.source !== "migration") stamps += row.amount;
    if (row.kind === "reward_earned") earned += row.amount;
    if (row.kind === "reward_redeemed") redeemed += row.amount;
  }
  return {
    days,
    cards: cards.count ?? 0,
    newCards: newCards.count ?? 0,
    stamps,
    activeCards: stampsByCard.size,
    rewardsEarned: earned,
    rewardsRedeemed: redeemed,
    returning: [...stampsByCard.values()].filter((count) => count >= 2).length,
  };
}
