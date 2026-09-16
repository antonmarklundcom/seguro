# 04 — Google Ads & Landing Page System

Paid is the volume engine while SEO matures. The two assets that decide unit
economics are **message-matched landing pages** (conversion rate, Quality
Score) and **closed-loop conversion tracking** (bidding on lead *quality*).

> **Stack note (2026-09-16):** `/lp/*` pages are static HTML + PHP pages
> from the `php-site-template`, not React components — see `docs/02`.

## Landing page system (`/lp/*`)

- Built from the template's shared partials, same as SEO pages, but: no
  header nav, one CTA, `noindex,follow`.
- A LP is a `content/page.php` (or dedicated `lp`) record: `{ vertical,
  headline, subheadline, offer, audience, city?, form-variant,
  trust-blocks[] }`. Creating a variant is a small content record, so
  *every ad group gets a message-matched LP*:

```
/lp/seguro-auto-cotiza/          ← generic "cotizá en 2 minutos"
/lp/seguro-auto-barato/          ← price angle ("desde ₲ …/mes")
/lp/seguro-auto-asuncion/        ← geo match
/lp/seguro-moto-ya/              ← moto + urgency
/lp/seguro-medico-familia/       ← audience match
```

- **Dynamic text insertion:** a small vanilla-JS snippet
  (`assets/js/lp-dynamic-text.js`) reads `utm_term`/ValueTrack params to
  echo the keyword in the headline where sensible, with a safe fallback to
  the default headline if no param is present or matched.
- **A/B testing:** start with a **PHP-set cookie bucket** on first visit
  (server-side, no edge runtime needed) + a GA4 experiment custom
  dimension. One test at a time, conversion (lead submit) as the only
  metric that decides.
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

1. **GA4 (client-side) + the CRM-provided `vc-attribution.js`** for
   first-touch UTM/gclid/fbclid capture into the `vc_attr` cookie. No
   server-side GTM container at launch — that assumed a Node/container
   runtime this stack doesn't have (see `PLAN.md` §7); revisit only if
   ad-blocker loss becomes measurably significant.
2. **GA4 events:** `lp_view → funnel_start → funnel_step_n → lead_submit →
   lead_valid` (fired once the mirror write + CRM POST both complete) →
   import to Google Ads.
3. **Enhanced Conversions for Leads:** hash email/phone at submit, send with
   `gclid`.
4. **Offline Conversion Import (OCI):** a small scheduled script (cron or
   manual, reading `storage/leads/leads.ndjson` + VenderCRM outcome
   exports — see docs/05) pushes lead-lifecycle upgrades back to Google Ads
   by `gclid`:
   - `lead_valid` (passed validation, reached VenderCRM) — small value
   - `lead_accepted` (partner accepted) — medium value
   - `policy_sold` (partner reported sale) — full value
   Then bid **tCPA → tROAS on stage values** once this exists. This is the
   single biggest lever in the whole plan: it makes Google optimize for
   revenue-quality leads while competitors optimize for form-fills. Not a
   launch blocker — build it once there's enough volume to matter.
5. **Every lead stores its full attribution:** `gclid`, UTMs, LP slug, A/B
   bucket, referrer, device — attribution is a first-class field set in the
   `leads.ndjson` mirror, not a GA-only concern (doc 05).

## Budget ramp (suggestion)

| Phase | Monthly budget | Goal |
|-------|----------------|------|
| Weeks 1–4 | US$ 500–1,000 | Auto only; validate CVR ≥ 8 % LP→lead and CPL below partner price |
| Months 2–3 | US$ 1,500–3,000 | Add moto + médico; switch to tCPA once ≥ 30 conv/month |
| Months 4+ | scale to marginal CPL | OCI live → value-based bidding; add PMax + remarketing |

Kill criteria per ad group: 200 clicks with CVR < 3 % → LP or intent problem;
pause and rework rather than bleed.
