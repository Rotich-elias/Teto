# Teto Technologies website

Marketing website for **Teto Technologies** (teto.co.ke), a Kenyan technology company. It is a server-rendered Laravel application with a small amount of progressive enhancement, built to be fast on mobile networks, accessible, and straightforward to hand over.

> **Before launch:** replace every `TODO(owner)` placeholder listed at the end of this file. The site deliberately contains no invented clients, statistics, testimonials, addresses, phone numbers, or results.

---

## What is included

- Home, services index, five service detail pages, portfolio, about, contact, privacy, and terms pages.
- Friendly 404 page with `noindex`.
- Working contact form with:
  - server-side validation;
  - database storage in `contact_messages`;
  - notification to the company inbox and an auto-reply to the sender;
  - honeypot field;
  - rate limit of 5 submissions per hour per IP;
  - optional Cloudflare Turnstile;
  - AJAX success/error states with a normal POST fallback when JavaScript is unavailable.
- Floating WhatsApp button driven by `TETO_WHATSAPP`.
- Every “Get a Quote” link points to `/contact?service=<slug>` and preselects the service.
- SEO: unique titles and descriptions, canonical URLs, Open Graph/Twitter metadata, JSON-LD, `sitemap.xml`, and `robots.txt`.
- Security headers, including a nonce-based Content Security Policy.
- Responsive layout with light/dark mode via `prefers-color-scheme`.
- Self-hosted Inter and Plus Jakarta Sans fonts.
- Docker Compose stack (PHP-FPM, nginx, MySQL) and a multi-stage Dockerfile.
- PHPUnit feature tests for pages, the contact form, sitemap/robots, and security headers.

## Tech stack

| Layer | Choice |
| --- | --- |
| Backend | Laravel 11, PHP 8.2+ |
| Templates | Blade |
| Styling | Tailwind CSS 3 + Vite 6 |
| Interactivity | Alpine.js CSP build, lazy-loaded for the contact form |
| Database | MySQL 8 in production; SQLite is supported locally |
| Mail | Laravel Mail over SMTP |
| Deployment | Docker Compose: nginx + PHP-FPM + MySQL |

The Alpine CSP build is used so the Content Security Policy does not need `unsafe-eval`. Alpine is loaded on demand the first time someone interacts with the contact form; the form remains a normal POST if JavaScript never loads.

---

## Requirements

- PHP 8.2 or newer with `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, and `fileinfo`
- Composer 2
- Node.js 20+ and npm
- MySQL 8 (or SQLite for a quick local run)
- Docker 24+ and Docker Compose v2 for the container workflow

## Local development

```bash
# 1. Install dependencies
composer install
npm install

# 2. Create the environment file and application key
cp .env.example .env
php artisan key:generate

# 3. Choose a database
#    Option A: SQLite (quickest)
touch database/database.sqlite
#    In .env set: DB_CONNECTION=sqlite and comment out the DB_* MySQL values.

#    Option B: MySQL
#    Create a database and user, then set DB_DATABASE, DB_USERNAME and DB_PASSWORD in .env.

# 4. Run migrations
php artisan migrate

# 5. Build front-end assets
npm run build

# 6. Serve the site
php artisan serve
```

The site is then available at <http://127.0.0.1:8000>.

For asset hot-reloading during development, run `npm run dev` in a second terminal and use `php artisan serve`. The security middleware automatically allows the Vite dev server origins when `APP_ENV=local`.

### Local mail

The default `.env.example` uses `MAIL_MAILER=log`, so contact-form emails are written to `storage/logs/laravel.log` instead of being delivered. This is intentional for local development.

---

## Environment variables

All company details are read through `config/teto.php`, so they can be changed without editing templates.

### Application

| Variable | Purpose |
| --- | --- |
| `APP_NAME` | Site name used in titles and emails |
| `APP_ENV` | `local` or `production` |
| `APP_KEY` | Required; generate with `php artisan key:generate` |
| `APP_DEBUG` | `true` locally, **`false` in production** |
| `APP_URL` | Public site URL, e.g. `https://teto.co.ke` |
| `APP_TIMEZONE` | `Africa/Nairobi` |
| `APP_FORCE_HTTPS` | `true` behind TLS in production |
| `SESSION_SECURE_COOKIE` | `true` when the site is served over HTTPS |

### Database, session, cache, queue

The Docker stack sets `DB_CONNECTION=mysql`, `DB_HOST=mysql`, `SESSION_DRIVER=database`, `CACHE_STORE=database`, and `QUEUE_CONNECTION=sync`. Contact emails are sent synchronously, so no queue worker is required.

### Mail

| Variable | Purpose |
| --- | --- |
| `MAIL_MAILER` | `smtp` in production, `log` locally |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_SCHEME` | SMTP server details |
| `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP credentials |
| `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` | Sender identity |
| `MAIL_TO` | Inbox that receives contact-form notifications |

If `MAIL_TO` is empty, the company notification is skipped and a warning is logged. If `MAIL_FROM_ADDRESS` is empty, the mailer cannot add a `From` header and delivery fails; the enquiry is still stored and the failure is logged. Set both before launch.

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
| `TETO_MAP_EMBED_URL` | Contact page map iframe |
| `TETO_LINKEDIN`, `TETO_GITHUB`, `TETO_X`, `TETO_FACEBOOK`, `TETO_INSTAGRAM`, `TETO_TIKTOK` | Footer social links |

Blank values render a visible `TODO(owner)` badge instead of inventing information.

### Cloudflare Turnstile (optional)

| Variable | Purpose |
| --- | --- |
| `TURNSTILE_ENABLED` | `true` to enable |
| `TURNSTILE_SITE_KEY` | Public widget key |
| `TURNSTILE_SECRET_KEY` | Server-side secret |

The honeypot and rate limit work without Turnstile. When enabling Turnstile, both keys are required; the CSP is extended automatically to allow the Cloudflare challenge resources.

---

## Docker

The stack builds two images from the same multi-stage `Dockerfile`:

- `app` — PHP 8.3-FPM with OPcache, migrations, and Laravel caches
- `web` — nginx serving the compiled assets and proxying PHP to `app`
- `mysql` — MySQL 8 with a persistent named volume

### Run it

```bash
cp .env.example .env
php artisan key:generate          # or set APP_KEY manually

# Set at minimum:
#   APP_URL=https://your-domain.example
#   APP_ENV=production
#   APP_DEBUG=false
#   APP_FORCE_HTTPS=true
#   DB_DATABASE / DB_USERNAME / DB_PASSWORD / DB_ROOT_PASSWORD
#   MAIL_* and MAIL_TO
#   TETO_* company details

docker compose up --build -d
```

The site is exposed on port `8000` by default. Override with `APP_PORT=8080 docker compose up --build -d`.

On start, the entrypoint waits for MySQL, runs `php artisan migrate --force`, then caches config, routes, and views. Set `RUN_MIGRATIONS=false` if you run migrations separately.

Useful commands:

```bash
docker compose logs -f app
docker compose exec app php artisan about
docker compose exec app php artisan migrate:status
docker compose exec mysql mysqldump -u root -p"$DB_ROOT_PASSWORD" "$DB_DATABASE" > backup.sql
```

TLS is expected to terminate at the host or a reverse proxy (Caddy, Traefik, nginx, or Cloudflare). Forward `X-Forwarded-Proto` and set `APP_FORCE_HTTPS=true`; the application sends HSTS only when the request is secure and `APP_ENV=production`.

---

## Contact form behaviour

1. A request passes through the `contact` rate limiter (5 per hour per IP).
2. `ContactRequest` validates the fields and silently accepts/discards honeypot submissions.
3. If Turnstile is enabled, the token is verified server-side.
4. The enquiry is stored in `contact_messages` **before** email is attempted.
5. The company notification is sent to `MAIL_TO`; the sender receives an auto-reply.
6. Mail failures are logged and do not lose the stored enquiry.
7. JSON requests receive `201`/`422`/`429` responses; normal form posts redirect back with a status or error message.

The form has a no-JavaScript fallback: it submits normally and uses the same server-side validation and redirects.

---

## SEO

- `GET /sitemap.xml` is generated from the configured pages and services.
- `GET /robots.txt` is generated by the application and points to the sitemap.
- Every page has a unique title and description, canonical URL, Open Graph and Twitter metadata, and `hreflang`.
- Home includes Organization and LocalBusiness JSON-LD. Empty company fields are omitted rather than fabricated.
- The 404 page is excluded from indexing.

Update `APP_URL` before generating the sitemap so absolute URLs are correct.

---

## Security

- CSRF protection on the contact form.
- Server-side validation and output escaping through Blade.
- Nonce-based CSP; no `unsafe-eval`.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and `X-Permitted-Cross-Domain-Policies`.
- HSTS when served over HTTPS in production.
- Secrets are read from environment variables; `.env` is excluded from the Docker build and git.
- Only nginx should be exposed publicly. The `app` and `mysql` services are internal to the Compose network.
- The application currently trusts all proxies (`trustProxies(at: '*')`) because it sits behind the bundled nginx container. Do not expose PHP-FPM directly.

Run `php artisan about` in production to confirm `APP_DEBUG=false`.

---

## Testing

```bash
php artisan test
vendor/bin/pint --test
npm run build
```

The feature tests use an in-memory SQLite database (see `phpunit.xml`) and cover:

- all public pages and service detail pages;
- unknown service slugs and the 404 page;
- contact form storage, validation, JSON responses, honeypot, and rate limiting;
- sitemap and robots output;
- security headers and CSP.

---

## Deployment checklist

- [ ] Point the domain’s A/AAAA records at the server; point `www` at the apex or a redirect.
- [ ] Issue a TLS certificate and redirect HTTP to HTTPS.
- [ ] Set `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://…`, `APP_FORCE_HTTPS=true`, and `SESSION_SECURE_COOKIE=true`.
- [ ] Set a strong `APP_KEY`, database passwords, and SMTP credentials.
- [ ] Set `MAIL_TO` and send a test enquiry end-to-end.
- [ ] Fill in all `TETO_*` company details.
- [ ] Replace the placeholder portfolio and team content.
- [ ] Run `php artisan migrate --force` and confirm the `contact_messages` table exists.
- [ ] Configure database and file backups, and test a restore.
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
- [ ] Supply the founding year (`TETO_FOUNDED`).
- [ ] Supply the real mission statement used on the about page.
- [ ] Supply three portfolio projects: title, sector, one-line summary, problem, solution, **verified** result, technologies, and an approved image.
- [ ] Supply team names, roles, photos, and short bios (or confirm that the team section should be removed).

### Contact and company details

- [ ] Company email address (`TETO_EMAIL`).
- [ ] Phone number (`TETO_PHONE`).
- [ ] WhatsApp number in international format without `+` (`TETO_WHATSAPP`).
- [ ] Physical address (`TETO_ADDRESS`).
- [ ] Business hours (`TETO_HOURS`).
- [ ] Google Maps embed URL (`TETO_MAP_EMBED_URL`).
- [ ] Social links: LinkedIn, GitHub, X, Facebook, Instagram.
- [ ] Registered business name (`TETO_LEGAL_NAME`).
- [ ] Business registration number (`TETO_REG_NUMBER`).
- [ ] Data protection contact email for privacy requests.

### Email and infrastructure

- [ ] SMTP host, port, scheme, username, and password.
- [ ] `MAIL_FROM_ADDRESS` and `MAIL_FROM_NAME`.
- [ ] `MAIL_TO` inbox for contact-form notifications.
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
- [ ] Confirm whether any analytics, advertising, or other non-essential cookies will be added. The current site only uses an essential session cookie and therefore has no cookie banner. If you enable Turnstile or add analytics, review whether a cookie notice is required.

---

## Content policy

This repository intentionally does not contain invented clients, project results, statistics, testimonials, team members, addresses, phone numbers, or social profiles. Placeholder content is rendered with a visible `TODO(owner)` badge so it cannot be mistaken for real information. Replace placeholders with verified details before launch.

## Project structure

```text
app/
  Http/Controllers/       Page, contact, and sitemap controllers
  Http/Middleware/        Security headers and CSP
  Http/Requests/          Contact form validation
  Mail/                   Company notification and auto-reply
  Models/                 ContactMessage
  Services/               Turnstile verification
config/teto.php           Company details, services, portfolio, SEO defaults
resources/views/          Blade pages and components
resources/js/app.js       Lazy Alpine loader
resources/js/alpine.js    Contact form component
resources/css/app.css     Design tokens, dark mode, component classes
public/                   Compiled assets, fonts, images
docker/                   nginx, PHP, and entrypoint configuration
tests/Feature/            Page, contact, sitemap, and security tests
```

## Useful commands

```bash
php artisan route:list
php artisan view:clear
php artisan config:clear
php artisan test
vendor/bin/pint
npm run build
docker compose up --build -d
```
