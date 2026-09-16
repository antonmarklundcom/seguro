# 06 — Risks & Problems (see them before they see us)

Honest list, ordered by how likely they are to actually hurt.

> **Stack note (2026-09-16):** items #12–15 below were written for the
> Next.js/Postgres/BullMQ design and are restated for the static HTML + PHP
> stack (`PLAN.md` v3). The risks themselves — lead loss, tracking
> fragility, spam, vendor sprawl — are unchanged; only the technical detail
> is updated.

## Business / market

1. **Partner side is the hard side, not traffic.** Generating leads is a
   solved problem; getting Paraguayan insurers to *pay per lead* and *follow
   up fast* is not. Insurers may be slow, offline-oriented, and used to
   agent networks. **Mitigation:** start with hungry independent brokers on
   simple WhatsApp delivery + manual invoicing; prove revenue before
   pitching insurers. Have 2 partner LOIs *before* spending on ads.

2. **Slow partner follow-up kills the flywheel.** A lead called after 3 days
   doesn't convert → partner says "your leads are bad" → churn.
   **Mitigation:** measure time-to-contact (outcome feedback, tracked
   manually or via VenderCRM), route away from slow partners, send the
   consumer the partner's contact too (double-sided connection).

3. **Small absolute market.** PY insurance search volume is limited; the
   ceiling for a single vertical is real. **Mitigation:** multi-vertical
   platform from day 1 (docs 02/09) — the same template pattern runs
   préstamos, telecom, etc. as separate site clones. Portfolio economics,
   not single-site economics.

4. **Lead quality disputes.** Partners contest leads to lower bills.
   **Mitigation:** full lead record per lead in `leads.ndjson` (doc 05,
   contact + attribution + payload), clear crediting policy
   (duplicates/invalid phones auto-credited).

5. **Cash-flow / currency.** Ad spend in USD, revenue in PYG with net-30+
   from local partners. **Mitigation:** prepaid lead packages for new
   partners; price CPL in PYG but review monthly against USD.

## Regulatory / legal

6. **Insurance intermediation rules.** The Superintendencia de Seguros (BCP)
   licenses brokers ("corredores"). A pure lead-gen/marketing model
   (introducing, not advising or selling) usually falls outside broker
   licensing — but this **must be confirmed by a local lawyer before
   launch**, and copy must avoid "asesoramos/recomendamos" language that
   implies advice. Alternative structure if needed: partner with a licensed
   broker as merchant of record.

7. **Data protection.** Selling personal data without proper consent is the
   existential legal risk for a lead business. Paraguay's framework is
   tightening (Ley 6534/2020 today; Ley 7593/2025 advancing toward full
   force). **Mitigation:** explicit versioned consent, DPAs with partners,
   GDPR-grade practices from day 1 (doc 05) — cheaper than retrofitting.

8. **Bidding on competitor/insurer brand names** in Google Ads can trigger
   complaints. Legal-check locally; start without brand campaigns.

## SEO / traffic

9. **Google policy risk for lead-gen sites.** Thin doorway pages, fake
   reviews, or "site reputation abuse" patterns get penalized. **Mitigation:**
   genuine content depth per page (doc 03), real reviews only, no rented
   subdomains.

10. **SEO takes 6–12 months.** The gap must be bridged by paid — budget for
    it (doc 04) or the project dies in the trough. Set expectations now.

11. **Exact-match domain, weak brand.** `seguro.com.py` ranks-friendly but
    brandable? Users must *remember* it to come back. **Mitigation:** treat
    "Seguro" as a brand (logo, consistent voice), buy the brand search term.

## Technical

12. **Lead loss = direct revenue loss.** A failed `enviar.php` request, a
    hosting outage mid-write, or a VenderCRM POST that silently fails could
    each cost a lead. **Mitigation:** persist-first append to
    `storage/leads/leads.ndjson` *before* the VenderCRM call (docs/02/05),
    so the append is the durability boundary rather than an external
    service's success response; weekly reconciliation of `leads.ndjson` row
    counts vs. VenderCRM's Sitios lead count vs. GA4 `lead_submit` events —
    the numbers must match (doc 05).

13. **Tracking fragility.** Ad blockers, iOS ITP, or a mis-set
    `vc-attribution.js` snippet → attribution gaps and Google bids blind.
    **Mitigation:** the CRM-provided attribution cookie is first-party on
    the CRM's own domain (mitigates some blocking); treat any large gap
    between GA4 and `leads.ndjson` counts as a tracking-fragility signal to
    investigate, not a lead-loss signal (doc 05's reconciliation section
    explains the difference).

14. **Form spam / click fraud.** Competitors and bots can poison lead quality
    and waste budget. **Mitigation:** honeypot field + time-to-submit floor
    on every form (already in the template's `enviar.php` pattern); add
    Cloudflare Turnstile only if spam volume actually shows up in
    `leads.ndjson`; monitor invalid-lead rate per source.

15. **Single-founder bus factor / vendor sprawl.** Keep the stack boring and
    documented (this repo *is* the documentation). The static HTML + PHP
    stack is deliberately narrower than a Node/Postgres/queue stack would
    be: fewer services to patch, a plain git repo + a flat log file to back
    up, and a hosting account (Hostinger shared hosting) that needs no
    database administration at all.

## Product

16. **"Comparison" promise without live prices.** Real-time quote APIs from
    PY insurers mostly don't exist; if the site over-promises instant price
    comparison and delivers "a broker will call you", trust drops.
    **Mitigation:** honest UX — "recibí cotizaciones de hasta 3 aseguradoras
    en 24 h"; add indicative price tables (from partner rate cards) as a
    differentiator; move toward API quoting with the most digital partner
    later.
