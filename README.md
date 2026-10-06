# Steevanz website

Next.js (App Router) site for Steevanz: NFC plates for Google reviews and AI tools for local businesses.

## Stack

- Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4, `motion`
- Supabase (bookings, leads, availability, client accounts, orders, auth)
- Resend (email notifications)
- Vercel Analytics and Speed Insights

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

The site builds and runs without any environment variables; bookings, leads and the admin area degrade gracefully until Supabase and Resend are configured.

## Structure

- `src/app/(pt)` Portuguese routes (default, served at `/`)
- `src/app/(en)/en` English routes (served at `/en`)
- `src/app/admin` admin panel (restricted to `ADMIN_EMAILS` with a confirmed email)
- `src/app/conta` client area: sign in, sign up, password recovery, purchased products (`/conta/<productId>`)
- `src/components/modules/registry.tsx` one management module per product, shared by the client area and the admin panel
- `src/content` all copy, product catalogue and prices (`products.ts`), docs and media manifest
- `supabase/migrations` database schema, RLS and seed data

## Accounts

Anyone can create an account at `/conta/registar` (email + password). Orders sent from the cart are stored in `orders` (linked to the account when signed in). When an admin sets an order to **Aceite** in `/admin/encomendas`, its products become active in `client_products` and appear in the client's area. Admins can also add, suspend or cancel products per client in `/admin/clientes`.

Supabase dashboard settings (Authentication):

- Email provider: enable **Confirm email** (required: admin rights depend on a confirmed email, so with confirmation off anyone could register an `ADMIN_EMAILS` address); minimum password length 10; enable leaked password protection.
- URL configuration: Site URL = production URL; add `<site>/conta/auth/callback` (and `http://localhost:3000/conta/auth/callback`) to Redirect URLs.
- Email templates: translate confirm signup and reset password to Portuguese.
- Admin accounts: register at `/conta/registar` with an email listed in `ADMIN_EMAILS` and confirm it. Admins who used the old magic-link login have no password yet: use `/conta/recuperar` once to set one.

## Prices

All prices live in `src/content/products.ts`. Values flagged with `priceIsProvisional: true` are placeholders.
