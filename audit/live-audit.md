# seguro.com.py: live audit (Phase 0, read-only)

Audited 2026-10-01 (all 55 sitemap URLs fetched, all return 200).
Raw regex scan output: `audit/legal-audit-scan-raw.md` (436 matches; most are false positives, see "Scan triage").

## Facts about the codebase (differs from the brief)

- The local repo is **not** `php-site-template`. It is a dependency-free **Node generator** (`engine/` + `sites/seguro/` → `dist/seguro.com.py/`), Hostinger static output. There is no PHP and no `config.php` today. The form handler will be added as a static PHP file the build copies to `dist/`.
- **Live == local build.** All 55 live pages are byte-identical to `dist/seguro.com.py/`, and a clean rebuild of the source reproduces `dist/` exactly. No differences to list.
- Content lives in `sites/seguro/content/pages.mjs`, `providers.mjs`, `authors.mjs`, `sites/seguro/blog/*.md` and `site.config.mjs` (operator e-mail is set there).
- `engine/verify.mjs` currently **fails the build on `<form`** and on a `vendercrm` string (it was written for "no forms"). It must be changed in P1.

## What the site loads

- Scripts: one first-party `/assets/js/site.js` and JSON-LD only. **No analytics, pixel or third-party script is loaded.**
- `site.js` contains an opt-in Google Tag loader (`window.ANALYTICS_ID`) that is never defined, so it is dead code, but a cookie banner is shown on every page for it. Remove both (default decision): no banner needed.
- Images: none (only inline SVG icons). No insurer logos. Fonts are self-hosted.
- Forms: none; one calculator with two number inputs.
- Hidden text: 11 HTML comments `VERIFY (...)` on the fichas (internal notes leaking into public source).
- Phone/WhatsApp links: none.
- E-mail: `contacto@seguro.com.py` is on **all 55 pages** (footer "Correo de contacto" + JSON-LD `Organization.email`), plus `mailto:` on `/contacto/` and `/aviso-legal/`, plus prose on `/privacidad/`, `/nosotros/`, `/terminos/`.
- JSON-LD types in use: WebSite, Organization, BreadcrumbList, FAQPage (15 pages), Article (10), **WebPage (40), CollectionPage (12), ItemList (7), ContactPage (1), AboutPage (1)**. The last five are outside your allowed list. No InsuranceAgency, Offer, price or Review.
- Prices: only the Gs. 5.000.000 / 1.500.000 / 3.500.000 example (guide + calculator defaults). No premiums.
- "mejor": 3 hits, all in "no ordenamos de mejor a peor" disclaimers or "es mejor preguntarlo". Not endorsements.
- SOAT / SOA / "obligatorio": **no statement that a SOAT/SOA is mandatory.** `/motos/` has a hedged FAQ ("la exigencia ... depende de la normativa vigente"), unsourced.

## External links (13 unique, HTTP status checked 2026-10-01)

| Link | Status | Note |
|---|---|---|
| sanatoriomigone.com.py | 200 | goes away with the ficha |
| asismed.com.py | 200 | goes away |
| santaclara.com.py | 200 | goes away |
| consolidada.com.py, ecp.com.py, mapfre.com.py, sancorseguros.com.py, segurospatria.com.py, tajy.com.py, yacyreta.com.py | 200 | go away with the directory |
| **aseguradoradeleste.com.py** | **no DNS (dead)** | linked from a ficha as "verificado el 2026-09-14": that claim is false |
| bcp.gov.py/superintendencia-de-seguros-i361 | 403 to curl and to a browser user agent | probably bot-blocking; **needs a manual browser check**. This is the only official link left after the rewrite |
| superintendenciadesalud.gov.py | 301 → 200 | update to the final URL |

## Scan triage (436 regex matches)

- 160 low + 65 high `insurer-name`: the names of the 8 insurers / 3 prepagas in their own fichas. Real, but one issue (directory), not 225.
- 55 high `advice`: all one boilerplate sentence on every page, "no brinda asesoramiento personalizado". **False positive** (it is a disclaimer). Reword anyway when the footer text is replaced.
- 129 low `compare`: the word "comparar". Acceptable (criteria only). 
- 4 high `calc-no-disclaimer` / 4 medium `calc-review`: the calculator on 4 pages (the tool does have its own "Simulación didáctica ... no vinculante" box, but the scan wants it directly under the result).
- 2 high `price`: one real (Gs. figures), one false positive ("prima ... surge de").
- 5 medium `ranking`: "más difundida/más elegida" (real, unsourced) and "más barata" quoted in a question (false). 
- 5 medium `cta-sell`: the word "cotizar" in nav/FAQ/headings.
- 4 medium `urgency`: "No constituye una oferta" (false), "Ningún paso es más urgente" (reword).
- 54 pages: site-level top strip missing (expected, not yet built).

## Hand-triaged findings

Risk is exposure to you as owner. **High 11, Medium 16, Low 9.**

| # | URL(s) | Exact text / evidence | Risk | Safe rewrite |
|---|---|---|---|---|
| 1 | all 55 | footer "Correo de contacto contacto@seguro.com.py"; JSON-LD `"email": "contacto@seguro.com.py"` | **high** | Remove address everywhere; footer links to the contact form; drop `operator.email` from config and `email` from schema |
| 2 | `/contacto/`, `/aviso-legal/` | `mailto:contacto@seguro.com.py`, "Este es el único canal de contacto" | **high** | Replace with the 3-step form flow |
| 3 | `/aseguradoras/` + 8 children (Aseguradora del Este, Tajy, La Consolidada, Sancor, MAPFRE, Patria, Aseguradora Yacyretá, El Comercio Paraguayo) | Named-company fichas; titles use the brand ("Tajy: teléfono, sucursales..."); "Verificado el 2026-09-14" only means the website exists | **high** | Replace by "Cómo verificar una aseguradora o un corredor" with BCP link only; 301 children to it |
| 4 | `/aseguradoras/patria/`, `/tajy/` | "Patria se presenta como compañía de capital paraguayo"; "Según información pública, opera en vida, incendio, fianzas..." ; "Tajy opera en varios ramos... entre ellos automotor" | **high** | Unsourced factual claims about named companies; removed with the fichas |
| 5 | `/aseguradoras/aseguradora-del-este/` | Link to dead domain marked "verificado" | **high** | Removed with ficha |
| 6 | `/salud/migone/`, `/asismed/`, `/santa-clara/` | "Migone ... es un prestador de medicina prepaga, sujeto a la Superintendencia de Salud"; named companies with brand titles | **high** | Legal classification of a named company, unsourced. 301 to `/salud/` |
| 7 | `/blog/salud/como-comparar-asismed-santa-clara/` | "Asismed y Santa Clara son dos de los prestadores ... con más presencia en Paraguay" | **high** | Unsourced market claim about named firms; 301 to `/blog/salud/como-elegir-medicina-prepaga/` |
| 8 | `/blog/salud/que-cubre-un-plan-migone/` | Brand in title; "Migone" plan content | **high** | 301 to the same generic prepaga post |
| 9 | `/blog/viajes/que-cubre-asistencia-tarjeta-itau/` | "las tarjetas Itaú suelen mencionarse entre las que ofrecen este tipo de servicio" (unsourced, brand in title) | **high** | 301 to `/asistencia-al-viajero/tarjetas-de-credito/` |
| 10 | `/calculadoras/deducible/`, `/autos/todo-riesgo/`, `/guias/como-funciona-la-franquicia-o-deducible/`, `/blog/autos/como-elegir-franquicia/` | Calculator pre-filled with Gs. 5.000.000 / 1.500.000; "Gs. 3.500.000" payout | **high** | Remove the calculator (DISCLAIMERS §3 default); worked example in abstract units ("daño 100, franquicia 30"); 301 the calculator URL to the franquicia guide |
| 11 | `/autos/cotizar/` | Page and nav item teach how to obtain quotes; "Una cotización no obliga a nada... El contrato existe cuando se emite la póliza y se paga la prima" (legal claim, no source); "un corredor ... puede gestionar varias propuestas por vos" | **high** | Keep URL; rewrite as "qué datos te piden y qué preguntar", drop contract-law statements or source/date them |
| 12 | `/`, `/privacidad/`, `/salud/`, `/contacto/`, `/preguntas-frecuentes/`, `/como-comparamos/`, `/contacto/` meta | "no hay formularios en este sitio", "no recogemos datos" | medium | Becomes **false** once the form exists (misleading statement). Rewrite: no consumer forms, one business/partner form |
| 13 | `/corredores/` | "El corredor actúa por cuenta del asegurado, no de la compañía"; "su remuneración suele provenir de una comisión"; "debe estar matriculado" | medium | Legal statements without source/date (ties to Ley 827/96, unverified). Add source + date or reword to "preguntale al corredor" |
| 14 | `/salud/`, `/blog/salud/como-elegir-medicina-prepaga/`, `/salud/comparar-planes/` | "Un seguro ... bajo la órbita de la Superintendencia de Seguros ... prepaga ... Superintendencia de Salud" | medium | Matches the known position (LEGAL-AUDIT R-PREPAGA) but has no source or date on the page. Add "Fuente: ... consultado el [fecha]" once verified |
| 15 | `/guias/*` (3), pillar pages | No "Actualizada el", no Sources list, no end note | medium | Add the three elements from DISCLAIMERS §5 (as page data) |
| 16 | `/autos/contra-terceros/`, `/blog/autos/que-cubre-contra-terceros-ejemplos/` | "la cobertura de auto más difundida/más elegida en Paraguay" | medium | Unsourced market claim; delete |
| 17 | `/motos/` | FAQ "¿El seguro de moto es obligatorio en Paraguay?" (hedged, no source) | medium | Delete the question (SOAT/SOA is the unverified area) or answer only "consultá fuentes oficiales" |
| 18 | `/guias/que-pasa-si-choco-y-no-tengo-seguro/`, blog twin | "la responsabilidad económica ... queda directamente sobre vos"; "Ningún paso administrativo es más urgente"; near-duplicate pair | medium | Neutral wording, source/date; keep both URLs but differentiate, or 301 the blog twin (decision) |
| 19 | all | Cookie banner + analytics loader in `site.js` | medium | Remove both; short "no usamos cookies de análisis" line in privacidad |
| 20 | footer, `/nosotros/`, `/aviso-legal/` | No razón social / RUC / domicilio; "Identidad del portal" has only name + e-mail; guides "firmadas por la redacción" | medium | Fields stay `null` and are hidden until you confirm; consent label uses the owner name you provide |
| 21 | `/privacidad/` | "retención de registros 30 días ... en ningún caso más de 90 días" | medium | Statement about the host's behaviour, unverified. Reword or confirm with Hostinger |
| 22 | 63 pages | JSON-LD `WebPage`, `CollectionPage`, `ItemList`, `ContactPage`, `AboutPage` | medium | Remove; keep only Organization, WebSite, Article, FAQPage, BreadcrumbList |
| 23 | `/salud/comparar-planes/` | Title "Comparativa de planes de salud y sanatorios" but page has criteria only | medium | Retitle to "Criterios para comparar..." (small SEO cost, removes a misleading-title risk) |
| 24 | `/como-comparamos/` | "Ninguna entidad puede pagar para aparecer ...", "Corregimos cualquier error señalado" (needs a channel), directory rules | medium | Rewrite: criteria and sources; correction via the form |
| 25 | `/contacto/`, `/` | "consultar por publicidad", "Sugerir un tema o una entidad para el directorio" | medium | Remove; the new types are corrección, datos, aseguradora, corredor, medio, agencia, otro |
| 26 | `/aseguradoras/mapfre/` | FAQ "¿Puedo cotizar desde esta ficha?" | medium | Removed with ficha |
| 27 | 7 pages | Hidden `<!-- VERIFY ... -->` comments in output | low | Gone with fichas; strip comments in build |
| 28 | all | Sticky bar + home hero "Ver el directorio de aseguradoras"; nav dropdown "Aseguradora del Este" | low | Point to "Cómo verificar una aseguradora"; remove named nav child |
| 29 | `/404.html` | Links "Directorio de aseguradoras" | low | Update labels |
| 30 | `/nosotros/` | "portal editorial independiente", "Nació para..." | low | "Independiente" is a claim; keep only if true (ask) |
| 31 | `/guias/cuanto-cuesta-un-seguro-de-auto-en-paraguay/` | Title promises a price; page gives none | low | Keep title (SEO), rewrite as "qué factores influyen en el costo" |
| 32 | `/blog/*` | Each post: "Publicado", no sources list | low | Add "Actualizada el", sources and end note |
| 33 | `/glosario/` | Generic definitions, no sources | low | Add date/source line |
| 34 | `.htaccess` | No redirects; no rules for `config.php`, `storage/` | low | Add in P1/P3 |
| 35 | `site.config.mjs` | `operator.email` published | low | Remove |
| 36 | `engine/verify.mjs` | Fails on `<form` / `vendercrm` | low | Update (P1) |

## Good already (keep)

Disclaimers "no emitimos pólizas, no cotizamos, no intermediamos"; "la medicina prepaga no es un seguro"; no prices or premiums; no rankings, stars, testimonials, logos or ratings; no third-party scripts; comparison tables are criteria only with a review date.
