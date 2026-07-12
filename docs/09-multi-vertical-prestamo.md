# 09 — Multi-Vertical Platform: prestamo.com.py (and beyond)

**Short answer: yes — this architecture fits prestamo.com.py almost
perfectly, and the plan is deliberately built so that it does.** Loans
(préstamos) is the *same business* as insurance lead-gen: capture intent →
qualify → route to partner → get paid per lead/funded loan. It is exactly the
Swedish pattern: Insplanet/Compricer (insurance) and Lendo/Sambla/Zmarta
(loans) run on the same machinery.

## What transfers 1:1 (≈ 80 % of the codebase)

| Component | Reuse |
|-----------|-------|
| Lead engine (ingest, dedupe, scoring, routing, delivery, billing, audit) | Unchanged — verticals and partners are already data (`Vertical`, `PartnerVertical`) |
| LP block library + funnel framework | Unchanged — new funnel = new field schema in config |
| Tracking stack (ssGTM, GA4, OCI, Enhanced Conversions) | Unchanged — new Ads account/container, same code |
| SEO architecture (pillar/geo/brand/guías templates, sitemaps, JSON-LD) | Same templates: `/prestamos-personales/`, `/prestamo/[banco]/`, guías |
| Admin, partner portal, invoicing | Unchanged |
| Infra, CI, design system | Unchanged — second Vercel project on the same monorepo |

Implementation: `apps/web` becomes multi-tenant by domain — a `site config`
(brand, theme tokens, verticals, content dir) selected per hostname. One
repo, one deploy pipeline, N domains.

## What changes for prestamo

1. **Funnel fields:** loan amount, term, income, employment type (formal/
     informal — IPS contributor or not is *the* qualifier in PY), existing
     debts, purpose. Slider-based amount picker converts best (see Lendo).
2. **Partners:** banks (Ueno, Itaú, Familiar, Continental, Visión, Atlas),
     financieras (Solar, Fic, Crediágil-type), fintechs and cooperativas.
     Cooperativas are a PY specialty — huge lending share, very local, likely
     eager lead buyers.
3. **Economics:** loan leads are worth **more** per lead and CPCs are
     higher; funded-loan CPA deals are standard. The OCI staged-value model
     (doc 04) matters even more here.
4. **Scoring:** pre-qualification rules per partner (min income, formal
     employment, age, Informconf status question) — the routing `filters`
     field already supports this; the funnel should ask the knock-out
     questions early so unqualified users get a useful "no" (or a
     cooperativa route) instead of wasting partner money.
5. **Regulatory delta:** consumer-credit rules — usury caps (BCP publishes
     max rates), mandatory cost transparency if we display rates, and
     Ley 6534/2020 (credit data, Informconf) is *directly* in scope here.
     Copy discipline: we are a *comparador/conector*, we do not lend.
     Google Ads personal-loan policy requires APR-range disclosure on the LP
     — bake it into the loan LP template.
6. **Trust bar is higher.** People fear loan scams; the site must look
     bank-grade and never ask for documents/PINs in the funnel.

## Sequencing recommendation

Do **not** launch both at once. Prove the machine on seguro (phase 1–3,
doc 08), extract the multi-tenant config in phase 4, then launch prestamo as
the second tenant. Realistic effort for prestamo launch on the proven
platform: **3–5 weeks** (mostly content, partner deals and the loan funnel
schema) versus 3+ months standalone.

## Synergies between the two sites

- **Cross-sell:** every funded car loan needs car insurance; life insurance
  is often required for loans → route insurance leads from prestamo into the
  seguro partner pool (consent permitting) at zero acquisition cost.
- Shared partner relationships (banks buy both loan and insurance leads),
  shared invoicing, shared analytics, shared negative-keyword and
  fraud-signal lists.
- One brand family later: "parte del grupo Seguro/Prestamo" trust badge.

The end state is a **Zmarta-style vertical portfolio for Paraguay** on one
codebase — which is why docs 02 and 05 insist that verticals, partners and
routing live in data, not code.
