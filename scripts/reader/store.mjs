// Everything the reader reads from and writes to Supabase. In a dry run the reads are real but
// every write is only printed (never review texts, names or anything personal).
import { cronSecret, log, siteUrl } from "./config.mjs";
import { matchStoredReviews, sameReviewToleranceMs } from "../../src/lib/reviews/maps-reader.ts";

const now = () => new Date().toISOString();

function check({ error }) {
  if (error) throw new Error(error.message);
}

/** Short, text-free description of review rows for the dry-run log. */
function describeRows(rows) {
  if (!rows.length) return "0 reviews";
  const dates = rows.map((row) => row.published_at).sort();
  const replied = rows.filter((row) => row.owner_reply).length;
  return `${rows.length} reviews (${dates[0].slice(0, 10)} → ${dates.at(-1).slice(0, 10)}, ${replied} com resposta)`;
}

export function createStore(db, { dryRun }) {
  const print = (what, detail) => log(`  [dry-run] escreveria ${what}:`, typeof detail === "string" ? detail : JSON.stringify(detail));

  return {
    dryRun,

    // --- reads ---------------------------------------------------------------------------------
    async business(match) {
      const query = db
        .from("review_businesses")
        .select("id, slug, name, google_maps_url, review_url, alert_email, place_id, google_place_id, google_link_status, google_fid, lat, lng, category, competitors_refreshed_at, competitor_radius_km, competitors_search_radius_km, competitors_rule_version");
      const { data, error } = await (match.id ? query.eq("id", match.id) : query.eq("slug", match.slug)).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) throw new Error("O negócio deste pedido já não existe.");
      return data;
    },

    async newestStored(businessId) {
      const { data, error } = await db.from("google_reviews").select("published_at").eq("business_id", businessId).order("published_at", { ascending: false }).limit(1).maybeSingle();
      if (error) throw new Error(error.message);
      return data?.published_at ?? null;
    },

    async oldestUnansweredSince(businessId, since) {
      const { data, error } = await db
        .from("google_reviews")
        .select("published_at")
        .eq("business_id", businessId)
        .is("owner_reply", null)
        .gte("published_at", since)
        .order("published_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data?.published_at ?? null;
    },

    /** Ids among `ids` already stored for the business. */
    async knownIds(businessId, ids) {
      const known = new Set();
      for (let index = 0; index < ids.length; index += 100) {
        const { data, error } = await db.from("google_reviews").select("review_id").eq("business_id", businessId).in("review_id", ids.slice(index, index + 100));
        if (error) throw new Error(error.message);
        for (const row of data ?? []) known.add(row.review_id);
      }
      return known;
    },

    async competitorsForPlace(placeId) {
      const { data, error } = await db.from("competitors").select("id, business_id, is_self, category, reply_rate, reply_sample, replies_window_days").eq("place_id", placeId);
      if (error) throw new Error(error.message);
      return data ?? [];
    },

    async readerPlaceRow(placeId) {
      const { data, error } = await db.from("reader_places").select("read_on, replies_read_on").eq("place_id", placeId).maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },

    /** Stored rows of the business published in the time span of `rows` (±2 s), in pages of 1000. */
    async storedAround(businessId, rows) {
      const times = rows.map((row) => Date.parse(row.published_at));
      const from = new Date(Math.min(...times) - sameReviewToleranceMs).toISOString();
      const to = new Date(Math.max(...times) + sameReviewToleranceMs).toISOString();
      const stored = [];
      for (let start = 0; ; start += 1000) {
        const { data, error } = await db
          .from("google_reviews")
          .select("review_id, rating, published_at")
          .eq("business_id", businessId)
          .gte("published_at", from)
          .lte("published_at", to)
          .order("published_at")
          .order("review_id")
          .range(start, start + 999);
        if (error) throw new Error(error.message);
        stored.push(...(data ?? []));
        if (!data || data.length < 1000) return stored;
      }
    },

    /**
     * Saves reviews read from Maps and returns those that were not stored before. A review already
     * stored under another id (e.g. `gbp:…` from the Business Profile sync) keeps that row: only
     * its owner reply is updated, and only when Maps shows one (a reply just posted through the API
     * may take a while to appear on Maps and must not be erased).
     */
    async saveReviews(businessId, rows) {
      if (!rows.length) return [];
      const known = await this.knownIds(
        businessId,
        rows.map((row) => row.review_id),
      );
      const matches = matchStoredReviews(rows, await this.storedAround(businessId, rows));
      const upserts = rows.filter((row) => !matches.has(row.review_id));
      const replies = rows.filter((row) => matches.has(row.review_id) && row.owner_reply);
      if (dryRun) {
        print("google_reviews", describeRows(upserts));
        if (matches.size) print("respostas em reviews já guardadas com outro id", `${matches.size} encontradas, ${replies.length} com resposta`);
      } else {
        for (let index = 0; index < upserts.length; index += 500) {
          check(await db.from("google_reviews").upsert(upserts.slice(index, index + 500), { onConflict: "review_id" }));
        }
        for (const row of replies) {
          check(
            await db
              .from("google_reviews")
              .update({ owner_reply: row.owner_reply, owner_replied_at: row.owner_replied_at, fetched_at: row.fetched_at })
              .eq("review_id", matches.get(row.review_id)),
          );
        }
      }
      return rows.filter((row) => !known.has(row.review_id) && !matches.has(row.review_id));
    },

    // --- writes --------------------------------------------------------------------------------
    async jobProgress(jobId, fields) {
      if (dryRun) return print("progresso", fields);
      check(await db.from("review_import_jobs").update({ ...fields, updated_at: now() }).eq("id", jobId));
    },

    async updateBusiness(id, fields) {
      if (dryRun) return print("review_businesses", fields);
      check(await db.from("review_businesses").update(fields).eq("id", id));
    },

    async upsertSnapshots(rows) {
      if (!rows.length) return;
      if (dryRun) return print(`competitor_snapshots (${rows.length} linhas)`, rows[0]);
      check(await db.from("competitor_snapshots").upsert(rows, { onConflict: "competitor_id,taken_on" }));
    },

    async updateCompetitors(placeId, fields) {
      if (dryRun) return print(`competitors com place_id ${placeId}`, fields);
      check(await db.from("competitors").update(fields).eq("place_id", placeId));
    },

    /** The customer's own row in its comparison (is_self) after its name was corrected. */
    async renameOwnPlace(businessId, name) {
      if (dryRun) return print(`competitors (próprio) de ${businessId}`, { name });
      check(await db.from("competitors").update({ name }).eq("business_id", businessId).eq("is_self", true));
    },

    async updateCompetitor(id, fields) {
      if (dryRun) return print(`competitors ${id}`, fields);
      check(await db.from("competitors").update(fields).eq("id", id));
    },

    /**
     * The customer's comparison set from the reader's zone search: its own place (is_self) and the
     * chosen places. Places that dropped out go, unless an admin excluded them on purpose.
     */
    async saveCompetitors(businessId, rows) {
      if (dryRun) return print(`competitors (${rows.length} linhas)`, rows.slice(0, 2));
      check(await db.from("competitors").upsert(rows.map((row) => ({ ...row, business_id: businessId })), { onConflict: "business_id,place_id" }));
      const keep = rows.map((row) => `"${row.place_id}"`).join(",");
      check(await db.from("competitors").delete().eq("business_id", businessId).eq("excluded", false).not("place_id", "in", `(${keep})`));
    },

    /** Places read by the reader since `since` (for any customer): their numbers are reused, not read again. */
    async freshPlaceIds(placeIds, since) {
      if (!placeIds.length) return new Set();
      const { data, error } = await db.from("reader_places").select("place_id, read_at").in("place_id", placeIds);
      if (error) throw new Error(error.message);
      return new Set((data ?? []).filter((row) => row.read_at && Date.parse(row.read_at) >= since.getTime()).map((row) => row.place_id));
    },

    /**
     * Shared base per place: the newest snapshot of each place (from any customer's row) goes onto
     * the rows of that place that have none yet, and a finished read is recorded for each place (so
     * the panel's progress counts it). Nothing is read from Google.
     */
    async reuseSnapshots(placeIds) {
      if (!placeIds.length) return 0;
      if (dryRun) return print("competitor_snapshots (reaproveitadas)", `${placeIds.length} locais`);
      const { data: rows, error } = await db.from("competitors").select("id, place_id").in("place_id", placeIds);
      if (error) throw new Error(error.message);
      const placeOf = new Map((rows ?? []).map((row) => [row.id, row.place_id]));
      const { data: snapshots, error: snapshotsError } = await db
        .from("competitor_snapshots")
        .select("competitor_id, taken_on, rating, average, reviews_count, distribution, photos_count, profile")
        .in("competitor_id", [...placeOf.keys()])
        .order("taken_on", { ascending: false })
        .limit(1000);
      if (snapshotsError) throw new Error(snapshotsError.message);
      const newest = new Map();
      const withSnapshot = new Set();
      for (const snapshot of snapshots ?? []) {
        withSnapshot.add(snapshot.competitor_id);
        const placeId = placeOf.get(snapshot.competitor_id);
        if (!newest.has(placeId)) newest.set(placeId, snapshot);
      }
      const copies = (rows ?? [])
        .filter((row) => !withSnapshot.has(row.id) && newest.has(row.place_id))
        .map((row) => ({ ...newest.get(row.place_id), competitor_id: row.id }));
      if (copies.length) check(await db.from("competitor_snapshots").upsert(copies, { onConflict: "competitor_id,taken_on" }));
      const at = now();
      check(
        await db.from("review_import_jobs").insert(
          placeIds.map((placeId) => ({
            kind: "competitor",
            place_id: placeId,
            priority: 3,
            requested_by: "panel",
            provider: "reader",
            status: "done",
            requested_at: at,
            started_at: at,
            finished_at: at,
            error: "Reaproveitado: este local já tinha sido lido desde a última atualização.",
          })),
        ),
      );
      return copies.length;
    },

    /** Reads of these places for the reader (rating, total, stars), skipping ones already waiting. */
    async queuePlaceReads(placeIds) {
      if (dryRun) return print("review_import_jobs (competitor)", `${placeIds.length} locais`);
      let queued = 0;
      for (const placeId of placeIds) {
        const { error } = await db
          .from("review_import_jobs")
          .insert({ kind: "competitor", place_id: placeId, priority: 4, requested_by: "panel", provider: "reader", requested_at: now() });
        if (!error) queued++;
        else if (error.code !== "23505") throw new Error(error.message);
      }
      return queued;
    },

    async readerPlace(placeId, fields) {
      if (dryRun) return print("reader_places", { place_id: placeId, ...fields });
      check(await db.from("reader_places").upsert({ place_id: placeId, ...fields, updated_at: now() }, { onConflict: "place_id" }));
    },

    /** Asks the site to email the owner about new negative reviews. Failures are only logged. */
    async postAlert(businessId, reviewIds) {
      if (dryRun) return print(`alerta em ${siteUrl}/api/reader/alerts`, { businessId, reviewIds });
      if (!cronSecret) return log("  aviso: falta CRON_SECRET no .env.local; alerta de reviews negativas não enviado");
      try {
        const response = await fetch(`${siteUrl}/api/reader/alerts`, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${cronSecret}` },
          body: JSON.stringify({ businessId, reviewIds }),
          signal: AbortSignal.timeout(20_000),
        });
        if (!response.ok) log(`  aviso: alerta de reviews negativas recusado (${response.status})`);
        else log(`  alerta de ${reviewIds.length} review(s) negativa(s) pedido`);
      } catch (error) {
        log("  aviso: alerta de reviews negativas falhou:", error instanceof Error ? error.message : error);
      }
    },
  };
}
