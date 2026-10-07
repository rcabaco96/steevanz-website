// Dev helper for the review panels listed in /admin/reviews. Uses the service role key from .env.local.
//   node --env-file=.env.local scripts/review-businesses.mjs                 -> list (dry run)
//   node --env-file=.env.local scripts/review-businesses.mjs --delete        -> delete every business
//   node --env-file=.env.local scripts/review-businesses.mjs --delete-slug=x -> delete one business
//   node --env-file=.env.local scripts/review-businesses.mjs --clear-jobs    -> delete queued, running and failed reader jobs
// Deleting a business also deletes its reviews, competitors, reply drafts, learned phrases, import
// jobs and Google link (all cascade). Shared competitor numbers (by Google place) stay.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
const db = createClient(url, key, { auth: { persistSession: false } });

const { data: businesses, error } = await db.from("review_businesses").select("id, slug, name").order("name");
if (error) throw new Error(error.message);
for (const business of businesses) console.log(business.slug.padEnd(40), business.name);
console.log(`${businesses.length} businesses`);

const remove = async (business) => {
  const { error: deleteError } = await db.from("review_businesses").delete().eq("id", business.id);
  if (deleteError) throw new Error(`${business.slug}: ${deleteError.message}`);
  console.log("deleted", business.slug);
};

if (process.argv.includes("--delete")) for (const business of businesses) await remove(business);

// Reader jobs not finished (queued, running or failed, e.g. competitors of businesses that no longer
// exist). --clear-jobs deletes them; finished jobs ("done") stay.
const unfinished = ["queued", "running", "failed"];
const { data: pending, error: queueError } = await db.from("review_import_jobs").select("id").in("status", unfinished).limit(5000);
if (queueError) throw new Error(queueError.message);
console.log(`${pending.length} reader jobs queued, running or failed`);
if (process.argv.includes("--clear-jobs")) {
  const { error: clearError } = await db.from("review_import_jobs").delete().in("status", unfinished);
  if (clearError) throw new Error(clearError.message);
  console.log("deleted", pending.length, "jobs");
}

const single = process.argv.find((arg) => arg.startsWith("--delete-slug="))?.split("=")[1];
if (single) {
  const business = businesses.find((item) => item.slug === single);
  if (!business) console.log("not found", single);
  else await remove(business);
}
