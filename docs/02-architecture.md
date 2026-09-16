# 02 — Technical Architecture

> **Rewritten 2026-09-16** for the static HTML + PHP stack decision in
> `PLAN.md` v3. This replaces the earlier Next.js/Fastify/Postgres/BullMQ
> monorepo design in full — that design is superseded, not merely amended.
> If you are looking for *why* this changed, or what doesn't translate from
> the old plan, see `PLAN.md` §7 "Migration notes".

## Guiding principles

1. **Landing pages are the product.** Everything optimizes for page speed,
   conversion rate and iteration speed on pages — a static file served
   directly by Apache/PHP-FPM is about as fast as this gets.
2. **Content is data, not code.** Verticals, cities and pages are records in
   `content/<type>.php` files rendered through shared templates — this is
   what makes a new page (or a whole new vertical) a content change, not a
   code change, and it is what makes `prestamo.com.py` a second template-repo
   clone rather than a rewrite (doc 09).
3. **Leads are money.** The lead-capture path must never lose a lead:
   validate on submit, **persist to a local file before** calling out to
   VenderCRM, never block the visitor on that external call.
4. **Small-team ergonomics.** One repo, no build step, no framework version
   to track, boring proven tools (PHP 8.2, vanilla JS, plain CSS/HTML).

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Site | **Static HTML pages + PHP includes**, from `antonmarklundcom/php-site-template` | No SSG/build pipeline, no framework upgrades; every other local-business site the owner runs is built this way |
| Templates | 7 templates (`service`, `article`, `tool`, `guide`, `segment`, `page`, `stub`) + partials (`header`, `footer`, etc.) provided by the template | Consistent structure across all pages without a component framework |
| Content | `content/<type>.php` — one PHP array/record per page, plus a 3-line route file per page | Content lives in git, is diffable and reviewable in PRs, with no CMS to run |
| Market data | `lib/market/paraguay.php` + `assets/js/market/paraguay.js` (already exists in the template) — money formatting, tax-id validation, reference tables via `market_table()` | Money/date/tax-id handling is shared and tested once, not re-implemented per site |
| Lead capture | `enviar.php` (template's form handler) → `POST {CRM_URL}/api/v1/leads` | See "Lead capture" below — this is the one piece of real server logic in the whole site |
| Lead persistence | **Append-only JSON-Lines file** (`storage/leads/leads.ndjson`, outside the web root or `.htaccess`-denied) | Persist-first durability without standing up a database for a brochure site |
| Funnels / `/lp/` dynamic text | **Vanilla JavaScript**, no framework | Multi-step quote funnel and ad-landing-page keyword insertion are small, well-scoped scripts — a framework buys nothing here |
| Hosting | **Hostinger shared hosting, PHP 8.2** | No managed Node.js process, no MySQL database to provision or back up; cheaper slot, fewer moving parts |
| CRM | **VenderCRM** (`POST /api/v1/leads`) | Contacts, dedup, pipeline stages, per-site lead counts, UTM attribution — see `docs/05` |
| Analytics | GA4 (client-side) + the CRM-provided `vc-attribution.js` for first-touch UTM/gclid/fbclid capture | No server-side GTM container needed; see `PLAN.md` §7 for the OCI/value-based-bidding deferral |
| CI / build gate | The template's `verify.sh` (structure, dangling-slug and market-module checks) + its CI screenshot workflow | Runs on every PR without a Node build |

**Why not the Next.js/Postgres/BullMQ design from v2?** That design assumed
a partner-routing engine (queue workers, retries, a relational `Lead`/
`Partner`/`LeadDelivery` schema) would exist from week one. At launch there
is no partner engine — the owner forwards leads to brokers manually
(decision E in `PLAN.md`) — so a database, a queue and a framework build
step would all sit unused. If a partner-routing engine is ever justified by
real volume, it is built as its own app (see `PLAN.md` §7), not retrofitted
into this brochure site.

## System diagram

```
                        ┌───────────────────────────────────┐
   Google Ads ────────▶ │  Static HTML + PHP (Hostinger,     │
   Organic/SEO ───────▶ │  shared hosting)                   │
                        │  content/*.php → templates/*.php   │
                        │  /lp/* pages (noindex,follow)       │
                        └──────────────┬──────────────────────┘
                                       │ POST enviar.php (same host, own server)
                                       ▼
                        ┌───────────────────────────────────┐
                        │  enviar.php                        │
                        │  1. validate (phone required,      │
                        │     honeypot check)                │
                        │  2. append to storage/leads/        │
                        │     leads.ndjson  (persist-first)  │
                        │  3. POST VenderCRM /api/v1/leads   │
                        │     (idempotency key, X-Api-Key,   │
                        │     10s timeout, try/catch)        │
                        │  4. redirect → thank-you page      │
                        │     (always, even on CRM failure)  │
                        └──────────────┬──────────────────────┘
                                       │ 201 / 200 (or logged failure + email fallback)
                                       ▼
                                  VenderCRM
                          (contacts, pipeline, Sitios)
                                       │
                                       ▼
                    Owner works pipeline → forwards to brokers via WhatsApp
```

There is no separate API service, no worker process and no message queue.
`enviar.php` runs synchronously inside the same PHP-FPM request that served
the form; the whole round trip is designed to finish inside the visitor's
page-load patience even when VenderCRM is slow or unreachable, because the
mirror write happens first and the CRM call is bounded to ~10 seconds.

## Repository layout (from the template)

```
seguro-com-py/
├── content/                  # data: one record per page, per type
│   ├── page.php
│   ├── service.php
│   ├── article.php
│   ├── guide.php
│   ├── segment.php
│   ├── tool.php
│   └── lead-values.php       # tier / WhatsApp prefill / CRM tag per service or tool
├── templates/                # service, article, tool, guide, segment, page, stub
├── partials/                 # header, footer, etc. (locked — edit only with sign-off)
├── lib/
│   └── market/paraguay.php   # money/date/tax-id + market_table()
├── assets/
│   ├── css/site.css          # :root tokens block is locked
│   └── js/
│       ├── market/paraguay.js
│       ├── funnel.js         # multi-step quote funnel (vanilla JS, new for this site)
│       └── lp-dynamic-text.js # /lp/ keyword insertion (vanilla JS, new for this site)
├── storage/
│   └── leads/leads.ndjson    # persist-first lead mirror, append-only, not web-served
├── enviar.php                 # lead handler → VenderCRM (locked structure, extend, don't rewrite)
├── router.php / .htaccess
├── sitemap.xml / robots.txt
├── verify.sh                  # build gate
└── deploy/make-zip.sh
```

## Key design decisions

### Pages as data
A page is a record in `content/<type>.php` (title, meta, body blocks,
`lead-values` reference where relevant) rendered through one of the seven
shared templates. A new pillar, subtype or guía page is a new content record
plus a three-line route file — never new copy hand-written into a template
or partial. This is what makes 15–20 launch pages (docs/03) tractable for
Sonnet sessions working in parallel, one content file per session.

### The quote funnel
Multi-step form (2–4 steps) beats a long single form on mobile, implemented
as plain HTML steps + a small vanilla-JS controller (`assets/js/funnel.js`):

1. Step 1 asks the *easy, engaging* question (e.g. car brand/year) — zero
   friction commitment.
2. Contact details (name, phone/WhatsApp) come **last**, after sunk cost.
3. State persisted in `sessionStorage` between steps.
4. **Partial leads**: once a phone number is entered, that step's submit
   also appends a partial record to `leads.ndjson` (marked `status:
   "partial"`) — so an abandoned funnel still yields a remarketable contact.
5. Final submit → `enviar.php` → "¡Listo! ✅" thank-you page.

### `/lp/` ad landing pages
Each `/lp/[slug]` page is a `content/page.php` (or a dedicated `lp` record)
with no header nav and one CTA, marked `noindex,follow`. A small vanilla-JS
snippet (`lp-dynamic-text.js`) reads `utm_term`/ValueTrack params from the
URL and swaps the headline placeholder for the matched keyword, with a safe
default headline if no param is present or matched — no server templating
needed for this, it runs entirely client-side after the static page loads.

### Lead capture (the one piece of real logic)
`enviar.php`, extended from the template's reference implementation per the
`vendercrm-lead-capture` skill:

1. Reject the honeypot field silently (redirect to thank-you, post nothing).
2. Validate `phone` (required) and normalize the format the CRM accepts.
3. Build `idempotency_key = sha256(phone + "|" + date("Y-m-d-H"))`.
4. **Append the full lead as one JSON line to `storage/leads/leads.ndjson`
   first** — this file, not the CRM response, is what makes "was this lead
   captured" true. Include: contact fields, vertical/page slug, payload
   (funnel answers), UTM/gclid/fbclid from the `vc_attr` cookie, consent
   timestamp + `consent_text_version`.
5. `POST {CRM_URL}/api/v1/leads` with `X-Api-Key` (from `getenv()`), the
   idempotency key, and the same attribution — wrapped in try/catch with a
   ~10s timeout. A failure here **only** logs and (per the template's
   existing pattern) sends an email fallback; it never blocks step 6.
6. Redirect to the thank-you page — always, regardless of step 5's outcome.

### Reliability rule for leads
Because there is no database, "persist-first" means: the `leads.ndjson`
append (step 4 above) happens **before** the network call to VenderCRM
(step 5), and step 5's failure is caught and swallowed from the visitor's
perspective. A kill-the-CRM-URL test must always show the lead still
present in `leads.ndjson` and the visitor still reaching the thank-you page.
A weekly manual or cron-scheduled reconciliation compares `leads.ndjson`
row counts against VenderCRM's Sitios lead count for the same period.

### Environments & config
- One environment per Hostinger hosting slot (staging subdomain, then
  `seguro.com.py`); deploy via git push / Hostinger's build webhook, per
  the template's deploy pipeline.
- Secrets (`VENDERCRM_API_KEY`, `VENDERCRM_URL`) as PHP-FPM/Hostinger env
  vars, never committed; `.env.example` kept current.
- No build-time config validation step (no Next.js, no Zod) — `verify.sh`
  is the equivalent gate: it checks for dangling content slugs, missing
  `lead-values.php` records and market-module wiring before every PR merges.

## Performance

Because pages are static HTML with no client-side framework to hydrate,
there is no JS-bundle budget to enforce the way a Next.js app needs one —
the vanilla-JS funnel and `/lp/` scripts are each a few KB. The practical
performance bar is simply: keep images optimized (per the `webimg-pipeline`
/ `higgsfield-web-imagery` skills), avoid render-blocking third-party
scripts above the fold, and let `verify.sh` + the template's CI screenshot
workflow catch regressions. There is no CI-enforced Lighthouse gate baked
into the template today; add one only if a specific page proves slow in
practice — don't build performance tooling speculatively for a static site
that is fast by construction.
