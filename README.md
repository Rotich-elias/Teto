# Teto Technologies website

Marketing website for **Teto Technologies** (teto.co.ke), a Kenyan technology company. It is a server-rendered [Next.js](https://nextjs.org) (App Router) application built to be fast on mobile networks, accessible, and straightforward to hand over.

> **Before launch:** replace every `TODO(owner)` placeholder listed at the end of this file. The site deliberately contains no invented clients, statistics, testimonials, addresses, phone numbers, or results.

---

## What is included

- Home, services index, seven service detail pages, portfolio, products, about, contact, privacy, and terms pages.
- Friendly 404 page with `noindex`.
- Contact form with:
  - server-side validation (see `lib/contact.ts`);
  - database storage in `contact_messages` (Neon Postgres, via `lib/db.ts`);
  - notification to the company inbox and an auto-reply to the sender (Resend);
  - honeypot field;
  - best-effort rate limit of 5 submissions per hour per IP, shared across serverless instances via the database when one is configured;
  - optional Cloudflare Turnstile;
  - AJAX success/error states, plus a no-JavaScript POST fallback that redirects back to `/contact?status=…`.
- Admin area at `/admin` for editing products, portfolio (with images), contact details, social links, services, homepage copy, TSO price, SEO, app downloads, media and the contact inbox. Every change is saved to Neon Postgres and appears on the public site immediately — no code edit or redeploy.
- APKs and images upload directly from the browser to Vercel Blob; metadata and content live in Neon. Visitors download from stable `/download/<slug>` links — no Google Drive.
- Floating WhatsApp button driven by the admin company details (falling back to `TETO_WHATSAPP`).
- Every “Get a Quote” link points to `/contact?service=<slug>` and preselects the service.
- SEO: unique titles and descriptions, canonical URLs, Open Graph/Twitter metadata, JSON-LD, `sitemap.xml`, and `robots.txt`.
- Security headers (CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP) set in `next.config.ts`.
- Responsive layout with light/dark mode via `prefers-color-scheme`.
- Self-hosted Inter and Plus Jakarta Sans fonts.
- Vitest unit tests for contact validation, site helpers, content schemas, Blob URL validation and the rate limiter.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database | Neon serverless Postgres (`@neondatabase/serverless`) for enquiries, CMS content, downloads and media metadata |
| File storage | Vercel Blob (`@vercel/blob`) for APKs and uploaded images |
| Mail | [Resend](https://resend.com) |
| Tests | Vitest (`tests/`) |
| Deployment | Vercel (or any Node 20+ host) |

---

## Requirements

- Node.js 20.9 or newer (see `engines` in `package.json`)
- npm
- A Neon Postgres database (needed for the contact inbox, downloads and content editing)
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

Without `DATABASE_URL` or `RESEND_API_KEY` the contact form still validates and reports success, but it logs a warning and does not store or email the enquiry. The site renders the built-in content defaults, but admin saves will fail until a database is configured. This keeps local development working with no external services.

---

## Environment variables

`lib/site.ts` holds the built-in defaults for every editable section. When `DATABASE_URL` is set and the migration has run, values saved in `/admin` override those defaults immediately.

### Application

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site origin, e.g. `https://teto.co.ke`. Used for canonical URLs, sitemap, robots and JSON-LD. Falls back to the Vercel production URL, then `http://localhost:3000`. |

### Company details

| Variable | Where it appears |
| --- | --- |
| `TETO_EMAIL` | Footer, contact page, email links |
| `TETO_DATA_EMAIL` | Privacy policy data-request contact (falls back to `TETO_EMAIL`) |
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

Blank values render a visible `TODO(owner)` badge instead of inventing information; blank social URLs simply hide the social icons. These variables are build-time seed defaults: redeploy after changing one that has not been overridden in the admin. Admin-edited values take priority and need no redeploy.

### Contact form email (Resend)

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key. Without it, no email is sent. |
| `CONTACT_TO_EMAIL` | Comma-separated notification inboxes: `tetoteknologies@gmail.com, elgeiy8@gmail.com`. Falls back to `TETO_EMAIL`. |
| `CONTACT_FROM_EMAIL` | Verified sender. Falls back to Resend's onboarding address. |

### Contact form storage (Neon Postgres)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Without it, submissions are emailed but not stored. |

### Admin, downloads and CMS (Neon + Vercel Blob)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Same Neon database; stores content, `app_downloads`, media and inbox data. |
| `ADMIN_PASSWORD` | Password for `/admin/login`. Without it the whole admin area cannot be used. |
| `ADMIN_SESSION_SECRET` | Long random string used to sign the admin session cookie (e.g. `openssl rand -hex 32`). |
| `BLOB_READ_WRITE_TOKEN` | Added by Vercel when a Blob store is connected; required to issue browser upload tokens for APKs and images. |

### Cloudflare Turnstile (optional)

| Variable | Purpose |
| --- | --- |
| `TURNSTILE_ENABLED` | `true` to enable |
| `TURNSTILE_SITE_KEY` | Public widget key |
| `TURNSTILE_SECRET_KEY` | Server-side secret |

The honeypot and rate limit work without Turnstile.

---

## Contact form behaviour

1. The request passes through the rate limiter: an in-memory fast path plus, when `DATABASE_URL` is set, a count of recent `contact_messages` for the same IP so the limit is shared across serverless instances (5 per hour per IP). The database check fails open if it errors.
2. `lib/contact.ts` validates the fields and rejects honeypot submissions.
3. If Turnstile is enabled, the token is verified server-side (`lib/turnstile.ts`).
4. The enquiry is stored in `contact_messages` **before** email is attempted.
5. The company notification is sent to every address in `CONTACT_TO_EMAIL`; the sender receives an auto-reply.
6. Storage and mail failures are logged and do not lose the enquiry or surface as an error.

The endpoint accepts both a JSON body (the React form) and a `application/x-www-form-urlencoded` body (the no-JavaScript fallback). JSON requests receive `201`/`400`/`422`/`429` JSON responses; form posts receive a `303` redirect to `/contact?status=sent|invalid|rate|verify#enquiry`, which the contact page renders as a banner.

> **No-JS limitation:** when JavaScript is unavailable and validation fails, the redirect does not preserve the values the visitor typed — they are returned to an empty form with an error banner. A richer fallback (flash values in a short-lived signed cookie) can be added later if required.
>
> **Rate limiting:** the database-backed count is per-IP and covers stored submissions. If you need protection that does not depend on the database, put a shared limiter (e.g. Upstash Redis) in front of the endpoint.

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
  read        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)

app_downloads (
  id            BIGSERIAL PRIMARY KEY,
  product_slug  TEXT NOT NULL UNIQUE,
  file_name     TEXT NOT NULL,
  version       TEXT,
  size_bytes    BIGINT NOT NULL,
  content_type  TEXT NOT NULL,
  blob_url      TEXT NOT NULL,
  download_url  TEXT NOT NULL,
  blob_pathname TEXT NOT NULL,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
)

site_content (
  key         TEXT PRIMARY KEY,
  data        JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)

content_changes (
  id          BIGSERIAL PRIMARY KEY,
  section     TEXT NOT NULL,
  action      TEXT NOT NULL,
  snapshot    JSONB,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)

media_assets (
  id            BIGSERIAL PRIMARY KEY,
  pathname      TEXT NOT NULL UNIQUE,
  url           TEXT NOT NULL,
  file_name     TEXT NOT NULL,
  content_type  TEXT NOT NULL,
  size_bytes    BIGINT NOT NULL,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

The migration is idempotent and safe to run repeatedly.

---

## App downloads

1. Sign in at `/admin/downloads` with `ADMIN_PASSWORD`.
2. Choose a product, select an `.apk` file (up to 100 MB), add an optional version label and upload.
3. The browser requests a short-lived token from `/api/admin/blob-token` and uploads the file **directly to Vercel Blob** — the APK never passes through a Vercel Function, so the 4.5 MB function body limit does not apply.
4. The browser confirms the upload to `/api/admin/downloads`, which checks the Blob object with `head()`, stores its metadata in `app_downloads`, and deletes the previous APK from storage.
5. The products page links to `/download/<slug>`. That route reads the current URL from the database and redirects to Blob's `download=1` URL, so the browser saves the file with its original name.

Products and their slugs are managed in **Admin → Products**. To add another downloadable app, give it a `slug` and set its download URL to `/download/<slug>`; it will then appear in the APK upload dropdown. Admin pages are `noindex` and never prerendered.

Upload endpoints require a signed, httpOnly session cookie, only accept the Android package MIME type, cap the size, and verify that the stored URL belongs to the `downloads/` folder of your Blob store before making it live.

---

## Content management (admin CMS)

Sign in at `/admin`. The same single password protects every admin page.

| Page | What it edits |
| --- | --- |
| `/admin` | Overview, counts, quick actions and recent changes |
| `/admin/status` | Configuration checks and every remaining TODO placeholder |
| `/admin/content/products` | Product cards, slugs, links and platforms |
| `/admin/content/portfolio` | Case studies and their images |
| `/admin/content/company` | Contact details, mission, vision and map embed |
| `/admin/content/social` | Social links (blank URL hides the icon) |
| `/admin/content/tso` | TSO page content and package price |
| `/admin/content/services` | Service cards and detail pages |
| `/admin/content/homepage` | Hero, section headings and stat labels |
| `/admin/content/values`, `/process_steps`, `/tech` | Other homepage sections |
| `/admin/content/seo` | Default title, description, keywords and sharing image |
| `/admin/media` | Reuse or delete uploaded images |
| `/admin/messages` | Contact enquiries: filter, mark read/unread, reply, delete |
| `/admin/backup` | Export/import JSON content and review change history |

Each editor has add/remove/reorder controls and an **Edit as JSON** mode for advanced changes. Saving validates the whole section, writes one JSONB row to `site_content`, invalidates the cached reads, and regenerates affected public pages. **Reset section to defaults** deletes the override so the values in `lib/site.ts` apply again.

Images are uploaded directly to Vercel Blob under `images/` and recorded in `media_assets`. They are safe to use in portfolio, product, SEO and other image fields; the public image domains and CSP are already configured.

JSON backups contain text content only. APK files and uploaded images must be managed from **App downloads** and **Media library**. Before importing, the server validates every recognised section; a bad section aborts the import without writing anything.

---

## SEO

- `app/sitemap.ts` generates `/sitemap.xml` from the static pages and the current services in the CMS.
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
- Security headers are set for every route in `next.config.ts`: `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `X-Permitted-Cross-Domain-Policies`, and (in production) `Strict-Transport-Security`.
- The CSP only allows the Cloudflare Turnstile and Google Maps sources when those features are configured, and adds `'unsafe-eval'`/websocket sources in development only.

> **Note on CSP:** Next.js emits inline bootstrap scripts, so the policy allows `'unsafe-inline'` for `script-src`/`style-src` while pages stay statically rendered. A stricter nonce-based policy (as the Laravel app used) is possible with `middleware.ts`, but it opts every page into dynamic rendering. Revisit if a stricter policy is required.

---

## Testing

Vitest unit tests cover contact validation, site helpers, content schemas, Blob URL validation, admin authentication and the rate limiter.

```bash
npm run typecheck
npm run test
npm run build
```

---

## Deployment (Vercel)

> **Full step-by-step runbook:** [`docs/deployment.md`](docs/deployment.md) —
> Neon database, Resend domain, Vercel env vars, DNS/TLS, post-deploy smoke
> test, rollback and troubleshooting.

1. Import the repository into Vercel and set the framework preset to **Next.js**.
2. Add the environment variables from `.env.example` in **Project → Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin: `https://teto.co.ke`. Vercel issues and renews TLS automatically; DNS is managed in Cloudflare (DNS only).
4. Run `npm run db:migrate` once against the production `DATABASE_URL`. It creates every table, including the CMS tables.
5. Deploy. Pages are prerendered at build time, so redeploy after changing a `TETO_*` seed variable that has not been overridden in the admin. Content edited in `/admin` is live immediately.

### Deployment checklist

- [ ] Hosting is **Vercel**; production origin is `https://teto.co.ke` (TLS is issued and renewed automatically by Vercel).
- [ ] DNS is managed in **Cloudflare (DNS only)**; point the domain's records at Vercel as shown in the Vercel dashboard.
- [ ] TLS is handled by Vercel; confirm `https://teto.co.ke` loads and HTTP redirects to HTTPS. Set `NEXT_PUBLIC_SITE_URL=https://teto.co.ke`.
- [ ] Set `DATABASE_URL` and run `npm run db:migrate`; confirm `contact_messages`, `app_downloads`, `site_content`, `content_changes` and `media_assets` exist.
- [ ] Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and a verified `CONTACT_FROM_EMAIL`, then send a test enquiry end-to-end.
- [ ] Set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` and connect the Blob store; sign in at `/admin`.
- [ ] Use `/admin/status` until no TODO placeholders remain, then fill them in the relevant editors.
- [ ] Export a JSON backup from `/admin/backup` and store it safely.
- [ ] Fill in all required `TETO_*` seed details; admin overrides take priority and need no redeploy.
- [ ] Confirm the case-study copy and replace the delivery statements with verified results.
- [ ] Confirm the security headers in `next.config.ts` match the production domain (and the CSP once Turnstile/Maps are configured).
- [ ] Configure database backups, and test a restore.
- [ ] Configure uptime and error monitoring.
- [ ] Review the privacy policy and terms with a qualified adviser.
- [ ] Run Lighthouse mobile on `/` and `/contact` and confirm scores of at least 90.
- [x] Submit `https://teto.co.ke/sitemap.xml` in Google Search Console.

---

## TODO(owner)

Every item below must be supplied or approved by the site owner. Search the codebase for `TODO(owner)` to find the visible placeholders, or use `/admin/status` for the current, live list. Values can be filled in through the admin editors without editing this file.

### Brand and content

- [ ] Approve or replace the logo and brand assets in `public/images/` (`logo.svg`, `logo.png`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-default.png`).
- [ ] Approve the tagline and all service copy.
- [x] Founder (`TETO_FOUNDER`): Rotich Elias.
- [x] Supply the founding year (`TETO_FOUNDED`): 2019.
- [ ] Approve the mission and vision statements drafted on the about page (`TETO_MISSION`, `TETO_VISION`) and any owner-supplied company history.
- [x] Standard package price for TSO: KES 10,000 per year.
- [ ] Review the **TSO — Take Schools Online** page (`/tso`): approve the concept copy and the planned feature list, and supply screenshots when available. It is a first draft of a programme Teto is building.
- [ ] Confirm the **problem**, **solution** and **result** copy for the four case studies on `/portfolio`. The copy is drafted from the live sites and the results are factual delivery statements (no metrics) — replace them with specific, verified outcomes when available.
- [ ] Confirm the client names on the case studies (Bhilzak, UkweliTally, Techlup, CAFHED) are approved for publication, and that the screenshots in `public/images/work-*.png` may be used.
- [ ] Add further product entries for `/products` if needed — UkweliTally is already listed. Each needs a name, kind, summary, description, platforms, status, image and a download or website link.
- [x] Deadlines & Notes download: upload `deadline-1.0.24.apk` from `/admin/downloads` under slug `deadlines-notes`. The products page links to `/download/deadlines-notes`, which resolves the current file from the database. Device screenshots are in `public/images/deadlines-notes/`; the card uses the app logo (`deadlines-notes-logo.png`).

### Contact and company details

- [x] Company email address (`TETO_EMAIL`): tetoteknologies@gmail.com.
- [x] Phone number (`TETO_PHONE`): 0721 237 811.
- [x] WhatsApp number in international format without `+` (`TETO_WHATSAPP`): 254721237811.
- [x] Physical address (`TETO_ADDRESS`): Westlands, Nairobi, Kenya.
- [x] Business hours (`TETO_HOURS`): Open 24/7.
- [x] Google Maps embed URL (`TETO_MAP_EMBED_URL`): `https://www.google.com/maps?q=Westlands,+Nairobi,+Kenya&output=embed`.
- [ ] Social links: TikTok supplied (`https://www.tiktok.com/@teto_technologies`); LinkedIn, GitHub, X, Facebook and Instagram still blank, so their icons are hidden rather than showing a badge.
- [x] Registered business name (`TETO_LEGAL_NAME`): Teto Technologies.
- [x] Business registration number (`TETO_REG_NUMBER`): Tech20261.
- [x] Data protection contact email for privacy requests (`TETO_DATA_EMAIL`): tetoteknologies@gmail.com.

### Email and infrastructure

- [ ] Resend API key and a verified sending domain (`RESEND_API_KEY`, `CONTACT_FROM_EMAIL`).
- [x] Notification inboxes (`CONTACT_TO_EMAIL`): tetoteknologies@gmail.com and elgeiy8@gmail.com.
- [ ] Neon (or other Postgres) database and its `DATABASE_URL`.
- [ ] Hosting: Vercel. Region not yet specified.
- [ ] Domain DNS is managed in Cloudflare (DNS only); registrar not yet specified. Production URL: `https://teto.co.ke`.
- [ ] TLS is issued and renewed automatically by Vercel; confirm the production HTTPS redirect after deploy.
- [ ] Backup destination, retention, and restore procedure.
- [ ] Monitoring and alerting destination.
- [ ] Optional Cloudflare Turnstile site and secret keys.

### Legal

- [x] Privacy policy effective date: 1 November 2026.
- [x] Terms of use effective date: 1 November 2026.
- [x] Confirmed data retention period for contact enquiries: discarded or anonymised as soon as no longer needed.
- [x] Legal review of the privacy policy, terms, and consent wording.
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
  tso/                    TSO — Take Schools Online flagship page
  services/               Services index and [slug] detail pages
  portfolio/              Portfolio
  products/               Products
  contact/                Contact page (renders the form)
  privacy/                Privacy policy
  terms/                  Terms of use
  not-found.tsx           Custom 404
  sitemap.ts              Generated /sitemap.xml
  robots.ts               Generated /robots.txt
  admin/                  Admin overview, readiness, content editors, media, inbox, backup
  api/admin/              Auth, Blob tokens, content, media, messages and downloads APIs
  api/contact/route.ts    Contact form endpoint
  download/[slug]/        Public APK redirect
  globals.css             Design tokens, dark mode, component classes
components/               Nav, footer, cards, forms, admin editors, icons, JSON-LD
lib/
  site.ts                 Built-in defaults for all editable sections
  content.ts              Validation, cached reads, saves, history, export/import
  content-sections.ts     Section keys and labels shared with client components
  admin-fields.ts         Declarative admin form definitions
  admin-data.ts           Media and message-inbox database helpers
  admin-auth.ts           Signed admin session cookie
  contact.ts              Contact form validation
  contact-mail.ts         Resend notification + auto-reply
  db.ts                   Neon Postgres client and insert
  downloads.ts            APK validation and metadata helpers
  turnstile.ts            Cloudflare Turnstile verification
  rate-limit.ts           In-memory limiter plus a database-backed contact limit
  metadata.ts             Per-page metadata helper
scripts/migrate.mjs       Creates every database table used by the site
docs/deployment.md        Deployment runbook
next.config.ts            Image domains, security headers and Turbopack root
tests/                    Vitest unit tests
vitest.config.mts         Vitest configuration
public/                   Favicons, images
```

## Useful commands

```bash
npm run dev          # start the dev server
npm run build        # production build
npm run start        # run the production build
npm run typecheck    # tsc --noEmit
npm run test         # vitest
npm run db:migrate   # create/update all database tables
```
