// Example businesses for demos, one per kind of booking: besides the restaurant (Tasca do Largo)
// and the barbershop (Navalha d'Ouro) already there, a clinic and a sports venue. Each gets a demo
// client account (no password, no email sent; addresses on the unroutable .test domain), its space
// with hours, services, people or places, and the queue, loyalty card and bookings switched on.
// Uses the service role key from .env.local. Nothing is deleted; running it again changes nothing.
//   node --env-file=.env.local scripts/demo-businesses.mjs
// Then fill them all with demo data:
//   node --env-file=.env.local scripts/demo-balcao.mjs tasca-do-largo navalha-douro clinica-sorriso arena-desportiva
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
const db = createClient(url, key, { auth: { persistSession: false } });
const check = ({ error }, what) => {
  if (error) throw new Error(`${what}: ${error.message}`);
};

const businesses = [
  {
    email: "clinica-sorriso@exemplo.test",
    owner: "Dra. Helena Marques",
    name: "Clínica Sorriso",
    slug: "clinica-sorriso",
    kind: "clinic",
    phone: "213 555 010",
    address: "Avenida da Igreja 40, 1700-237 Lisboa",
    hours: { weekdays: [1, 2, 3, 4, 5], intervals: [["09:00", "13:00"], ["14:00", "19:00"]] },
    places: ["Dra. Helena Marques", "Dr. Pedro Lima", "Ana Costa (higienista)"],
    services: [
      { name: "Primeira consulta", minutes: 45, price: 4000, places: ["Dra. Helena Marques", "Dr. Pedro Lima"] },
      { name: "Consulta", minutes: 30, price: 3000, places: ["Dra. Helena Marques", "Dr. Pedro Lima"] },
      { name: "Limpeza dentária", minutes: 45, price: 5000, places: ["Ana Costa (higienista)"] },
      { name: "Branqueamento", minutes: 60, price: 15000, places: ["Dra. Helena Marques"] },
    ],
    waitlist: { ask_party: false, ask_service: true, ask_staff: false, avg_minutes: 20 },
    reward: "Uma limpeza dentária com 50% de desconto",
  },
  {
    email: "arena-desportiva@exemplo.test",
    owner: "Carlos Pereira",
    name: "Arena Desportiva",
    slug: "arena-desportiva",
    kind: "sports",
    phone: "217 555 020",
    address: "Rua do Desporto 5, 1500-201 Lisboa",
    hours: { weekdays: [1, 2, 3, 4, 5, 6, 0], intervals: [["09:00", "23:00"]] },
    places: ["Campo de futebol 1", "Campo de futebol 2", "Campo de padel", "Campo de ténis"],
    services: [
      { name: "Futebol 5 (1 hora)", minutes: 60, price: 4000, places: ["Campo de futebol 1", "Campo de futebol 2"] },
      { name: "Padel (1h30)", minutes: 90, price: 2400, places: ["Campo de padel"] },
      { name: "Ténis (1 hora)", minutes: 60, price: 1500, places: ["Campo de ténis"] },
    ],
    waitlist: { ask_party: false, ask_service: false, ask_staff: false, avg_minutes: 15 },
    reward: "Uma hora de campo oferecida",
  },
];

for (const business of businesses) {
  // Account: the existing profile for this email, or a new account (no password, nothing sent).
  let { data: profile } = await db.from("profiles").select("id").eq("email", business.email).maybeSingle();
  if (!profile) {
    const { data, error } = await db.auth.admin.createUser({ email: business.email, email_confirm: true, user_metadata: { full_name: business.owner, business_name: business.name } });
    if (error) throw new Error(`account ${business.email}: ${error.message}`);
    profile = { id: data.user.id };
    await db.from("profiles").update({ full_name: business.owner, business_name: business.name }).eq("id", profile.id);
  }

  let { data: space } = await db.from("establishments").select("*").eq("slug", business.slug).maybeSingle();
  if (space) {
    console.log(`${business.name}: já existe (${business.slug})`);
    continue;
  }
  const created = await db
    .from("establishments")
    .insert({ owner_id: profile.id, name: business.name, slug: business.slug, kind: business.kind, phone: business.phone, address: business.address })
    .select()
    .single();
  check(created, "space");
  space = created.data;

  const hours = business.hours.weekdays.flatMap((weekday) => business.hours.intervals.map(([opens, closes]) => ({ establishment_id: space.id, weekday, opens, closes })));
  check(await db.from("establishment_hours").insert(hours), "hours");

  const places = new Map();
  for (const [index, name] of business.places.entries()) {
    const { data, error } = await db.from("establishment_staff").insert({ establishment_id: space.id, name, active: true, sort: index }).select("id").single();
    if (error) throw new Error(`place: ${error.message}`);
    places.set(name, data.id);
  }
  for (const [index, service] of business.services.entries()) {
    const { data, error } = await db
      .from("establishment_services")
      .insert({ establishment_id: space.id, name: service.name, duration_minutes: service.minutes, price_cents: service.price, booking_kind: "one", sort: index })
      .select("id")
      .single();
    if (error) throw new Error(`service: ${error.message}`);
    const ids = service.places.map((name) => places.get(name)).filter(Boolean);
    if (ids.length) check(await db.from("establishment_service_staff").insert(ids.map((staffId) => ({ service_id: data.id, staff_id: staffId }))), "who does it");
  }

  check(
    await db.from("client_products").upsert(
      ["waitlist", "loyalty", "bookings"].map((product_id) => ({ user_id: profile.id, product_id, status: "active", spaces: 1 })),
      { onConflict: "user_id,product_id" },
    ),
    "products",
  );
  check(await db.from("booking_pages").insert({ establishment_id: space.id, active: true, notify_owner: false, slot_interval_minutes: 15 }), "booking page");
  check(await db.from("waitlist_settings").insert({ establishment_id: space.id, state: "open", ...business.waitlist }), "queue");
  check(await db.from("loyalty_programs").insert({ establishment_id: space.id, reward: business.reward, stamps_required: 8 }), "loyalty card");
  console.log(`${business.name}: criado (${business.slug}), com ${business.services.length} serviços e ${business.places.length} pessoas/espaços`);
}

// The barbershop example is a barbershop (it was created as "salon").
check(await db.from("establishments").update({ kind: "barbershop" }).eq("slug", "navalha-douro").eq("kind", "salon"), "barbershop kind");
console.log("\nDepois: node --env-file=.env.local scripts/demo-balcao.mjs tasca-do-largo navalha-douro clinica-sorriso arena-desportiva");
