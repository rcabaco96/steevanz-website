import type { SupabaseClient } from "@supabase/supabase-js";
import { isNegative } from "./analytics.ts";
import { composeDistinct, composeOptions, learnFromAnswer, ownTextKeys, replyKey, type ComposedReply, type Snippet } from "./reply-rules.ts";
import { normalize, themesIn, type ThemeId } from "./text.ts";
import {
  defaultReplySettings,
  draftsPerRun,
  replyWindowStart,
  shouldAutoApprove,
  staleClaimMinutes,
  toneFingerprint,
  toneSettings,
  type AutoMode,
  type DraftStatus,
  type ReplyExample,
  type ReplySettings,
  type ToneSettings,
} from "./replies.ts";


interface SettingsRow {
  business_id: string;
  signature: string;
  address_form: ReplySettings["addressForm"];
  tone: string[];
  length: ReplySettings["length"];
  emojis: boolean;
  examples: { review_id: string; rating: number; text: string; reply: string }[];
  empty_positive: string;
  empty_negative: string;
  highlights: string;
  avoid: string;
  negative_contact: string;
  auto_mode: AutoMode;
  auto_limit: number;
  auto_used: number;
  auto_negative: boolean;
  onboarded_at: string | null;
  profile_id: string | null;
}

function toSettings(row: SettingsRow | null): ReplySettings {
  if (!row) return { ...defaultReplySettings };
  return {
    signature: row.signature,
    addressForm: row.address_form,
    tone: row.tone,
    length: row.length,
    emojis: row.emojis,
    examples: (row.examples ?? []).map((example) => ({ reviewId: example.review_id, rating: example.rating, text: example.text, reply: example.reply })),
    emptyPositive: row.empty_positive,
    emptyNegative: row.empty_negative,
    highlights: row.highlights,
    avoid: row.avoid,
    negativeContact: row.negative_contact,
    autoMode: row.auto_mode,
    autoLimit: row.auto_limit,
    autoUsed: row.auto_used,
    autoNegative: row.auto_negative,
    onboardedAt: row.onboarded_at,
    profileId: row.profile_id,
  };
}

/**
 * Business rule: training, learning and evolution are kept per tone (the set of form answers).
 * Finds or creates the tone for these answers; the same answers always map to the same tone.
 */
async function ensureProfile(client: SupabaseClient, businessId: string, settings: ToneSettings): Promise<string> {
  const fingerprint = toneFingerprint(settings);
  const { data, error } = await client
    .from("review_reply_profiles")
    .upsert({ business_id: businessId, fingerprint, settings: toneSettings(settings), last_used_at: new Date().toISOString() }, { onConflict: "business_id,fingerprint" })
    .select("id")
    .single<{ id: string }>();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function loadReplySettings(client: SupabaseClient, businessId: string): Promise<ReplySettings> {
  const { data, error } = await client.from("review_reply_settings").select("*").eq("business_id", businessId).maybeSingle<SettingsRow>();
  if (error) throw new Error(error.message);
  const settings = toSettings(data);
  if (data && settings.onboardedAt && !settings.profileId) {
    // Saved before tones existed: attach the settings and what was already learned to a tone.
    settings.profileId = await ensureProfile(client, businessId, settings);
    await client.from("review_reply_settings").update({ profile_id: settings.profileId }).eq("business_id", businessId);
    await client.from("review_reply_training").update({ profile_id: settings.profileId }).eq("business_id", businessId).is("profile_id", null);
    await client.from("review_reply_snippets").update({ profile_id: settings.profileId }).eq("business_id", businessId).is("profile_id", null);
  }
  return settings;
}

/**
 * Saves the settings form. Different tone answers switch to another tone (new, or one used
 * before, with everything it learned); pending replies of the old tone are rebuilt in the new one.
 * Changing the automatic-reply quota restarts its counter.
 */
export async function saveReplySettings(client: SupabaseClient, businessId: string, settings: ReplySettings, previous: ReplySettings): Promise<string> {
  const profileId = await ensureProfile(client, businessId, settings);
  const quotaChanged = settings.autoMode !== previous.autoMode || settings.autoLimit !== previous.autoLimit;
  const row = {
    business_id: businessId,
    signature: settings.signature,
    address_form: settings.addressForm,
    tone: settings.tone,
    length: settings.length,
    emojis: settings.emojis,
    examples: settings.examples.map((example: ReplyExample) => ({ review_id: example.reviewId, rating: example.rating, text: example.text, reply: example.reply })),
    empty_positive: settings.emptyPositive,
    empty_negative: settings.emptyNegative,
    highlights: settings.highlights,
    avoid: settings.avoid,
    negative_contact: settings.negativeContact,
    auto_mode: settings.autoMode,
    auto_limit: settings.autoLimit,
    auto_used: quotaChanged ? 0 : previous.autoUsed,
    auto_negative: settings.autoNegative,
    onboarded_at: previous.onboardedAt ?? new Date().toISOString(),
    profile_id: profileId,
    updated_at: new Date().toISOString(),
  };
  const { error } = await client.from("review_reply_settings").upsert(row, { onConflict: "business_id" });
  if (error) throw new Error(error.message);
  if (previous.profileId && previous.profileId !== profileId) {
    const { error: draftsError } = await client.from("review_reply_drafts").delete().eq("business_id", businessId).in("status", ["pending", "generating"]);
    if (draftsError) throw new Error(draftsError.message);
  }
  return profileId;
}

export async function saveAutoMode(client: SupabaseClient, businessId: string, mode: AutoMode, limit: number, negative: boolean): Promise<void> {
  const { error } = await client
    .from("review_reply_settings")
    .update({ auto_mode: mode, auto_limit: limit, auto_used: 0, auto_negative: negative, updated_at: new Date().toISOString() })
    .eq("business_id", businessId);
  if (error) throw new Error(error.message);
}

export interface ReplyBusiness {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  lastSyncedAt: string | null;
  googleFid: string | null;
}

export async function loadReplyBusiness(client: SupabaseClient, slug: string): Promise<ReplyBusiness | null> {
  const { data, error } = await client
    .from("review_businesses")
    .select("id, slug, name, category, last_synced_at, google_fid")
    .eq("slug", slug)
    .maybeSingle<{ id: string; slug: string; name: string; category: string | null; last_synced_at: string | null; google_fid: string | null }>();
  if (error) throw new Error(error.message);
  return data
    ? { id: data.id, slug: data.slug, name: data.name, category: data.category, lastSyncedAt: data.last_synced_at, googleFid: data.google_fid }
    : null;
}

export interface InboxItem {
  draftId: string;
  status: DraftStatus;
  reply: string;
  reasoning: string;
  approvedBy: "client" | "auto" | null;
  edited: boolean;
  decidedAt: string | null;
  createdAt: string;
  review: { id: string; rating: number; text: string | null; publishedAt: string; ownerReply: string | null };
}

interface DraftRow {
  id: string;
  status: DraftStatus;
  reply: string;
  reasoning: string;
  approved_by: "client" | "auto" | null;
  edited: boolean;
  decided_at: string | null;
  created_at: string;
  original_reply: string | null;
  snippet_ids: string[];
  feedback_reasons: string[];
  feedback_note: string;
  google_reviews: { review_id: string; rating: number; text: string | null; published_at: string; owner_reply: string | null } | null;
}

const draftColumns =
  "id, status, reply, reasoning, approved_by, edited, decided_at, created_at, original_reply, feedback_reasons, feedback_note, snippet_ids, google_reviews(review_id, rating, text, published_at, owner_reply)";

function toInboxItem(row: DraftRow): InboxItem | null {
  const review = row.google_reviews;
  if (!review) return null;
  return {
    draftId: row.id,
    status: row.status,
    reply: row.reply,
    reasoning: row.reasoning,
    approvedBy: row.approved_by,
    edited: row.edited,
    decidedAt: row.decided_at,
    createdAt: row.created_at,
    review: { id: review.review_id, rating: review.rating, text: review.text, publishedAt: review.published_at, ownerReply: review.owner_reply },
  };
}

export interface ReplyInbox {
  items: InboxItem[];
  /** Recent unanswered reviews (inside the reply window) that still have no draft. */
  backlog: number;
  /** Unanswered reviews older than the window: never sent to the AI. */
  olderUnanswered: number;
}

/** Live drafts (pending and approved), newest reviews first. */
export async function loadInbox(client: SupabaseClient, businessId: string, onboardedAt: string | null): Promise<ReplyInbox> {
  const since = (replyWindowStart(onboardedAt) ?? new Date()).toISOString();
  const [drafts, unanswered, older] = await Promise.all([
    client.from("review_reply_drafts").select(draftColumns).eq("business_id", businessId).in("status", ["pending", "approved", "generating"]).limit(1000),
    client.from("google_reviews").select("review_id").eq("business_id", businessId).is("owner_reply", null).gte("published_at", since).limit(5000),
    client.from("google_reviews").select("review_id", { count: "exact", head: true }).eq("business_id", businessId).is("owner_reply", null).lt("published_at", since),
  ]);
  if (drafts.error) throw new Error(drafts.error.message);
  if (unanswered.error) throw new Error(unanswered.error.message);
  if (older.error) throw new Error(older.error.message);
  const items = (drafts.data as unknown as DraftRow[])
    .map(toInboxItem)
    .filter((item): item is InboxItem => item !== null)
    .sort((a, b) => Date.parse(b.review.publishedAt) - Date.parse(a.review.publishedAt));
  const drafted = new Set(items.map((item) => item.review.id));
  return { items, backlog: (unanswered.data ?? []).filter((row) => !drafted.has(row.review_id)).length, olderUnanswered: older.count ?? 0 };
}

// ---------------------------------------------------------------------------------------------
// Sentence library ("Treinar")

interface SnippetRow {
  id: string;
  kind: Snippet["kind"];
  sentiment: Snippet["sentiment"];
  theme: ThemeId | null;
  text: string;
  source: "training" | "edit";
  accepted: number;
  rejected: number;
}

export type LibrarySnippet = Snippet & { source: "training" | "edit" };

const snippetColumns = "id, kind, sentiment, theme, text, source, accepted, rejected";

/** The owner's sentences learned under one tone (never mixed with other tones). */
export async function loadLibrary(client: SupabaseClient, businessId: string, profileId: string | null): Promise<LibrarySnippet[]> {
  if (!profileId) return [];
  const { data, error } = await client
    .from("review_reply_snippets")
    .select(snippetColumns)
    .eq("business_id", businessId)
    .eq("profile_id", profileId)
    .eq("disabled", false)
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error(error.message);
  return (data as SnippetRow[]).map((row) => ({ ...row }));
}

export interface TrainingReview {
  id: string;
  rating: number;
  text: string;
  publishedAt: string;
  ownerReply: string | null;
  themes: ThemeId[];
}

/** Training reviews per screen. */
export const trainingBatch = 3;

/**
 * Picks real reviews of the business (never invented) that teach the most: the ones whose
 * sentiment and themes the owner's library covers least, mixing positives and negatives.
 */
export async function loadTrainingQueue(client: SupabaseClient, businessId: string, profileId: string | null, limit = trainingBatch): Promise<TrainingReview[]> {
  const [reviews, done, library] = await Promise.all([
    client
      .from("google_reviews")
      .select("review_id, rating, text, published_at, owner_reply")
      .eq("business_id", businessId)
      .not("text", "is", null)
      .order("published_at", { ascending: false })
      .limit(1000),
    profileId
      ? client.from("review_reply_training").select("review_id").eq("business_id", businessId).eq("profile_id", profileId).limit(5000)
      : Promise.resolve({ data: [] as { review_id: string }[], error: null }),
    loadLibrary(client, businessId, profileId),
  ]);
  if (reviews.error) throw new Error(reviews.error.message);
  if (done.error) throw new Error(done.error.message);
  const seen = new Set((done.data ?? []).map((row) => row.review_id as string));
  const covered = new Map<string, number>();
  for (const snippet of library) {
    const key = `${snippet.sentiment}:${snippet.kind === "theme" ? snippet.theme : snippet.kind}`;
    covered.set(key, (covered.get(key) ?? 0) + 1);
  }
  const candidates = (reviews.data ?? [])
    .filter((row) => !seen.has(row.review_id as string) && ((row.text as string) ?? "").trim().length >= 40)
    .map((row) => {
      const sentiment = isNegative(row.rating as number) ? "negative" : "positive";
      const themes = themesIn(row.text as string);
      const gaps = themes.filter((theme) => !covered.get(`${sentiment}:${theme}`)).length + (covered.get(`${sentiment}:opening`) ? 0 : 1);
      const review: TrainingReview = {
        id: row.review_id as string,
        rating: row.rating as number,
        text: row.text as string,
        publishedAt: row.published_at as string,
        ownerReply: row.owner_reply as string | null,
        themes,
      };
      // Negatives are rarer and matter more, so they get a head start.
      return { review, score: gaps * 2 + (sentiment === "negative" ? 1.5 : 0) + Math.min(themes.length, 2) * 0.5 };
    })
    .sort((a, b) => b.score - a.score)
    .map((candidate) => candidate.review);

  // Alternate sentiments when both exist, so a screen is never all of the same kind.
  const negatives = candidates.filter((review) => isNegative(review.rating));
  const positives = candidates.filter((review) => !isNegative(review.rating));
  const picked: TrainingReview[] = [];
  while (picked.length < limit && (negatives.length || positives.length)) {
    const next = picked.length % 2 === 0 ? (positives.shift() ?? negatives.shift()) : (negatives.shift() ?? positives.shift());
    if (next) picked.push(next);
  }
  return picked;
}

const sameText = (a: string, b: string) => normalize(a).replace(/\s+/g, " ").trim() === normalize(b).replace(/\s+/g, " ").trim();

/** Files the owner's sentences into the library; skips sentences it already has. */
async function addToLibrary(
  client: SupabaseClient,
  businessId: string,
  answer: string,
  rating: number,
  settings: ReplySettings,
  source: "training" | "edit",
  reviewId: string,
): Promise<LibrarySnippet[]> {
  const existing = await loadLibrary(client, businessId, settings.profileId);
  const fresh = learnFromAnswer(answer, rating, settings).filter(
    (snippet, index, all) => !existing.some((item) => sameText(item.text, snippet.text)) && all.findIndex((other) => sameText(other.text, snippet.text)) === index,
  );
  if (!fresh.length) return [];
  const { data, error } = await client
    .from("review_reply_snippets")
    .insert(fresh.map((snippet) => ({ business_id: businessId, profile_id: settings.profileId, ...snippet, source, from_review_id: reviewId })))
    .select(snippetColumns);
  if (error) throw new Error(error.message);
  return data as SnippetRow[];
}

/** "Treinar": stores the owner's answer to a real review and learns its sentences. */
export async function learnTrainingAnswer(client: SupabaseClient, businessId: string, reviewId: string, answer: string): Promise<LibrarySnippet[] | null> {
  const { data: review, error } = await client
    .from("google_reviews")
    .select("review_id, rating")
    .eq("business_id", businessId)
    .eq("review_id", reviewId)
    .maybeSingle<{ review_id: string; rating: number }>();
  if (error) throw new Error(error.message);
  if (!review) return null;
  const settings = await loadReplySettings(client, businessId);
  if (!settings.profileId) return null;
  const { error: trainingError } = await client
    .from("review_reply_training")
    .upsert(
      { business_id: businessId, profile_id: settings.profileId, review_id: reviewId, answer: answer.trim(), skipped: false },
      { onConflict: "business_id,profile_id,review_id" },
    );
  if (trainingError) throw new Error(trainingError.message);
  return addToLibrary(client, businessId, answer, review.rating, settings, "training", reviewId);
}

export async function skipTrainingReview(client: SupabaseClient, businessId: string, reviewId: string): Promise<void> {
  const { profileId } = await loadReplySettings(client, businessId);
  if (!profileId) return;
  const { error } = await client
    .from("review_reply_training")
    .upsert({ business_id: businessId, profile_id: profileId, review_id: reviewId, skipped: true }, { onConflict: "business_id,profile_id,review_id" });
  if (error) throw new Error(error.message);
}

/** Stops using a sentence. It stays recorded: all learning is kept (business rule). */
export async function removeSnippet(client: SupabaseClient, businessId: string, snippetId: string): Promise<void> {
  const { error } = await client.from("review_reply_snippets").update({ disabled: true }).eq("id", snippetId).eq("business_id", businessId);
  if (error) throw new Error(error.message);
}

/** Counts accepted/rejected uses of the owner's sentences (base sentences have no counters). */
async function scoreSnippets(client: SupabaseClient, businessId: string, ids: string[], field: "accepted" | "rejected"): Promise<void> {
  const own = ids.filter((id) => !id.includes(":"));
  if (!own.length) return;
  const { data, error } = await client.from("review_reply_snippets").select(`id, ${field}`).eq("business_id", businessId).in("id", own);
  if (error) throw new Error(error.message);
  for (const row of (data ?? []) as unknown as Record<string, string | number>[]) {
    await client
      .from("review_reply_snippets")
      .update({ [field]: Number(row[field]) + 1 })
      .eq("id", row.id);
  }
}

/**
 * Every reply text the owner wrote: training answers, replies edited before approving, replies on
 * Google and the star-only templates. Suggestions must never be exactly one of these.
 */
async function loadOwnTextKeys(client: SupabaseClient, businessId: string, settings: ReplySettings): Promise<Set<string>> {
  const [training, edited, google] = await Promise.all([
    client.from("review_reply_training").select("answer").eq("business_id", businessId).neq("answer", "").limit(5000),
    client.from("review_reply_drafts").select("reply").eq("business_id", businessId).eq("edited", true).limit(5000),
    client.from("google_reviews").select("owner_reply").eq("business_id", businessId).not("owner_reply", "is", null).limit(5000),
  ]);
  for (const result of [training, edited, google]) if (result.error) throw new Error(result.error.message);
  const texts = [
    ...(training.data ?? []).map((row) => row.answer as string),
    ...(edited.data ?? []).map((row) => row.reply as string),
    ...(google.data ?? []).map((row) => row.owner_reply as string),
    settings.emptyPositive,
    settings.emptyNegative,
  ];
  return new Set(texts.filter(Boolean).flatMap(ownTextKeys));
}

// ---------------------------------------------------------------------------------------------
// Drafts

/** Claims a review for drafting; null when another request already has a live draft for it. */
async function claim(client: SupabaseClient, businessId: string, reviewId: string, profileId: string | null): Promise<string | null> {
  const { data, error } = await client
    .from("review_reply_drafts")
    .insert({ business_id: businessId, review_id: reviewId, status: "generating", profile_id: profileId })
    .select("id")
    .maybeSingle<{ id: string }>();
  if (error) {
    if (error.code === "23505") return null;
    throw new Error(error.message);
  }
  return data?.id ?? null;
}

interface ReviewToDraft {
  review_id: string;
  rating: number;
  text: string | null;
}

/** Builds the reply for one claimed review, applying automatic approval when the settings allow it. */
async function fillDraft(
  client: SupabaseClient,
  draftId: string,
  review: ReviewToDraft,
  settings: ReplySettings,
  library: Snippet[],
  ownKeys: Set<string>,
  businessId: string,
  options: { exclude?: string[]; lengthDelta?: number; allowAuto?: boolean; shownKeys?: Set<string> } = {},
): Promise<"pending" | "approved" | "failed"> {
  try {
    const draft = composeDistinct(
      { review: { id: review.review_id, rating: review.rating, text: review.text }, settings, library, exclude: options.exclude, lengthDelta: options.lengthDelta },
      ownKeys,
      options.shownKeys,
    );
    if (!draft) throw new Error("no reply different from the owner's texts and from the replies already shown");
    let status: "pending" | "approved" = "pending";
    if (options.allowAuto !== false && shouldAutoApprove(settings, review.rating)) {
      // Atomic quota check: two drafts at the same time cannot both take the last automatic approval.
      const { data: allowed } = await client.rpc("take_auto_reply", { p_business_id: businessId });
      if (allowed === true) status = "approved";
    }
    const { error } = await client
      .from("review_reply_drafts")
      .update({
        status,
        reply: draft.reply,
        reasoning: draft.reasoning,
        snippet_ids: draft.snippetIds,
        model: "regras",
        error: null,
        ...(status === "approved" ? { approved_by: "auto", decided_at: new Date().toISOString() } : {}),
      })
      .eq("id", draftId);
    if (error) throw new Error(error.message);
    if (status === "approved") await scoreSnippets(client, businessId, draft.snippetIds, "accepted");
    return status;
  } catch (error) {
    console.error("[replies] draft failed:", error instanceof Error ? error.message : error);
    // Free the claim so the next "Atualizar" tries again.
    await client.from("review_reply_drafts").delete().eq("id", draftId);
    return "failed";
  }
}

export interface DraftRunResult {
  drafted: number;
  autoApproved: number;
  failed: number;
  backlog: number;
}

/** Drafts replies for recent unanswered reviews (see replyWindowDays) without a live draft, newest first, up to `draftsPerRun`. */
export async function draftMissingReplies(client: SupabaseClient, business: ReplyBusiness): Promise<DraftRunResult> {
  const settings = await loadReplySettings(client, business.id);
  if (!settings.onboardedAt) return { drafted: 0, autoApproved: 0, failed: 0, backlog: 0 };

  // Claims left behind by a request that died are released.
  await client
    .from("review_reply_drafts")
    .delete()
    .eq("business_id", business.id)
    .eq("status", "generating")
    .lt("created_at", new Date(Date.now() - staleClaimMinutes * 60_000).toISOString());

  const [{ data: reviews, error }, { data: live, error: liveError }, library, ownKeys] = await Promise.all([
    client
      .from("google_reviews")
      .select("review_id, rating, text")
      .eq("business_id", business.id)
      .is("owner_reply", null)
      .gte("published_at", replyWindowStart(settings.onboardedAt)!.toISOString())
      .order("published_at", { ascending: false })
      .limit(5000),
    client.from("review_reply_drafts").select("review_id").eq("business_id", business.id).in("status", ["generating", "pending", "approved"]).limit(5000),
    loadLibrary(client, business.id, settings.profileId),
    loadOwnTextKeys(client, business.id, settings),
  ]);
  if (error) throw new Error(error.message);
  if (liveError) throw new Error(liveError.message);
  const drafted = new Set((live ?? []).map((row) => row.review_id as string));
  const missing = (reviews as ReviewToDraft[]).filter((review) => !drafted.has(review.review_id));
  const batch = missing.slice(0, draftsPerRun);

  const outcomes: string[] = [];
  for (const review of batch) {
    const draftId = await claim(client, business.id, review.review_id, settings.profileId);
    outcomes.push(draftId ? await fillDraft(client, draftId, review, settings, library, ownKeys, business.id) : "skipped");
  }
  const count = (value: string) => outcomes.filter((outcome) => outcome === value).length;
  return {
    drafted: count("pending") + count("approved"),
    autoApproved: count("approved"),
    failed: count("failed"),
    backlog: missing.length - batch.length + count("failed"),
  };
}

async function liveDraft(client: SupabaseClient, businessId: string, draftId: string): Promise<DraftRow | null> {
  const { data, error } = await client.from("review_reply_drafts").select(draftColumns).eq("id", draftId).eq("business_id", businessId).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as DraftRow | null) ?? null;
}

/**
 * "Aceitar": only marks the reply as approved (Google is not connected yet). With an edited text,
 * the owner's new sentences go into the library.
 */
export async function approveDraft(client: SupabaseClient, businessId: string, draftId: string, editedReply: string | null): Promise<{ ok: boolean; learned: number }> {
  const draft = await liveDraft(client, businessId, draftId);
  if (!draft || draft.status !== "pending" || !draft.google_reviews) return { ok: false, learned: 0 };
  const edited = editedReply !== null && editedReply.trim() !== "" && editedReply.trim() !== draft.reply.trim();
  const { error } = await client
    .from("review_reply_drafts")
    .update({
      status: "approved",
      approved_by: "client",
      decided_at: new Date().toISOString(),
      ...(edited ? { edited: true, original_reply: draft.reply, reply: editedReply!.trim() } : {}),
    })
    .eq("id", draftId)
    .eq("status", "pending");
  if (error) throw new Error(error.message);
  if (!edited) {
    await scoreSnippets(client, businessId, draft.snippet_ids, "accepted");
    return { ok: true, learned: 0 };
  }
  const settings = await loadReplySettings(client, businessId);
  const learned = await addToLibrary(client, businessId, editedReply!, draft.google_reviews.rating, settings, "edit", draft.google_reviews.review_id);
  return { ok: true, learned: learned.length };
}

/** Puts an approved reply back to "por aprovar" (only while it is not published). */
export async function undoApproval(client: SupabaseClient, businessId: string, draftId: string): Promise<boolean> {
  const draft = await liveDraft(client, businessId, draftId);
  if (!draft || draft.status !== "approved" || draft.google_reviews?.owner_reply) return false;
  const { error } = await client.from("review_reply_drafts").update({ status: "pending", approved_by: null, decided_at: null }).eq("id", draftId);
  if (error) throw new Error(error.message);
  return true;
}

/**
 * "Rejeitar": keeps the rejected draft and its reasons, counts a rejection on each of the owner's
 * sentences it used (sentences rejected more than accepted stop being used), and builds a new
 * reply with other sentences.
 */
export async function rejectAndRedraft(client: SupabaseClient, businessId: string, draftId: string, reasons: string[]): Promise<"redrafted" | "rejected" | "missing"> {
  const draft = await liveDraft(client, businessId, draftId);
  if (!draft || draft.status !== "pending" || !draft.google_reviews) return "missing";
  const { error } = await client
    .from("review_reply_drafts")
    .update({ status: "rejected", feedback_reasons: reasons, decided_at: new Date().toISOString() })
    .eq("id", draftId)
    .eq("status", "pending");
  if (error) throw new Error(error.message);
  await scoreSnippets(client, businessId, draft.snippet_ids, "rejected");

  const settings = await loadReplySettings(client, businessId);
  const [library, ownKeys] = await Promise.all([loadLibrary(client, businessId, settings.profileId), loadOwnTextKeys(client, businessId, settings)]);
  const newId = await claim(client, businessId, draft.google_reviews.review_id, settings.profileId);
  if (!newId) return "rejected";
  const lengthDelta = reasons.includes("longa") ? -1 : reasons.includes("curta") ? 1 : 0;
  const outcome = await fillDraft(
    client,
    newId,
    draft.google_reviews,
    { ...settings, emojis: reasons.includes("emojis") ? false : settings.emojis },
    library,
    ownKeys,
    businessId,
    // A redraft after a rejection always waits for the owner, even with automatic replies on.
    { exclude: draft.snippet_ids, lengthDelta, allowAuto: false, shownKeys: await shownReplyKeys(client, businessId, draft.google_reviews.review_id) },
  );
  return outcome === "failed" ? "rejected" : "redrafted";
}

/** Every reply already suggested for a review (any status): alternatives never repeat them. */
async function shownReplyKeys(client: SupabaseClient, businessId: string, reviewId: string): Promise<Set<string>> {
  const { data, error } = await client.from("review_reply_drafts").select("reply").eq("business_id", businessId).eq("review_id", reviewId).neq("reply", "").limit(500);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => replyKey(row.reply as string)));
}

export interface ReplyAlternative {
  /** replyKey of the text: identifies the option when the owner picks it. */
  key: string;
  reply: string;
  reasoning: string;
}

/** Number of alternatives offered by "Outra resposta". */
export const alternativesCount = 5;

async function alternativesFor(client: SupabaseClient, businessId: string, draft: DraftRow): Promise<ComposedReply[]> {
  const review = draft.google_reviews!;
  const settings = await loadReplySettings(client, businessId);
  const [library, ownKeys, shownKeys] = await Promise.all([
    loadLibrary(client, businessId, settings.profileId),
    loadOwnTextKeys(client, businessId, settings),
    shownReplyKeys(client, businessId, review.review_id),
  ]);
  return composeOptions({ review: { id: review.review_id, rating: review.rating, text: review.text }, settings, library }, ownKeys, shownKeys, alternativesCount);
}

/**
 * "Outra resposta": up to 5 replies with different texts, none equal to one already shown for this
 * review nor to a text the owner wrote. Nothing is saved until the owner picks one.
 */
export async function draftAlternatives(client: SupabaseClient, businessId: string, draftId: string): Promise<ReplyAlternative[] | null> {
  const draft = await liveDraft(client, businessId, draftId);
  if (!draft || draft.status !== "pending" || !draft.google_reviews) return null;
  return (await alternativesFor(client, businessId, draft)).map((option) => ({ key: replyKey(option.reply), reply: option.reply, reasoning: option.reasoning }));
}

/**
 * The owner picked an alternative: the current suggestion is kept as rejected (its sentences count
 * a rejection) and the chosen text becomes the new suggestion, still waiting for "Aceitar".
 */
export async function chooseAlternative(client: SupabaseClient, businessId: string, draftId: string, key: string): Promise<"chosen" | "stale" | "missing"> {
  const draft = await liveDraft(client, businessId, draftId);
  if (!draft || draft.status !== "pending" || !draft.google_reviews) return "missing";
  // Rebuilt on the server: the client only says which text, never what to store.
  const chosen = (await alternativesFor(client, businessId, draft)).find((option) => replyKey(option.reply) === key);
  if (!chosen) return "stale";
  const { error } = await client
    .from("review_reply_drafts")
    .update({ status: "rejected", feedback_reasons: ["outra"], decided_at: new Date().toISOString() })
    .eq("id", draftId)
    .eq("status", "pending");
  if (error) throw new Error(error.message);
  await scoreSnippets(client, businessId, draft.snippet_ids, "rejected");
  const settings = await loadReplySettings(client, businessId);
  const newId = await claim(client, businessId, draft.google_reviews.review_id, settings.profileId);
  if (!newId) return "missing";
  const { error: updateError } = await client
    .from("review_reply_drafts")
    .update({ status: "pending", reply: chosen.reply, reasoning: chosen.reasoning, snippet_ids: chosen.snippetIds, model: "regras" })
    .eq("id", newId);
  if (updateError) throw new Error(updateError.message);
  return "chosen";
}

export interface ToneHistoryEntry {
  id: string;
  settings: ToneSettings;
  createdAt: string;
  current: boolean;
  sentences: number;
  trained: number;
  accepted: number;
  edited: number;
  rejected: number;
}

/** Each tone the owner used, with what it learned and how its replies were received. */
export async function loadToneHistory(client: SupabaseClient, businessId: string, currentProfileId: string | null): Promise<ToneHistoryEntry[]> {
  const [profiles, snippets, training, drafts] = await Promise.all([
    client.from("review_reply_profiles").select("id, settings, created_at").eq("business_id", businessId).order("created_at", { ascending: false }).limit(100),
    client.from("review_reply_snippets").select("profile_id").eq("business_id", businessId).eq("disabled", false).limit(10000),
    client.from("review_reply_training").select("profile_id").eq("business_id", businessId).eq("skipped", false).limit(10000),
    client.from("review_reply_drafts").select("profile_id, status, approved_by, edited").eq("business_id", businessId).in("status", ["approved", "rejected"]).limit(10000),
  ]);
  for (const result of [profiles, snippets, training, drafts]) if (result.error) throw new Error(result.error.message);
  const count = <T extends { profile_id: string | null }>(rows: T[] | null, id: string, test: (row: T) => boolean = () => true) =>
    (rows ?? []).filter((row) => row.profile_id === id && test(row)).length;
  type DraftStat = { profile_id: string | null; status: string; approved_by: string | null; edited: boolean };
  const draftRows = drafts.data as DraftStat[] | null;
  return (profiles.data ?? []).map((profile) => ({
    id: profile.id as string,
    settings: profile.settings as ToneSettings,
    createdAt: profile.created_at as string,
    current: profile.id === currentProfileId,
    sentences: count(snippets.data as { profile_id: string | null }[] | null, profile.id as string),
    trained: count(training.data as { profile_id: string | null }[] | null, profile.id as string),
    accepted: count(draftRows, profile.id as string, (row) => row.status === "approved" && row.approved_by === "client" && !row.edited),
    edited: count(draftRows, profile.id as string, (row) => row.status === "approved" && row.edited),
    rejected: count(draftRows, profile.id as string, (row) => row.status === "rejected"),
  }));
}
