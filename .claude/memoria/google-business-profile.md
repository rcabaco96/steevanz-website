---
name: google-business-profile
description: "Steevanz's own Google Business Profile and Google Cloud setup — owner account, support case ID, verification/duplicate status, OAuth project for «Ligar Google»"
metadata:
  node_type: memory
  type: reference
  originSessionId: 177b9a61-fd1e-4c6c-a678-6469c7833203
  modified: 2026-10-11T22:48:50.147Z
---

- Steevanz's Google Business Profile: «Proprietário principal» is rogeriocabaco3@gmail.com
  (organisation «Steevanz» om-1736192456604764632 in Business Manager). Shown as «Cópia»
  (duplicate) and pending verification; the code went to the old phone 928 069 072, which no longer
  exists. New phone: 961 292 679.
- 2026-10-11: owner also submitted the form to change the profile phone to 961 292 679; apex
  steevanz.com DNS A 76.76.21.21 added at Amen (works, redirects to www).
- **GBP support case ID: 1-8398000041203** (opened 2026-10-11 by email via
  support.google.com/business/gethelp): change phone, verify by new number or video, resolve the
  duplicate status.
- Google Cloud project for «Ligar Google»: `steevanz-app` (number 116519460560), owner
  rogeriocabaco3@gmail.com; OAuth web client created; env vars GOOGLE_OAUTH_CLIENT_ID /
  GOOGLE_OAUTH_CLIENT_SECRET / GOOGLE_TOKEN_KEY set on Vercel (prod+preview) and .env.local.
  Account Management + Business Information APIs enabled; «Google My Business API» (v4, reviews and
  replies) needs the Basic API Access approval (form support.google.com/business/contact/api_default,
  not yet submitted as of 2026-10-11; needs a verified profile 60+ days).
- In the panel, «Ligar Google» shows «Em breve» via `googleConnectComingSoon` (src/lib/google/coming-soon.ts)
  until Google approves. Since 2026-10-11 the panel Google page shows «Em breve» to everyone (admins too),
  with a notice «em processo de verificação com a Google… em princípio na próxima semana»; only admins
  can test, by opening /api/google/connect?slug=<slug> directly. gcloud CLI installed, signed in as rogeriocabaco3@gmail.com.

Related: [[deploy-login-page-only]].
