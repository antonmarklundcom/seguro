# 04 — Google Ads & Landing Page System

Paid is the volume engine while SEO matures. The two assets that decide unit
economics are **message-matched landing pages** (conversion rate, Quality
Score) and **closed-loop conversion tracking** (bidding on lead *quality*).

## Landing page system (`/lp/*`)

- Built from the same block library as SEO pages, but: no header nav, one
  CTA, `noindex,follow`.
- A LP is a config object: `{ vertical, headline, subheadline, offer,
  audience, city?, form-variant, trust-blocks[] }`. Creating a variant is a
  10-line file, so *every ad group gets a message-matched LP*:

```
/lp/seguro-auto-cotiza/          ← generic "cotizá en 2 minutos"
/lp/seguro-auto-barato/          ← price angle ("desde ₲ …/mes")
/lp/seguro-auto-asuncion/        ← geo match
/lp/seguro-moto-ya/              ← moto + urgency
/lp/seguro-medico-familia/       ← audience match
```

- **Dynamic text insertion:** LP reads `utm_term`/ValueTrack params to echo
  the keyword in the headline where sensible (with a safe fallback).
- **A/B testing:** start with Vercel Edge Middleware bucketing + GA4
  experiment dimension. One test at a time, conversion (lead submit) as the
  only metric that decides.
- **Mobile-first:** click-to-WhatsApp and click-to-call buttons alongside the
  form — in Paraguay a WhatsApp conversation *is* a lead (tracked as such).

## Account structure

```
Account (PYG, es)
├── Search — Auto — Brand-none        [exact/phrase, STAG structure]
│   ├── AG: cotizar seguro auto      → /lp/seguro-auto-cotiza/
│   ├── AG: seguro auto precio/barato→ /lp/seguro-auto-barato/
│   ├── AG: seguro auto asuncion     → /lp/seguro-auto-asuncion/
│   └── AG: seguro contra terceros   → /lp/seguro-terceros/
├── Search — Moto
├── Search — Médico
├── Search — Competitor/Brand         [insurer names — legal-check first, doc 06]
├── Search — Brand (seguro.com.py)    [defend cheaply once brand exists]
├── PMax — feed-less                  [only after search proves LTV, isolated budget]
└── Remarketing — funnel abandoners   [GDN + YouTube, "terminá tu cotización"]
```

Principles: tight single-theme ad groups (STAG), exact+phrase only at start,
aggressive negative lists shared account-wide (gratis, empleo, curso, dgi…),
Asunción/Central geo-tiered bids, Spanish **and** Guaraní language targeting
(bilingual users have mixed browser settings).

## Tracking architecture (the moat)

The Swedish players win on feedback loops: they bid on what *closes*, not
what *clicks*. Plan:

1. **Consent Mode v2 + GTM (server-side container)** on a first-party
   subdomain (`t.seguro.com.py`) — resilient to ad blockers/ITP, and keeps
   PII handling under our control.
2. **GA4 events:** `lp_view → funnel_start → funnel_step_n → lead_submit →
   lead_valid` (server-fired after validation) → import to Google Ads.
3. **Enhanced Conversions for Leads:** hash email/phone at submit, send with
   `gclid`.
4. **Offline Conversion Import (OCI):** worker pushes lead-lifecycle upgrades
   back to Google Ads by `gclid`:
   - `lead_valid` (passed validation/dedup) — small value
   - `lead_accepted` (partner accepted) — medium value
   - `policy_sold` (partner reported sale) — full value
   Then bid **tCPA → tROAS on stage values**. This is the single biggest
   lever in the whole plan: it makes Google optimize for revenue-quality
   leads while competitors optimize for form-fills.
5. **Every lead stores its full attribution:** `gclid`, UTMs, LP slug, A/B
   variant, referrer, device — attribution is a first-class column set in
   the DB, not a GA-only concern (doc 05).

## Budget ramp (suggestion)

| Phase | Monthly budget | Goal |
|-------|----------------|------|
| Weeks 1–4 | US$ 500–1,000 | Auto only; validate CVR ≥ 8 % LP→lead and CPL below partner price |
| Months 2–3 | US$ 1,500–3,000 | Add moto + médico; switch to tCPA once ≥ 30 conv/month |
| Months 4+ | scale to marginal CPL | OCI live → value-based bidding; add PMax + remarketing |

Kill criteria per ad group: 200 clicks with CVR < 3 % → LP or intent problem;
pause and rework rather than bleed.
