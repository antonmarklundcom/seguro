# PLAN.md — seguro.com.py Build Plan & Implementation Spec

> **Authored by Fable 5** (planning/architecture model) for handoff to
> **Sonnet 5 / Opus 4.8** implementation sessions.
> Date: 2026-07-17 · Status: v2 — full implementation spec · Complements
> `docs/01–09`, which remain the business/architecture reference. Where this
> plan and docs/02 or docs/08 conflict, **this plan wins for launch scope**
> (the docs describe the end state).

---

## Model tiering — who does what

| Model | Use for | Don't use for |
|-------|---------|---------------|
| **Fable 5** | Architecture decisions, spec/schema changes, gap analysis, phase-gate reviews, revising this plan | Routine implementation — don't burn Fable time on mechanical build work |
| **Sonnet 5** | Default builder for every phase below: scaffolding, pages, components, forms, API routes, content drafting, config, CI | Decisions that change the data model or business scope |
| **Opus 4.8** | The genuinely hard problems only: lead-pipeline reliability edge cases, server-side tracking (GA4 MP / Consent Mode / OCI) wiring, tricky Core Web Vitals debugging | Anything Sonnet can do |

Rule of thumb: if the task is "make X exist per this spec", it's Sonnet.
If the task is "decide what X should be", it's Fable. Escalate mid-phase to
Opus only when Sonnet has failed twice on the same problem.

**Session protocol for builder models:**
1. Read this file top to bottom, plus the `docs/` file(s) referenced by the
   phase you're building. Trust this file over memory.
2. Work only the current phase's checklist. Tick items in this file as you
   complete them (edit `[ ]` → `[x]`), commit the tick with the work.
3. Every session ends with: CI green, work committed and pushed, and a short
   "session log" entry appended to the bottom of this file (date, model,
   what was done, what's next, any deviations from spec).
4. If the spec is ambiguous or wrong, make the smallest reasonable choice,
   flag it in the session log, and keep moving — do not redesign. If the
   change touches the data model, revenue path, or business scope, stop and
   leave a question for Fable/owner instead.

---

## Current state (verified 2026-07-16)

**This repository contains zero code.** It holds a README and nine planning
docs (`docs/01–09`). The business thinking is complete; nothing executable
exists yet: no scaffold, no schema, no funnel, no content, no tracking, no
CI. Off-repo blockers untouched: legal review, partner LOIs, WhatsApp
Business, Google Ads account, DNS.

## Decisions locked with the owner (2026-07-16)

1. **Founder-inbox delivery first.** No partners signed yet. V1 delivers
   every lead to the owner's own WhatsApp/email; the owner forwards manually
   while recruiting brokers. Partner routing/billing (docs/05 full spec) is
   deferred to Phase 5, triggered by the first signed partner. The `Lead`
   table is built to full spec from day 1 so nothing migrates.
2. **Lean single Next.js app, not the monorepo.** One Next.js 15 (App
   Router) + TypeScript app on Vercel + Neon Postgres via Prisma. Lead
   ingestion via route handlers (persist-first), delivery retries via a
   `DeliveryAttempt` table drained by Vercel Cron — no Redis/BullMQ/Fastify/
   Turborepo. Split per docs/02 only when volume or a partner API forces it.
3. **AI-drafted es-PY shipped directly.** No local reviewer at launch. Voseo
   ("cotizá", "elegí"), prices in ₲. Accepted risk; prefer factual claims
   over colloquial flourish. Revisit a local reviewer once revenue exists.
4. **prestamo.com.py out of scope.** Keep verticals/config as data/typed
   modules so extraction is mechanical later; build zero multi-tenant
   machinery now.

---

# IMPLEMENTATION SPEC

Everything a builder session needs. Sections: stack & layout → data model →
config → funnel → API → delivery → admin → pages & content → tracking →
CI/deploy → env vars.

## S1. Stack & repository layout

Dependencies (pin majors, latest minors at install time):

- `next@15` (App Router), `react@19`, `typescript@5`
- `tailwindcss@4`, `@tailwindcss/typography`
- `prisma` + `@prisma/client` (Postgres / Neon)
- `zod` (single source of validation truth)
- `resend` (email), `@marsidev/react-turnstile` (spam), `libphonenumber-js`
  (E.164 normalization)
- MDX via `@next/mdx` or `content-collections` (builder's choice; keep it
  boring), `@vercel/og` for OG images
- Testing: `vitest` + `@testing-library/react`; `playwright` only for the
  funnel e2e (one spec)
- Lint/format: `eslint` (next config) + `prettier`

```
seguro/
├── prisma/schema.prisma
├── src/
│   ├── app/
│   │   ├── (site)/                    # indexable pages, shared layout w/ nav+footer
│   │   │   ├── page.tsx               # home
│   │   │   ├── seguro-de-auto/        # pillar + subtypes
│   │   │   ├── seguro-de-moto/
│   │   │   ├── guias/[slug]/
│   │   │   ├── socios/  sobre-nosotros/  contacto/  privacidad/  terminos/
│   │   ├── (funnel)/cotizar/[vertical]/   # multi-step funnel (client component core)
│   │   ├── lp/[slug]/                 # Ads LPs — no nav, noindex
│   │   ├── gracias/                   # post-submit confirmation
│   │   ├── admin/                     # auth-gated (see S7)
│   │   └── api/
│   │       ├── v1/leads/route.ts
│   │       ├── v1/leads/partial/route.ts
│   │       ├── cron/deliver/route.ts
│   │       └── cron/reconcile/route.ts
│   ├── components/blocks/             # Hero, QuoteForm, TrustBar, FAQ, PartnerLogos,
│   │                                  # Testimonials, CtaWhatsApp, ComparisonTable, Breadcrumbs
│   ├── lib/
│   │   ├── leads/     # ingest, dedupe, spam, delivery, scoring stub
│   │   ├── config/    # verticals.ts, cities.ts, lps.ts, site.ts (all typed, zod-validated)
│   │   ├── tracking/  # dataLayer helpers, GA4 MP server events, consent
│   │   ├── seo/       # metadata builders, JSON-LD builders, sitemap helpers
│   │   └── db.ts      # prisma singleton
│   └── content/guias/*.mdx
├── tests/
├── docs/                              # existing business docs
└── .github/workflows/ci.yml
```

Module-boundary rule: nothing in `app/` imports Prisma directly except route
handlers and server components via `lib/`; all lead logic lives in
`lib/leads/` so the future API-service extraction is a file move.

## S2. Data model (Prisma) — build exactly this in Phase 0

```prisma
enum LeadStatus { PARTIAL NEW VALID DUPLICATE INVALID DELIVERED ACCEPTED SOLD REJECTED }

model Lead {
  id           String     @id @default(cuid())
  vertical     String                      // "seguro-de-auto" | "seguro-de-moto" | ...
  status       LeadStatus @default(NEW)
  // contact
  name         String?
  phone        String                      // E.164 +595…
  email        String?
  city         String?
  // vertical-specific answers, validated against the vertical's zod schema
  payload      Json
  // attribution — first-class, never lost (docs/04)
  gclid        String?
  utmSource    String?
  utmMedium    String?
  utmCampaign  String?
  utmTerm      String?
  landingPage  String?                     // path of first page in session
  abVariant    String?
  referrer     String?
  device       String?                     // "mobile" | "desktop" | "tablet"
  ip           String?                     // purge after 90 days (cron)
  // consent (docs/05 compliance)
  consentAt    DateTime
  consentText  String                      // exact versioned text agreed to
  score        Int?
  notes        String?                     // admin free text
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  deliveries   DeliveryAttempt[]
  @@index([phone, vertical, createdAt])    // dedupe lookup
  @@index([status, createdAt])
}

model DeliveryAttempt {
  id          String   @id @default(cuid())
  leadId      String
  lead        Lead     @relation(fields: [leadId], references: [id])
  channel     String                        // "email" | "whatsapp" (founder-inbox for now)
  destination String                        // owner email / phone; partner later
  status      String   @default("PENDING")  // PENDING | SENT | FAILED | DEAD
  attempts    Int      @default(0)          // DEAD after 5
  lastError   String?
  nextRetryAt DateTime @default(now())
  sentAt      DateTime?
  createdAt   DateTime @default(now())
  @@index([status, nextRetryAt])
}
```

Notes: no `Partner`/`PartnerVertical`/`Vertical` tables yet (Phase 5;
verticals are typed config, S3). Partial leads: row created with status
`PARTIAL` at funnel step 2+ once phone exists; upgraded in place to `NEW` on
full submit (same id, so attribution is preserved).

## S3. Config modules (`src/lib/config/`)

All config typed + zod-validated at build time (import in `next.config` or a
prebuild script so a typo fails the build).

```ts
// verticals.ts — the core abstraction; adding a vertical = adding an entry
export type FunnelStep = {
  id: string;
  title: string;                       // es-PY
  fields: FieldDef[];                  // renders generically in QuoteForm
};
export type FieldDef =
  | { kind: "select"; name: string; label: string; options: {value:string; label:string}[] }
  | { kind: "text" | "tel" | "email"; name: string; label: string; placeholder?: string }
  | { kind: "radio-cards"; name: string; label: string; options: {value:string; label:string; icon?:string}[] };

export type Vertical = {
  slug: "seguro-de-auto" | "seguro-de-moto";   // widen as verticals launch
  name: string;                        // "Seguro de auto"
  active: boolean;
  steps: FunnelStep[];                 // contact step is appended automatically (S4)
  payloadSchema: z.ZodSchema;          // server-side validation of payload Json
};
```

**Auto funnel definition (launch content):**
- Step 1 `vehiculo`: marca (select: Toyota, Kia, Hyundai, Chevrolet, Nissan,
  Volkswagen, Ford, Otro), año (select: 2026…1995, grouped "2020 o más nuevo"
  first), uso (radio-cards: Particular / Trabajo / Uber-Bolt).
- Step 2 `cobertura`: tipo (radio-cards: Contra terceros / Todo riesgo /
  No sé, quiero asesoría), vencimiento del seguro actual (select: No tengo
  seguro / Este mes / 1–3 meses / Más adelante) ← renewal capture, docs/07 #9.
- Step 3 `contacto` (auto-appended to every vertical): nombre, ciudad
  (select from cities.ts + "Otra"), teléfono (tel, required), consent
  checkbox (unticked) + Turnstile.

**Moto funnel:** same shape; step 1 = marca (Kenton, Star, Yamaha, Honda,
Taiga, Otro), cilindrada (select: hasta 125cc / 125–250cc / 250cc+), año.
Step 2 = tipo de cobertura + vencimiento. Step 3 shared.

`cities.ts`: Asunción, Ciudad del Este, Encarnación, Luque, San Lorenzo,
Capiatá, Lambaré, Fernando de la Mora, Mariano Roque Alonso, Ñemby, Otra.

`lps.ts`: LP registry — see S8. `site.ts`: brand name, owner contact
destinations (from env), WhatsApp number, social, consent text **with
version id** (e.g. `consent-v1`), legal entity placeholder.

## S4. Quote funnel (`/cotizar/[vertical]`)

- Client component wizard rendering `FieldDef`s generically; one screen per
  step, progress bar, big touch targets (mobile-first — assume 390px).
- State in `sessionStorage` (key `funnel:<vertical>`), survives refresh.
- Contact step last (docs/02). On step advance past the step where phone was
  entered → fire `POST /api/v1/leads/partial` (idempotent by
  sessionStorage-held `leadId`; server creates or updates the PARTIAL row).
- Attribution captured on funnel entry from URL/search params + `document.referrer`
  and carried in the payload: gclid, utm_*, landingPage (first path stored in
  sessionStorage at first page view by `lib/tracking`), abVariant, device
  (UA-based coarse check server-side).
- Submit → `POST /api/v1/leads` → redirect `/gracias?v=<vertical>`.
- `/gracias`: honest confirmation — "¡Listo! Recibimos tu solicitud. Te
  contactamos hoy por WhatsApp para acercarte cotizaciones." + click-to-
  WhatsApp button ("¿Querés respuesta más rápida? Escribinos") with prefilled
  message including the vertical.
- Every funnel page and step ≥ 2: `robots: noindex`. Step 1 of
  `/cotizar/seguro-de-auto/` may be indexable per docs/03 (transactional
  intent) — implement as: step 1 indexable, subsequent steps are client-side
  state (no URL change), which sidesteps the crawl-budget problem entirely.

## S5. Lead API contracts

`POST /api/v1/leads` (full submit) — target < 300 ms:
1. Parse with zod: `{ vertical, contact{name?, phone, email?, city?},
   payload, attribution{...}, consent{checked:true, textVersion}, turnstileToken,
   hp (honeypot, must be empty), startedAt (epoch ms) }`.
2. Spam gates, in order, cheapest first: honeypot non-empty → 200 fake-ok
   (don't teach bots); `now - startedAt < 5000` ms → reject 422; Turnstile
   verify (server call) → reject 403 on fail; IP rate limit 5/hour/IP
   (simple: count Lead rows by ip in last hour) → 429.
3. Normalize phone with libphonenumber-js, country PY; must be valid mobile
   (+5959…); else 422 with field error.
4. Dedupe: Lead with same phone+vertical, status ≠ INVALID, `createdAt >
   now-30d` → create row anyway with status `DUPLICATE` (audit trail), do
   **not** enqueue delivery, still return 201 (user experience identical).
5. **Persist first** (upgrade PARTIAL row if `leadId` supplied and phone
   matches, else create; status NEW). Then create DeliveryAttempt rows
   (email + whatsapp, destinations from env). Then fire-and-forget one
   immediate delivery try (don't await network beyond 2s — cron is the
   guarantee). Return `201 {id}`.
6. Server-fire GA4 `lead_valid` event via Measurement Protocol (S9) when
   status is NEW (not DUPLICATE).

`POST /api/v1/leads/partial`: `{ leadId?, vertical, phone?, partialPayload,
attribution }` → creates/updates PARTIAL row → `200 {leadId}`. No Turnstile
(low stakes), but honeypot + rate limit still apply. Only creates a row once
phone is present and valid.

`GET /api/cron/deliver` (Vercel Cron, every minute, protected by
`CRON_SECRET` bearer): claim up to 20 DeliveryAttempt rows where
`status IN (PENDING,FAILED) AND attempts < 5 AND nextRetryAt <= now` using
`UPDATE … SKIP LOCKED`; attempt send; on success → SENT+sentAt; on failure →
attempts+1, lastError, `nextRetryAt = now + 2^attempts minutes`; on 5th
failure → DEAD + alert email to owner. Also: purge `ip` on leads older than
90 days (piggyback, cheap).

`GET /api/cron/reconcile` (daily): compare last-24h Lead counts vs GA4
`lead_submit` count (GA4 Data API if configured, else skip GA side), email
owner a one-line report; alert loudly if DB < GA4 (lead loss!).

## S6. Founder-inbox delivery (Phase 1 scope)

- **Email (Resend):** structured lead card to `OWNER_EMAIL` — vertical, all
  payload answers labeled in Spanish, contact, city, score placeholder,
  attribution summary (source/campaign), link to `/admin/leads/<id>`,
  `wa.me` deep link to the consumer with prefilled first message.
- **WhatsApp to owner:** launch = **CallMeBot or plain email-to-self
  fallback is NOT acceptable**; implement as: if `WHATSAPP_CLOUD_TOKEN` set,
  send via Cloud API template to `OWNER_WHATSAPP`; else channel disabled and
  email is sole channel (owner can enable later without code changes).
- Consumer confirmation: none by message at launch (no WhatsApp sender
  identity yet) — the `/gracias` page + owner's manual WhatsApp contact IS
  the confirmation. Revisit in Phase 5.

## S7. Admin (`/admin`)

- Auth: single shared secret — HTTP Basic via middleware (`ADMIN_USER`/
  `ADMIN_PASSWORD` env). No user table, no OAuth. It's one founder.
- Pages: `/admin/leads` (table: created, vertical, name, phone as wa.me
  link, city, status, source; filter by status/vertical; 50/page),
  `/admin/leads/[id]` (full payload, attribution, delivery attempts with
  errors, status dropdown, notes field, "reenviar" button re-queueing
  delivery), `/admin/export` (CSV of leads by date range).
- Server components + minimal forms; zero client-state libraries. `noindex`
  + blocked in robots.txt.

## S8. Pages, content & LP system (Phase 2 scope)

**Indexable page inventory for launch (17 pages)** — each with unique
metadata, JSON-LD, breadcrumbs, and a funnel CTA:

| Route | Type | Content brief |
|---|---|---|
| `/` | home | "El comparador de seguros del Paraguay" — category hero, vertical cards, how-it-works (3 steps), trust bar, FAQ (5 q), guías teaser |
| `/seguro-de-auto/` | pillar | ~1200 words: qué cubre, tipos (terceros/todo riesgo), precios orientativos en ₲ (ranges, honest), cómo cotizar, FAQPage JSON-LD (6 q), links to subtypes+guías |
| `/seguro-de-auto/contra-terceros/` | subtype | ~800 words, price-angle |
| `/seguro-de-auto/todo-riesgo/` | subtype | ~800 words, coverage-angle |
| `/seguro-de-moto/` | pillar | ~1000 words, PY moto fleet angle |
| `/guias/*` × 8 | MDX guías | Launch set: cuánto-cuesta-el-seguro-de-auto-en-paraguay · qué-cubre-el-seguro-contra-terceros · todo-riesgo-vs-terceros · seguro-de-moto-precios-y-coberturas · qué-hacer-en-un-accidente-de-tránsito-en-paraguay · cómo-elegir-aseguradora-en-paraguay · seguro-para-uber-y-bolt · documentos-para-contratar-un-seguro. 700–1100 words each, one real question answered, ₲ figures, named author box, last-updated date, CTA to funnel |
| `/socios/` | B2B | Pitch to brokers/insurers: leads calificados, sin costo fijo, pagás por lead; contact form → same lead API, vertical `socios` (add to config, funnel-less: single form) |
| `/sobre-nosotros/` `/contacto/` `/privacidad/` `/terminos/` | legal/trust | Privacy + terms: AI-draft from docs/05 compliance section, **flag for owner legal review before launch** |

**LP system (`/lp/[slug]`)** — registry in `lps.ts`:

```ts
type LpConfig = { slug: string; vertical: string; headline: string;      // supports {kw} token
  subheadline: string; offer?: string; city?: string;
  blocks: ("trustbar"|"how"|"faq"|"testimonials")[]; };
```

Rendered with no site nav, one sticky CTA (funnel embed or jump), footer
with legal links only, `noindex,follow`. `{kw}` in headline replaced by
sanitized `utm_term` (allowlist: letters/spaces/accents, max 40 chars) with
the literal headline as fallback. Launch LPs (4): `seguro-auto-cotiza`,
`seguro-auto-barato`, `seguro-auto-asuncion` (city=asuncion),
`seguro-moto-ya`.

**Technical SEO (implement in Phase 2):** metadata builders per page type;
JSON-LD: Organization+WebSite on layout, FAQPage on pillars, BreadcrumbList
sitewide, Article on guías; segmented sitemaps (`/sitemap.xml` index →
pillars/guias); canonicals everywhere; robots.txt disallow `/lp/`, `/admin/`,
`/api/`; OG images via `@vercel/og` (template: headline on brand background).

**Copy rules (every session):** es-PY voseo, ₲ prices, honest promises
("recibí cotizaciones en 24 h" — never fake instant comparison, docs/06 #16),
no "asesoramos/recomendamos" (broker-licensing risk, docs/06 #6), WhatsApp
CTA everywhere.

## S9. Tracking spec (Phase 3 scope)

- **Client:** GA4 via gtag (no GTM container at launch — less to break; add
  GTM when owner needs to edit tags without deploys). Consent Mode v2:
  default denied for EEA-flags irrelevant in PY but implement the banner
  anyway (simple accept/reject, stores choice in cookie, gates gtag).
- **Events:** `page_view` (auto), `lp_view` (on /lp/*), `funnel_start`
  (step 1 rendered), `funnel_step` (n param), `lead_submit` (client, on 201),
  `lead_valid` (**server-fired** via GA4 Measurement Protocol from the leads
  route, with client_id passed from the form — hidden field populated from
  the GA cookie). `lead_valid` is the Google Ads conversion import.
- **Attribution capture:** first-touch stored in sessionStorage on first
  page view (`lib/tracking/attribution.ts`): gclid, utm_*, referrer, landing
  path. Funnel reads it; every lead row gets it.
- **A/B harness (Phase 4):** cookie `ab:<test-id>` set 50/50 in middleware
  for `/lp/*` only; variant read by LP component and sent as GA4 user
  property + stored on lead. One test at a time.
- Enhanced Conversions for Leads + OCI staged values (docs/04): **defer**
  until Ads runs ≥ 30 conv/month. The schema already stores everything
  needed (gclid, phone, email); when the time comes it's a worker/cron
  addition, not a migration. Leave a `// OCI:` marker in the delivery cron.

## S10. CI & deploy

- GitHub Actions on PR + main: `typecheck` → `lint` → `vitest` →
  `next build` → Lighthouse CI against the built preview (budget: perf ≥ 90,
  SEO ≥ 95, LCP < 2.0s mobile-throttled, CLS < 0.05, LP route JS < 90 kB gz —
  fail the build on breach, per docs/02).
- Playwright funnel e2e (submit auto funnel end-to-end against preview with
  Turnstile test keys) — required check.
- Vercel: production = `main`, previews per PR. Region `gru1` (São Paulo,
  closest to PY). Vercel Cron: `/api/cron/deliver` every minute,
  `/api/cron/reconcile` daily 09:00 America/Asuncion.
- Neon: `main` branch DB + preview branches if trivial to wire; else single
  dev DB for previews.

## S11. Environment variables (`.env.example`, keep current)

```
DATABASE_URL=                 # Neon pooled
RESEND_API_KEY=
OWNER_EMAIL=                  # founder-inbox destination
OWNER_WHATSAPP=               # +5959…, optional
WHATSAPP_CLOUD_TOKEN=         # optional; enables WA channel
WHATSAPP_PHONE_NUMBER_ID=     # optional
TURNSTILE_SITE_KEY= / TURNSTILE_SECRET_KEY=
GA4_MEASUREMENT_ID= / GA4_API_SECRET=        # Measurement Protocol
CRON_SECRET=
ADMIN_USER= / ADMIN_PASSWORD=
NEXT_PUBLIC_SITE_URL=https://seguro.com.py
SENTRY_DSN=                   # optional at launch
```

---

# PHASED MILESTONES

Each phase ≈ 1–3 Sonnet sessions; gate reviewed by Fable 5 (or owner) before
the next phase. Builders: tick boxes as you go.

### Phase 0 — Scaffold & foundations (1 session) → spec S1, S2, S10, S11
- [ ] Next.js 15 + TS + Tailwind scaffold, repo layout per S1
- [ ] Prisma schema per S2, migrated on Neon; `lib/db.ts`
- [ ] Config modules per S3 (verticals with auto+moto funnels, cities, site) with zod build-time validation
- [ ] Block library v1: Hero, TrustBar, FAQ, CtaWhatsApp, Breadcrumbs (QuoteForm in Phase 1)
- [ ] CI per S10 (Lighthouse budget enforced), `.env.example` per S11
- [ ] Vercel project deploying `main`, region gru1
- **Gate:** placeholder home deploys green; Lighthouse ≥ 95 SEO / ≥ 90 perf; migration applied.

### Phase 1 — Auto vertical core (2–3 sessions) → spec S4, S5, S6, S7
- [ ] QuoteForm wizard + `/cotizar/[vertical]` per S4 (auto + moto work from config alone)
- [ ] `POST /api/v1/leads` + `/partial` per S5 (spam gates, dedupe, persist-first)
- [ ] Delivery: DeliveryAttempt rows + immediate try + `/api/cron/deliver` per S5/S6
- [ ] Resend lead-card email; WhatsApp channel behind env flag
- [ ] `/gracias` page; `/admin` per S7
- [ ] Vitest: phone normalization, dedupe, spam gates, retry backoff; Playwright funnel e2e
- **Gate:** phone-submitted test lead reaches owner email < 1 min; kill Resend mid-test → lead persists and retries recover it; DUPLICATE path verified; admin shows everything.

### Phase 2 — Content, SEO & LPs (2–3 sessions) → spec S8
- [ ] 17 indexable pages per S8 inventory (home, pillars, subtypes, 8 guías, socios, legal)
- [ ] LP system + 4 launch LPs, `{kw}` insertion, noindex verified
- [ ] Technical SEO: JSON-LD, sitemaps, canonicals, robots.txt, OG images
- [ ] `/socios` single-form lead path (vertical `socios`)
- **Gate:** Lighthouse budget green on every page class; owner has read and approved all copy; Search Console verified + sitemaps submitted; `curl` confirms noindex on /lp/* and funnel.

### Phase 3 — Tracking (1–2 sessions; Opus if MP/consent wiring stalls) → spec S9
- [ ] GA4 + consent banner + Consent Mode v2
- [ ] Full event chain incl. server-fired `lead_valid` with client_id
- [ ] Attribution capture lib; lead rows populated (verify gclid via test click)
- [ ] `/api/cron/reconcile` daily report
- **Gate:** test lead shows full chain in GA4 DebugView AND populated attribution columns in Postgres; reconcile email arrives.

### Phase 4 — Launch & first revenue (1–2 sessions + owner work)
- [ ] Owner (off-repo, blockers): legal read on lead-gen vs. corredor licensing + consent text + privacy policy; DNS → Vercel; Google Ads account + conversion import of `lead_valid`; campaigns per docs/04 (4 ad groups → the 4 LPs, US$ 500–1,000/mo)
- [ ] A/B harness per S9 on top LP
- [ ] Sentry wired (now there's traffic worth watching)
- [ ] Fix what real traffic exposes (perf, copy, spam tuning)
- **Gate (graduate):** 4 consecutive weeks: zero lead loss in reconciliation, CVR ≥ 8 % on best LP, ≥ 1 broker actively receiving forwarded leads.

### Phase 5 — Partner engine (post-launch; triggered by first signed partner) → docs/05 full spec
- [ ] `Partner`/`PartnerVertical` tables + routing (priority, caps, filters, shared/exclusive)
- [ ] Real delivery channels (WhatsApp template to partner, email, Google Sheets append)
- [ ] Outcome capture via signed magic-link (aceptar/rechazar/vendido); billing report from deliveries
- [ ] Consumer WhatsApp confirmations; médico vertical (config + pillar + LPs) per docs/08 gating
- [ ] OCI staged values + Enhanced Conversions once ≥ 30 conv/month
- [ ] Re-evaluate lean-app decision; split api/worker per docs/02 only if forced
- **Fable 5 reviews this phase's design before build** — it changes the data model and revenue path.

---

## What's needed to finish — condensed

**Code (this repo): ~7–10 build sessions to launch** (Phases 0–4), nearly
all Sonnet 5. **Owner (off-repo, items 1–2 block launch):** ① local legal
review (licensing, consent, privacy policy) ② DNS + Google Ads account +
budget (~US$ 500–1,000/mo; SEO alone takes 6–12 months) ③ broker outreach
(founder-inbox means launch doesn't wait on it) ④ WhatsApp Business
(app now, Cloud API at Phase 5) ⑤ Resend/Neon/Turnstile/GA4 account
creation as Phase 0–3 needs them.

**Portfolio note:** the block library, config-driven funnel, lead schema and
tracking built here are the intended platform for `prestamo.com.py`
(docs/09). No sibling repo has reusable specs yet — seguro is the origin.

## Standing rules for implementation sessions

- Ship behind the Lighthouse budget — CI-enforced, not aspirational.
- Never lose a lead: persist-first, retries, reconciliation must match. Any
  change touching the lead path gets a zero-loss test.
- All user-facing copy: es-PY voseo, ₲ prices, honest promises, no
  advice-implying language.
- `/lp/*` and funnel steps stay noindex from the first deploy.
- Verticals/config stay data — nothing hardcoded that blocks prestamo.
- Business-scope changes (pricing model, verticals, partner terms) go back
  to Fable 5 + owner; don't decide them mid-build.
- End every session: CI green, pushed, checklist ticked, session log below.

---

## Session log

_(builders append here: date · model · phase · done / next / deviations)_

- 2026-07-16 · Fable 5 · planning · Initial plan written after repo audit + owner Q&A.
- 2026-07-17 · Fable 5 · planning · v2: expanded into full implementation spec (S1–S11), per-phase checklists, session protocol. Ready for Sonnet handoff at Phase 0.
