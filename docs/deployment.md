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
npm run test        # vitest — expect 23 passed
npm run build       # next build — expect 18 routes, no warnings
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

The contact form stores enquiries in a `contact_messages` table.

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
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
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
| `CONTACT_TO_EMAIL` | inbox that receives enquiries (falls back to `TETO_EMAIL`) |
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
| `CONTACT_TO_EMAIL` | e.g. `tetoteknologies@gmail.com` |
| `CONTACT_FROM_EMAIL` | verified sender, e.g. `Teto Technologies <no-reply@teto.co.ke>` |

**Company details** — blank values render a visible `TODO(owner)` badge, so fill
in as many as you have:

```text
TETO_EMAIL, TETO_PHONE, TETO_WHATSAPP, TETO_WHATSAPP_MESSAGE,
TETO_ADDRESS, TETO_HOURS, TETO_FOUNDED, TETO_LEGAL_NAME, TETO_REG_NUMBER,
TETO_FOUNDER, TETO_MAP_EMBED_URL,
TETO_LINKEDIN, TETO_GITHUB, TETO_X, TETO_FACEBOOK, TETO_INSTAGRAM, TETO_TIKTOK
```

**Optional**

```text
TURNSTILE_ENABLED, TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY
```

> `TETO_MAP_EMBED_URL` is the **embed** URL from Google Maps
> (**Share → Embed a map → Copy HTML**, then take the `src` value). Setting it
> also adds the Google Maps origins to the CSP automatically.

### 4.3 First deploy

Deploy. Vercel runs `next build`; the pages are prerendered at build time.

> **Important:** because pages are prerendered, changing any `TETO_*` variable
> or `NEXT_PUBLIC_SITE_URL` requires a **redeploy** to take effect. Changing
> `DATABASE_URL`/`RESEND_API_KEY` does not (those are used at request time).

---

## 5. Domain and TLS

1. In Vercel, **Project → Settings → Domains**, add `teto.co.ke` and
   `www.teto.co.ke`.
2. Vercel shows the DNS records to create (an `A` record to `76.76.21.21`, or a
   `CNAME` to `cname.vercel-dns.com` — follow what the dashboard says for your
   apex domain).
3. At your DNS provider, add those records. Set `www` to redirect to the apex,
   or the apex to `www` — pick one canonical host and be consistent.
4. Vercel issues the TLS certificate automatically once DNS resolves. Confirm
   `https://teto.co.ke` loads and HTTP redirects to HTTPS.
5. Set `NEXT_PUBLIC_SITE_URL=https://teto.co.ke` (matching the canonical host)
   and redeploy.

---

## 6. Post-deploy smoke test

Run these against the live site. Replace the domain as needed.

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
```

Then confirm:

- [ ] The test enquiry from step 3/4 arrives in `CONTACT_TO_EMAIL`, and the
      sender address receives the auto-reply.
- [ ] The row exists in the database:
      `SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 1;`
- [ ] `/contact?status=sent` shows the green banner and `/contact?status=invalid`
      the red one.
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
| Map shows a placeholder | `TETO_MAP_EMBED_URL` is blank; set it and redeploy. |
| Company details not updating | `TETO_*` values are baked in at build time — redeploy after changing them. |
| CSP blocks Turnstile or Maps | Ensure the feature is enabled (`TURNSTILE_ENABLED=true` / `TETO_MAP_EMBED_URL` set) and redeploy so `next.config.ts` includes the origins. |

---

## Final go-live checklist

- [ ] `npm run typecheck`, `npm run test` and `npm run build` pass.
- [ ] `DATABASE_URL` set and `contact_messages` exists in production.
- [ ] `RESEND_API_KEY` set and `CONTACT_FROM_EMAIL` uses a verified domain.
- [ ] `NEXT_PUBLIC_SITE_URL` set to the canonical HTTPS origin.
- [ ] All `TETO_*` company details filled in; no `TODO(owner)` badges remain.
- [ ] Portfolio and team placeholders replaced with owner-approved content.
- [ ] Domain resolves over HTTPS; HTTP redirects to HTTPS.
- [ ] Post-deploy smoke test (section 6) passes end-to-end.
- [ ] Backups, monitoring and Search Console configured.
- [ ] Privacy policy and terms reviewed with a qualified adviser.
