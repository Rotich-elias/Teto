# Teto Technologies website

Marketing website for **Teto Technologies** (teto.co.ke), a Kenyan technology company. It is a server-rendered [Next.js](https://nextjs.org) (App Router) application built to be fast on mobile networks, accessible, and straightforward to hand over.

> **Before launch:** replace every `TODO(owner)` placeholder listed at the end of this file. The site deliberately contains no invented clients, statistics, testimonials, addresses, phone numbers, or results.

---

## What is included

- Home, services index, five service detail pages, portfolio, products, about, contact, privacy, and terms pages.
- Friendly 404 page with `noindex`.
- Contact form with:
  - server-side validation (see `lib/contact.ts`);
  - database storage in `contact_messages` (Neon Postgres, via `lib/db.ts`);
  - notification to the company inbox and an auto-reply to the sender (Resend);
  - honeypot field;
  - best-effort rate limit of 5 submissions per hour per IP;
  - optional Cloudflare Turnstile;
  - AJAX success/error states.
- Floating WhatsApp button driven by `TETO_WHATSAPP`.
- Every “Get a Quote” link points to `/contact?service=<slug>` and preselects the service.
- SEO: unique titles and descriptions, canonical URLs, Open Graph/Twitter metadata, JSON-LD, `sitemap.xml`, and `robots.txt`.
- Responsive layout with light/dark mode via `prefers-color-scheme`.
- Self-hosted Inter and Plus Jakarta Sans fonts.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database | Neon serverless Postgres (`@neondatabase/serverless`) |
| Mail | [Resend](https://resend.com) |
| Tests | Vitest (configured; test files pending) |
| Deployment | Vercel (or any Node 20+ host) |

---

## Requirements

- Node.js 20.9 or newer (see `engines` in `package.json`)
- npm
- A Neon Postgres database (only needed for contact-form storage)
- A Resend API key (only needed for contact-form email)

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env.local
#    Fill in the values you have; the site runs without the optional ones.

# 3. Run the database migration (only if DATABASE_URL is set)
npm run db:migrate

# 4. Start the dev server
npm run dev
```

The site is then available at <http://localhost:3000>.

Without `DATABASE_URL` or `RESEND_API_KEY` the contact form still validates and reports success, but it logs a warning and does not store or email the enquiry. This keeps local development working with no external services.

---

## Environment variables

All company details are read through `lib/site.ts`, so they can be changed without editing pages.

### Application

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site origin, e.g. `https://teto.co.ke`. Used for canonical URLs, sitemap, robots and JSON-LD. Falls back to the Vercel production URL, then `http://localhost:3000`. |

### Company details

| Variable | Where it appears |
| --- | --- |
| `TETO_EMAIL` | Footer, contact page, email links |
| `TETO_PHONE` | Footer, contact page, mobile nav |
| `TETO_WHATSAPP` | Floating WhatsApp button (international format, digits only) |
| `TETO_WHATSAPP_MESSAGE` | Pre-filled WhatsApp message |
| `TETO_ADDRESS` | Footer, contact page, about page |
| `TETO_HOURS` | Footer, contact page, service pages |
| `TETO_FOUNDED` | About page |
| `TETO_LEGAL_NAME` | Footer and legal pages |
| `TETO_REG_NUMBER` | Footer and legal pages |
| `TETO_FOUNDER` | About page |
| `TETO_MAP_EMBED_URL` | Contact page map iframe |
| `TETO_LINKEDIN`, `TETO_GITHUB`, `TETO_X`, `TETO_FACEBOOK`, `TETO_INSTAGRAM`, `TETO_TIKTOK` | Footer social links |

Blank values render a visible `TODO(owner)` badge instead of inventing information. Pages are prerendered, so redeploy after changing a variable.

### Contact form email (Resend)

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. Without it, no email is sent. |
| `CONTACT_TO_EMAIL` | Inbox that receives notifications. Falls back to `TETO_EMAIL`. |
| `CONTACT_FROM_EMAIL` | Verified sender. Falls back to Resend's onboarding address. |

### Contact form storage (Neon Postgres)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Without it, submissions are emailed but not stored. |

### Cloudflare Turnstile (optional)

| Variable | Purpose |
| --- | --- |
| `TURNSTILE_ENABLED` | `true` to enable |
| `TURNSTILE_SITE_KEY` | Public widget key |
| `TURNSTILE_SECRET_KEY` | Server-side secret |

The honeypot and rate limit work without Turnstile.

---

## Contact form behaviour

1. The request passes through an in-memory rate limiter (5 per hour per IP).
2. `lib/contact.ts` validates the fields and rejects honeypot submissions.
3. If Turnstile is enabled, the token is verified server-side (`lib/turnstile.ts`).
4. The enquiry is stored in `contact_messages` **before** email is attempted.
5. The company notification is sent to `CONTACT_TO_EMAIL`; the sender receives an auto-reply.
6. Storage and mail failures are logged and do not lose the enquiry or surface as an error.
7. The endpoint returns `201`/`400`/`422`/`429` JSON responses.

> **Not yet ported:** the Laravel version had a no-JavaScript POST fallback. The React form currently requires JavaScript. Rate limiting is in-memory and resets when a serverless instance recycles — put a shared limiter (e.g. Upstash Redis) in front of it for real protection.

### Database schema

`npm run db:migrate` creates:

```sql
contact_messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  service     TEXT NOT NULL,
  message     TEXT NOT NULL,
  ip          TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

The migration is idempotent and safe to run repeatedly.

---

## SEO

- `app/sitemap.ts` generates `/sitemap.xml` from the static pages and services.
- `app/robots.ts` generates `/robots.txt` and points to the sitemap.
- Every page has a unique title and description, canonical URL, Open Graph and Twitter metadata, and `hreflang`.
- Home and contact include Organization / LocalBusiness JSON-LD. Empty company fields are omitted rather than fabricated.
- The 404 page is excluded from indexing.

Set `NEXT_PUBLIC_SITE_URL` before generating the sitemap so absolute URLs are correct.

---

## Security

- Contact submissions are validated server-side and stored/emailed with parameterised queries.
- Secrets are read from environment variables; `.env*` files are git-ignored.
- Honeypot, rate limiting and optional Turnstile on the contact form.

> **Not yet ported:** the Laravel app shipped security headers (CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`, etc.) via middleware. These need to be re-added with a `next.config` `headers()` block or `middleware.ts` before launch.

---

## Testing

Vitest is configured (`vitest.config.ts`) but no tests exist yet. `lib/contact.ts` and `lib/contact-mail.ts` are pure functions and are the easiest first targets.

```bash
npm run typecheck
npm run test
npm run build
```

---

## Deployment (Vercel)

1. Import the repository into Vercel and set the framework preset to **Next.js**.
2. Add the environment variables from `.env.example` in **Project → Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin (e.g. `https://teto.co.ke`).
4. Run `npm run db:migrate` once against the production `DATABASE_URL`.
5. Deploy. Pages are prerendered at build time, so redeploy after changing any `TETO_*` variable.

### Deployment checklist

- [ ] Point the domain’s A/AAAA records at the host; point `www` at the apex or a redirect.
- [ ] Issue a TLS certificate and redirect HTTP to HTTPS.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production origin.
- [ ] Set `DATABASE_URL` and run `npm run db:migrate`; confirm the `contact_messages` table exists.
- [ ] Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and a verified `CONTACT_FROM_EMAIL`, then send a test enquiry end-to-end.
- [ ] Fill in all `TETO_*` company details.
- [ ] Replace the placeholder portfolio and team content.
- [ ] Re-add security headers (see Security above).
- [ ] Configure database backups, and test a restore.
- [ ] Configure uptime and error monitoring.
- [ ] Review the privacy policy and terms with a qualified adviser.
- [ ] Run Lighthouse mobile on `/` and `/contact` and confirm scores of at least 90.
- [ ] Submit `https://your-domain/sitemap.xml` in Google Search Console.

---

## TODO(owner)

Every item below must be supplied or approved by the site owner. Search the codebase for `TODO(owner)` to find the visible placeholders.

### Brand and content

- [ ] Approve or replace the logo and brand assets in `public/images/` (`logo.svg`, `logo.png`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-default.png`).
- [ ] Approve the tagline and all service copy.
- [x] Founder (`TETO_FOUNDER`): Rotich Elias.
- [x] Supply the founding year (`TETO_FOUNDED`): 2019.
- [ ] Supply the real mission statement used on the about page.
- [ ] Supply three portfolio projects: title, sector, one-line summary, problem, solution, **verified** result, technologies, and an approved image.
- [ ] Supply team names, roles, photos, and short bios (or confirm that the team section should be removed).

### Contact and company details

- [x] Company email address (`TETO_EMAIL`): tetoteknologies@gmail.com.
- [ ] Phone number (`TETO_PHONE`).
- [ ] WhatsApp number in international format without `+` (`TETO_WHATSAPP`).
- [ ] Physical address (`TETO_ADDRESS`).
- [ ] Business hours (`TETO_HOURS`).
- [ ] Google Maps embed URL (`TETO_MAP_EMBED_URL`).
- [ ] Social links: LinkedIn, GitHub, X, Facebook, Instagram.
- [x] Registered business name (`TETO_LEGAL_NAME`): Teto Technologies.
- [x] Business registration number (`TETO_REG_NUMBER`): Tech20261.
- [ ] Data protection contact email for privacy requests.

### Email and infrastructure

- [ ] Resend API key and a verified sending domain (`RESEND_API_KEY`, `CONTACT_FROM_EMAIL`).
- [x] Notification inbox (`CONTACT_TO_EMAIL`): tetoteknologies@gmail.com.
- [ ] Neon (or other Postgres) database and its `DATABASE_URL`.
- [ ] Hosting/VPS provider and region.
- [ ] Domain registrar and DNS access.
- [ ] TLS certificate/renewal method.
- [ ] Backup destination, retention, and restore procedure.
- [ ] Monitoring and alerting destination.
- [ ] Optional Cloudflare Turnstile site and secret keys.

### Legal

- [ ] Privacy policy effective date.
- [ ] Terms of use effective date.
- [ ] Confirmed data retention period for contact enquiries.
- [ ] Legal review of the privacy policy, terms, and consent wording.
- [ ] Confirm whether any analytics, advertising, or other non-essential cookies will be added. If you enable Turnstile or add analytics, review whether a cookie notice is required.

---

## Content policy

This repository intentionally does not contain invented clients, project results, statistics, testimonials, team members, addresses, phone numbers, or social profiles. Placeholder content is rendered with a visible `TODO(owner)` badge so it cannot be mistaken for real information. Replace placeholders with verified details before launch.

## Project structure

```text
app/
  layout.tsx              Root layout: fonts, nav, footer, JSON-LD
  page.tsx                Home
  about/                  About
  services/               Services index and [slug] detail pages
  portfolio/              Portfolio
  products/               Products
  contact/                Contact page (renders the form)
  privacy/                Privacy policy
  terms/                  Terms of use
  not-found.tsx           Custom 404
  sitemap.ts              Generated /sitemap.xml
  robots.ts               Generated /robots.txt
  api/contact/route.ts    Contact form endpoint
  globals.css             Design tokens, dark mode, component classes
components/               Nav, footer, cards, forms, icons, JSON-LD
lib/
  site.ts                 Company details, services, portfolio, SEO defaults
  contact.ts              Contact form validation
  contact-mail.ts         Resend notification + auto-reply
  db.ts                   Neon Postgres client and insert
  turnstile.ts            Cloudflare Turnstile verification
  rate-limit.ts           In-memory rate limiter
  metadata.ts             Per-page metadata helper
scripts/migrate.mjs       Creates the contact_messages table
public/                   Favicons, images
```

## Useful commands

```bash
npm run dev          # start the dev server
npm run build        # production build
npm run start        # run the production build
npm run typecheck    # tsc --noEmit
npm run test         # vitest
npm run db:migrate   # create/update the contact_messages table
```
