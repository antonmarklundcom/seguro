# PLAN.md — seguro.com.py Build Plan

> **Authored by Fable 5** (planning/architecture model) for handoff to
> **Sonnet 5 / Opus 4.8** implementation sessions.
> Date: 2026-07-16 · Status: awaiting owner review · Supersedes nothing —
> complements `docs/01–09`, which remain the business/architecture reference.

---

## Model tiering — who does what

| Model | Use for | Don't use for |
|-------|---------|---------------|
| **Fable 5** | Architecture decisions, spec/schema changes, gap analysis, phase-gate reviews, revising this plan | Routine implementation — don't burn Fable time on mechanical build work |
| **Sonnet 5** | Default builder for every phase below: scaffolding, pages, components, forms, API routes, content drafting, config, CI | Decisions that change the data model or business scope |
| **Opus 4.8** | The genuinely hard problems only: lead-pipeline reliability edge cases, server-side tracking (ssGTM/OCI) wiring, tricky Core Web Vitals debugging | Anything Sonnet can do |

Rule of thumb: if the task is "make X exist per this spec", it's Sonnet.
If the task is "decide what X should be", it's Fable. Escalate mid-phase to
Opus only when Sonnet has failed twice on the same problem.

---

## Current state (verified against the repo, 2026-07-16)

**This repository contains zero code.** It holds a README and nine planning
docs (`docs/01–09`) covering business model, market, architecture, SEO, Ads,
lead engine, risks, opportunities, and roadmap. The business thinking is
complete and good; nothing executable exists yet:

- ❌ No app scaffold, package.json, or framework code
- ❌ No database schema, no lead ingestion, no funnel
- ❌ No content (0 SEO pages, 0 guías)
- ❌ No tracking, no CI, no deploy configuration
- ❌ Off-repo blockers untouched: legal review, partner LOIs, WhatsApp
  Business API, Google Ads account, domain DNS → hosting

## Decisions locked with the owner (2026-07-16)

These amend `docs/02` and `docs/08` where they conflict; the docs describe
the *end state*, this plan describes the *launch state*.

1. **Founder-inbox delivery first.** No partners are signed yet. V1 delivers
   every lead to the owner's own WhatsApp/email; the owner forwards manually
   while recruiting brokers. The full routing/delivery engine (`Partner`,
   `PartnerVertical`, multi-channel delivery, caps, billing) is deferred to
   Phase 3, triggered by the first signed partner. The `Lead` table is built
   to the full spec from day 1 so nothing needs migrating.
2. **Lean single Next.js app, not the monorepo.** One Next.js 15 (App
   Router) + TypeScript app on Vercel with managed Postgres (Neon) via
   Prisma. Lead ingestion via API routes (persist-first), delivery retries
   via a `DeliveryAttempt` table drained by Vercel Cron — no Redis, no
   BullMQ, no Fastify, no Turborepo. Split into the docs/02 monorepo only
   when real volume or a partner-API requirement forces it. Keep module
   boundaries clean (`src/lib/leads/`, `src/lib/config/`, `src/components/blocks/`)
   so the future extraction is mechanical.
3. **AI-drafted es-PY shipped directly.** No local reviewer for launch. All
   copy in Paraguayan Spanish (voseo: "cotizá", "elegí"), prices in ₲.
   *Accepted risk* (docs/03 §5, docs/06 #16 adjacent): dialect authenticity
   is a trust/SEO factor — revisit getting a local reviewer once revenue
   exists, and prefer factual/verifiable claims over colloquial flourish in
   the meantime.
4. **prestamo.com.py is out of scope.** Seguro is the platform origin;
   lessons and eventually code transfer later (docs/09). Keep verticals/
   config as data (decision 2's module boundaries) but build **zero**
   multi-tenant machinery now.

---

## Phased milestones

Each phase ≈ 1–3 implementation sessions (Sonnet 5 unless noted). A phase is
done when its **gate** passes, reviewed by Fable 5 before the next begins.

### Phase 0 — Spec & scaffold (1 session)
- Next.js 15 + TypeScript + Tailwind scaffold; Prisma + Neon Postgres;
  Vercel project wired to the repo; `.env.example`.
- Prisma schema: `Lead` (full attribution + consent columns per docs/05),
  `DeliveryAttempt`, `Vertical` config table *or* typed TS config module
  (decide in-session; TS config preferred at this scale).
- Zod schemas shared between funnel and API route (one source of truth).
- Design tokens + block library v1: Hero, QuoteForm, TrustBar, FAQ,
  PartnerLogos, Testimonials, CTA/WhatsApp button.
- CI (GitHub Actions): typecheck, lint, minimal tests, Lighthouse budget
  from docs/02 (LCP < 2.0s mobile, CLS < 0.05, LP JS < 90 kB gz).
- **Gate:** deploys to Vercel; a placeholder page scores ≥ 95 SEO / ≥ 90
  perf in Lighthouse CI; schema migrated.

### Phase 1 — Auto vertical core (2–3 sessions)
- Multi-step quote funnel `/cotizar/seguro-de-auto/` per docs/02: easy
  question first, contact last, sessionStorage state, **partial-lead
  capture** server-side once phone is entered.
- Lead ingest `POST /api/v1/leads`: Zod validation, E.164 `+595`
  normalization, honeypot + time-to-submit floor + Turnstile + IP rate
  limit; **persist first**, then enqueue delivery row; 30-day
  phone+vertical dedupe.
- Founder-inbox delivery: email (Resend) + WhatsApp notification to owner
  with a structured lead card; retries via `DeliveryAttempt` + Vercel Cron;
  failure alerting (email is fine).
- Consumer confirmation page ("Listo ✅ — te contactarán hoy") with honest
  UX per docs/06 #16 (no fake instant-price promise).
- Minimal admin: one auth-protected `/admin` route — lead list, detail,
  status toggle, CSV export. (Replaces the docs' Retool suggestion — no
  extra SaaS.)
- **Gate:** a test lead submitted on a phone arrives in the owner's
  WhatsApp/email within 1 minute, survives a simulated delivery failure
  (retry works), and appears in `/admin`. Zero-lead-loss check: kill the
  delivery path mid-submit, lead still persists.

### Phase 2 — Content, SEO & landing pages (2–3 sessions)
- SEO pages (all es-PY, SSG): home, `/seguro-de-auto/` pillar,
  `/seguro-de-auto/contra-terceros/`, `/seguro-de-auto/todo-riesgo/`,
  `/seguro-de-moto/` pillar, 6–8 guías (MDX), `/socios/` (partner-pitch —
  this is a *sales tool* for recruiting the first brokers),
  `/sobre-nosotros/`, `/contacto/`, `/privacidad/`, `/terminos/`.
- Technical SEO per docs/03: metadata templates, JSON-LD (Organization,
  WebSite, FAQPage, BreadcrumbList), segmented sitemaps, canonicals,
  robots.txt blocking `/lp/` + funnel steps ≥ 2, OG images.
- LP system `/lp/[slug]`: config-object pages from the same blocks, no nav,
  one CTA, `noindex,follow`, `utm_term` dynamic-text insertion with safe
  fallback. Ship 4 message-matched LPs for the initial auto ad groups.
- Launch with 15–20 strong pages, not stubs (docs/03 §5).
- **Gate:** Lighthouse budget green on every page class; Search Console
  verified, sitemaps submitted, LPs confirmed noindex; owner has reviewed
  and published the copy.

### Phase 3 — Tracking & measurement (1–2 sessions, Opus 4.8 for ssGTM/OCI wiring if Sonnet stalls)
- GA4 + Consent Mode v2 + consent banner (versioned consent text stored per
  lead — already in schema from Phase 0).
- Event chain: `lp_view → funnel_start → funnel_step_n → lead_submit →
  lead_valid` (server-fired). Store `gclid`/UTMs/LP slug/device on every
  lead (schema already has the columns).
- Server-side GTM on `t.seguro.com.py` **only if** the owner accepts its
  hosting cost now; otherwise client GTM + server-fired GA4 Measurement
  Protocol events as the launch config, ssGTM as a fast-follow. Enhanced
  Conversions for Leads + OCI staged values (docs/04) come once Ads has
  ≥ 30 conv/month — not before.
- Weekly reconciliation report: GA4 submits vs. DB rows (docs/06 #12).
- **Gate:** a test lead shows the full event chain in GA4 DebugView and its
  gclid/UTM columns populated in Postgres.
- *Also in this phase (owner, off-repo):* Google Ads account, billing,
  first campaigns per docs/04 — code side just has to have LPs + conversion
  events ready.

### Phase 4 — Launch & first revenue (1–2 sessions + owner-led work)
- Owner (off-repo, **launch blockers**): local legal read on lead-gen vs.
  broker licensing + consent text + privacy policy (docs/06 #6–7);
  WhatsApp Business API (or start with plain WhatsApp Business app for
  founder-inbox); DNS `seguro.com.py` → Vercel; Ads live at US$ 500–1,000/mo.
- Code: fix what real traffic exposes; A/B harness on the top LP (simple
  cookie bucketing + GA4 dimension — no middleware complexity until needed);
  review-request follow-up message to converted leads.
- **Gate (graduate):** 4 consecutive weeks of leads flowing with zero lead
  loss in reconciliation, CVR ≥ 8 % LP→lead on the best LP, and ≥ 1 broker
  actively receiving forwarded leads.

### Phase 5 — Partner engine (post-launch, triggered by first signed partner)
- `Partner` + `PartnerVertical` tables, routing (priority/caps/filters),
  real delivery channels (WhatsApp template / email / Google Sheets),
  outcome capture via signed magic-link, monthly billing report — i.e. the
  rest of docs/05. Add moto/médico funnels per the docs/08 gating rule.
- This is where re-evaluating the lean-app decision belongs: if partner
  webhooks + retries outgrow cron, split `api`/`worker` per docs/02.

---

## What's needed to finish (gap checklist)

**Code (this repo, ~7–10 build sessions to launch):**
- [ ] Phase 0 scaffold + schema + CI + design blocks
- [ ] Phase 1 funnel + lead API + founder-inbox delivery + admin
- [ ] Phase 2 15–20 SEO pages + 4 Ads LPs + technical SEO
- [ ] Phase 3 GA4/consent/conversion tracking + reconciliation
- [ ] Phase 4 launch hardening + A/B loop

**Owner (off-repo, can run in parallel — items 1–2 block launch):**
1. [ ] Local legal review: lead-gen vs. corredor licensing; consent text;
       privacy policy (docs/06 #6–7)
2. [ ] Domain DNS + Google Ads account + billing
3. [ ] Broker outreach (the `/socios/` page from Phase 2 is the pitch
       asset); founder-inbox mode means launch does **not** wait on this
4. [ ] WhatsApp Business (app now; Cloud API when partner delivery needs it)
5. [ ] Decide ad budget commitment (docs/04 suggests US$ 500–1,000/mo to
       start) — SEO alone takes 6–12 months (docs/06 #10)

**Reusable elsewhere (portfolio note):** the block library, funnel
framework, lead schema, and tracking setup built here are the intended
platform for `prestamo.com.py` (docs/09). No sibling repo has reusable
specs yet — seguro is the origin; extract, don't duplicate, when prestamo
starts.

---

## Standing rules for implementation sessions

- Ship behind the Lighthouse budget — it's CI-enforced, not aspirational.
- Never lose a lead: persist-first, retries, and the reconciliation count
  must match. Any change touching the lead path gets a zero-loss test.
- All user-facing copy: es-PY voseo, prices in ₲, honest promises
  ("cotizaciones en 24 h", never fake instant comparison).
- `/lp/*` and funnel steps ≥ 2 stay `noindex` from the first deploy.
- Keep verticals/config as data or typed config modules — no hardcoding
  that blocks the prestamo future.
- Business-scope changes (pricing model, verticals, partner terms) go back
  to Fable 5 + owner; don't decide them mid-build.
