# Auth emails: Supabase settings after merging

Since branch `wt/auth-emails`, **Supabase Auth sends no email in any of the site's flows**. The site
asks Supabase only for a one-time token (`auth.admin.generateLink` with the service role, which never
sends anything), builds its own link and sends the email through Resend from
`Steevanz <noreply@steevanz.com>`, in pt-PT, with the same layout as the booking emails.

The link goes straight to the site, e.g.
`https://steevanz.com/conta/auth/confirm?token_hash=…&type=magiclink&next=/painel/x`
(`/admin/auth/confirm` for `ADMIN_EMAILS` addresses). That route calls
`supabase.auth.verifyOtp({ token_hash, type })` on the server and sets the session cookies. There is
no PKCE code verifier, so the link works on a different device or browser from the one that asked
for it.

Project: `odvtklbxrqdugrtzjzye` (one project for every deployment). Values below were read on
2026-10-09 with a read-only `GET /v1/projects/odvtklbxrqdugrtzjzye/config/auth`.

## What to change, in order

### 1. Apply the migration

`supabase/migrations/20261009235500_auth_email_cooldowns.sql`: table `auth_email_cooldowns` and the
functions `auth_email_claim` / `auth_email_release` (service role only). They enforce one auth email
per address per 60 s (`authEmailCooldownSeconds` in `src/lib/auth/email-links.ts`), for unknown
emails too, so the answer never reveals whether an account exists. Without the migration everything
still works, but with no cooldown (each request logs `[auth] email cooldown unavailable`).

### 2. Link lifetime: `mailer_otp_exp` 86400 → 3600

The emails say «Este link é válido durante 1 hora e só pode ser usado uma vez.» The text comes from
one constant, `authLinkValidity` in `src/lib/auth/link-validity.ts` (also used on `/conta/link-invalido`
and in the admin «Convite enviado» line). Supabase decides the real lifetime with `mailer_otp_exp`, so
the two must match:

```json
{ "mailer_otp_exp": 3600 }
```

To use another lifetime, change both (e.g. 7200 and `"2 horas"`). Note that panel invites from
`/admin/reviews` («Enviar convite») now also last 1 hour (the old email said 24 horas); the owner
can resend the invite, or the client asks for a new link on `/conta/entrar`.

### 3. Turn on the Send Email Hook (recommended): Supabase can then never send an email

Our code never asks Supabase to send. But the Auth API is public (the anon key is in the browser),
so anyone can still call `/auth/v1/otp`, `/signup`, `/recover` or `/resend` directly, and the
dashboard buttons («Send magic link», «Invite user», «Send password recovery») also send. Today those
would go out through the custom SMTP (Resend) with Supabase's English templates and its PKCE links.

With the hook on, Supabase hands every such email to `POST /api/auth/email-hook`, which checks the
signature, logs `[auth] Supabase tried to send an auth email; not sent` and sends nothing.

1. Dashboard → Authentication → Hooks → «Send Email hook» → HTTPS, URL
   `https://steevanz.com/api/auth/email-hook`, generate the secret (format `v1,whsec_…`).
   Management API equivalent:
   ```json
   {
     "hook_send_email_enabled": true,
     "hook_send_email_uri": "https://steevanz.com/api/auth/email-hook",
     "hook_send_email_secrets": "v1,whsec_…"
   }
   ```
2. Put the same secret in Vercel as `SEND_EMAIL_HOOK_SECRET` (Production, and Preview if you want).
3. Only one URL is possible for the whole project. Until this code is on production (`main`), the
   URL answers 404: Supabase then fails those direct calls with an error, which still means no email
   is sent. Nothing in the site depends on the hook.
4. The dashboard buttons above stop sending too. Use the site instead: «Enviar convite» in
   `/admin/reviews`, or «Receber link de entrada por email» on `/conta/entrar`.

### 4. SMTP: keep it until the hook is on, then it is unused

Once the hook is on, the custom SMTP (`smtp.resend.com`, `noreply@steevanz.com`, `smtp_max_frequency`
60) is never used: the hook takes over all sending. You can leave it as a harmless stopgap, or remove
it. If you **don't** turn the hook on, keep the SMTP, so that direct API calls at least come from
`noreply@steevanz.com` and not from Supabase's default sender.

`smtp_max_frequency` and `rate_limit_email_sent` only apply to emails Supabase sends, so they no
longer matter for our flows. Our cooldown is step 1.

### 5. URLs: nothing to add

- `/conta/auth/confirm` and `/admin/auth/confirm` **do not** need to be in `uri_allow_list`: our
  links never go through Supabase's `/auth/v1/verify` and we never pass `redirect_to`.
- Keep the existing `/conta/auth/callback**` and `/admin/auth/callback` entries for now: PKCE links
  Supabase already sent still land there, and the callback still accepts `?code=` (same browser
  only, as before) and `?token_hash=`. They can be removed once those links have expired (after
  `mailer_otp_exp`).
- `site_url` is still `https://steevanz-git-nfc-rogeriocabaco3s-projects.vercel.app`, and the
  allow list still has the `steevanz-git-nfc-…` entries. Our flows don't use them, but Supabase does
  for anything it still sends (without the hook) and as the default redirect. Suggested:
  `"site_url": "https://steevanz.com"` and drop the `nfc` entries.
- The email links use the address the request came from when it is one of ours (`NEXT_PUBLIC_SITE_URL`
  and its `www.`, the Vercel deployment and branch URLs, localhost); anything else falls back to
  `NEXT_PUBLIC_SITE_URL`, so a forged `Origin`/`Host` cannot point a token at another site.

### 6. Vercel environment

- `SUPABASE_SERVICE_ROLE_KEY` is now needed for **every** auth email (before, the sign-in link used
  the anon key). Production and Preview must have it. Without it the forms answer «O acesso a contas
  ainda não está configurado.»
- `RESEND_API_KEY`: already set. `steevanz.com` is verified in Resend, so `noreply@` and `mail@`
  need nothing more.
- `SEND_EMAIL_HOOK_SECRET`: new, see step 3.

## Does Supabase ever send an email with this code?

| Flow | Where | What happens now |
| --- | --- | --- |
| Sign-in link («Receber link de entrada por email») | `requestSignInLink`, `src/lib/auth/actions.ts` | Account looked up in `profiles`; unknown → nothing sent, same answer (generateLink `magiclink` would otherwise **create** the user, so `shouldCreateUser: false` is kept by the lookup). Known → `generateLink` + Resend, sent after the response. |
| Sign-up | `signUp` | `generateLink({ type: "signup", password, data })` creates the unconfirmed user, our «Confirme o seu email» email. Email that already has an account → a sign-in link email («Já tem conta na Steevanz»); the page is the same either way. |
| Forgotten password | `requestPasswordReset` | `generateLink({ type: "recovery" })` (unknown email → `user_not_found` → nothing sent, same answer), link opens `/conta/nova-password` signed in. |
| Panel invite («Enviar convite») | `sendPanelInvite`, `src/lib/admin/client-access.ts` | `generateLink` `magiclink` + Resend, from `noreply@`. |
| Client account created by the admin | `ensureClientAccount` | `auth.admin.createUser({ email_confirm: true })`: never sends. |
| Password change | `updatePassword` | `updateUser({ password })`. Sends nothing: `security_update_password_require_reauthentication` is off and `mailer_notifications_password_changed_enabled` is false. Keep both off (or the hook on). |
| Email change, invites, reauthentication, OTP codes | — | Not used anywhere in the site. |

So in normal use Supabase sends nothing. The only remaining paths are direct calls to the public
Auth API and the dashboard buttons, which step 3 closes.

Every other email in the site already goes through Resend from `Steevanz <mail@steevanz.com>`
(booking, orders, leads, loyalty, waitlist, review alerts, reader heartbeat), all via
`sendOwnerEmail` (`src/lib/booking/email.ts`), which now uses the shared sender
`src/lib/email/send.ts`. That sender only knows two addresses (`mail@` and `noreply@steevanz.com`).

## Why links failed on another device

`signInWithOtp` / `signUp` / `resetPasswordForEmail` ran through `@supabase/ssr`, whose default flow
is PKCE: the browser that asked for the link got a `code_verifier` cookie, and the email link
(`{{ .ConfirmationURL }}` → Supabase `/verify` → `/conta/auth/callback?code=…`) could only be
exchanged with that cookie (`exchangeCodeForSession`). Opened on a phone, or in the email app's
browser, the cookie is missing, the exchange fails and the user saw «O link é inválido ou expirou».
The new links carry the token hash and are checked on the server with `verifyOtp`, which needs no
verifier.

## Unrelated things noticed in the same read

- `password_min_length` is 6 and `password_hibp_enabled` is false, while the README asks for 10 and
  leaked password protection. The site enforces 10 itself; Supabase's setting only matters for direct
  API calls.
- Email links are one-time: some corporate mail scanners (e.g. Outlook Safe Links) open links to
  check them, which would use the token up. The «link já não serve» page explains this and offers a
  new link. If it becomes a problem, the confirm route can show a «Entrar» button first and verify
  on the click.
