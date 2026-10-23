---
name: supabase-migrations
description: "How DB migrations reach production (Management API + token in .env.local) and that each apply needs the owner's explicit OK"
metadata:
  node_type: memory
  type: reference
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-15T08:41:47.146Z
---

Migrations in `supabase/migrations/` are applied to production (project `odvtklbxrqdugrtzjzye`) through the Supabase Management API: `POST https://api.supabase.com/v1/projects/odvtklbxrqdugrtzjzye/database/query` with `SUPABASE_ACCESS_TOKEN` from `.env.local` (read in a script, never printed), then a row `(version, name, statements)` in `supabase_migrations.schema_migrations`.

**Why:** the permission classifier blocks this unless the owner explicitly authorizes it (2026-10-15 the owner said «Autorizo a aplicares com cuidado, hipótese de dar rollback»).

**How to apply:** ask the owner first; read-only pre-check; write a rollback SQL first; wrap migration + schema_migrations insert in one `begin … commit`; verify counts after. See [[paid-api-spend]] for the separate no-spend rule.
