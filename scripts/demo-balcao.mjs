// Demo data for showing the Balcão (queue, today's bookings, loyalty cards) to a client, on the
// sample spaces. Uses the service role key from .env.local. Nothing is deleted.
//   node --env-file=.env.local scripts/demo-balcao.mjs                  -> list the spaces (dry run)
//   node --env-file=.env.local scripts/demo-balcao.mjs tasca-do-largo   -> fill one or more spaces
// Run it again just before a demo: the queue starts over (the previous demo tickets are closed as
// served), today's bookings and the cards are only added once. Demo rows have tokens starting "demo".
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
const db = createClient(url, key, { auth: { persistSession: false } });

const token = () => `demo${randomBytes(20).toString("base64url")}`;
const codeAlphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const cardCode = () => Array.from(randomBytes(6), (byte) => codeAlphabet[byte % codeAlphabet.length]).join("");
const minutes = (n) => new Date(Date.now() + n * 60_000);
const iso = (date) => date.toISOString();
const check = ({ error }, what) => {
  if (error) throw new Error(`${what}: ${error.message}`);
};

/** Midnight of today in the space's time zone, as a UTC instant. */
function localMidnight(timeZone, plusDays = 0) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
  const guess = new Date(`${day}T00:00:00Z`);
  const shown = new Date(guess.toLocaleString("en-US", { timeZone }));
  return new Date(guess.getTime() - (shown.getTime() - guess.getTime()) + plusDays * 86_400_000);
}

/** Next quarter of an hour from now, plus `offset` minutes. */
function quarter(offset) {
  const now = Date.now() + offset * 60_000;
  return new Date(Math.round(now / 900_000) * 900_000);
}

const people = {
  restaurant: [
    ["Ana Ribeiro", 2, null],
    ["Rui Matos", 4, "Com um carrinho de bebé"],
    ["Família Costa", 6, null],
    ["Inês Carvalho", 2, "Prefere esplanada"],
    ["Pedro Lopes", 3, null],
    ["Marta e Joana", 2, null],
    ["João Ferreira", 5, null],
    ["Sofia Almeida", 2, null],
    ["Tiago Neves", 4, null],
    ["Beatriz Sousa", 2, null],
  ],
  other: [
    ["André Pinto", null, null],
    ["Miguel Santos", null, "Só acertar as laterais"],
    ["Ricardo Gomes", null, null],
    ["Duarte Rocha", null, null],
    ["Hugo Martins", null, null],
    ["Bruno Teixeira", null, null],
    ["Filipe Moreira", null, null],
    ["Nuno Cardoso", null, null],
    ["Gonçalo Pires", null, null],
    ["Vasco Antunes", null, null],
  ],
};

const { data: spaces, error } = await db.from("establishments").select("*").order("created_at");
if (error) throw new Error(error.message);
const slugs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
if (!slugs.length) {
  for (const space of spaces) console.log(space.slug.padEnd(28), space.name, `(${space.kind})`);
  console.log("\nPass one or more slugs to fill them with demo data.");
  process.exit(0);
}

for (const slug of slugs) {
  const space = spaces.find((item) => item.slug === slug);
  if (!space) {
    console.log(`${slug}: not found`);
    continue;
  }
  const tz = space.time_zone;
  const restaurant = space.kind === "restaurant";
  const list = restaurant ? people.restaurant : people.other;
  const [{ data: staff }, { data: services }, { data: settings }, { data: page }, { data: program }] = await Promise.all([
    db.from("establishment_staff").select("*").eq("establishment_id", space.id).eq("active", true).order("sort"),
    db.from("establishment_services").select("*").eq("establishment_id", space.id).eq("active", true).order("sort"),
    db.from("waitlist_settings").select("*").eq("establishment_id", space.id).maybeSingle(),
    db.from("booking_pages").select("*").eq("establishment_id", space.id).maybeSingle(),
    db.from("loyalty_programs").select("*").eq("establishment_id", space.id).maybeSingle(),
  ]);
  const pick = (array, index) => (array?.length ? array[index % array.length] : null);
  console.log(`\n${space.name}`);

  // --- Queue: a few served earlier, one being called, five waiting ------------------------------
  if (settings) {
    check(
      await db
        .from("waitlist_entries")
        .update({ status: "served", finished_at: iso(new Date()), close_reason: "staff" })
        .eq("establishment_id", space.id)
        .like("token", "demo%")
        .in("status", ["waiting", "called"]),
      "close previous demo tickets",
    );
    check(await db.from("waitlist_settings").update({ state: "open" }).eq("establishment_id", space.id), "open queue");
    const plan = [
      { status: "served", joined: -140, called: -118 },
      { status: "served", joined: -105, called: -86 },
      { status: "served", joined: -80, called: -61 },
      { status: "served", joined: -52, called: -33 },
      { status: "called", joined: -27, called: -3 },
      { status: "waiting", joined: -22 },
      { status: "waiting", joined: -16 },
      { status: "waiting", joined: -11 },
      { status: "waiting", joined: -6 },
      { status: "waiting", joined: -2 },
    ];
    for (const [index, step] of plan.entries()) {
      const [name, party, notes] = list[index];
      const service = settings.ask_service ? pick(services, index) : null;
      const person = settings.ask_staff && index % 3 !== 2 ? pick(staff, index) : null;
      const { data: entry, error: joinError } = await db.rpc("waitlist_join", {
        p_establishment: space.id,
        p_token: token(),
        p_name: name,
        p_party: settings.ask_party ? (party ?? 1) : null,
        p_service: service?.id ?? null,
        p_staff: person?.id ?? null,
        p_email: null,
        p_notes: notes,
        p_source: index === 7 ? "staff" : "online",
        p_day_start: iso(localMidnight(tz)),
      });
      if (joinError) throw new Error(`join: ${joinError.message}`);
      const joined = minutes(step.joined);
      check(
        await db
          .from("waitlist_entries")
          .update({
            joined_at: iso(joined),
            sort_key: joined.getTime() / 1000,
            status: step.status,
            called_at: step.called ? iso(minutes(step.called)) : null,
            finished_at: step.status === "served" ? iso(minutes(step.called + settings.grace_minutes)) : null,
            close_reason: step.status === "served" ? "auto" : null,
          })
          .eq("id", entry.id),
        "ticket times",
      );
    }
    console.log("  fila: 4 atendidos, 1 a ser chamado, 5 à espera (fila aberta)");
  }

  // --- Bookings: today around now (two arrived, one late, the rest to come) and tomorrow ----------
  if (page) {
    const { count } = await db
      .from("establishment_bookings")
      .select("id", { count: "exact", head: true })
      .eq("establishment_id", space.id)
      .like("token", "demo%")
      .gte("starts_at", iso(localMidnight(tz)))
      .lt("starts_at", iso(localMidnight(tz, 1)));
    if (count) {
      console.log(`  reservas: já há ${count} de demonstração hoje (nada acrescentado)`);
    } else {
      check(await db.from("booking_pages").update({ active: true }).eq("establishment_id", space.id), "open bookings");
      const today = [
        { at: -75, status: "arrived" },
        { at: -45, status: "arrived" },
        { at: -20, status: "confirmed" },
        { at: 15 },
        { at: 30 },
        { at: 60 },
        { at: 90 },
        { at: 120 },
        { at: 165 },
      ];
      const tomorrow = restaurant ? [13 * 60, 13 * 60 + 30, 20 * 60, 20 * 60 + 30, 21 * 60] : [10 * 60, 11 * 60, 14 * 60 + 30, 16 * 60, 17 * 60 + 30];
      const rows = [];
      const add = (start, index, status = "confirmed") => {
        const [name, party, notes] = list[(index + 3) % list.length];
        const service = restaurant ? null : pick(services, index);
        const length = restaurant ? page.table_minutes : (service?.duration_minutes ?? 30);
        rows.push({
          establishment_id: space.id,
          token: token(),
          service_id: service?.id ?? null,
          staff_id: restaurant ? null : (pick(staff, index)?.id ?? null),
          party_size: restaurant ? (party ?? 2) : null,
          starts_at: iso(start),
          ends_at: iso(new Date(start.getTime() + length * 60_000)),
          name,
          phone: `91${String(2000000 + index * 7919).slice(0, 7)}`,
          notes: index === 4 ? (restaurant ? "Aniversário: trazemos bolo" : "Primeira vez") : notes,
          status,
          source: index % 4 === 1 ? "staff" : "online",
        });
      };
      today.forEach((item, index) => add(quarter(item.at), index, item.status));
      tomorrow.forEach((minute, index) => add(new Date(localMidnight(tz, 1).getTime() + minute * 60_000), index + 20));
      check(await db.from("establishment_bookings").insert(rows), "bookings");
      console.log(`  reservas: ${today.length} hoje (2 chegaram, 1 atrasada) e ${tomorrow.length} amanhã`);
    }
  }

  // --- Loyalty cards: regulars with stamps, one with a reward to hand over -------------------------
  if (program) {
    check(await db.from("loyalty_programs").update({ active: true }).eq("establishment_id", space.id), "program on");
    const cards = [
      [list[0][0], 3, -2],
      [list[1][0], 7, -26],
      [list[3][0], program.stamps_required - 1, -50],
      [list[5][0], 1, -75],
      [list[6][0], program.stamps_required, -140],
      [list[8][0], 5, -300],
    ];
    let added = 0;
    for (const [index, [name, stamps, lastMinutes]] of cards.entries()) {
      const { data: existing } = await db.from("loyalty_cards").select("id").eq("establishment_id", space.id).eq("name", name).like("token", "demo%").maybeSingle();
      if (existing) continue;
      const created = minutes(-60 * 24 * (20 + index * 4));
      const { data: card, error: cardError } = await db
        .from("loyalty_cards")
        .insert({
          establishment_id: space.id,
          token: token(),
          code: cardCode(),
          name,
          phone: index % 2 ? `93${String(4100000 + index * 3571).slice(0, 7)}` : null,
          consent_at: iso(created),
          created_at: iso(created),
          stamps: Math.min(stamps, program.stamps_required - 1),
        })
        .select()
        .single();
      if (cardError) throw new Error(`card: ${cardError.message}`);
      // A completed card: the last stamp goes through the real rule, which creates the reward.
      if (stamps >= program.stamps_required) check(await db.rpc("loyalty_stamp", { p_card: card.id, p_amount: 1, p_source: "staff_panel", p_enforce_cooldown: false }), "stamp");
      const events = [{ card_id: card.id, establishment_id: space.id, kind: "joined", amount: 1, source: null, created_at: iso(created) }];
      for (let n = 0; n < Math.min(stamps, program.stamps_required - 1); n++) {
        events.push({ card_id: card.id, establishment_id: space.id, kind: "stamp", amount: 1, source: "staff_panel", created_at: iso(minutes(lastMinutes - n * 60 * 24 * 3)) });
      }
      check(await db.from("loyalty_events").insert(events), "events");
      check(await db.from("loyalty_cards").update({ last_stamp_at: iso(minutes(lastMinutes)) }).eq("id", card.id), "last stamp");
      added++;
    }
    console.log(`  cartão: ${added} cartões novos (um com recompensa por entregar)`);
  }
}
