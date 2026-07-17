# seguro.com.py — Insurance Lead Generation Platform for Paraguay

Comparison & lead-generation site for insurance in Paraguay (Spanish, es-PY).
Model inspired by Swedish comparison sites (Insplanet, Compricer, Zmarta):
high-converting landing pages → qualified leads → routed to the right insurance
partner → paid per lead (CPL) or per closed policy.

**Domain:** seguro.com.py
**Audience:** Paraguayan consumers and small businesses
**Language:** Spanish (es-PY), mobile-first, WhatsApp-centric

## Documentation

| Doc | Contents |
|-----|----------|
| [01 — Vision & Market](docs/01-vision-and-market.md) | Business model, Paraguay market, verticals, partners |
| [02 — Architecture](docs/02-architecture.md) | Tech stack, system design, repo layout, infra |
| [03 — Site Structure & SEO](docs/03-site-structure-seo.md) | URL architecture, content plan, technical SEO |
| [04 — Google Ads & Landing Pages](docs/04-google-ads-landing-pages.md) | Campaign structure, LP system, tracking, conversion feedback |
| [05 — Lead Engine](docs/05-lead-engine.md) | Data model, validation, scoring, routing, partner delivery |
| [06 — Risks & Problems](docs/06-risks-and-problems.md) | Regulatory, market, technical and business risks |
| [07 — Opportunities](docs/07-opportunities.md) | Growth levers beyond the base plan |
| [08 — Roadmap](docs/08-roadmap.md) | Phased delivery plan with milestones |
| [09 — Multi-Vertical Platform](docs/09-multi-vertical-prestamo.md) | Reusing the platform for prestamo.com.py and other verticals |

## Project status

This repo is a **working, tested codebase** — not a live site yet. Everything
below is real and passes `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
across all 10 packages.

**Built:**
- Full lead pipeline: funnel → API (validate/dedupe) → worker (score/route/deliver
  via webhook, with Resend email and console-log stubs for WhatsApp/Sheets)
- 3 verticals live end to end (seguro-de-auto, seguro-de-moto, seguro-medico),
  each with a pillar page, funnel, and Ads landing pages
- 2 subtype pages (contra-terceros, todo-riesgo), 2 guía articles, an
  aseguradoras hub, legal/static pages, sitemap/robots
- GTM/GA4 tracking scaffold with Consent Mode v2
- Internal admin app (lead browser, partner CRUD, routing rules, manual redeliver)
- 40 unit tests, CI (typecheck/lint/test/build), Dockerfiles, Vercel configs

**Deliberately not built yet** (each needs something only a human can provide):
- **Legal review** of the consent/privacy copy and the broker-licensing
  question — `/privacidad` and `/terminos` are explicitly marked as drafts
  pending a Paraguayan lawyer (docs/06)
- **Real partner data** — the `/aseguradoras` brand pages use generic
  placeholder text on purpose (see the comment in
  `apps/web/lib/aseguradoras.ts`) rather than fabricated facts about real
  companies; real copy needs to come from each partner or their public
  materials
- **Geo pages and vehicle-model pages** (docs/03) — skipped for the same
  reason: they'd need real local stats or real price data to avoid being
  thin/doorway pages, which docs/06 explicitly flags as a Google policy risk
- **Live accounts**: Google Ads, GTM/GA4, WhatsApp Cloud API, Resend, hosting
  — the code paths exist and degrade safely without credentials (see
  `RESEND_API_KEY` handling in `apps/worker/src/lib/email.ts`), but nothing
  is actually connected
- **Real branding** — generic Tailwind blue, no logo/visual identity yet
- **E2E test suite** — verified manually with headless Chromium during
  development, not committed as an automated Playwright suite
- Partner API, OCI/Enhanced Conversions push, A/B testing, renewal nurture
  (all explicitly phase 2+ in docs/08)

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 10 (`corepack enable` will pick up the pinned version automatically)
- PostgreSQL 16 and Redis 7 — either via `docker compose up -d` or installed
  locally

### Setup

```bash
pnpm install

# Copy env files (repeat for apps/api, apps/worker, apps/admin)
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env
cp apps/admin/.env.example apps/admin/.env
# apps/admin also needs ADMIN_PASSWORD and ADMIN_SESSION_SECRET set to real values

docker compose up -d          # postgres + redis, or start your own
pnpm db:generate               # generates the Prisma client
pnpm db:migrate                # creates the schema
pnpm db:seed                   # seeds verticals + an example partner

pnpm dev                       # runs all apps in parallel via turbo
```

- `apps/web` → http://localhost:3000
- `apps/api` → http://localhost:4000
- `apps/admin` → http://localhost:3001 (login with the `ADMIN_PASSWORD` you set)
- `apps/worker` has no HTTP port — it just logs as it processes jobs

### Common scripts (run from the repo root)

| Command | What it does |
|---|---|
| `pnpm dev` | Run every app in dev mode |
| `pnpm build` | Build every app/package (Turborepo-cached) |
| `pnpm typecheck` | `tsc --noEmit` across the workspace |
| `pnpm lint` | ESLint across the workspace |
| `pnpm test` | Vitest unit tests (shared/config/worker) |
| `pnpm db:generate` | Regenerate the Prisma client |
| `pnpm db:migrate` | Create/apply a migration |
| `pnpm db:seed` | Seed verticals + an example partner |

## Repo structure

```
apps/
  web/      Next.js — public site, funnel, Ads landing pages
  api/      Fastify — lead ingestion (POST /v1/leads)
  worker/   BullMQ — score → route → deliver
  admin/    Next.js — internal admin (password-protected)
packages/
  db/         Prisma schema + client
  shared/     Zod lead/attribution schemas, phone validation
  config/     Verticals and sites as data
  ui/         Landing-page block library
  tracking/   GTM/GA4 + consent
```

## Deployment

- `apps/web/vercel.json` and `apps/admin/vercel.json` — deploy each as its
  own Vercel Project with **Root Directory** set to `apps/web` /
  `apps/admin`
- `apps/api/Dockerfile` and `apps/worker/Dockerfile` — build from the repo
  root (`docker build -f apps/api/Dockerfile .`), deployable to Railway,
  Fly.io, or any container host
- None of this is connected to a real domain, hosting account, or Google Ads
  account yet — see "Project status" above

## TL;DR of the plan

1. **Next.js (App Router) + TypeScript** front end: statically generated,
   fast, SEO-perfect landing pages in Spanish.
2. **Fastify lead API + PostgreSQL + BullMQ (Redis)** back end: validates,
   scores, dedupes and routes leads to partners via webhook / email / WhatsApp,
   with retries and full audit trail.
3. **Two page systems:** indexable SEO pages (`/seguro-de-auto/…`) and
   noindexed, message-matched Ads landing pages (`/lp/…`) generated from the
   same component library.
4. **Closed-loop tracking:** server-side GTM + Enhanced Conversions for Leads
   feed lead *quality* (not just volume) back into Google Ads bidding.
5. **Platform, not site:** everything is config-driven per vertical so the
   same codebase powers prestamo.com.py and future domains.
