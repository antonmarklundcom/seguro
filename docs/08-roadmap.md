# 08 — Roadmap

> **Superseded as the build order by `PLAN.md`'s T0–T5 PR roadmap
> (2026-09-16).** This file is kept as the original business-sequencing
> reference (what happens in what order, and why), rewritten for the
> static HTML + PHP stack. For the actual PR-by-PR build plan with gates
> and skills, read `PLAN.md`.

## Phase 0 — Foundations (weeks 1–2)
- [ ] Local legal check: lead-gen vs. broker licensing; consent text; privacy
      policy (blocks launch — start immediately, doc 06 #6–7)
- [ ] 2–3 broker partners signed (LOI + CPL + delivery channel agreed)
- [ ] Adopt `antonmarklundcom/php-site-template` as this repo's foundation
      (`PLAN.md` T0): site identity, `paraguay` market module wired,
      `VENDERCRM_API_KEY`/`VENDERCRM_URL` env vars, `verify.sh` green
- [ ] Design tokens applied in the template's `assets/css/site.css`;
      footer legal disclosure wired into `partials/footer.php`
- [ ] Keyword research validated with Google Keyword Planner (es, PY) — see
      the callout in `docs/03`; the seed keyword table there is example
      data only

## Phase 1 — Launch auto vertical (weeks 3–6)
- [ ] Funnel: `/cotizar/seguro-de-auto/` multi-step (vanilla JS) +
      partial-lead capture to the `leads.ndjson` mirror
- [ ] Lead capture: `enviar.php` wired per the `vendercrm-lead-capture`
      skill — persist-first mirror append, then VenderCRM POST, honeypot,
      idempotency key, never block the visitor (`PLAN.md` T3)
- [ ] SEO pages: home, `/seguro-de-auto/` pillar (+2 subtypes), 4 guías,
      `/socios/`, legal pages
- [ ] Tracking: GA4 + `vc-attribution.js`; `lead_valid` event fired once the
      mirror append + CRM POST both complete
- [ ] Ads: 4 ad groups + 4 message-matched `/lp/` pages, US$ 500–1,000
- [ ] Weekly reconciliation check (`leads.ndjson` rows vs. VenderCRM Sitios
      count vs. GA4 submits — doc 05)

**Gate to phase 2:** ≥ 80 % partner acceptance rate and CPL < agreed lead
price for 4 consecutive weeks.

## Phase 2 — Prove the machine (months 2–3)
- [ ] Add moto + médico verticals (new `content/*.php` records reusing the
      same templates and funnel pattern — no config schema to migrate)
- [ ] Enhanced Conversions for Leads + OCI (`lead_accepted` value push) via
      a small script reading `leads.ndjson` + VenderCRM outcome exports
- [ ] Outcome capture: owner logs partner accept/reject/sold in VenderCRM's
      own pipeline (no custom magic-link flow needed at this scale)
- [ ] Consumer confirmations (WhatsApp) + review request flow
- [ ] `/aseguradoras/*` brand pages (8–10 insurers)
- [ ] A/B testing loop running (1 test/week on the top LP, PHP cookie
      bucket per doc 04)

## Phase 3 — Deepen the moat (months 4–6)
- [ ] WhatsApp conversational funnel (doc 07 #1)
- [ ] Price-data content hub (doc 07 #2); 40+ guías live
- [ ] Value-based bidding (tROAS on staged conversion values), once OCI
      volume justifies it
- [ ] Re-evaluate whether a partner-routing engine is justified by real
      volume — if so, scope it as a **separate app** (see `PLAN.md` §7),
      not a change to this brochure site

## Phase 4 — Portfolio (months 6–12)
- [ ] Launch **prestamo.com.py** as a second `php-site-template` clone
      (doc 09) — its own repo, its own content, sharing only the pattern
      and the VenderCRM account structure
- [ ] Embedded widget for dealerships/banks (doc 07 #5)
- [ ] Programmatic vehicle-model pages with real price data
- [ ] Renewal-nurture automation
- [ ] Evaluate: direct insurer API quoting with the most digital partner

## Standing rules
- Ship weekly; `./verify.sh` green before every PR.
- No new vertical until the previous one hits its acceptance/CPL gate.
- Every lead is auditable end-to-end at all times (the `leads.ndjson`
  mirror plus VenderCRM's own record).
