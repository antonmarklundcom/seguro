# 03 — Site Structure & SEO

Goal: own the Paraguayan search results for insurance intent, the way Swedish
comparison sites own "jämför försäkring". Spanish (es-PY), Google.com.py.

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
├── /guias/                            → editorial content (MDX)
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
technically clean site with 50 good pages can dominate quickly.

## Technical SEO checklist

- **Rendering:** SSG/ISR for all indexable pages — full HTML, no
  client-rendered content. ISR revalidation for price/partner data.
- **Metadata:** per-page `title`/`description` templates per vertical; OG
  images generated per page (`@vercel/og`).
- **Structured data (JSON-LD):** `Organization`, `WebSite` (+sitelinks
  searchbox), `FAQPage` on pillars, `BreadcrumbList`, `Service`/`Product`
  with `AggregateRating` once reviews exist (star snippets = CTR weapon),
  `InsuranceAgency` for partner/brand pages.
- **hreflang:** `es-PY` as default; skip multi-language until Guaraní/EN
  content actually exists.
- **Sitemaps:** segmented (`sitemap-pillars.xml`, `sitemap-guias.xml`,
  `sitemap-aseguradoras.xml`) — makes indexing problems diagnosable per
  section in Search Console.
- **Canonicals everywhere;** `/lp/*` and funnel steps `noindex`.
- **Internal linking:** pillar ↔ guías ↔ brand pages, breadcrumbs sitewide;
  every guía links to its funnel ("Cotizá tu seguro →").
- **Core Web Vitals:** budget in doc 02, enforced in CI.
- **robots.txt:** allow all except `/lp/`, `/api/`, funnel steps.

## Content plan

Cadence: **2 guías/week** for the first 6 months (can be produced cheaply and
reviewed by a local). Every guía answers one real question, in Paraguayan
Spanish (voseo: "cotizá", "elegí"), with concrete guaraní prices and local
examples. Content in MDX in-repo → versioned, reviewable in PRs.

E-E-A-T signals: named author with bio, "revisado por" a licensed local
broker (partner win-win), cited sources (BCP/Superintendencia statistics),
visible last-updated dates.

## SEO problems to avoid from day 1

1. **Doorway-page trap** — geo/brand templates must each have unique,
   genuinely useful content blocks.
2. **Ads LPs leaking into the index** — duplicate-content cannibalization;
   `noindex` from the first deploy.
3. **Funnel eating crawl budget** — parameterized step URLs must be blocked.
4. **es-ES Spanish** — wrong dialect reads foreign and hurts trust *and*
   relevance; all copy through a Paraguayan reviewer.
5. **Launching thin** — go live with 15–20 strong pages, not 200 stubs.
