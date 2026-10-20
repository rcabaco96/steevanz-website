import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { localize } from "../src/lib/i18n.ts";

// Owner, 2026-10-20: bookings, info requests and orders store the visitor's real language (six site
// languages), no longer folded into pt/en.
const languages = ["pt", "en", "es", "fr", "de", "it"];

describe("stored language of bookings, leads and orders", () => {
  it("widens the three check constraints to the six languages, with a rollback that maps back to en first", () => {
    const migration = readFileSync("supabase/migrations/20261020120000_site_languages.sql", "utf8");
    const rollback = readFileSync("supabase/rollbacks/20261020120000_site_languages.sql", "utf8");
    for (const sql of [migration, rollback]) {
      assert.match(sql, /^begin;$/m);
      assert.match(sql, /^commit;$/m);
    }
    const six = `(${languages.map((l) => `'${l}'`).join(", ")})`;
    for (const table of ["bookings", "leads", "orders"]) {
      assert.ok(migration.includes(`alter table public.${table} add constraint ${table}_locale_check check (locale in ${six});`), table);
      const update = rollback.indexOf(`update public.${table} set locale = 'en' where locale in ('es', 'fr', 'de', 'it');`);
      const restore = rollback.indexOf(`alter table public.${table} add constraint ${table}_locale_check check (locale in ('pt', 'en'));`);
      assert.ok(update >= 0 && restore > update, `${table} rollback`);
    }
    assert.doesNotMatch(migration, /\b(update|delete|drop column|drop table)\b/i);
  });

  it("stores the real language instead of baseLocaleOf, and the owner emails still show it", () => {
    for (const file of ["src/lib/booking/actions.ts", "src/lib/cart/actions.ts"]) {
      const source = readFileSync(file, "utf8");
      assert.doesNotMatch(source, /baseLocaleOf/, file);
      assert.match(source, /locale: data\.locale,/, file);
      assert.match(source, /label: "Idioma", value: data\.locale\.toUpperCase\(\)/, file);
    }
  });

  it("falls back to English for a customer text without its own translation", () => {
    const text = { pt: "Olá", en: "Hello" };
    assert.equal(localize(text, "pt"), "Olá");
    for (const locale of ["es", "fr", "de", "it"]) assert.equal(localize(text, locale), "Hello", locale);
    assert.equal(localize({ ...text, de: "Hallo" }, "de"), "Hallo");
  });
});
