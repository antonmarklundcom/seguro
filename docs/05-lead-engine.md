# 05 — Lead Capture (formerly "Lead Engine")

> **Rewritten 2026-09-16** for the static HTML + PHP stack (`PLAN.md` v3).
> The **lead schema/fields, the VenderCRM-as-CRM-of-record decision, and the
> compliance requirements below are unchanged locked decisions** — only the
> implementation (no database, no queue, no partner-routing worker) changed.
> The full partner-routing/scoring/billing design that used to live in this
> file (Prisma `Partner`/`PartnerVertical`/`LeadDelivery` models, a BullMQ
> worker, a partner portal) is **out of scope for this repo** — see
> `PLAN.md` §7 "Migration notes" and §4 "Not in this repo". At launch, the
> owner works the VenderCRM pipeline and forwards leads to brokers manually
> (decision E, `PLAN.md`). If partner volume ever justifies an automated
> routing/delivery/billing engine, it is built as a **separate app**, not
> retrofitted into this brochure site.

## What this site actually does with a lead

`ingest → validate → persist (mirror) → deliver to VenderCRM → thank-you`.
That's the whole pipeline for launch. Dedup, scoring, routing, delivery
retries and billing are VenderCRM's job (dedup, pipeline stages) or the
owner's manual job (routing to a broker, billing) until a partner engine is
ever justified.

## Lead fields (locked — same fields as v2, different storage)

Every lead captured, whether from a page form, a funnel or a `/lp/` page,
carries these fields. In v2 this was a Postgres/MySQL row; now it is one
JSON object appended as a line to `storage/leads/leads.ndjson`.

```json
{
  "id": "uuid-or-timestamp-based",
  "created_at": "2026-09-16T14:32:00-04:00",
  "status": "new",
  "vertical": "seguro-de-auto",
  "page_slug": "/seguro-de-auto/cotizar/",
  "name": "…",
  "phone": "+595981123456",
  "email": null,
  "city": "asuncion",
  "payload": { "marca": "Toyota", "anio": 2019, "…": "…" },
  "gclid": null,
  "fbclid": null,
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "…",
  "utm_term": "…",
  "landing_page": "/lp/seguro-auto-cotiza/",
  "referrer": "https://www.google.com/",
  "device": "mobile",
  "consent_at": "2026-09-16T14:32:00-04:00",
  "consent_text_version": "2026-09-v1",
  "crm_result": { "status": 201, "duplicate": false, "contact_id": "…" }
}
```

`status` values: `new`, `partial` (funnel abandoned after phone entered),
`sent` (VenderCRM POST succeeded), `crm_failed` (mirror has it, CRM call
failed — logged + email fallback fired). There is no `DUPLICATE` status
here — VenderCRM's own idempotency-key replay and per-site dedup handle
that; this file is a durability mirror, not a system of record for pipeline
state.

## Pipeline

### 1. Ingest & validate — `enviar.php` (synchronous, on the same PHP-FPM
request that served the form)
- Honeypot field check first — non-empty means silent redirect to
  thank-you, nothing else runs.
- `phone` is required and validated/normalized; everything else is
  optional per the fields table above.
- Time-to-submit floor (reject submissions faster than a human could
  plausibly fill the form) as a lightweight spam defense — no Turnstile at
  launch; add it only if spam volume actually shows up in `leads.ndjson`.

### 2. Persist first — append to `storage/leads/leads.ndjson`
- One JSON line per lead/partial-lead, written **before** anything else
  touches the network. This file is outside the web root or denied via
  `.htaccess`, never publicly servable.
- This step must succeed (or the visitor sees an error) before step 3 runs
  — the mirror, not the CRM response, is the source of truth for "was this
  lead captured".

### 3. Deliver to VenderCRM — `POST {CRM_URL}/api/v1/leads`
- `idempotency_key = sha256(phone + "|" + date("Y-m-d-H"))` — collapses
  accidental double-submits within the same hour without blocking a
  genuine re-enquiry the next day.
- `X-Api-Key` from `getenv('VENDERCRM_API_KEY')` — server-side only, never
  in HTML/JS, never committed.
- Wrapped in try/catch with a ~10s timeout. On success (`201` or the
  idempotency-replay `200`), update the mirror line's `crm_result` (or log
  a matching line) for the reconciliation pass. On failure, log loudly
  (include the response body — it names the field on a `422`) and send the
  template's existing email fallback; **never** block the redirect on this.
- **Never send** pipeline, stage, owner or tag — routing lives in
  VenderCRM's Sitios config for this site, exactly as the
  `vendercrm-lead-capture` skill specifies.

### 4. Always redirect to thank-you
Regardless of step 3's outcome, the visitor reaches the thank-you page.
A visitor who filled in a form and hit an error page is a lost customer; a
logged CRM failure with the lead safely in `leads.ndjson` is a five-minute
fix later.

### 5. Attribution
`vc-attribution.js` (served from `{CRM_URL}/vc-attribution.js`, per the
`vendercrm-lead-capture` skill) runs on every page and stores first-touch
`utm_*`/`gclid`/`fbclid` in the `vc_attr` cookie for 90 days. `enviar.php`
reads that cookie server-side and includes it both in the `leads.ndjson`
line and in the VenderCRM payload.

## What VenderCRM already handles (not rebuilt here)

- Contact dedup and pipeline stages (Nuevo → Contactado → Cotizado →
  Negociando → Ganado/Perdido), configured once under **Sitios**.
- Per-site lead counts and UTM attribution reporting.
- Idempotency-key replay (`200` with `duplicate: true`) instead of creating
  a second contact.

## Reconciliation (replaces the v2 "weekly GA4 vs. DB vs. deliveries" report)

Weekly, compare:
1. Row count in `storage/leads/leads.ndjson` for the period.
2. VenderCRM Sitios lead count for the same site/period.
3. GA4 `lead_submit` event count for the same period.

All three should be close; a gap between (1) and (2) means the CRM POST is
failing more than expected (check the `crm_failed` mirror entries and the
email fallback inbox); a gap between (1) and (3) means the tracking snippet
or an ad blocker is undercounting, not that leads are being lost. This can
start as a manual monthly check (`grep`/`jq` over the ndjson file) and
become a small script later — it does not need a dashboard at launch.

## Compliance & data protection (unchanged from v2)

- Explicit consent checkbox (unticked) with versioned text: *"Acepto que
  mis datos sean compartidos con las aseguradoras/corredores seleccionados
  para recibir cotizaciones."* Store timestamp + text version per lead (now
  as `consent_at` / `consent_text_version` fields in the `leads.ndjson`
  line, per docs/10 §4).
- Paraguay: Ley 6534/2020 (personal credit data, out of scope — we never
  collect credit data) and Ley 7593/2025 (personal data protection,
  vacatio legis to ~Nov 2027, build to its standard now) — see docs/10 for
  the full framework. One local legal review of the consent flow and the
  privacy policy before launch (⚖️L1, `PLAN.md` §5).
- Design to GDPR-like standards anyway: data minimization, retention limits
  (e.g. purge raw IP after 90 days — a small scheduled script can rewrite
  `leads.ndjson` dropping stale IPs, since there is no `DELETE ... WHERE`
  without a database), deletion on request (ARCO), DPAs with partners.
- Secrets never in repo; PII never in logs (log the CRM response body's
  error *field name*, not the lead's PII, when troubleshooting a `422`);
  the mirror file itself is PII and must be excluded from any public path,
  backup export or screenshot; VenderCRM calls are HTTPS-only.

## Future: if a partner-routing engine is ever built

Not scheduled, not blocking launch. If a signed partner needs automated
routing, delivery and billing beyond "the owner forwards by WhatsApp and
invoices manually," that is a new, separate application — most naturally a
small Node/Next.js service on the `nodejs-mysql-hostinger-stack` pattern,
reading a real database seeded/imported from `leads.ndjson` and VenderCRM's
own exports, rather than adding a database to this brochure site. The v2
`Vertical`/`Partner`/`PartnerVertical`/`LeadDelivery` schema sketch remains
a reasonable starting point for that future app's design, but it does not
belong in this repo.
