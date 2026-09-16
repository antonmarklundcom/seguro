# PLAN.md — seguro.com.py Build Plan (v3)

> **Authored by Fable 5** (planning/architecture model) for handoff to
> **Sonnet** implementation sessions.
> Date: 2026-09-16 · Status: active · Supersedes PLAN.md v2 (2026-08-21).
> **Stack change from v2:** the Next.js 15 + TypeScript + Drizzle/MySQL app
> on Hostinger's managed Node.js hosting is **rejected**. This site ships as
> **static HTML + PHP** from the `antonmarklundcom/php-site-template` on
> Hostinger **shared** hosting (PHP 8.2), the same pattern as the owner's
> other local-business lead-gen sites. No database, no build step, no
> Node process to keep alive.
> `docs/01, 03 (structure), 04, 05 (business rules), 06, 07, 09, 10` remain
> the business/legal/SEO *end-state* reference; `docs/02` has been rewritten
> in place for this stack; **this file is the build order.**

---

## 1. The three questions this plan answers

1. **One system or landing + VenderCRM?** → **Static site + VenderCRM.**
   No custom Node lead engine, no custom admin, no partner-routing worker
   until a partner is actually paying (unchanged principle from v2 — just
   built without a database). The site is static HTML/PHP pages generated
   from `content/<type>.php` data files, plus one PHP form handler
   (`enviar.php`, from the template) that posts leads to VenderCRM. The
   Phase 3 "partner engine" idea from v2 (routing worker, partner portal) is
   **out of scope for this repo** — see §7 Migration notes. If that is ever
   built, it is a **separate app**, not a template-repo feature.
2. **What is legal in Paraguay without a broker license?** → Unchanged from
   v2: operate as a **marketing/lead-referral company, never an
   intermediary**: no advising, no recommending a specific insurer, no
   quoting premiums as if binding, no participating in the sale. Full
   framework, copy rules and lawyer checklist: **`docs/10-legal-compliance-paraguay.md`**.
   Legal items marked ⚖️ below are launch blockers. Nothing in §3 changes
   the legal analysis — this is a hosting/stack decision, not a business-model
   change.
3. **What does the owner do around the code?** → Every phase lists
   **off-repo owner work** (legal, accounts, partners). PRs never wait on
   each other across tracks unless marked as a gate.

## 2. Locked architecture decisions (2026-09-16)

These **replace** v2 decisions A–D. Decisions E–G from v2 are unchanged and
repeated here for completeness.

| # | Decision | Rationale |
|---|----------|-----------|
| A | **Static HTML + PHP from `antonmarklundcom/php-site-template`**, cloned as its own repo (`seguro-com-py` or similar) — no Next.js, no TypeScript, no monorepo | Matches every other local-business site the owner runs; zero build pipeline, zero framework upgrade risk, trivial hosting |
| B | **Hosting: Hostinger shared hosting, PHP 8.2** — not managed Node.js, no MySQL/Postgres database | The template needs no database; content lives as PHP data files in git. Simpler ops, cheaper hosting slot, one less moving part to keep patched |
| C | **VenderCRM is the CRM of record at launch**, unchanged from v2. Form → the template's `enviar.php` handler → `POST {CRM_URL}/api/v1/leads` with per-site API key (server-side only, `getenv()`), idempotency key, honeypot, attribution via `vc-attribution.js` cookie | Same reasoning as v2 — contacts, dedup, pipeline, per-site lead counts and UTM attribution exist today for free |
| D | **Persist-first mirror = an append-only JSON-Lines log file** (e.g. `storage/leads/leads.ndjson`, one JSON object per line, outside the web root or `.htaccess`-denied), written **before** the VenderCRM POST. No MySQL, no Postgres. | Zero-lead-loss rule from docs/05/06 survives the stack change without a database: a flat append-only file on local disk is enough durability for a single-server brochure site, and it is trivially greppable/exportable for a monthly reconciliation pass. If volume or the Phase-3 partner engine ever demands relational queries, this file is a append-only intake log a real DB can be seeded from later — it is not a UI or a report replacement |
| E | **Founder-worked leads first.** Owner works the VenderCRM pipeline and forwards leads to brokers by WhatsApp manually while recruiting partners. Partner routing/delivery/billing (docs/05 business logic) waits for the **first signed partner** | Unchanged from v2 |
| F | **es-PY voseo copy shipped AI-drafted**, ₲ prices, honest promises ("cotizaciones en 24 h", never fake instant comparison), and a **standing marketing-service disclosure** on every page footer and consent text | Unchanged from v2 (docs/10) |
| G | **prestamo.com.py stays out of scope** for this repo; the multi-vertical relationship is a **second template-repo clone**, not a shared config module (see docs/09 amendment) | Matches how the owner already runs multiple market sites from one template, and removes the "typed TS vertical config" idea entirely |

Data flow at launch:

```
visitor → static page / /lp/ page → JS multi-step funnel (vanilla JS)
            → POST enviar.php (own server, same host)
              1. append lead to storage/leads/leads.ndjson  (persist-first)
              2. POST VenderCRM /api/v1/leads (idempotency key, X-Api-Key, 10s timeout)
              3. redirect thank-you (always — CRM failure only logs + email fallback)
   owner works pipeline in VenderCRM → forwards to brokers via WhatsApp
```

## 3. Model tiering — who does what

This is a **static brochure-style site**: no framework internals, no
database schema, no queue system. Every PR below is sized for **Sonnet**.
There is no PR here that needs Opus-tier reasoning — the hardest piece
(lead capture → VenderCRM with persist-first) is a documented pattern
(`vendercrm-lead-capture` skill) applied inside a template that already has
a working reference implementation.

| Model | Use for |
|-------|---------|
| **Fable 5** | Phase-gate reviews, scope changes, revising this plan, anything that changes a locked decision or the legal posture |
| **Sonnet** | Everything else: T0 adopt, all pages, lead capture wiring, funnels, `/lp/` pages, SEO/schema, content |

Rule: "make X exist per this spec" → Sonnet. "decide what X is" → Fable.
Every implementation session must read this file, `docs/10`, and the
relevant `docs/0x` before writing code, plus the `php-site-template` and
`vendercrm-lead-capture` skills.

## 4. PR roadmap (php-site-template pattern)

Each PR is one implementation session on a `claude/…` branch, reviewed and
merged by the owner. **Gate** = merge criteria. All PRs are Sonnet unless
noted. This follows the `phased-autonomous-build` Template profile: no
foundation-scaffolding phase, because the template already renders green on
clone.

### T0 — Adopt

| PR | Scope | Gate |
|----|-------|------|
| **T0 Adopt template** | Use `antonmarklundcom/php-site-template` as a GitHub template → new repo; run the README's ~20-step adopt checklist: site identity, `paraguay` market module wired (already exists in the template — money formatting, tax-id validation, `market_table()`), env vars incl. `VENDERCRM_API_KEY` and `VENDERCRM_URL`, `.htaccess`/router sanity, `verify.sh` green on a fresh clone and on the `deploy/make-zip.sh` output | `./verify.sh` green; placeholder home page live on a Hostinger staging subdomain |

### T1 — Home + core pages

| PR | Scope | Gate |
|----|-------|------|
| **T1 Home + core pages** | `content/page.php` / `content/service.php` records + route files for: home (`/`), `/seguro-de-auto/` pillar, `/sobre-nosotros/`, `/contacto/`, `/socios/` (broker-recruiting pitch); design tokens applied (`assets/css/site.css` `:root` block — locked file, edit only with owner sign-off); footer legal disclosure from docs/10 §3 wired into `partials/footer.php` | `./verify.sh` green; Lighthouse (manual or CI, per template's screenshot CI) shows fast static pages; footer disclosure renders on every page |

### T2 — Content lane (parallel, fan-out friendly)

These four PRs touch disjoint `content/` files and can run as parallel
Sonnet sessions once T1 merges (same pattern as N-service-page fan-outs in
other template sites).

| PR | Scope | Gate |
|----|-------|------|
| **T2a Subtype + moto pages** | `/seguro-de-auto/contra-terceros/`, `/seguro-de-auto/todo-riesgo/`, `/seguro-de-moto/` pillar (per docs/03) | `verify.sh` green; no dangling slugs |
| **T2b Guías** | 6–8 `guide` template pages per docs/03's content plan (2/week cadence target once live) | Each guía links to its funnel; `content/lead-values.php` records complete |
| **T2c `/lp/` ad landing pages** | 4 initial `/lp/[slug]` pages per docs/04 (config-object style: one CTA, no nav) with `noindex,follow` meta and vanilla-JS `utm_term` dynamic text insertion (safe fallback to default headline if no param) | Confirmed `noindex` in rendered HTML; each LP posts leads with its own `source`/UTM visible in VenderCRM Sitios |
| **T2d Legal & trust pages** ⚖️ | `/privacidad`, `/terminos` drafted from `docs/10` templates; consent checkbox (unticked) with versioned text naming data sharing with insurers/brokers; ARCO/data-subject-request contact | **Merges only after ⚖️L1 (lawyer review) below** — code can be written and reviewed, but do not deploy live until sign-off |

### T3 — Lead capture wiring + persist-first mirror

| PR | Scope | Gate |
|----|-------|------|
| **T3 Lead capture** | Wire every form (home hero, pillar pages, guías, funnel, all `/lp/` pages) to the template's `enviar.php` pattern: `phone` + `idempotency_key` (`sha256(phone|YYYY-MM-DD-HH)`) required, honeypot field, 10s timeout + try/catch around the VenderCRM POST (never block the visitor — always show thank-you), email/log fallback on CRM failure. **Add the persist-first mirror**: append the full lead payload (contact, page/vertical, UTMs, gclid/fbclid from the `vc_attr` cookie, consent timestamp + text version) as one JSON line to `storage/leads/leads.ndjson` **before** the VenderCRM call. Multi-step funnel (`/cotizar/seguro-de-auto/`) in vanilla JS: easy question first, contact last, `sessionStorage` state, partial-lead capture to the same mirror once phone is entered. `vc-attribution.js` included on every page | Real phone submit → contact in VenderCRM (normalized `+595…`), row appended to `leads.ndjson` with attribution; double-submit creates no duplicate contact; kill the CRM URL in a test → lead still lands in `leads.ndjson` and visitor still sees the thank-you page |

### T4 — SEO / schema / sitemap polish

| PR | Scope | Gate |
|----|-------|------|
| **T4 SEO polish** | Per-page `<title>`/meta description templates per vertical (data-driven from `content/*.php`, never hardcoded per page); JSON-LD (`Organization`, `WebSite`, `FAQPage` on pillars, `BreadcrumbList`); static `sitemap.xml` (segmented if the template's router supports it) + `robots.txt` disallowing `/lp/` and funnel step URLs; static, pre-made OG image per template type (see §7 — no generated-OG-image pipeline) | `verify.sh` green; sitemap validates; `/lp/*` and funnel steps confirmed excluded from robots/sitemap; copy checked against docs/10 §3 prohibited-phrases list |

### Launch

| PR | Scope | Gate |
|----|-------|------|
| **T5 Launch hardening** | Fix what a first batch of real traffic exposes; simple A/B test on the top `/lp/` page using a server-set cookie bucket in PHP (no edge middleware, no framework); WhatsApp follow-up message template; weekly `leads.ndjson`-vs-VenderCRM reconciliation check (manual script or cron) | 4 consecutive weeks zero lead loss in reconciliation; CVR ≥ 8 % on best LP |

### Not in this repo (see §7)

The v2 "Phase 3 partner engine" (routing worker, partner portal, per-partner
API keys, automated billing) stays a **future, separate app** if a partner
volume ever justifies it. It is not a php-site-template feature and is not
scheduled here.

## 5. Off-repo owner work (parallel tracks)

Unchanged from v2 — none of this depends on the tech stack.

### ⚖️ Legal track (details + checklists in `docs/10`)

| # | Item | Blocks |
|---|------|--------|
| **L1** | Local lawyer engagement (Asunción, insurance + data-protection practice): confirm the marketing-partner model against Ley de Seguros 827/96 licensing; review consent text, privacy policy, footer disclosure, and the prohibited-phrases list | T2d merge (live), launch |
| **L2** | Entity + tax: incorporate an **EAS** via eas.mic.gov.py, RUC, **SIFEN e-invoicing from day one** for lead fees + IVA 10% | first invoice (if/when a partner engine ever exists), but start now — takes weeks |
| **L3** | Data-protection compliance setup per Paraguay's data-protection law: consent + purpose registry, data-transfer terms with lead buyers (DPA), retention policy, ARCO request procedure | launch |
| **L4** | Contract templates: lead purchase agreement with brokers (per-lead CPL pricing), duplicate/invalid crediting policy | first signed partner |

### Tech/accounts track

| # | Item | Blocks |
|---|------|--------|
| T1 | VenderCRM: create site under **Sitios**, get API key, set default pipeline stage; pipeline stages Nuevo → Contactado → Cotizado → Negociando → Ganado/Perdido | T3 verification |
| T2 | Hostinger: pick account/slot on **shared** hosting, subdomain for staging (no database needed) | T0 |
| T3 | DNS `seguro.com.py` → Hostinger | launch |
| T4 | Google Ads account + billing; budget commitment US$ 500–1,000/mo (SEO alone takes 6–12 months, docs/06 #10) | first campaign after T2c/T4 |
| T5 | WhatsApp Business app on the founder number now | — |
| T6 | Search Console verification + sitemap submission | after T2/T4 |

### Real keyword research (do this before locking the page list)

The keyword clusters in `docs/03-site-structure-seo.md` are **example seed
terms**, not a Google Keyword Planner export. Run a real KWP pass (the
`google-kwp-batches` process) for es-PY insurance terms before finalizing
which pillar/subtype/guía pages ship in T1/T2 — see the callout added to
`docs/03`.

### Partner track

| # | Item |
|---|------|
| P1 | Broker outreach list (Asunción/CDE/Encarnación independents) — `/socios/` page from T1 is the pitch asset; founder-inbox mode means launch does **not** wait on this |
| P2 | First signed partner (L4 contract) → triggers a future partner-engine decision (separate app, see §7) |

## 6. Standing rules for implementation sessions

- Read `PLAN.md` + `docs/10` before coding; load `php-site-template` and
  `vendercrm-lead-capture` skills for any PR touching content or leads.
- Content is data: every page is a record in `content/<type>.php` plus a
  route file. Never hardcode copy in a template or partial.
- **Never lose a lead**: the `leads.ndjson` append precedes the VenderCRM
  POST; any change to the lead path ships with a zero-loss test (kill the
  CRM URL, confirm the lead still lands in the mirror file and the visitor
  still sees the thank-you page).
- VenderCRM API key server-side only (`getenv()`), never in HTML/JS; never
  send pipeline/stage/owner from code (routing lives in the CRM's Sitios
  config).
- All user-facing copy: es-PY voseo, ₲ prices, `dd/mm/yyyy`,
  `America/Asuncion`, honest promises; **never** use advice/recommendation
  language — check every page against the docs/10 prohibited-phrases list.
- `/lp/*` and funnel steps ≥ 2 stay `noindex` from the first deploy.
- Money formatting, date formatting and tax-id validation go through the
  template's `paraguay` market module (`fmt_money()`, `market_table()`,
  `window.Market`) — never a bespoke per-site helper.
- `./verify.sh` green (repo + unzipped `deploy/make-zip.sh` output) is the
  gate before every PR, not a suggestion.
- Business-scope or legal-posture changes go back to Fable 5 + owner.

## 7. Migration notes: what doesn't carry over from the Next.js plan

The v2 plan assumed a Next.js 15 + TypeScript + Drizzle/MySQL app. These
concepts do not translate to the static HTML + PHP stack; here is the
simplest equivalent for each.

| Next.js-plan concept | Why it doesn't translate | PHP-stack equivalent |
|---|---|---|
| **SSG/ISR** (`revalidate`, on-demand regeneration for "live" price/partner data) | There is no build step and no server-rendering runtime to revalidate | Pages are already static HTML on disk. When copy or a reference number changes, edit the `content/*.php` record and redeploy (Hostinger's git-push/webhook build). For genuinely time-sensitive figures ("consulte el monto vigente"), don't fake freshness — say so in copy, per docs/10's no-overpromise rule |
| **`@vercel/og` generated OG images per page** | No Node image-generation pipeline exists in this stack | Design a small set of **static, pre-made OG images** per template type (home, pillar, guía, `/lp/`) once, store under `assets/img/og/`, reference by template in `content/*.php`. Skip a PHP/GD generator unless a specific page truly needs a dynamic number baked into the image — usually it doesn't |
| **Admin app / partner portal** (v2 Phase 3 `apps/admin`, magic-link partner outcomes, per-partner API keys) | This is a stateful, authenticated multi-user app — not a brochure-site feature | **Out of scope for this repo.** If/when a paying partner needs a portal, build it as a **separate Next.js/Node app** (per `nodejs-mysql-hostinger-stack`) that reads the same VenderCRM pipeline data, or simply keep using VenderCRM's own UI + WhatsApp/email for outcome tracking |
| **TypeScript vertical config modules** (`packages/config`, Zod-validated `Vertical`/`PartnerVertical`) | No TypeScript, no shared package graph in this stack | Verticals are folders of `content/*.php` records (one per page) plus the market module. A new vertical (e.g. `seguro-de-moto`) is new content records reusing the same templates — no config schema to design or migrate |
| **Drizzle/MySQL `leads` mirror table**, Prisma `Lead`/`Partner`/`PartnerVertical`/`LeadDelivery` schema (docs/05) | No database in this stack | Persist-first mirror is the append-only `storage/leads/leads.ndjson` file (decision D above). It captures the same fields docs/05 lists (contact, payload, attribution, consent) as one JSON object per line. If a partner-routing engine is ever built, it becomes a **separate app with its own database**, seeded/imported from this log rather than sharing a live DB with the brochure site |
| **BullMQ/Redis worker, retries/DLQ for partner delivery** | There is no partner-routing/delivery system in this repo (decision E: founder-forwards-manually) | Not needed. The CRM POST inside `enviar.php` already retries nothing — it is a single best-effort call with a 10s timeout, because the mirror file is the source of truth for "was this lead captured", not the CRM call |
| **GA4 + server-side GTM on a first-party subdomain, Offline Conversion Import worker** (docs/04) | Server-side GTM assumes a Node/container runtime; OCI push assumed a worker | Client-side GA4 + `vc-attribution.js` (already CRM-provided) covers attribution capture. OCI/value-based bidding stays a **future, manual or scripted** step (a small cron script reading `leads.ndjson` + VenderCRM outcome exports could push OCI later) — not blocking launch |
| **Vercel Edge Middleware A/B bucketing** (doc 04) | No edge runtime in this stack | A/B bucket via a PHP-set cookie on first visit, read server-side to pick the LP variant; GA4 custom dimension carries the bucket, same as v2's intent |

None of the above changes the **business, legal, SEO or lead-schema
decisions** in docs/01, 03–07, 09, 10 — only how they are implemented.
