# 09 — Multi-Vertical Platform: prestamo.com.py (and beyond)

> **Stack note (2026-09-16):** the mechanism for "multi-vertical" changed
> with the switch to the static HTML + PHP stack (`PLAN.md` v3). It is no
> longer "one Next.js monorepo, multi-tenant by domain, shared Prisma
> schema" — it is **a second clone of `antonmarklundcom/php-site-template`**,
> its own repo, its own `content/*.php` files and its own Hostinger hosting
> slot, reusing the same market module, the same VenderCRM lead-capture
> pattern and the same page templates. The *business* argument below (why
> préstamos is the same business as insurance lead-gen, what changes per
> vertical, sequencing) is unchanged — only "what transfers" and "how it's
> implemented" are rewritten.

**Short answer: yes — this pattern fits prestamo.com.py almost perfectly,
and the plan is deliberately built so that it does.** Loans (préstamos) is
the *same business* as insurance lead-gen: capture intent → qualify → route
to partner → get paid per lead/funded loan. It is exactly the Swedish
pattern: Insplanet/Compricer (insurance) and Lendo/Sambla/Zmarta (loans) run
on the same machinery — in the owner's case, the same **template**, not the
same running application.

## What transfers 1:1 (as a template pattern, not shared code)

| Component | Reuse |
|-----------|-------|
| Lead capture (`enviar.php` → VenderCRM, persist-first mirror, honeypot, idempotency key) | Same pattern, new repo — each site has its own `VENDERCRM_API_KEY` and its own `leads.ndjson` |
| Templates (`service`, `article`, `tool`, `guide`, `segment`, `page`, `stub`) + partials | Unchanged — new funnel = new `content/*.php` records using the same templates |
| Market module (`lib/market/paraguay.php`) | Unchanged — money/date/tax-id formatting is shared across both sites via the template |
| SEO architecture (pillar/geo/brand/guía structure, sitemaps, JSON-LD) | Same patterns: `/prestamos-personales/`, `/prestamo/[banco]/`, guías, each as its own content records in the new repo |
| Lead-schema fields (contact, payload, attribution, consent) | Same JSON-Lines shape (doc 05), independent files per site |
| `verify.sh` build gate, deploy pipeline | Unchanged — each clone ships its own copy |

Implementation: **a second GitHub repo** (`prestamo-com-py` or similar),
created from the same `php-site-template`, with its own site identity,
content and VenderCRM site record. There is no shared runtime, shared
database or shared deploy pipeline between `seguro.com.py` and
`prestamo.com.py` — the "platform" is the *template and the pattern*, kept
in sync by fixing shared bugs in `php-site-template` itself (per that
skill's "improving the template" rule), not by a multi-tenant app.

## What changes for prestamo

1. **Funnel fields:** loan amount, term, income, employment type (formal/
     informal — IPS contributor or not is *the* qualifier in PY), existing
     debts, purpose. Slider-based amount picker converts best (see Lendo) —
     built as a vanilla-JS funnel step, same pattern as the auto-insurance
     funnel.
2. **Partners:** banks (Ueno, Itaú, Familiar, Continental, Visión, Atlas),
     financieras (Solar, Fic, Crediágil-type), fintechs and cooperativas.
     Cooperativas are a PY specialty — huge lending share, very local, likely
     eager lead buyers.
3. **Economics:** loan leads are worth **more** per lead and CPCs are
     higher; funded-loan CPA deals are standard.
4. **Scoring:** pre-qualification rules per partner (min income, formal
     employment, age, Informconf status question) — ask the knock-out
     questions early in the funnel so unqualified users get a useful "no"
     (or a cooperativa route) instead of a wasted submission. With no
     database, this stays copy/UX logic in the funnel, not a routing-engine
     filter.
5. **Regulatory delta:** consumer-credit rules — usury caps (BCP publishes
     max rates), mandatory cost transparency if we display rates, and
     Ley 6534/2020 (credit data, Informconf) is *directly* in scope here.
     Copy discipline: we are a *comparador/conector*, we do not lend.
     Google Ads personal-loan policy requires APR-range disclosure on the LP
     — bake it into the loan LP content record.
6. **Trust bar is higher.** People fear loan scams; the site must look
     bank-grade and never ask for documents/PINs in the funnel.

## Sequencing recommendation

Do **not** launch both at once. Prove the machine on seguro (phases 1–3,
doc 08), then launch prestamo as a second template-repo clone. Realistic
effort for the prestamo launch on the proven pattern: **on the order of a
few Sonnet-session weeks** (mostly content, partner deals and the loan
funnel copy) versus building it standalone, because the template, the
lead-capture pattern and the SEO structure are already proven — there is no
shared codebase to migrate or extract, just a fresh clone with new content.

## Synergies between the two sites

- **Cross-sell:** every funded car loan needs car insurance; life insurance
  is often required for loans → route insurance leads from prestamo into the
  seguro partner pool (consent permitting) at zero acquisition cost — a
  manual/WhatsApp handoff at this scale, not an automated integration.
- Shared partner relationships (banks buy both loan and insurance leads),
  shared VenderCRM account structure (as separate Sitios entries), shared
  negative-keyword and fraud-signal lists, shared owner know-how.
- One brand family later: "parte del grupo Seguro/Prestamo" trust badge.

The end state is a **Zmarta-style vertical portfolio for Paraguay**, built
as **independent template-repo sites sharing a proven pattern** — which is
why the template's content-as-data discipline (docs/02) matters: every new
vertical or market is new content and a new repo, not a rewrite.
