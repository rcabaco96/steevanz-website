// Dev helper for Supabase auth users. Uses the service role key from .env.local.
//   node --env-file=.env.local scripts/dev-users.mjs             -> list users (dry run)
//   node --env-file=.env.local scripts/dev-users.mjs --delete    -> delete every non-admin user
//   node --env-file=.env.local scripts/dev-users.mjs --create    -> create confirmed test clients
import { randomBytes } from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
if (!admins.length) throw new Error("ADMIN_EMAILS is empty; refusing to run");

const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const api = async (path, init) => {
  const res = await fetch(`${url}/auth/v1/admin${path}`, { headers, ...init });
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
};

const testClients = [
  { email: "cliente1@example.com", full_name: "Cliente Teste 1", business_name: "Café Teste" },
  { email: "cliente2@example.com", full_name: "Cliente Teste 2", business_name: "Barbearia Teste" },
];

const { users } = await api("/users?per_page=1000");
const isAdmin = (u) => admins.includes((u.email ?? "").toLowerCase());
for (const u of users) console.log(isAdmin(u) ? "ADMIN " : "client", u.email, u.email_confirmed_at ? "confirmed" : "unconfirmed");

if (process.argv.includes("--delete")) {
  for (const u of users.filter((u) => !isAdmin(u))) {
    await api(`/users/${u.id}`, { method: "DELETE" });
    console.log("deleted", u.email);
  }
}

if (process.argv.includes("--create")) {
  for (const { email, ...metadata } of testClients) {
    const password = randomBytes(9).toString("base64url");
    await api("/users", { method: "POST", body: JSON.stringify({ email, password, email_confirm: true, user_metadata: metadata }) });
    console.log("created", email, "password:", password);
  }
}
