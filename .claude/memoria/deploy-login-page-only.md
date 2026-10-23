---
name: deploy-login-page-only
description: Since 2026-10-10 the new site is live on main (www.steevanz.com); old site kept on branch site-antigo; login-page preview still exists
metadata:
  node_type: memory
  type: project
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-10T14:10:43.783Z
---

2026-10-10: on the owner's request, `login-page` was fast-forwarded into `main` and deployed to
production (www.steevanz.com). The previous production site is kept on branch `site-antigo`
(commit 0fe70b4). Production env mirrors the preview's, plus `NEXT_PUBLIC_SITE_URL=https://www.steevanz.com`
(the apex steevanz.com has no A record at the DNS host Amen, so only www works until the owner adds it;
Vercel already redirects apex → www). Supabase Auth site_url = https://www.steevanz.com. The local
reader's READER_SITE_URL = https://www.steevanz.com.

Earlier (2026-10-09) the rule was "only login-page gets deploys"; its preview
https://steevanz-git-login-page-rogeriocabaco3s-projects.vercel.app still exists (branch CRON_SECRET
override there). Redeploy via API `POST /v13/deployments` with `deploymentId` (add `target:
"production"` for prod), VERCEL_TOKEN from .env.local.

**How to apply:** owner decision 2026-10-10: work directly on `main` (local checkout is on main);
every push to main deploys production at www.steevanz.com. login-page is no longer used.
