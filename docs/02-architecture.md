# 02 — Technical Architecture

## Guiding principles

1. **Landing pages are the product.** Everything optimizes for page speed,
   conversion rate and iteration speed on pages.
2. **Config over code.** Verticals, cities, partners and routing rules are
   data, not hardcoded — this is what makes prestamo.com.py a config change,
   not a rewrite (doc 09).
3. **Leads are money.** The lead pipeline must never lose a lead: validate at
   the edge, persist first, deliver asynchronously with retries, audit
   everything.
4. **Small team ergonomics.** One TypeScript monorepo, one language
   everywhere, boring proven tools.

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSG/ISR gives static-file speed with CMS-like editing; best-in-class SEO control (metadata API, sitemaps, structured data) |
| Styling | Tailwind CSS + a small design system | Fast LP iteration, tiny CSS payload |
| Lead API | **Fastify** (separate service, `apps/api`) | Leads must not depend on frontend deploys; Fastify = fast, typed (TypeBox/Zod) |
| Database | **PostgreSQL** + Prisma | Relational fits leads/partners/routing; Prisma for velocity |
| Queue | **BullMQ on Redis** | Async partner delivery, retries with backoff, scheduled jobs |
| Content | **MDX / content-collections in-repo**, CMS later | Start git-based (free, versioned, fast); add Payload/Strapi when non-devs edit |
| Admin | **Next.js internal app** (`apps/admin`) or start with Retool | Partner CRUD, lead browser, routing rules, CPL reports |
| Email | Resend or Postmark | Lead delivery + autoresponders |
| WhatsApp | Meta WhatsApp Cloud API (or 360dialog) | Lead delivery to partners + user confirmations — critical in PY |
| Analytics | GA4 + **server-side GTM**, Plausible as sanity check | See doc 04 |
| Hosting | Vercel (web) + Railway/Fly.io (api, workers, Postgres, Redis) | Zero-ops start; South-America edge via Vercel CDN (GRU region closest to PY) |
| Error tracking | Sentry (web + api) | |
| CI | GitHub Actions: typecheck, lint, test, Lighthouse budget | Perf budget enforced in CI, not by hope |

**Why not a single Next.js app with API routes?** Acceptable for week 1, but
the lead engine wants long-running workers, retries and queue consumers —
awkward in serverless. Splitting API + workers out early avoids a painful
migration and keeps lead ingestion up even during frontend deploys.

## System diagram

```
                        ┌─────────────────────────────┐
   Google Ads ────────▶ │  apps/web (Next.js, Vercel)  │
   Organic/SEO ───────▶ │  SEO pages  +  /lp/* pages   │
                        └──────────────┬──────────────┘
                                       │ POST /v1/leads
                                       ▼
                        ┌─────────────────────────────┐
                        │  apps/api (Fastify)          │
                        │  validate → persist → enqueue│
                        └──────┬───────────────┬──────┘
                               │               │
                          PostgreSQL        Redis/BullMQ
                               │               │
                               │               ▼
                        ┌──────┴──────────────────────┐
                        │  apps/worker                 │
                        │  score → route → deliver     │
                        │  (webhook / email / WhatsApp)│
                        │  retries, dedup, audit log   │
                        └──────┬───────────────┬──────┘
                               │               │
                               ▼               ▼
                        Partner CRMs      Google Ads OCI
                        (webhook/email/    (offline conversion
                         WhatsApp/API)      import: lead quality)
```

## Monorepo layout

```
seguro/
├── apps/
│   ├── web/                  # Next.js — public site + landing pages
│   │   ├── app/
│   │   │   ├── (seo)/        # indexable pages: /, /seguro-de-auto/...
│   │   │   ├── (funnel)/     # quote funnel: /cotizar/[vertical]/...
│   │   │   └── lp/           # Ads landing pages (noindex)
│   │   └── content/          # MDX: guides, city pages, FAQs
│   ├── api/                  # Fastify — lead ingestion + partner API
│   ├── worker/               # BullMQ consumers — routing & delivery
│   └── admin/                # internal admin (phase 2; Retool before that)
├── packages/
│   ├── ui/                   # shared design system (LP blocks!)
│   ├── db/                   # Prisma schema + client
│   ├── config/               # vertical/city/partner config schemas
│   ├── tracking/             # GTM/GA4/dataLayer helpers, consent
│   └── shared/               # zod schemas shared web↔api (lead payloads)
├── docs/                     # this documentation
└── .github/workflows/
```

## Key design decisions

### Landing pages as data
A landing page = `(vertical, audience, offer, city?)` rendered through a
shared block library (Hero, TrustBar, QuoteForm, Comparison, FAQ,
Testimonials, PartnerLogos). New LP = one config/MDX file, no new React
code. This is what makes 100+ message-matched Ads pages maintainable.

### The quote funnel
Multi-step form (2–4 steps) beats a long single form on mobile:

1. Step 1 asks the *easy, engaging* question (e.g. car brand/year) — zero
   friction commitment.
2. Contact details (name, phone/WhatsApp) come **last**, after sunk cost.
3. State persisted in `sessionStorage`; **partial leads** are captured
   server-side on each step so an abandoned funnel still yields a
   remarketable contact when the phone was entered.
4. Submit → `POST /v1/leads` → instant "Listo ✅" + WhatsApp confirmation.

### Reliability rules for leads
- API persists the lead **before** any external call; delivery is async.
- If Postgres is down, API falls back to writing the payload to Redis, and a
  reconciler drains it (leads survive DB incidents).
- Every delivery attempt is logged (`LeadDelivery` rows) — disputes with
  partners are settled with data.

### Environments & config
- `dev` / `production`; preview deploys per PR on Vercel.
- All secrets in platform env vars; `.env.example` kept current.
- Site config (verticals, cities, partners) validated with Zod at build time
  — a typo in config fails the build, not production.

## Performance budget (CI-enforced)

Enforced via Lighthouse CI (`apps/web/lighthouserc.cjs`, run in
`.github/workflows/ci.yml`) against a production build on every PR.

| Metric | Budget | CI severity |
|--------|--------|--------------|
| LCP (mobile, 4G) | < 2.0 s | error (build fails) |
| CLS | < 0.05 | error (build fails) |
| Lighthouse SEO (indexable pages) | ≥ 95 | error (build fails) |
| Lighthouse Performance | ≥ 90 | error (build fails) |
| JS shipped per page | < 90 kB gz | **warn only for now** — current shared bundle is ~110 kB. Tighten to error once trimmed (candidates: code-split the funnel's radio/select inputs, audit Tailwind's generated CSS size). |

Fast pages are a *ranking factor*, a *Quality Score factor* (cheaper clicks)
and a *conversion factor* — this budget is a business rule, not vanity.
