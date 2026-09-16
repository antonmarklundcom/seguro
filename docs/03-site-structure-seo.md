# 03 — Site Structure & SEO

Goal: own the Paraguayan search results for insurance intent, the way Swedish
comparison sites own "jämför försäkring". Spanish (es-PY), Google.com.py.

> **Stack note (2026-09-16):** the site ships as static HTML + PHP pages
> from `content/<type>.php` records (see `docs/02`), not Next.js routes.
> Paths below (e.g. `/cotizar/[vertical]/`) describe the **URL pattern**,
> not a framework routing syntax — each concrete URL is its own content
> record + route file in the PHP template.

## URL architecture

Flat, keyword-first, fully in Spanish. Every indexable page targets exactly
one intent cluster.

```
seguro.com.py/
├── /                                  → "seguros en Paraguay" (brand + category)
│
├── /seguro-de-auto/                   → pillar: seguro de auto Paraguay
│   ├── /seguro-de-auto/cotizar/       → funnel entry (indexable, transactional)
│   ├── /seguro-de-auto/asuncion/      → geo page (template)
│   ├── /seguro-de-auto/ciudad-del-este/
│   ├── /seguro-de-auto/contra-terceros/   → subtype pages
│   ├── /seguro-de-auto/todo-riesgo/
│   └── /seguro-de-auto/toyota-hilux/  → long-tail: by popular vehicle (phase 2)
│
├── /seguro-de-moto/                   → same template per vertical
├── /seguro-medico/
├── /seguro-de-vida/
├── /seguro-de-hogar/
├── /seguro-de-viaje/
│   └── /seguro-de-viaje/schengen/     → high-intent visa traffic
│
├── /aseguradoras/                     → hub: "las aseguradoras del Paraguay"
│   ├── /aseguradoras/mapfre/          → brand pages (huge SEO opportunity:
│   ├── /aseguradoras/la-consolidada/     people search insurer names, we
│   └── ...                               rank + convert them to comparison)
│
├── /guias/                            → editorial content (`guide` template)
│   ├── /guias/que-cubre-el-seguro-contra-terceros/
│   ├── /guias/cuanto-cuesta-el-seguro-de-auto-en-paraguay/
│   └── ...
│
├── /cotizar/[vertical]/               → the multi-step funnel (noindex steps ≥2)
├── /lp/[slug]/                        → Google Ads LPs — noindex,follow (doc 04)
├── /socios/                           → B2B page for partner acquisition
└── /sobre-nosotros/, /contacto/, /privacidad/, /terminos/
```

**Rules**
- One intent = one page. `cotizar seguro de auto` and `seguro de auto precio`
  belong to the same pillar; `seguro de moto` is its own page.
- Geo pages only for cities with real volume (Asunción, Ciudad del Este,
  Encarnación, Luque, San Lorenzo, Capiatá…) and each gets *localized*
  content blocks (local broker info, local stats), never pure find-replace —
  thin doorway pages are a Google penalty risk.
- Slugs without accents (`asuncion`, not `asunción`), lowercase, hyphens.

## Keyword clusters (initial research targets)

> ⚠️ **These are example seed terms, not real data.** The table below was
> drafted for planning purposes and has **not** been validated against
> Google Keyword Planner or Search Console. Before locking the final page
> list for T1/T2 (`PLAN.md` §4), run a real keyword-research pass for es-PY
> insurance terms — the `google-kwp-batches` process/skill exists for
> exactly this — and revise clusters, priorities and page counts against
> actual search volume, not this placeholder list.

| Cluster | Example queries (es-PY) | Page |
|---------|--------------------------|------|
| Category | seguros paraguay, comparar seguros | `/` |
| Auto transactional | seguro de auto, cotizar seguro auto, seguro vehicular paraguay | `/seguro-de-auto/` |
| Auto price | cuánto cuesta el seguro de auto | guía + pillar section |
| Subtype | seguro contra terceros, seguro todo riesgo | subtype pages |
| Moto | seguro de moto paraguay | `/seguro-de-moto/` |
| Brand | mapfre paraguay teléfono, la consolidada seguros | `/aseguradoras/*` |
| Travel/visa | seguro de viaje schengen | `/seguro-de-viaje/schengen/` |

Volumes in PY are modest per-term but the long tail is wide open — a
technically clean site with 50 good pages can dominate quickly. **Again:**
treat these clusters and pages as a starting hypothesis for content
planning, not a final, KWP-validated page list.

## Technical SEO checklist

- **Rendering:** every page is pre-built static HTML (no client-rendered
  content, no framework hydration) — there is no SSG/ISR build step because
  there is no build step at all. When a reference number or piece of copy
  changes, edit the `content/*.php` record and redeploy; for genuinely
  time-sensitive figures, say "consulte el monto vigente" rather than
  faking freshness (see docs/02 §7 migration notes, docs/10 no-overpromise
  rule).
- **Metadata:** per-page `title`/`description` templates per vertical,
  driven from `content/*.php` fields — never hardcoded per page. **OG
  images:** a small set of static, pre-made images per template type (home,
  pillar, guía, `/lp/`), not a generated-per-page pipeline — see `PLAN.md`
  §7 for why a Node/`@vercel/og`-style generator isn't used here.
- **Structured data (JSON-LD):** `Organization`, `WebSite` (+sitelinks
  searchbox), `FAQPage` on pillars, `BreadcrumbList`, `Service`/`Product`
  with `AggregateRating` once reviews exist (star snippets = CTR weapon),
  `InsuranceAgency` for partner/brand pages. Emitted inline in each PHP
  template.
- **hreflang:** `es-PY` as default; skip multi-language until Guaraní/EN
  content actually exists.
- **Sitemaps:** a static `sitemap.xml` (segmented into
  `sitemap-pillars.xml`, `sitemap-guias.xml`, `sitemap-aseguradoras.xml` if
  the template's router supports multiple sitemap files) — makes indexing
  problems diagnosable per section in Search Console.
- **Canonicals everywhere;** `/lp/*` and funnel steps `noindex`.
- **Internal linking:** pillar ↔ guías ↔ brand pages, breadcrumbs sitewide;
  every guía links to its funnel ("Cotizá tu seguro →").
- **robots.txt:** allow all except `/lp/`, funnel steps ≥ 2.

## Content plan

Cadence: **2 guías/week** for the first 6 months (can be produced cheaply and
reviewed by a local). Every guía answers one real question, in Paraguayan
Spanish (voseo: "cotizá", "elegí"), with concrete guaraní prices and local
examples. Content is a `content/guide.php` record per guía — versioned,
reviewable in PRs, same as every other page.

E-E-A-T signals: named author with bio, "revisado por" a licensed local
broker (partner win-win), cited sources (BCP/Superintendencia statistics),
visible last-updated dates.

## SEO problems to avoid from day 1

1. **Doorway-page trap** — geo/brand templates must each have unique,
   genuinely useful content blocks.
2. **Ads LPs leaking into the index** — duplicate-content cannibalization;
   `noindex` from the first deploy.
3. **Funnel eating crawl budget** — funnel step URLs must be blocked in
   `robots.txt` and marked `noindex`.
4. **es-ES Spanish** — wrong dialect reads foreign and hurts trust *and*
   relevance; all copy through a Paraguayan reviewer.
5. **Launching thin** — go live with 15–20 strong pages, not 200 stubs.
