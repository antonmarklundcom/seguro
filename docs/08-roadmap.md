# 08 — Roadmap

## Phase 0 — Foundations (weeks 1–2)
- [ ] Local legal check: lead-gen vs. broker licensing; consent text; privacy
      policy (blocks launch — start immediately, doc 06 #6–7)
- [ ] 2–3 broker partners signed (LOI + CPL + delivery channel agreed)
- [ ] Monorepo scaffold (Turborepo): `apps/web`, `apps/api`, `apps/worker`,
      `packages/{ui,db,shared,config,tracking}`
- [ ] CI: typecheck, lint, test, Lighthouse budget; Vercel + Railway envs
- [ ] Design system: tokens, LP block library v1 (Hero, QuoteForm, TrustBar,
      FAQ, PartnerLogos, Testimonials)
- [ ] Keyword research validated with Google Keyword Planner (es, PY) +
      Search Console data from a parked page if available

## Phase 1 — Launch auto vertical (weeks 3–6)
- [ ] Funnel: `/cotizar/seguro-de-auto/` multi-step + partial-lead capture
- [ ] Lead API: ingest, validation, dedupe, spam defenses
- [ ] Worker: routing v1 (priority + caps), delivery via WhatsApp template +
      email + Google Sheets; retries + DLQ + Slack alerts
- [ ] Admin v0 = Retool: lead browser, partner CRUD, manual redeliver
- [ ] SEO pages: home, `/seguro-de-auto/` pillar (+2 subtypes), 4 guías,
      `/socios/`, legal pages
- [ ] Tracking: GA4 + server-side GTM + Consent Mode v2; `lead_valid`
      server event wired to Google Ads
- [ ] Ads: 4 ad groups + 4 message-matched LPs, US$ 500–1,000
- [ ] Weekly reconciliation report (GA4 submits vs. DB rows vs. deliveries)

**Gate to phase 2:** ≥ 80 % partner acceptance rate and CPL < agreed lead
price for 4 consecutive weeks.

## Phase 2 — Prove the machine (months 2–3)
- [ ] Add moto + médico verticals (config + funnel schemas + pillars + LPs)
- [ ] Enhanced Conversions for Leads + OCI (`lead_accepted` value push)
- [ ] Outcome capture: magic-link accept/reject/sold in delivery messages
- [ ] Consumer confirmations (WhatsApp) + review request flow
- [ ] `/aseguradoras/*` brand pages (8–10 insurers)
- [ ] First invoicing cycle from `LeadDelivery` data
- [ ] A/B testing loop running (1 test/week on the top LP)

## Phase 3 — Deepen the moat (months 4–6)
- [ ] Partner portal v1 (lead list, outcomes, invoices) + partner API keys
- [ ] WhatsApp conversational funnel (doc 07 #1)
- [ ] Price-data content hub (doc 07 #2); 40+ guías live
- [ ] Routing v2: weighted round-robin, filters, score-based exclusivity
- [ ] Value-based bidding (tROAS on staged conversion values)
- [ ] `apps/admin` replaces Retool where it hurts

## Phase 4 — Portfolio (months 6–12)
- [ ] Extract vertical config → launch **prestamo.com.py** on the platform
      (doc 09)
- [ ] Embedded widget for dealerships/banks (doc 07 #5)
- [ ] Programmatic vehicle-model pages with real price data
- [ ] Renewal-nurture automation
- [ ] Evaluate: direct insurer API quoting with the most digital partner

## Standing rules
- Ship weekly; every change behind the Lighthouse budget.
- No new vertical until the previous one hits its acceptance/CPL gate.
- Every lead is auditable end-to-end at all times.
