# seguro.com.py — Insurance Lead Generation Platform for Paraguay

Comparison & lead-generation site for insurance in Paraguay (Spanish, es-PY).
Model inspired by Swedish comparison sites (Insplanet, Compricer, Zmarta):
high-converting landing pages → qualified leads → routed to the right insurance
partner → paid per lead (CPL) or per closed policy.

**Domain:** seguro.com.py
**Audience:** Paraguayan consumers and small businesses
**Language:** Spanish (es-PY), mobile-first, WhatsApp-centric

## Documentation

| Doc | Contents |
|-----|----------|
| [01 — Vision & Market](docs/01-vision-and-market.md) | Business model, Paraguay market, verticals, partners |
| [02 — Architecture](docs/02-architecture.md) | Tech stack, system design, repo layout, infra |
| [03 — Site Structure & SEO](docs/03-site-structure-seo.md) | URL architecture, content plan, technical SEO |
| [04 — Google Ads & Landing Pages](docs/04-google-ads-landing-pages.md) | Campaign structure, LP system, tracking, conversion feedback |
| [05 — Lead Engine](docs/05-lead-engine.md) | Data model, validation, scoring, routing, partner delivery |
| [06 — Risks & Problems](docs/06-risks-and-problems.md) | Regulatory, market, technical and business risks |
| [07 — Opportunities](docs/07-opportunities.md) | Growth levers beyond the base plan |
| [08 — Roadmap](docs/08-roadmap.md) | Phased delivery plan with milestones |
| [09 — Multi-Vertical Platform](docs/09-multi-vertical-prestamo.md) | Reusing the platform for prestamo.com.py and other verticals |
| [10 — Legal & Compliance (Paraguay)](docs/10-legal-compliance-paraguay.md) | Operating unlicensed as a marketing partner: Ley 827/96 line, Ley 7593/2025 data protection, consumer/anti-spam rules, EAS/tax, contract checklist |

## TL;DR of the plan

1. **Next.js (App Router) + TypeScript** front end: statically generated,
   fast, SEO-perfect landing pages in Spanish.
2. **Fastify lead API + PostgreSQL + BullMQ (Redis)** back end: validates,
   scores, dedupes and routes leads to partners via webhook / email / WhatsApp,
   with retries and full audit trail.
3. **Two page systems:** indexable SEO pages (`/seguro-de-auto/…`) and
   noindexed, message-matched Ads landing pages (`/lp/…`) generated from the
   same component library.
4. **Closed-loop tracking:** server-side GTM + Enhanced Conversions for Leads
   feed lead *quality* (not just volume) back into Google Ads bidding.
5. **Platform, not site:** everything is config-driven per vertical so the
   same codebase powers prestamo.com.py and future domains.
