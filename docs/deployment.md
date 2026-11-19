# Deployment runbook — Teto Technologies

A step-by-step guide to taking this Next.js app from the repository to
`https://teto.co.ke`. It is written for someone with access to the company's
Neon, Resend, Vercel and DNS accounts.

Everything is best-effort by design: with `DATABASE_URL` and `RESEND_API_KEY`
unset, the site runs and the contact form still reports success — it just logs
a warning and does not store or email the enquiry. So you can deploy early and
add the services afterwards, in any order.

> **Prerequisite:** Node.js 20.9+ and the repo checked out on the branch you
> intend to ship (currently `nextjs-migration`).

---

## 0. Local sanity check (5 minutes)

Before touching any cloud account, confirm the app builds and the tests pass on
your machine.

```bash
npm install
npm run typecheck   # tsc --noEmit — expect no output
npm run test        # vitest — expect all tests to pass
npm run build       # next build — expect no errors
```

Then run it locally and click through the site:

```bash
npm run dev         # http://localhost:3000
```

Check: `/`, `/services`, each service detail page, `/portfolio`, `/products`,
`/about`, `/contact` (submit the form), `/privacy`, `/terms`, and a bad URL for
the 404. With no services configured the form logs
`Contact message not stored…` / `Contact email not sent…` and still shows a
success message — that is expected.

---

## 1. Database — Neon Postgres

Neon stores contact enquiries, editable site content, app-download metadata, media records and inbox actions. The migration creates every table at once and is safe to run repeatedly.

### 1.1 Create the database

1. Sign in at <https://neon.tech> and create a project (pick the region closest
   to your Vercel region — e.g. `AWS eu-central-1` or `us-east-1`).
2. In **Connection Details**, copy the **pooled** connection string. It looks
   like:

   ```text
   postgresql://USER:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require
   ```

   The app uses the Neon HTTP driver (`@neondatabase/serverless`), which works
   with the pooled string.

### 1.2 Create the table

Run the migration once against that URL. An inline variable overrides the blank
one in `.env`, so this works without editing any file:

```bash
DATABASE_URL="postgresql://…your pooled string…" npm run db:migrate
```

Expected output:

```text
✓ create contact_messages table
✓ index contact_messages by created_at
✓ create app_downloads table
✓ add read flag to contact_messages
✓ index unread contact_messages
✓ create site_content table
✓ create content_changes table
✓ index content_changes by date
✓ create media_assets table
Migration complete.
```

The migration is idempotent — safe to run again. It creates:

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

### 1.3 Verify

```bash
DATABASE_URL="postgresql://…" node -e "
  const { neon } = require('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL);
  sql.query('SELECT count(*)::int AS n FROM contact_messages').then(r => console.log(r));
"
```

Expect `[{ n: 0 }]`. (Or use the Neon SQL editor: `SELECT count(*) FROM contact_messages;`.)

### 1.4 Add it to the app

- Local: put it in `.env.local` (Next.js loads this automatically).
- Production: add `DATABASE_URL` in Vercel (step 4).

**Keep this connection string secret.** It grants read/write to the database.

### 1.5 Admin, downloads and CMS — Vercel Blob

APKs and uploaded images are served from Vercel Blob; their metadata and all editable content live in the same Neon database. The browser uploads files directly to Blob, so large APKs are not limited by Vercel's 4.5 MB function payload cap.

1. In Vercel, open the project's **Storage** tab → **Create Storage** → **Blob**. Choose **Public** access, name it (for example `site-assets`), select **Add a read-write token env var to this connection**, and connect it to Production, Preview and Development. The read-write token is required to issue browser upload tokens.
2. Locally, run `vercel env pull` so `.env.local` receives `BLOB_READ_WRITE_TOKEN` (and the OIDC variables Vercel adds).
3. Generate the admin credentials and set them in Vercel and `.env.local`:
   ```bash
   openssl rand -hex 32   # use as ADMIN_SESSION_SECRET
   ```
   `ADMIN_PASSWORD` is the single password for the whole `/admin` area. Keep both secret.
4. Run `npm run db:migrate` again — it creates `app_downloads`, `site_content`, `content_changes` and `media_assets` as well as adding the inbox `read` flag.
5. After deploying, sign in at `https://teto.co.ke/admin`. Work through `/admin/status`, then edit products, portfolio, company details, social links, TSO price, services, homepage and SEO in the relevant editors. Upload `deadline-1.0.24.apk` from **App downloads** under the `deadlines-notes` slug and confirm `/download/deadlines-notes` saves the APK.
6. Export a JSON backup from `/admin/backup` and keep it somewhere safe.

Every admin save updates the cached content immediately; no code change or redeploy is needed.

---

## 2. Email — Resend

The form sends the company a notification and the sender an auto-reply.

### 2.1 Verify a sending domain

1. Sign in at <https://resend.com> and go to **Domains → Add Domain**.
2. Enter your domain, e.g. `teto.co.ke`.
3. Resend gives you DNS records (SPF/DKIM, and optionally DMARC). Add them at
   your DNS provider.
4. Wait for Resend to show the domain as **Verified**.

> Until the domain is verified you can only send from Resend's test address
> (`onboarding@resend.dev`) and only to your own account email. That is fine for
> a first test, not for production.

### 2.2 Create an API key

**API Keys → Create API Key**, with **Sending access**. Copy it once — Resend
will not show it again.

### 2.3 Configure the app

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | the key from 2.2 |
| `CONTACT_TO_EMAIL` | comma-separated inboxes that receive enquiries: `tetoteknologies@gmail.com, elgeiy8@gmail.com` (falls back to `TETO_EMAIL`) |
| `CONTACT_FROM_EMAIL` | a verified sender, e.g. `Teto Technologies <no-reply@teto.co.ke>` |

The local development default `Teto Technologies <onboarding@resend.dev>` will
**fail in production** — set a verified sender before launch.

---

## 3. Bot protection — Cloudflare Turnstile (optional)

The honeypot and rate limit work without it. Enable Turnstile if you expect
abuse.

1. In the Cloudflare dashboard, **Turnstile → Add site**. Copy the **Site Key**
   and **Secret Key**.
2. Set:

   ```text
   TURNSTILE_ENABLED=true
   TURNSTILE_SITE_KEY=…
   TURNSTILE_SECRET_KEY=…
   ```

3. **Redeploy.** The CSP in `next.config.ts` adds the Cloudflare origins
   automatically when `TURNSTILE_ENABLED=true` — no code change needed.

---

## 4. Hosting — Vercel

The site is hosted on Vercel. The production origin is `https://teto.co.ke`.
Vercel issues and renews the TLS certificate automatically; DNS is managed in
Cloudflare in **DNS only** mode (no Cloudflare proxy).

### 4.1 Import the project

1. Sign in at <https://vercel.com> and **Add New → Project**.
2. Import the GitHub repository. Vercel detects **Next.js** automatically; keep
   the default build command (`next build`) and output settings.
3. Do **not** deploy yet — add the environment variables first (next step).

### 4.2 Environment variables

In **Project → Settings → Environment Variables**, add the following for
**Production** (and **Preview** if you use it). Start from `.env.example` in the
repo.

**Required for a complete launch**

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://teto.co.ke` — used for canonical URLs, sitemap, robots, JSON-LD |
| `DATABASE_URL` | Neon pooled connection string (step 1) |
| `RESEND_API_KEY` | Resend key (step 2) |
| `CONTACT_TO_EMAIL` | `tetoteknologies@gmail.com, elgeiy8@gmail.com` |
| `CONTACT_FROM_EMAIL` | verified sender, e.g. `Teto Technologies <no-reply@teto.co.ke>` |
| `ADMIN_PASSWORD` | Password for the whole `/admin` area (step 1.5) |
| `ADMIN_SESSION_SECRET` | `openssl rand -hex 32` (step 1.5) |

Vercel adds `BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID` and `VERCEL_OIDC_TOKEN` automatically when the Blob store is connected (step 1.5). No manual entry is needed for those.

**Company details** — these are seed defaults. Values saved in `/admin` override
them immediately; blank values render a visible `TODO(owner)` badge (except the
social URLs, which simply hide their icons), so fill in as many as you have:

```text
TETO_EMAIL, TETO_DATA_EMAIL, TETO_PHONE, TETO_WHATSAPP, TETO_WHATSAPP_MESSAGE,
TETO_ADDRESS, TETO_HOURS, TETO_FOUNDED, TETO_LEGAL_NAME, TETO_REG_NUMBER,
TETO_FOUNDER, TETO_MAP_EMBED_URL, TETO_TIKTOK
```

`TETO_TIKTOK` is set to `https://www.tiktok.com/@teto_technologies`.
`TETO_LINKEDIN`, `TETO_GITHUB`, `TETO_X`, `TETO_FACEBOOK` and `TETO_INSTAGRAM`
are intentionally left blank: blank social URLs hide the icons instead of
rendering a `TODO(owner)` badge. Supply them when the owner approves the profile
links.

**Optional**

```text
TURNSTILE_ENABLED, TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY
```

> `TETO_MAP_EMBED_URL` is the **embed** URL from Google Maps
> (**Share → Embed a map → Copy HTML**, then take the `src` value). It is only a
> seed default — the live value is set in **Admin → Contact details**. Google
> Maps frame sources are always allowed by the CSP, so changing the map link in
> the admin does not need a redeploy.

### 4.3 First deploy

Deploy. Vercel runs `next build`; the pages are prerendered at build time.

> **Important:** because pages are prerendered, changing a `TETO_*` seed value
> or `NEXT_PUBLIC_SITE_URL` requires a **redeploy** to take effect where it has
> not been overridden in the admin. Content saved in `/admin`, uploads and
> `DATABASE_URL`/`RESEND_API_KEY` changes take effect without a redeploy.

---

## 5. Domain and TLS

The production domain is `teto.co.ke`. DNS is managed in Cloudflare in **DNS
only** mode (grey cloud), so Cloudflare does not proxy or cache the site. TLS is
issued and renewed by Vercel — there is no certificate to upload or renew
manually.

1. In Vercel, **Project → Settings → Domains**, add `teto.co.ke` and
   `www.teto.co.ke`.
2. Vercel shows the DNS records to create (an `A` record to `76.76.21.21`, or a
   `CNAME` to `cname.vercel-dns.com` — follow what the dashboard says for your
   apex domain).
3. In Cloudflare DNS, add those records with **Proxy status: DNS only**. Pick one
   canonical host and redirect the other to it (this site uses the apex,
   `https://teto.co.ke`).
4. Confirm Vercel issues the certificate: `https://teto.co.ke` loads and HTTP
   redirects to HTTPS.
5. Set `NEXT_PUBLIC_SITE_URL=https://teto.co.ke` (matching the canonical host)
   and redeploy.

---

## 6. Post-deploy smoke test

Run these against the live site at `https://teto.co.ke`.

```bash
# 1. Home and contact render
curl -s -o /dev/null -w "home=%{http_code}\n"    https://teto.co.ke/
curl -s -o /dev/null -w "contact=%{http_code}\n" https://teto.co.ke/contact

# 2. Security headers are present
curl -sI https://teto.co.ke/ | grep -iE 'content-security-policy|strict-transport|x-frame|referrer-policy'

# 3. JSON API accepts a valid enquiry (expect 201)
curl -s -o /dev/null -w "json=%{http_code}\n" -X POST https://teto.co.ke/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Launch Test","email":"you@example.com","phone":"+254700000000","service":"web-development","message":"Post-deploy smoke test.","consent":true}'

# 4. No-JS form POST redirects (expect 303 → /contact?status=sent#enquiry)
curl -s -o /dev/null -w "form=%{http_code} %{redirect_url}\n" -X POST https://teto.co.ke/api/contact \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'name=Launch+Test&email=you%40example.com&service=web-development&message=Post-deploy+smoke+test.&consent=on'

# 5. Sitemap and robots
curl -s -o /dev/null -w "sitemap=%{http_code}\n" https://teto.co.ke/sitemap.xml
curl -s -o /dev/null -w "robots=%{http_code}\n"  https://teto.co.ke/robots.txt

# 6. App download (expect 302 to a *.public.blob.vercel-storage.com URL)
curl -s -o /dev/null -w "download=%{http_code} %{redirect_url}\n" https://teto.co.ke/download/deadlines-notes

# 7. Admin is private and reachable after login (expect 307 → /admin/login, then 200)
curl -s -o /dev/null -w "admin=%{http_code} %{redirect_url}\n" https://teto.co.ke/admin
curl -s -o /dev/null -w "login=%{http_code}\n" https://teto.co.ke/admin/login
```

Then confirm:

- [ ] The test enquiry from step 3/4 arrives in **both** notification inboxes
      (`tetoteknologies@gmail.com` and `elgeiy8@gmail.com`), and the sender
      address receives the auto-reply.
- [ ] The row exists in the database:
      `SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 1;`
- [ ] `/contact?status=sent` shows the green banner and `/contact?status=invalid`
      the red one.
- [ ] `/admin/status` reports no remaining TODO placeholders.
- [ ] The test enquiry appears in `/admin/messages` and can be marked as read.
- [ ] No `TODO(owner)` badges remain on any public page (search the rendered
      pages for the text).
- [ ] The WhatsApp button opens `wa.me` with the pre-filled message.

---

## 7. Backups, monitoring, search

- [ ] **Backups:** Neon retains history by default (check your plan's window).
      If you need independent backups, schedule a `pg_dump` to object storage
      and test a restore.
- [ ] **Monitoring:** add uptime checks for `/` and `/contact`, and error
      tracking (e.g. Sentry) if you want alerts on 5xx and failed contact
      submissions.
- [ ] **Search Console:** verify `https://teto.co.ke` and submit
      `https://teto.co.ke/sitemap.xml`.
- [ ] **Lighthouse:** run mobile audits on `/` and `/contact`, aim for ≥ 90.

---

## Rollback

Vercel keeps every deployment. To roll back: **Project → Deployments → … →
Promote to Production** on the previous good build. The database is additive
(the migration only creates a table), so rolling back the app does not require
a database change.

---

## Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| Form succeeds but no email arrives | `RESEND_API_KEY` unset, or `CONTACT_FROM_EMAIL` domain not verified. Check the Vercel function logs. |
| Form succeeds but nothing is stored | `DATABASE_URL` unset or the table missing. Run `npm run db:migrate` against the production URL. |
| `db:migrate` says `DATABASE_URL is not set` | The variable was not passed. Use `DATABASE_URL="…" npm run db:migrate`. |
| 429 from the contact endpoint | Rate limit hit (5/hour/IP). The database-backed count shares this across instances. |
| Turnstile widget missing | `TURNSTILE_ENABLED=true` and `TURNSTILE_SITE_KEY` must both be set, then redeploy. |
| Map shows a placeholder | The map embed URL is blank. Add it in **Admin → Contact details**; `TETO_MAP_EMBED_URL` is only the seed default. |
| Company details not updating | Admin-saved values take priority. If no override exists, `TETO_*` values are baked in at build time — redeploy after changing them. |
| CSP blocks Turnstile | Set `TURNSTILE_ENABLED=true` and `TURNSTILE_SITE_KEY`, then redeploy so `next.config.ts` includes the Cloudflare origins. |
| Map iframe says “Refused to connect” | Confirm the URL in **Admin → Contact details** is a Google Maps `.../maps?...&output=embed` or `.../maps/embed?...` URL. Google Maps frames are always allowed by the CSP; redeploy once if the site was built from an older `next.config.ts`. |
| Admin login says "not configured" | Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in Vercel, then redeploy. |
| Upload fails with a CSP error | Redeploy after connecting the Blob store — `next.config.ts` allows the Blob origins in `connect-src`. |
| Upload is rejected as "unexpected upload location" | The Blob store must be public and the file must land under `downloads/<slug>/`. Re-upload from `/admin/downloads`. |
| `/download/<slug>` redirects to `/products` | No active row in `app_downloads`. Run `npm run db:migrate` and upload the APK from the admin page. |
| Admin editor says `DATABASE_URL is not configured` | Set `DATABASE_URL` in Vercel and redeploy. The site still renders built-in defaults without it, but saves are disabled. |
| Edits fail with `site_content does not exist` | Run `npm run db:migrate` against the production database. |
| An uploaded image is blocked by Next.js | Confirm the Blob store is public and the URL begins with `https://*.public.blob.vercel-storage.com/images/`. Redeploy after changing Blob settings so `next.config.ts` picks up the image domain. |
| Content edit saved but page looks stale | Hard-refresh once; saves invalidate the tagged cache and the root layout. Check the **Change history** page to confirm the save landed. |

---

## Final go-live checklist

- [ ] `npm run typecheck`, `npm run test` and `npm run build` pass.
- [ ] `DATABASE_URL` set and all migration tables exist in production.
- [ ] Blob store connected, and `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` set (step 1.5).
- [ ] `/admin/status` has no TODO placeholders; JSON backup exported from `/admin/backup`.
- [ ] APK uploaded from **App downloads** and `/download/deadlines-notes` saves the file.
- [ ] `RESEND_API_KEY` set and `CONTACT_FROM_EMAIL` uses a verified domain.
- [ ] `NEXT_PUBLIC_SITE_URL` set to the canonical HTTPS origin.
- [ ] All required `TETO_*` company details filled in; the remaining social
      URLs (apart from TikTok) are intentionally blank and their icons hidden;
      no other `TODO(owner)` badges remain.
- [ ] Portfolio placeholders replaced with owner-approved content.
- [ ] Domain resolves over HTTPS; HTTP redirects to HTTPS.
- [ ] Post-deploy smoke test (section 6) passes end-to-end.
- [ ] Backups, monitoring and Search Console configured.
- [ ] Privacy policy and terms reviewed with a qualified adviser.
