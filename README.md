# Steevanz website

Next.js (App Router) site for Steevanz: NFC plates for Google reviews and AI tools for local businesses.

## Stack

- Next.js 16, React 19, TypeScript (strict), Tailwind CSS v4, `motion`
- Supabase (bookings, leads, availability, admin auth)
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
- `src/app/(admin)/admin` admin area (Supabase Auth, restricted to `ADMIN_EMAILS`)
- `src/content` all copy, product catalogue and prices (`products.ts`), docs and media manifest
- `supabase/migrations` database schema, RLS and seed data

## Prices

All prices live in `src/content/products.ts`. Values flagged with `priceIsProvisional: true` are placeholders.
