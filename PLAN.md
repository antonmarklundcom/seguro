# PLAN.md — seguro.com.py Fable Plan (v2)

> **Authored by Fable 5** (planning/architecture model) for handoff to
> **Opus / Sonnet** implementation sessions.
> Date: 2026-08-21 · Status: active · Supersedes PLAN.md v1 (2026-07-16).
> `docs/01–09` remain the business/architecture *end-state* reference;
> `docs/10` is the legal/compliance reference; **this file is the build order.**

---

## 1. The three questions this plan answers

1. **One system or landing + VenderCRM?** → **Both, in one system.** One
   Next.js app (site + funnels + a thin lead API) with **VenderCRM as the
   CRM of record at launch**. No custom lead engine, no custom admin, no
   partner routing until a partner is actually paying. The custom Node lead
   engine from `docs/05` is **Phase 3**, built inside the same app when the
   first signed partner triggers it. Plain HTML/PHP is rejected: the plan
   needs 15–20 SEO pages, multi-step funnels, noindex LP variants, JSON-LD
   and sitemaps — that's Next.js territory, and PHP would be thrown away in
   Phase 3 anyway.
2. **What is legal in Paraguay without a broker license?** → Operate as a
   **marketing/lead-referral company, never an intermediary**: no advising,
   no recommending a specific insurer, no quoting premiums as if binding, no
   participating in the sale. Full framework, copy rules and lawyer
   checklist: **`docs/10-legal-compliance-paraguay.md`**. Legal items marked
   ⚖️ below are launch blockers.
3. **What does the owner do around the code?** → Every phase lists
   **off-repo owner work** (legal, accounts, partners). PRs never wait on
   each other across tracks unless marked as a gate.

## 2. Locked architecture decisions (2026-08-21)

These amend v1 decisions 1–2 and `docs/02` where they conflict.

| # | Decision | Rationale |
|---|----------|-----------|
| A | **One Next.js 15 (App Router) + TypeScript app** — no monorepo, no Fastify, no Redis/BullMQ at launch | Same as v1; the docs/02 monorepo is the Phase 3+ end state |
| B | **Hosting: Hostinger managed Node.js + MySQL (Drizzle)**, per the owner's proven `nextjs-deploy-hostinger` / `nodejs-mysql-hostinger-stack` playbooks — not Vercel/Neon/Prisma | The owner already runs propia.com.py and educacion.com.py on this stack; one hosting bill, one deploy muscle. Revisit Vercel only if Core Web Vitals on Hostinger can't hit the CI budget |
| C | **VenderCRM is the CRM of record at launch.** Form → own Next.js route handler → `POST {CRM_URL}/api/v1/leads` with per-site API key (server-side only), idempotency key, honeypot, attribution via `vc-attribution.js` | Contacts, dedup, pipeline (Nuevo → Contactado → Cotizado → Ganado/Perdido), per-site lead counts and UTM attribution exist today for free — replaces v1's "founder-inbox + custom /admin" entirely |
| D | **MySQL `leads` mirror table, persist-first.** The handler writes the full lead (attribution + versioned consent + payload) to local MySQL *before* posting to VenderCRM; a failed CRM post never loses a lead and never blocks the visitor | Zero-lead-loss rule from docs/02/05/06 survives the VenderCRM decision; the mirror is also the substrate the Phase 3 lead engine grows out of, and the consent audit trail the CRM doesn't hold |
| E | **Founder-worked leads first.** Owner works the VenderCRM pipeline and forwards leads to brokers by WhatsApp manually while recruiting partners. Partner routing/delivery/billing (docs/05) waits for the **first signed partner** | Unchanged from v1 — partner side is the hard side (docs/06 #1); build the machine when there's someone to deliver to |
| F | **es-PY voseo copy shipped AI-drafted**, ₲ prices, honest promises ("cotizaciones en 24 h", never fake instant comparison), and — new, from docs/10 — a **standing marketing-service disclosure** on every page footer and consent text | v1 decision 3 + legal posture |
| G | **prestamo.com.py stays out of scope**; keep vertical config as typed TS modules so extraction stays mechanical | Unchanged (docs/09) |

Data flow at launch:

```
visitor → Next.js pages/funnel → POST /api/leads (own server)
            1. insert MySQL leads mirror  (persist-first, consent + attribution)
            2. POST VenderCRM /api/v1/leads (idempotency key, X-Api-Key)
            3. redirect thank-you (always — CRM failure only logs)
   owner works pipeline in VenderCRM → forwards to brokers via WhatsApp
```

## 3. Model tiering — who does what

| Model | Use for |
|-------|---------|
| **Fable 5** | Phase-gate reviews, schema/scope changes, revising this plan, anything that changes a locked decision |
| **Opus** | The hard PRs: PR-4 (lead capture core), PR-10 (tracking), Phase 3 lead engine; and rescue when Sonnet fails twice on the same problem |
| **Sonnet** | Everything else: scaffold, pages, components, content, config, CI |

Rule: "make X exist per this spec" → Sonnet. "decide what X is" → Fable.
Every implementation session must read this file, `docs/10`, and the
relevant `docs/0x` before writing code. Skills to load per PR are listed in
each PR row.

## 4. PR roadmap

Each PR is one implementation session on a `claude/…` branch, reviewed and
merged by the owner. **Gate** = merge criteria. Skills column = Claude
skills the session must load.

### Phase 0 — Foundation

| PR | Scope | Model | Skills | Gate |
|----|-------|-------|--------|------|
| **PR-3 Scaffold + deploy** | Next.js 15 + TS + Tailwind; Drizzle + Hostinger MySQL; deploy to a Hostinger subdomain; `.env.example`; CI (typecheck, lint, Lighthouse budget: LCP < 2.0 s mobile, CLS < 0.05, LP JS < 90 kB gz, SEO ≥ 95); design tokens + block library v1 (Hero, QuoteForm, TrustBar, FAQ, Testimonials, WhatsApp CTA) | Sonnet | `nodejs-mysql-hostinger-stack`, `nextjs-deploy-hostinger`, `web-design-system` | Deployed placeholder page passes Lighthouse budget in CI; DB migration runs |
| **PR-4 Lead capture core** | `leads` mirror table (full docs/05 Lead columns: contact, payload JSON, gclid/UTMs/LP/device, `consent_at` + `consent_text_version`, status); shared Zod schemas; `POST /api/leads`: validate → normalize `+595` E.164 → **insert mirror first** → VenderCRM post (idempotency `sha256(phone\|hour)`, honeypot, 10 s timeout, never block visitor) → thank-you page; `vc-attribution.js` on every page, cookie mapped server-side; failure log + email alert | **Opus** | `vendercrm-lead-capture`, `paraguay-business-apps` | Real phone submit → contact in VenderCRM (normalized), deal in pipeline, mirror row with attribution; double-submit creates no duplicate; kill CRM URL → lead still in mirror + visitor still sees thank-you |

### Phase 1 — Funnel + legal shell

| PR | Scope | Model | Skills | Gate |
|----|-------|-------|--------|------|
| **PR-5 Auto quote funnel** | `/cotizar/seguro-de-auto/` multi-step (easy question first, contact last, sessionStorage); partial-lead capture to mirror once phone entered; spam hardening: Turnstile, time-to-submit floor, IP rate limit; funnel steps ≥ 2 `noindex` | Sonnet | `web-design-system`, `paraguay-local-site` | Mobile funnel completes < 60 s; abandoned-after-phone funnel yields a mirror row; bots blocked in test |
| **PR-6 Legal & trust layer** ⚖️ | `/privacidad`, `/terminos` drafted from `docs/10` templates; consent checkbox (unticked) with versioned text naming data sharing with insurers/brokers; footer disclosure on every page: *"seguro.com.py es un servicio de marketing y referencia. No somos corredores ni agentes de seguros y no brindamos asesoramiento."*; data-subject request contact (ARCO rights); cookie/consent banner v1 | Sonnet | — (reads `docs/10`) | Owner + lawyer have reviewed the exact texts before merge — **this PR merges only after ⚖️L1 below** |

### Phase 2 — Content, SEO, Ads

| PR | Scope | Model | Skills | Gate |
|----|-------|-------|--------|------|
| **PR-7 SEO core pages** | Home, `/seguro-de-auto/` pillar + `/contra-terceros/` + `/todo-riesgo/`, `/socios/` (broker-recruiting pitch page), `/sobre-nosotros/`, `/contacto/`; metadata templates, JSON-LD (Organization, WebSite, FAQPage, BreadcrumbList), sitemap, robots.txt, OG images | Sonnet | `web-design-system`, `nextjs-national-lead-gen`, `higgsfield-web-imagery` | Lighthouse green per page class; copy follows docs/10 language rules (checked against the prohibited-phrases list) |
| **PR-8 Guías + moto** | 6–8 MDX guías (auto-focused), `/seguro-de-moto/` pillar + funnel reusing PR-5 machinery via vertical config | Sonnet | same as PR-7 | 15–20 strong indexable pages total, zero stubs |
| **PR-9 Ads LP system** | `/lp/[slug]` config-object pages from the block library: no nav, one CTA, `noindex,follow`, `utm_term` dynamic-text insertion with safe fallback; 4 message-matched LPs for the initial auto ad groups | Sonnet | `web-design-system` | LPs confirmed noindex; LP JS < 90 kB gz; each LP posts leads with its own source/UTM visible in VenderCRM Sitios |
| **PR-10 Tracking** | GA4 + Consent Mode v2 wired to the PR-6 banner; event chain `lp_view → funnel_start → funnel_step_n → lead_submit`; server-fired `lead_valid` (GA4 Measurement Protocol); gclid/UTM verified into mirror; weekly reconciliation script (GA4 submits vs mirror rows vs VenderCRM count) emailed to owner | **Opus** | `claude-api` n/a — GA4 docs | Test lead shows full chain in DebugView with populated attribution columns; reconciliation report renders with matching counts |

### Launch (after ⚖️L1–L3 + PR-10)

| PR | Scope | Model | Gate |
|----|-------|-------|------|
| **PR-11 Launch hardening** | Fix what real traffic exposes; simple A/B harness on top LP (cookie bucket + GA4 dimension); review-request WhatsApp follow-up message template; error alerting pass | Sonnet | 4 consecutive weeks zero lead loss in reconciliation; CVR ≥ 8 % on best LP |

### Phase 3 — Partner engine (**triggered by first signed partner, not by date**)

| PR | Scope | Model |
|----|-------|-------|
| **PR-12 Partner + routing** | `partners`, `partner_verticals` tables (CPL ₲, caps, filters, priority, exclusivity) per docs/05; routing worker as Node cron in the same app reading the mirror; delivery via WhatsApp `wa.me` card + email; `delivery_attempts` with retries | Opus |
| **PR-13 Outcomes + billing** | Magic-link accept/reject/sold; monthly billing report per partner from delivery rows (₲ integer amounts, IVA-aware line items per `paraguay-business-apps` — actual invoices issued from the owner's facturación system, not this app) | Sonnet |
| **PR-14 Partner portal + API** | Auth-protected partner lead list + outcomes; per-partner API keys | Sonnet |

Phase 3 is also the re-evaluation point for decision A/B (split worker out,
consider docs/02 monorepo) — Fable review before PR-12 starts.

## 5. Off-repo owner work (parallel tracks)

### ⚖️ Legal track (details + checklists in `docs/10`)

| # | Item | Blocks |
|---|------|--------|
| **L1** | Local lawyer engagement (Asunción, insurance + data-protection practice): confirm the marketing-partner model against Ley de Seguros 827/96 licensing; review consent text, privacy policy, footer disclosure, and the prohibited-phrases list | PR-6 merge, launch |
| **L2** | Entity + tax: incorporate (EAS is the default candidate), RUC, timbrado/facturación for invoicing lead fees to brokers with IVA | first invoice (Phase 3), but start now — takes weeks |
| **L3** | Data-protection compliance setup per Paraguay's data-protection law: consent + purpose registry, data-transfer terms with lead buyers (DPA), retention policy, ARCO request procedure | launch |
| **L4** | Contract templates: lead purchase agreement with brokers (per-lead CPL pricing — see docs/10 on why premium revenue-share is the risky structure), duplicate/invalid crediting policy | first signed partner (Phase 3 trigger) |

### Tech/accounts track

| # | Item | Blocks |
|---|------|--------|
| T1 | VenderCRM: create site under **Sitios**, get API key, set default pipeline stage; pipeline stages Nuevo → Contactado → Cotizado → Negociando → Ganado/Perdido | PR-4 verification |
| T2 | Hostinger: pick account/slot, MySQL database, subdomain for staging | PR-3 |
| T3 | DNS `seguro.com.py` → Hostinger | launch |
| T4 | Google Ads account + billing; budget commitment US$ 500–1,000/mo (SEO alone takes 6–12 months, docs/06 #10) | first campaign after PR-9/PR-10 |
| T5 | WhatsApp Business app on the founder number now; Cloud API only when Phase 3 delivery needs templates | — |
| T6 | Search Console verification + sitemap submission | after PR-7 |

### Partner track

| # | Item |
|---|------|
| P1 | Broker outreach list (Asunción/CDE/Encarnación independents) — `/socios/` page from PR-7 is the pitch asset; founder-inbox mode means launch does **not** wait on this |
| P2 | First signed partner (L4 contract) → triggers Phase 3 |

## 6. Standing rules for implementation sessions

- Read `PLAN.md` + `docs/10` before coding; load the skills listed on the PR.
- Lighthouse budget is CI-enforced, not aspirational.
- **Never lose a lead**: mirror insert precedes the CRM post; any change to
  the lead path ships with a zero-loss test (kill the CRM, lead survives).
- VenderCRM API key server-side only; never send pipeline/stage/owner from
  code (routing lives in the CRM's Sitios config).
- All user-facing copy: es-PY voseo, ₲ prices, `dd/mm/yyyy`,
  `America/Asuncion`, honest promises; **never** use advice/recommendation
  language — check every page against the docs/10 prohibited-phrases list.
- `/lp/*` and funnel steps ≥ 2 stay `noindex` from the first deploy.
- Verticals as typed TS config modules — nothing hardcoded that blocks
  moto/médico or the prestamo future.
- Business-scope or legal-posture changes go back to Fable 5 + owner.
