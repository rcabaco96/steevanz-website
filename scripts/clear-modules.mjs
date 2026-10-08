// Clears the data of the waitlist, bookings and loyalty card modules, to test from scratch. Keeps the
// spaces, their settings (queue rules, booking page, card rules and PIN), services and staff.
// Uses the service role key from .env.local.
//   node --env-file=.env.local scripts/clear-modules.mjs                    -> counts only (dry run)
//   node --env-file=.env.local scripts/clear-modules.mjs --apply            -> deletes in every space
//   node --env-file=.env.local scripts/clear-modules.mjs --apply tasca-do-largo  -> only these spaces
// Deletes queue tickets, bookings, delays, blocked periods and loyalty cards (their stamps and
// rewards go with them). It cannot be undone.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
const db = createClient(url, key, { auth: { persistSession: false } });

const apply = process.argv.includes("--apply");
const slugs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const tables = ["waitlist_entries", "establishment_bookings", "booking_delays", "booking_blocks", "loyalty_cards"];

const { data: spaces, error } = await db.from("establishments").select("id, slug, name").order("name");
if (error) throw new Error(error.message);
const chosen = slugs.length ? spaces.filter((space) => slugs.includes(space.slug)) : spaces;
if (!chosen.length) throw new Error("No space found for those slugs.");

for (const space of chosen) {
  const counts = [];
  for (const table of tables) {
    const { count, error: countError } = await db.from(table).select("id", { count: "exact", head: true }).eq("establishment_id", space.id);
    if (countError) throw new Error(`${table}: ${countError.message}`);
    counts.push(`${table}: ${count}`);
    if (apply && count) {
      const { error: deleteError } = await db.from(table).delete().eq("establishment_id", space.id);
      if (deleteError) throw new Error(`${table}: ${deleteError.message}`);
    }
  }
  console.log(`${space.slug.padEnd(28)} ${counts.join(" · ")}`);
}
console.log(apply ? "\nDeleted." : "\nDry run: nothing deleted. Add --apply to delete.");
