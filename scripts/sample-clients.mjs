// Dev helper: two complete sample clients for testing the waitlist, loyalty card and bookings.
//   node --env-file=.env.local scripts/sample-clients.mjs
// Creates (skips any email that already exists):
//   - Marta Silva, restaurant "Tasca do Largo" (/fila, /cartao, /reservar/tasca-do-largo)
//   - Rui Costa, barbershop "Barbearia Navalha d'Ouro" (/fila, /cartao, /reservar/navalha-douro)
// Each with products active, opening hours, queue (open, people waiting), loyalty cards with stamps
// and bookings for today and tomorrow. Prints each login password and the loyalty staff code.
// To start over: delete the clients first (scripts/dev-users.mjs --delete-email=...).
import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
const db = createClient(url, key, { auth: { persistSession: false } });

const token = () => randomBytes(24).toString("base64url");
const codeAlphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const cardCode = () => Array.from(randomBytes(6), (byte) => codeAlphabet[byte % codeAlphabet.length]).join("");
const staffCode = (code) => {
  const salt = randomBytes(16).toString("hex");
  return { staff_code_hash: createHash("sha256").update(`${salt}:${code}`).digest("hex"), staff_code_salt: salt, staff_code_set_at: new Date().toISOString() };
};

/** ISO instant for a Lisbon wall-clock time, `days` from today. */
function lisbon(days, time) {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon" }).format(new Date(Date.now() + days * 86_400_000));
  const offset = new Intl.DateTimeFormat("en", { timeZone: "Europe/Lisbon", timeZoneName: "longOffset" })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((part) => part.type === "timeZoneName").value.replace("GMT", "") || "+00:00";
  return new Date(`${date}T${time}:00${offset}`).toISOString();
}
const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();
const plus = (iso, minutes) => new Date(Date.parse(iso) + minutes * 60_000).toISOString();

async function insert(table, rows) {
  const { data, error } = await db.from(table).insert(rows).select();
  if (error) throw new Error(`${table}: ${error.message}`);
  return data;
}

const clients = [
  {
    email: "marta.silva@example.com",
    full_name: "Marta Silva",
    business_name: "Tasca do Largo",
    phone: "912 345 678",
    nif: "509876543",
    staffCode: "2580",
    establishment: {
      slug: "tasca-do-largo",
      name: "Tasca do Largo",
      kind: "restaurant",
      accent_color: "#9a3b25",
      phone: "213 456 789",
      address: "Largo do Carmo 12, 1200-092 Lisboa",
    },
    hours: { weekdays: [0, 2, 3, 4, 5, 6], intervals: [["12:00", "15:30"], ["19:00", "23:00"]] },
    services: [],
    staff: [],
    waitlist: { state: "open", avg_minutes: 20, ask_party: true, max_party: 10, grace_minutes: 10, message: "Avisamos no telemóvel quando a mesa estiver pronta. Pode esperar à vontade no largo." },
    queue: [
      { name: "Joana", party_size: 4, status: "called", joined: 34, called: 2, email: null },
      { name: "Pedro", party_size: 2, status: "waiting", joined: 25, notes: "Esplanada, se possível" },
      { name: "Família Moreira", party_size: 6, status: "waiting", joined: 18, notes: "Com cadeira de bebé" },
      { name: "Carla", party_size: 2, status: "waiting", joined: 9 },
      { name: "Hugo", party_size: 3, status: "waiting", joined: 3, source: "staff" },
    ],
    loyalty: { stamps_required: 10, reward: "Sobremesa caseira oferecida", cooldown_minutes: 120, reward_valid_days: 60, terms: "Um carimbo por refeição. Não acumula com outras promoções." },
    cards: [
      { name: "Inês Rocha", email: "ines.rocha@example.com", stamps: 9 },
      { name: "Miguel Santos", phone: "934 111 222", stamps: 6 },
      { name: "Sofia Almeida", email: "sofia.almeida@example.com", stamps: 3 },
      { name: "Tomás Pereira", stamps: 1 },
    ],
    bookingPage: { active: true, mode: "table", slot_interval_minutes: 30, min_notice_minutes: 60, max_days_ahead: 60, table_minutes: 90, seats_per_slot: 24, max_party: 8, cancel_until_hours: 2, policy: "Guardamos a mesa 15 minutos. Grupos de mais de 8 pessoas: ligue-nos.", confirmation_note: "Se se atrasar, ligue para o 213 456 789." },
    bookings: [
      { name: "Ricardo Lopes", party_size: 2, day: 0, time: "20:00", phone: "961 222 333", notes: "Aniversário" },
      { name: "Ana Marques", party_size: 4, day: 0, time: "20:30", email: "ana.marques@example.com" },
      { name: "Grupo Teixeira", party_size: 8, day: 1, time: "13:00", phone: "917 444 555" },
      { name: "Luís Fonseca", party_size: 2, day: 1, time: "21:00", email: "luis.fonseca@example.com", status: "cancelled" },
      { name: "Beatriz Cunha", party_size: 3, day: 2, time: "19:30", phone: "926 777 888" },
    ],
  },
  {
    email: "rui.costa@example.com",
    full_name: "Rui Costa",
    business_name: "Barbearia Navalha d'Ouro",
    phone: "963 210 987",
    nif: "287654321",
    staffCode: "1357",
    establishment: {
      slug: "navalha-douro",
      name: "Barbearia Navalha d'Ouro",
      kind: "salon",
      accent_color: "#1f4e5f",
      phone: "222 333 444",
      address: "Rua de Santa Catarina 210, 4000-447 Porto",
    },
    hours: { weekdays: [2, 3, 4, 5, 6], intervals: [["09:00", "13:00"], ["14:00", "19:30"]] },
    services: [
      { name: "Corte", duration_minutes: 30, price_cents: 1500 },
      { name: "Barba", duration_minutes: 20, price_cents: 1000 },
      { name: "Corte + barba", duration_minutes: 45, price_cents: 2200 },
      { name: "Corte criança", duration_minutes: 25, price_cents: 1200 },
    ],
    staff: ["Rui", "Tiago", "André"],
    waitlist: { state: "open", avg_minutes: 30, ask_party: false, ask_service: true, ask_staff: true, max_party: 1, grace_minutes: 5, message: "Pode ir dar uma volta: avisamos 5 minutos antes da sua vez." },
    queue: [
      { name: "Duarte", status: "called", joined: 40, called: 1, service: 0, staff: 1 },
      { name: "Gonçalo", status: "waiting", joined: 28, service: 2, staff: 0 },
      { name: "Filipe", status: "waiting", joined: 15, service: 0, staff: null },
      { name: "Nuno", status: "waiting", joined: 6, service: 1, staff: 2 },
    ],
    loyalty: { stamps_required: 8, reward: "Um corte grátis", cooldown_minutes: 240, reward_valid_days: 90, terms: "Um carimbo por serviço pago." },
    cards: [
      { name: "Bruno Matos", phone: "912 888 777", stamps: 7 },
      { name: "Diogo Ramos", email: "diogo.ramos@example.com", stamps: 4 },
      { name: "Vasco Nunes", stamps: 2 },
    ],
    bookingPage: { active: true, mode: "service", slot_interval_minutes: 15, min_notice_minutes: 30, max_days_ahead: 30, table_minutes: 90, seats_per_slot: 1, max_party: 1, cancel_until_hours: 3, policy: "Tolerância de 10 minutos. Depois disso a marcação pode passar para o fim da fila.", confirmation_note: "Traga só a vontade de ficar bem." },
    bookings: [
      { name: "Henrique Silva", day: 0, time: "17:00", service: 0, staff: 0, phone: "915 000 111" },
      { name: "Paulo Reis", day: 0, time: "18:00", service: 2, staff: 1, email: "paulo.reis@example.com" },
      { name: "Martim Lopes", day: 1, time: "10:00", service: 3, staff: 2, phone: "936 222 000", notes: "Primeira vez" },
      { name: "João Vieira", day: 1, time: "15:30", service: 1, staff: 0 },
      { name: "Ricardo Faria", day: 2, time: "11:00", service: 0, staff: 1, email: "ricardo.faria@example.com" },
    ],
  },
];

const products = ["waitlist", "loyalty", "bookings"];

for (const sample of clients) {
  const { data: existing } = await db.from("profiles").select("id").eq("email", sample.email).maybeSingle();
  if (existing) {
    console.log("skip (already exists)", sample.email);
    continue;
  }
  const password = randomBytes(9).toString("base64url");
  const { data: created, error } = await db.auth.admin.createUser({
    email: sample.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: sample.full_name, business_name: sample.business_name, phone: sample.phone },
  });
  if (error) throw new Error(`createUser ${sample.email}: ${error.message}`);
  const ownerId = created.user.id;
  await db.from("profiles").update({ nif: sample.nif }).eq("id", ownerId);
  await insert("client_products", products.map((product_id) => ({ user_id: ownerId, product_id, status: "active" })));

  const [shop] = await insert("establishments", [{ owner_id: ownerId, ...sample.establishment }]);
  const id = shop.id;
  await insert("establishment_hours", sample.hours.weekdays.flatMap((weekday) => sample.hours.intervals.map(([opens, closes]) => ({ establishment_id: id, weekday, opens, closes }))));
  const services = sample.services.length ? await insert("establishment_services", sample.services.map((service, sort) => ({ establishment_id: id, sort, ...service }))) : [];
  const staff = sample.staff.length ? await insert("establishment_staff", sample.staff.map((name, sort) => ({ establishment_id: id, name, sort }))) : [];
  services.sort((a, b) => a.sort - b.sort);
  staff.sort((a, b) => a.sort - b.sort);

  // Waitlist: open, with people waiting and one already called.
  await insert("waitlist_settings", [{ establishment_id: id, max_waiting: 60, ...sample.waitlist }]);
  await insert(
    "waitlist_entries",
    sample.queue.map((entry, index) => ({
      establishment_id: id,
      token: token(),
      number: index + 1,
      name: entry.name,
      party_size: entry.party_size ?? null,
      service_id: entry.service !== undefined && entry.service !== null ? services[entry.service].id : null,
      staff_id: entry.staff !== undefined && entry.staff !== null ? staff[entry.staff].id : null,
      email: entry.email ?? null,
      notes: entry.notes ?? null,
      source: entry.source ?? "online",
      status: entry.status,
      joined_at: minutesAgo(entry.joined),
      sort_key: Date.parse(minutesAgo(entry.joined)) / 1000,
      called_at: entry.called !== undefined ? minutesAgo(entry.called) : null,
    })),
  );

  // Loyalty card: program with a staff code, cards at different points.
  await insert("loyalty_programs", [{ establishment_id: id, active: true, welcome_stamp: true, ...sample.loyalty, ...staffCode(sample.staffCode) }]);
  const cards = await insert(
    "loyalty_cards",
    sample.cards.map((card, index) => ({
      establishment_id: id,
      token: token(),
      code: cardCode(),
      name: card.name,
      email: card.email ?? null,
      phone: card.phone ?? null,
      consent_at: minutesAgo(60 * 24 * (30 - index * 5)),
      stamps: card.stamps,
      last_stamp_at: minutesAgo(60 * 24 * (index + 2)),
      created_at: minutesAgo(60 * 24 * (30 - index * 5)),
    })),
  );
  await insert(
    "loyalty_events",
    cards.flatMap((card) => [
      { card_id: card.id, establishment_id: id, kind: "joined", amount: 0, source: "welcome", created_at: card.created_at },
      { card_id: card.id, establishment_id: id, kind: "stamp", amount: card.stamps, source: "staff_panel", created_at: card.last_stamp_at },
    ]),
  );

  // Bookings: page on, a few for today, tomorrow and the day after.
  await insert("booking_pages", [{ establishment_id: id, notify_owner: false, ...sample.bookingPage }]);
  await insert(
    "establishment_bookings",
    sample.bookings.map((booking) => {
      const service = booking.service !== undefined ? services[booking.service] : null;
      const starts = lisbon(booking.day, booking.time);
      const minutes = service ? service.duration_minutes : sample.bookingPage.table_minutes;
      return {
        establishment_id: id,
        token: token(),
        service_id: service?.id ?? null,
        staff_id: booking.staff !== undefined ? staff[booking.staff].id : null,
        party_size: booking.party_size ?? null,
        starts_at: starts,
        ends_at: plus(starts, minutes),
        name: booking.name,
        email: booking.email ?? null,
        phone: booking.phone ?? null,
        notes: booking.notes ?? null,
        status: booking.status ?? "confirmed",
        cancelled_at: booking.status === "cancelled" ? new Date().toISOString() : null,
        // Sample emails are fake: mark the reminder as sent so the routine never emails them.
        reminder_sent_at: new Date().toISOString(),
      };
    }),
  );

  console.log(`created ${sample.email}  password: ${password}  staff code (cartão): ${sample.staffCode}  pages: /fila|/cartao|/reservar/${sample.establishment.slug}`);
}
