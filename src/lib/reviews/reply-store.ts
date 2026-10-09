import type { SupabaseClient } from "@supabase/supabase-js";
import { isNegative } from "./analytics.ts";
import { inferSignature, learnableOwnerReply, ownerReplySnippets, type OwnerReply } from "./owner-replies.ts";
import { isReplyLanguage, replyLanguage, type ReplyLanguage } from "./reply-languages.ts";
import { composeDistinct, composeOptions, learnFromAnswer, ownTextKeys, replyKey, translateToPortuguese, type ComposedReply, type Snippet } from "./reply-rules.ts";
import { normalize, themesIn, type ThemeId } from "./text.ts";
import {
  defaultReplySettings,
  draftsPerRun,
  inAutoReplyWindow,
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

/**
 * Business rule: the replies always work from every review stored in Supabase for the business
 * (google_reviews, whatever source saved it: the reader, the Google Business Profile, older
 * imports). Nothing here reads Google. Supabase returns at most 1000 rows per request, so every
 * list is read in pages until the end (a plain .limit() above 1000 silently cuts the list).
 */
const pageSize = 1000;

type PageResult = { data: unknown; error: { code?: string; message: string } | null };

/** Reads every row of a query in pages of 1000. The query needs a stable order (a unique last key). */
async function readAll<T>(build: (from: number, to: number) => PromiseLike<PageResult>): Promise<{ data: T[]; error: PageResult["error"] }> {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await build(from, from + pageSize - 1);
    if (error) return { data: rows, error };
    const page = (data ?? []) as T[];
    rows.push(...page);
    if (page.length < pageSize) return { data: rows, error: null };
  }
}

/** readAll, throwing on error. */
async function readAllOrThrow<T>(build: (from: number, to: number) => PromiseLike<PageResult>): Promise<T[]> {
  const { data, error } = await readAll<T>(build);
  if (error) throw new Error(error.message);
  return data;
}

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
  const voiceChanged =
    (previous.profileId !== null && previous.profileId !== profileId) ||
    previous.signature.trim() !== settings.signature.trim() ||
    previous.negativeContact.trim() !== settings.negativeContact.trim();
  if (previous.onboardedAt && voiceChanged) {
    // Pending replies carry the old tone, signature or contact: they are built again right away
    // (saveReplySettingsAction). Rejected and approved ones stay as history.
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
  googleMapsUrl: string | null;
}

export async function loadReplyBusiness(client: SupabaseClient, slug: string): Promise<ReplyBusiness | null> {
  const { data, error } = await client
    .from("review_businesses")
    .select("id, slug, name, category, last_synced_at, google_fid, google_maps_url")
    .eq("slug", slug)
    .maybeSingle<{ id: string; slug: string; name: string; category: string | null; last_synced_at: string | null; google_fid: string | null; google_maps_url: string | null }>();
  if (error) throw new Error(error.message);
  return data
    ? { id: data.id, slug: data.slug, name: data.name, category: data.category, lastSyncedAt: data.last_synced_at, googleFid: data.google_fid, googleMapsUrl: data.google_maps_url }
    : null;
}

export interface InboxItem {
  draftId: string;
  status: DraftStatus;
  /** The reply, in `language` (the review's language; see replyLanguage). */
  reply: string;
  language: ReplyLanguage;
  /** Portuguese translation shown under a reply in another language; null for Portuguese replies. */
  replyPt: string | null;
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
  /** Missing until the reply_languages migration is applied (see withLanguageColumns). */
  language?: string;
  reply_pt?: string | null;
  google_reviews: { review_id: string; rating: number; text: string | null; language: string | null; published_at: string; owner_reply: string | null } | null;
}

/**
 * review_reply_drafts.language / reply_pt and the same columns on review_reply_alternatives come
 * from supabase/migrations/20261005120000_reply_languages.sql. Until it is applied, the queries
 * that use them run again without them: replies still come in the review's language, and the
 * Portuguese translation is worked out when reading (draftTranslation) instead of stored.
 */
function missingLanguageColumns(error: { code?: string; message: string } | null): boolean {
  return Boolean(error && (error.code === "42703" || error.code === "PGRST204") && /\b(language|reply_pt)\b/.test(error.message));
}

async function withLanguageColumns<T extends { error: { code?: string; message: string } | null }>(run: (stored: boolean) => PromiseLike<T>): Promise<T> {
  const result = await run(true);
  return missingLanguageColumns(result.error) ? run(false) : result;
}

const baseDraftColumns =
  "id, status, reply, reasoning, approved_by, edited, decided_at, created_at, original_reply, feedback_reasons, feedback_note, snippet_ids, google_reviews(review_id, rating, text, language, published_at, owner_reply)";
const draftColumns = (stored: boolean) => (stored ? `${baseDraftColumns}, language, reply_pt` : baseDraftColumns);

type TranslationSettings = Pick<ReplySettings, "addressForm" | "negativeContact">;

/**
 * Language and Portuguese translation of a draft. Stored with the draft; for drafts without them
 * (before the migration) the language comes from the review and the translation from the base
 * sentences — a reply with no base sentence of that language was written in Portuguese.
 */
function draftTranslation(row: DraftRow, settings: TranslationSettings): { language: ReplyLanguage; replyPt: string | null } {
  if (isReplyLanguage(row.language)) {
    if (row.language === "pt" || row.reply_pt || !row.reply) return { language: row.language, replyPt: row.language === "pt" ? null : (row.reply_pt ?? null) };
    return { language: row.language, replyPt: translateToPortuguese(row.reply, row.language, settings).text };
  }
  const review = row.google_reviews;
  const language = review ? replyLanguage(review.text, review.language) : "pt";
  if (language === "pt" || !row.reply) return { language: "pt", replyPt: null };
  const translation = translateToPortuguese(row.reply, language, settings);
  // Most sentences must be base sentences of that language (a few are identical in Spanish and Portuguese).
  return translation.translated * 2 > translation.sentences ? { language, replyPt: translation.text } : { language: "pt", replyPt: null };
}

function toInboxItem(row: DraftRow, settings: TranslationSettings): InboxItem | null {
  const review = row.google_reviews;
  if (!review) return null;
  return {
    draftId: row.id,
    status: row.status,
    reply: row.reply,
    ...draftTranslation(row, settings),
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
  /** Stored reviews without an owner reply that still have no draft (the whole stored history). */
  backlog: number;
  /** Every review stored for the business: what the replies are built from. */
  stored: number;
}

/** Live drafts (pending and approved), newest reviews first, and what is still to prepare. */
export async function loadInbox(client: SupabaseClient, businessId: string, settings: ReplySettings): Promise<ReplyInbox> {
  const [drafts, unanswered, stored] = await Promise.all([
    withLanguageColumns((withLanguage) =>
      readAll<DraftRow>((from, to) =>
        client
          .from("review_reply_drafts")
          .select(draftColumns(withLanguage))
          .eq("business_id", businessId)
          .in("status", ["pending", "approved", "generating"])
          .order("id")
          .range(from, to),
      ),
    ),
    readAll<{ review_id: string }>((from, to) =>
      client.from("google_reviews").select("review_id").eq("business_id", businessId).is("owner_reply", null).order("review_id").range(from, to),
    ),
    client.from("google_reviews").select("review_id", { count: "exact", head: true }).eq("business_id", businessId),
  ]);
  if (drafts.error) throw new Error(drafts.error.message);
  if (unanswered.error) throw new Error(unanswered.error.message);
  if (stored.error) throw new Error(stored.error.message);
  const items = drafts.data
    .map((row) => toInboxItem(row, settings))
    .filter((item): item is InboxItem => item !== null)
    .sort((a, b) => Date.parse(b.review.publishedAt) - Date.parse(a.review.publishedAt));
  const drafted = new Set(items.map((item) => item.review.id));
  return { items, backlog: unanswered.data.filter((row) => !drafted.has(row.review_id)).length, stored: stored.count ?? 0 };
}

// ---------------------------------------------------------------------------------------------
// Sentence library ("Treinar")

interface SnippetRow {
  id: string;
  kind: Snippet["kind"];
  sentiment: Snippet["sentiment"];
  theme: ThemeId | null;
  text: string;
  source: SnippetSource;
  accepted: number;
  rejected: number;
}

/** Where a sentence was learned: «Treinar», a reply edited before approving, or a reply on Google. */
export type SnippetSource = "training" | "edit" | "google";

export type LibrarySnippet = Snippet & { source: SnippetSource };

const snippetColumns = "id, kind, sentiment, theme, text, source, accepted, rejected";

/** The owner's sentences learned under one tone (never mixed with other tones). */
export async function loadLibrary(client: SupabaseClient, businessId: string, profileId: string | null): Promise<LibrarySnippet[]> {
  if (!profileId) return [];
  const rows = await readAllOrThrow<SnippetRow>((from, to) =>
    client
      .from("review_reply_snippets")
      .select(snippetColumns)
      .eq("business_id", businessId)
      .eq("profile_id", profileId)
      .eq("disabled", false)
      .order("created_at", { ascending: false })
      .order("id")
      .range(from, to),
  );
  return rows.map((row) => ({ ...row }));
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
 * sentiment and themes the owner's library covers least, mixing positives and negatives. Only
 * reviews answered in Portuguese: the library is the owner's Portuguese voice. Reviews whose reply on
 * Google was already learned (learnOwnerReplies) count as trained; before the first tone exists,
 * the ones it will learn when the form is saved are left out too.
 */
export async function loadTrainingQueue(client: SupabaseClient, businessId: string, profileId: string | null, limit = trainingBatch): Promise<TrainingReview[]> {
  const [reviews, done, library, fromGoogle] = await Promise.all([
    readAllOrThrow<{ review_id: string; rating: number; text: string; language: string | null; published_at: string; owner_reply: string | null }>((from, to) =>
      client
        .from("google_reviews")
        .select("review_id, rating, text, language, published_at, owner_reply")
        .eq("business_id", businessId)
        .not("text", "is", null)
        .order("published_at", { ascending: false })
        .order("review_id")
        .range(from, to),
    ),
    profileId
      ? readAllOrThrow<{ review_id: string }>((from, to) =>
          client.from("review_reply_training").select("review_id").eq("business_id", businessId).eq("profile_id", profileId).order("review_id").range(from, to),
        )
      : Promise.resolve([]),
    loadLibrary(client, businessId, profileId),
    profileId ? loadGoogleLearned(client, profileId) : Promise.resolve(null),
  ]);
  const seen = new Set(done.map((row) => row.review_id));
  if (fromGoogle) for (const reviewId of fromGoogle.keys()) seen.add(reviewId);
  // No tone yet: saving the form learns these replies (only when the learning table exists).
  const learnsOnSave = !profileId && (await googleLearningReady(client));
  for (const row of learnsOnSave ? reviews : []) if (row.owner_reply && learnableOwnerReply(row.owner_reply)) seen.add(row.review_id);
  const covered = new Map<string, number>();
  for (const snippet of library) {
    const key = `${snippet.sentiment}:${snippet.kind === "theme" ? snippet.theme : snippet.kind}`;
    covered.set(key, (covered.get(key) ?? 0) + 1);
  }
  const candidates = reviews
    .filter(
      (row) =>
        !seen.has(row.review_id as string) &&
        ((row.text as string) ?? "").trim().length >= 40 &&
        replyLanguage(row.text as string, row.language as string | null) === "pt",
    )
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

// ---------------------------------------------------------------------------------------------
// Replies the owner already gave on Google (google_reviews.owner_reply)

/**
 * review_reply_google_learned and the 'google' snippet source come from
 * supabase/migrations/20261010110000_reply_learn_google.sql. Until it is applied this learning is
 * skipped and everything else works as before.
 */
function missingLearningTable(error: { code?: string; message: string } | null): boolean {
  return Boolean(error && (error.code === "42P01" || error.code === "PGRST205"));
}

/** Reviews whose Google reply was learned under this tone → replyKey of the reply learned; null without the migration. */
async function loadGoogleLearned(client: SupabaseClient, profileId: string): Promise<Map<string, string> | null> {
  const { data, error } = await readAll<{ review_id: string; reply_key: string }>((from, to) =>
    client.from("review_reply_google_learned").select("review_id, reply_key").eq("profile_id", profileId).order("review_id").range(from, to),
  );
  if (missingLearningTable(error)) return null;
  if (error) throw new Error(error.message);
  return new Map(data.map((row) => [row.review_id, row.reply_key]));
}

/** Whether the migration of this learning is applied. */
export async function googleLearningReady(client: SupabaseClient): Promise<boolean> {
  // A plain read: a head request on a missing table comes back without an error.
  const { error } = await client.from("review_reply_google_learned").select("review_id").limit(1);
  if (missingLearningTable(error)) return false;
  if (error) throw new Error(error.message);
  return true;
}

/** Every stored review with an owner reply on Google, newest first (the whole history, in pages). */
export async function loadOwnerReplies(client: SupabaseClient, businessId: string): Promise<OwnerReply[]> {
  const rows = await readAllOrThrow<{ review_id: string; rating: number; text: string | null; owner_reply: string }>((from, to) =>
    client
      .from("google_reviews")
      .select("review_id, rating, text, owner_reply")
      .eq("business_id", businessId)
      .not("owner_reply", "is", null)
      .order("published_at", { ascending: false })
      .order("review_id")
      .range(from, to),
  );
  return rows.filter((row) => row.owner_reply.trim()).map((row) => ({ reviewId: row.review_id, rating: row.rating, reviewText: row.text, reply: row.owner_reply }));
}

export interface OwnerLearning {
  /** False while the business has no tone yet (replies never configured): nothing is learned until the form is saved. */
  tone: boolean;
  /** Replies on Google learned now (new ones and ones the owner edited on Google). */
  replies: number;
  /** New sentences added to the tone's library. */
  sentences: number;
}

/**
 * Business rule (rule 11): the owner's replies on Google teach the AI replies by themselves. Learns
 * the sentences of every stored reply not yet learned under the current tone (only Portuguese
 * replies with some substance: see learnableOwnerReply), and again the replies the owner edited on
 * Google. Idempotent: a reply is claimed in review_reply_google_learned before its sentences are
 * stored, so two runs at the same time (the reader and the site) never learn it twice. A sentence
 * already in the tone's library — even one the owner removed — is not added again. Each tone
 * learns them on its own (they are source data, not feedback given under another tone): the
 * reader calls this after every import, the site when the replies page opens and before drafting.
 */
export async function learnOwnerReplies(client: SupabaseClient, businessId: string, given?: ReplySettings): Promise<OwnerLearning> {
  const settings = given ?? (await loadReplySettings(client, businessId));
  const profileId = settings.profileId;
  if (!profileId) return { tone: false, replies: 0, sentences: 0 };
  const [learned, replies] = await Promise.all([loadGoogleLearned(client, profileId), loadOwnerReplies(client, businessId)]);
  if (!learned) return { tone: true, replies: 0, sentences: 0 };

  const signature = inferSignature(replies.map((reply) => reply.reply));
  const todo = replies
    .filter((reply) => learned.get(reply.reviewId) !== replyKey(reply.reply))
    .map((reply) => ({ reply, snippets: ownerReplySnippets(reply, settings, signature) }))
    .filter((item) => item.snippets.length);
  if (!todo.length) return { tone: true, replies: 0, sentences: 0 };

  // Claim: new replies are inserted (a row already there belongs to another run); edited ones move
  // from the key learned before to the new one.
  const claimed = new Set<string>();
  const fresh = todo.filter((item) => !learned.has(item.reply.reviewId));
  for (let index = 0; index < fresh.length; index += 500) {
    const { data, error } = await client
      .from("review_reply_google_learned")
      .upsert(
        fresh.slice(index, index + 500).map((item) => ({ profile_id: profileId, review_id: item.reply.reviewId, business_id: businessId, reply_key: replyKey(item.reply.reply) })),
        { onConflict: "profile_id,review_id", ignoreDuplicates: true },
      )
      .select("review_id");
    if (error) throw new Error(error.message);
    for (const row of data ?? []) claimed.add(row.review_id as string);
  }
  const edited = todo.filter((item) => learned.has(item.reply.reviewId));
  for (const item of edited) {
    const { data, error } = await client
      .from("review_reply_google_learned")
      .update({ reply_key: replyKey(item.reply.reply), learned_at: new Date().toISOString() })
      .eq("profile_id", profileId)
      .eq("review_id", item.reply.reviewId)
      .eq("reply_key", learned.get(item.reply.reviewId)!)
      .select("review_id");
    if (error) throw new Error(error.message);
    if (data?.length) claimed.add(item.reply.reviewId);
  }
  if (!claimed.size) return { tone: true, replies: 0, sentences: 0 };

  // Every sentence of the tone, removed ones too: a sentence the owner took out never comes back this way.
  const existing = await readAllOrThrow<{ text: string }>((from, to) =>
    client.from("review_reply_snippets").select("text").eq("business_id", businessId).eq("profile_id", profileId).order("id").range(from, to),
  );
  const known = new Set(existing.map((row) => replyKey(row.text)));
  const rows = todo
    .filter((item) => claimed.has(item.reply.reviewId))
    .flatMap((item) =>
      item.snippets.flatMap((snippet) => {
        const key = replyKey(snippet.text);
        if (!key || known.has(key)) return [];
        known.add(key);
        return [{ business_id: businessId, profile_id: profileId, ...snippet, source: "google", from_review_id: item.reply.reviewId }];
      }),
    );
  try {
    for (let index = 0; index < rows.length; index += 500) {
      const { error } = await client.from("review_reply_snippets").insert(rows.slice(index, index + 500));
      if (error) throw new Error(error.message);
    }
  } catch (error) {
    // Not learned after all: the claims go, so the next run tries again (best effort).
    const freshClaimed = fresh.map((item) => item.reply.reviewId).filter((id) => claimed.has(id));
    for (let index = 0; index < freshClaimed.length; index += 100) {
      await client.from("review_reply_google_learned").delete().eq("profile_id", profileId).in("review_id", freshClaimed.slice(index, index + 100));
    }
    for (const item of edited.filter((entry) => claimed.has(entry.reply.reviewId))) {
      await client.from("review_reply_google_learned").update({ reply_key: learned.get(item.reply.reviewId)! }).eq("profile_id", profileId).eq("review_id", item.reply.reviewId);
    }
    throw error;
  }
  return { tone: true, replies: claimed.size, sentences: rows.length };
}

/** learnOwnerReplies for the site: a failure is logged and never stops the page or the drafts. */
export async function learnOwnerRepliesSafely(client: SupabaseClient, businessId: string, settings?: ReplySettings): Promise<OwnerLearning | null> {
  try {
    return await learnOwnerReplies(client, businessId, settings);
  } catch (error) {
    console.error("[replies] learning from the owner's Google replies failed:", error instanceof Error ? error.message : error);
    return null;
  }
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
    readAllOrThrow<{ answer: string }>((from, to) =>
      client.from("review_reply_training").select("answer").eq("business_id", businessId).neq("answer", "").order("profile_id").order("review_id").range(from, to),
    ),
    readAllOrThrow<{ reply: string }>((from, to) => client.from("review_reply_drafts").select("reply").eq("business_id", businessId).eq("edited", true).order("id").range(from, to)),
    readAllOrThrow<{ owner_reply: string }>((from, to) =>
      client.from("google_reviews").select("owner_reply").eq("business_id", businessId).not("owner_reply", "is", null).order("review_id").range(from, to),
    ),
  ]);
  const texts = [
    ...training.map((row) => row.answer),
    ...edited.map((row) => row.reply),
    ...google.map((row) => row.owner_reply),
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
  /** Google's language code: the reply is written in the review's language. */
  language: string | null;
  published_at: string;
}

const toComposeReview = (review: ReviewToDraft) => ({ id: review.review_id, rating: review.rating, text: review.text, language: review.language });

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
      { review: toComposeReview(review), settings, library, exclude: options.exclude, lengthDelta: options.lengthDelta },
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
    const { error } = await withLanguageColumns((stored) =>
      client
        .from("review_reply_drafts")
        .update({
          status,
          reply: draft.reply,
          reasoning: draft.reasoning,
          snippet_ids: draft.snippetIds,
          model: "regras",
          error: null,
          ...(stored ? { language: draft.language, reply_pt: draft.replyPt } : {}),
          ...(status === "approved" ? { approved_by: "auto", decided_at: new Date().toISOString() } : {}),
        })
        .eq("id", draftId),
    );
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

  // Replies the owner gave on Google since the last run (or a tone just created) teach first.
  await learnOwnerRepliesSafely(client, business.id, settings);

  // Every stored review without an owner reply (all of google_reviews, in pages), newest first.
  const [reviews, live, library, ownKeys] = await Promise.all([
    readAllOrThrow<ReviewToDraft>((from, to) =>
      client
        .from("google_reviews")
        .select("review_id, rating, text, language, published_at")
        .eq("business_id", business.id)
        .is("owner_reply", null)
        .order("published_at", { ascending: false })
        .order("review_id")
        .range(from, to),
    ),
    readAllOrThrow<{ review_id: string }>((from, to) =>
      client.from("review_reply_drafts").select("review_id").eq("business_id", business.id).in("status", ["generating", "pending", "approved"]).order("id").range(from, to),
    ),
    loadLibrary(client, business.id, settings.profileId),
    loadOwnTextKeys(client, business.id, settings),
  ]);
  const drafted = new Set(live.map((row) => row.review_id));
  const missing = reviews.filter((review) => !drafted.has(review.review_id));
  const batch = missing.slice(0, draftsPerRun);

  const outcomes: string[] = [];
  for (const review of batch) {
    const draftId = await claim(client, business.id, review.review_id, settings.profileId);
    // Automatic approval only for recent reviews; older ones always wait for the owner.
    const allowAuto = inAutoReplyWindow(settings.onboardedAt, review.published_at);
    outcomes.push(draftId ? await fillDraft(client, draftId, review, settings, library, ownKeys, business.id, { allowAuto }) : "skipped");
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
  const { data, error } = await withLanguageColumns((stored) =>
    client.from("review_reply_drafts").select(draftColumns(stored)).eq("id", draftId).eq("business_id", businessId).maybeSingle(),
  );
  if (error) throw new Error(error.message);
  return (data as unknown as DraftRow | null) ?? null;
}

/**
 * "Aceitar": only marks the reply as approved (Google is not connected yet). With an edited text,
 * the owner's new sentences go into the library. Business rule: the library is the owner's
 * Portuguese voice, so an edited reply in another language teaches nothing (`foreign`); its
 * Portuguese translation is redone sentence by sentence (the owner's own sentences stay as written).
 */
export async function approveDraft(
  client: SupabaseClient,
  businessId: string,
  draftId: string,
  editedReply: string | null,
): Promise<{ ok: boolean; learned: number; foreign: boolean }> {
  const draft = await liveDraft(client, businessId, draftId);
  if (!draft || draft.status !== "pending" || !draft.google_reviews) return { ok: false, learned: 0, foreign: false };
  const edited = editedReply !== null && editedReply.trim() !== "" && editedReply.trim() !== draft.reply.trim();
  const settings = await loadReplySettings(client, businessId);
  const { language } = draftTranslation(draft, settings);
  const replyPt = edited && language !== "pt" ? translateToPortuguese(editedReply!.trim(), language, settings).text : null;
  const { error } = await withLanguageColumns((stored) =>
    client
      .from("review_reply_drafts")
      .update({
        status: "approved",
        approved_by: "client",
        decided_at: new Date().toISOString(),
        ...(edited ? { edited: true, original_reply: draft.reply, reply: editedReply!.trim() } : {}),
        ...(stored && replyPt ? { reply_pt: replyPt } : {}),
      })
      .eq("id", draftId)
      .eq("status", "pending"),
  );
  if (error) throw new Error(error.message);
  if (!edited) {
    await scoreSnippets(client, businessId, draft.snippet_ids, "accepted");
    return { ok: true, learned: 0, foreign: false };
  }
  if (language !== "pt") return { ok: true, learned: 0, foreign: true };
  const learned = await addToLibrary(client, businessId, editedReply!, draft.google_reviews.rating, settings, "edit", draft.google_reviews.review_id);
  return { ok: true, learned: learned.length, foreign: false };
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
  const [drafts, alternatives] = await Promise.all([
    client.from("review_reply_drafts").select("reply").eq("business_id", businessId).eq("review_id", reviewId).neq("reply", "").limit(500),
    client.from("review_reply_alternatives").select("reply_key").eq("business_id", businessId).eq("review_id", reviewId).limit(1000),
  ]);
  if (drafts.error) throw new Error(drafts.error.message);
  if (alternatives.error) throw new Error(alternatives.error.message);
  return new Set([...(drafts.data ?? []).map((row) => replyKey(row.reply as string)), ...(alternatives.data ?? []).map((row) => row.reply_key as string)]);
}

export interface ReplyAlternative {
  /** Stored alternative (review_reply_alternatives): the owner picks it by this id. */
  id: string;
  reply: string;
  reasoning: string;
  language: ReplyLanguage;
  /** Portuguese translation when the reply is in another language. */
  replyPt: string | null;
}

/** Number of alternatives offered by "Outra resposta". */
export const alternativesCount = 5;

async function alternativesFor(client: SupabaseClient, businessId: string, draft: DraftRow, settings: ReplySettings): Promise<ComposedReply[]> {
  const review = draft.google_reviews!;
  const [library, ownKeys, shownKeys] = await Promise.all([
    loadLibrary(client, businessId, settings.profileId),
    loadOwnTextKeys(client, businessId, settings),
    shownReplyKeys(client, businessId, review.review_id),
  ]);
  return composeOptions({ review: toComposeReview(review), settings, library }, ownKeys, shownKeys, alternativesCount);
}

/**
 * "Outra resposta": up to 5 replies with different texts, none equal to one already shown for this
 * review (drafts or earlier alternatives) nor to a text the owner wrote. Every alternative shown
 * is stored, picked or not: it never comes back, and what the owner skipped stays as learning.
 */
export async function draftAlternatives(client: SupabaseClient, businessId: string, draftId: string): Promise<ReplyAlternative[] | null> {
  const draft = await liveDraft(client, businessId, draftId);
  if (!draft || draft.status !== "pending" || !draft.google_reviews) return null;
  const settings = await loadReplySettings(client, businessId);
  const options = await alternativesFor(client, businessId, draft, settings);
  if (!options.length) return [];
  const { data, error } = await withLanguageColumns((stored) =>
    client
      .from("review_reply_alternatives")
      .insert(
        options.map((option) => ({
          business_id: businessId,
          review_id: draft.google_reviews!.review_id,
          draft_id: draftId,
          profile_id: settings.profileId,
          reply: option.reply,
          reply_key: replyKey(option.reply),
          reasoning: option.reasoning,
          snippet_ids: option.snippetIds,
          ...(stored ? { language: option.language, reply_pt: option.replyPt } : {}),
        })),
      )
      .select("id, reply"),
  );
  if (error) throw new Error(error.message);
  // Same order as composed (the usual reply first).
  const rows = (data ?? []) as { id: string; reply: string }[];
  return options.flatMap((option) => {
    const row = rows.find((candidate) => candidate.reply === option.reply);
    return row ? [{ id: row.id, reply: option.reply, reasoning: option.reasoning, language: option.language, replyPt: option.replyPt }] : [];
  });
}

/**
 * The owner picked an alternative: the current suggestion is kept as rejected (its sentences count
 * a rejection) and the chosen text becomes the new suggestion, still waiting for "Aceitar".
 */
export async function chooseAlternative(client: SupabaseClient, businessId: string, draftId: string, alternativeId: string): Promise<"chosen" | "stale" | "missing"> {
  const draft = await liveDraft(client, businessId, draftId);
  if (!draft || draft.status !== "pending" || !draft.google_reviews) return "missing";
  // The text comes from what the server stored when showing it, never from the client.
  const { data: chosen, error: chosenError } = await withLanguageColumns((stored) =>
    client
      .from("review_reply_alternatives")
      .select(stored ? "id, reply, reasoning, snippet_ids, language, reply_pt" : "id, reply, reasoning, snippet_ids")
      .eq("id", alternativeId)
      .eq("business_id", businessId)
      .eq("draft_id", draftId)
      .maybeSingle<{ id: string; reply: string; reasoning: string; snippet_ids: string[]; language?: string; reply_pt?: string | null }>(),
  );
  if (chosenError) throw new Error(chosenError.message);
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
  const { error: updateError } = await withLanguageColumns((stored) =>
    client
      .from("review_reply_drafts")
      .update({
        status: "pending",
        reply: chosen.reply,
        reasoning: chosen.reasoning,
        snippet_ids: chosen.snippet_ids,
        model: "regras",
        ...(stored && isReplyLanguage(chosen.language) ? { language: chosen.language, reply_pt: chosen.reply_pt ?? null } : {}),
      })
      .eq("id", newId),
  );
  if (updateError) throw new Error(updateError.message);
  await client.from("review_reply_alternatives").update({ chosen: true }).eq("id", chosen.id);
  return "chosen";
}

export interface ToneHistoryEntry {
  id: string;
  settings: ToneSettings;
  createdAt: string;
  current: boolean;
  sentences: number;
  trained: number;
  /** Replies on Google whose sentences were learned under this tone. */
  google: number;
  accepted: number;
  edited: number;
  rejected: number;
}

/** Each tone the owner used, with what it learned and how its replies were received. */
export async function loadToneHistory(client: SupabaseClient, businessId: string, currentProfileId: string | null): Promise<ToneHistoryEntry[]> {
  type ProfileRef = { profile_id: string | null };
  type DraftStat = ProfileRef & { status: string; approved_by: string | null; edited: boolean };
  const [profiles, snippets, training, draftRows, google] = await Promise.all([
    client.from("review_reply_profiles").select("id, settings, created_at").eq("business_id", businessId).order("created_at", { ascending: false }).limit(100),
    readAllOrThrow<ProfileRef>((from, to) => client.from("review_reply_snippets").select("profile_id").eq("business_id", businessId).eq("disabled", false).order("id").range(from, to)),
    readAllOrThrow<ProfileRef>((from, to) =>
      client.from("review_reply_training").select("profile_id").eq("business_id", businessId).eq("skipped", false).order("profile_id").order("review_id").range(from, to),
    ),
    readAllOrThrow<DraftStat>((from, to) =>
      client.from("review_reply_drafts").select("profile_id, status, approved_by, edited").eq("business_id", businessId).in("status", ["approved", "rejected"]).order("id").range(from, to),
    ),
    readAll<ProfileRef>((from, to) =>
      client.from("review_reply_google_learned").select("profile_id").eq("business_id", businessId).order("profile_id").order("review_id").range(from, to),
    ),
  ]);
  if (profiles.error) throw new Error(profiles.error.message);
  if (google.error && !missingLearningTable(google.error)) throw new Error(google.error.message);
  const count = <T extends ProfileRef>(rows: T[], id: string, test: (row: T) => boolean = () => true) => rows.filter((row) => row.profile_id === id && test(row)).length;
  const entries = (profiles.data ?? []).map((profile) => ({
    id: profile.id as string,
    settings: profile.settings as ToneSettings,
    createdAt: profile.created_at as string,
    current: profile.id === currentProfileId,
    sentences: count(snippets, profile.id as string),
    trained: count(training, profile.id as string),
    google: count(google.data, profile.id as string),
    accepted: count(draftRows, profile.id as string, (row) => row.status === "approved" && row.approved_by === "client" && !row.edited),
    edited: count(draftRows, profile.id as string, (row) => row.status === "approved" && row.edited),
    rejected: count(draftRows, profile.id as string, (row) => row.status === "rejected"),
  }));
  return entries.sort((a, b) => Number(b.current) - Number(a.current));
}
