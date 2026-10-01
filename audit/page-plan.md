# Page plan (Phase 0)

Actions: **keep** (edit only for the shared safety layer), **rewrite**, **redirect** (301), **remove-section**, **new**.
Default decisions from the brief are applied; open choices are in the checkpoint message.

| URL | Action | Plan |
|---|---|---|
| `/` | rewrite | Keep URL/H1 intent. Drop "no hay formularios", directory card/CTA → "Cómo verificar una aseguradora". Top strip + new footer |
| `/autos/` | keep | Edit; sources, date, end note |
| `/autos/cotizar/` | rewrite | "Qué datos te piden y qué preguntar al pedir una cotización a la aseguradora". No tool; legal statements dated/sourced or removed |
| `/autos/contra-terceros/` | keep | Remove "más difundida"; sources |
| `/autos/todo-riesgo/` | remove-section | Remove calculator link and block |
| `/motos/` | keep | Delete the "¿obligatorio?" FAQ; fix directory links |
| `/hogar/`, `/vida/`, `/empresas/`, `/responsabilidad-civil/` | keep | Fix directory links; date, sources, end note |
| `/salud/` | remove-section | Remove the three named fichas; keep prepaga vs seguro; sources for the supervisor statement |
| `/salud/comparar-planes/` | keep | Retitle "Criterios para comparar planes...", remove ficha links |
| `/salud/migone/`, `/salud/asismed/`, `/salud/santa-clara/` | redirect | 301 → `/salud/` |
| `/asistencia-al-viajero/` | keep | Edit |
| `/asistencia-al-viajero/tarjetas-de-credito/` | keep | Edit; no brand |
| `/aseguradoras/` | rewrite | "Cómo verificar una aseguradora o un corredor"; links only to BCP / Superintendencia de Seguros |
| `/aseguradoras/aseguradora-del-este/`, `/tajy/`, `/la-consolidada/`, `/sancor/`, `/mapfre/`, `/patria/`, `/aseguradora-yacyreta/`, `/el-comercio-paraguayo/` | redirect | 8 × 301 → `/aseguradoras/` |
| `/corredores/` | keep | Source/date for legal statements; links to the verify page |
| `/comparar/`, `/comparar/seguros-de-auto/` | keep | Criteria only; edit |
| `/como-comparamos/` | rewrite | Sources and criteria; funding line; no directory language |
| `/nosotros/` | rewrite | Company fields `null`/hidden; correction via the form |
| `/contacto/` | rewrite | Chooser (no fields) |
| `/contacto/busco-un-seguro/` | new | Deflection page, no fields, indexable |
| `/contacto/mensaje/` | new | The form (PHP, noindex, not in sitemap) |
| `/contacto/gracias/` | new | Thank-you (noindex) |
| `/aviso-legal/`, `/privacidad/`, `/terminos/` | rewrite | Form data, VenderCRM + mail provider, retention (proposed, ask lawyer), rights via form; cookies section inside `/privacidad/` (no banner) |
| `/preguntas-frecuentes/` | keep | Fix "no hay formularios" answers; sources |
| `/guias/cuanto-cuesta-un-seguro-de-auto-en-paraguay/` | rewrite | "Qué factores influyen en el costo", no figures; date/sources/end note |
| `/guias/que-pasa-si-choco-y-no-tengo-seguro/` | rewrite | Neutral wording, source/date |
| `/guias/como-funciona-la-franquicia-o-deducible/` | rewrite | Abstract-unit example; calculator removed |
| `/calculadoras/deducible/` | redirect | 301 → `/guias/como-funciona-la-franquicia-o-deducible/` |
| `/glosario/` | keep | Date/source line |
| `/blog/`, `/blog/autos/`, `/blog/salud/`, `/blog/viajes/` | keep | Drop the 3 redirected posts from listings |
| `/blog/autos/como-elegir-franquicia/` | rewrite | Remove calculator link |
| `/blog/autos/como-elegir-seguro-para-motos/` | keep | Fix directory link |
| `/blog/autos/que-cubre-contra-terceros-ejemplos/` | keep | Remove "más elegida" |
| `/blog/autos/que-pasa-si-choco-primeros-pasos/` | keep | Differentiate from the guide (decision: or 301 to it) |
| `/blog/autos/cuanto-cuesta-y-que-datos-pedir/` | keep | Edit |
| `/blog/salud/como-elegir-medicina-prepaga/` | keep | Edit; becomes the target for 2 redirects |
| `/blog/salud/como-comparar-asismed-santa-clara/` | redirect | 301 → `/blog/salud/como-elegir-medicina-prepaga/` |
| `/blog/salud/que-cubre-un-plan-migone/` | redirect | 301 → `/blog/salud/como-elegir-medicina-prepaga/` |
| `/blog/viajes/como-elegir-asistencia-al-viajero/` | keep | Reword "el mejor producto" |
| `/blog/viajes/que-cubre-asistencia-tarjeta-itau/` | redirect | 301 → `/asistencia-al-viajero/tarjetas-de-credito/` |

**Totals:** 55 live URLs → 40 kept/rewritten, 15 redirected (8 aseguradoras, 3 salud, 1 calculator, 3 blog). New: 3 contact URLs (1 indexable). Sitemap after: 41 URLs.

**Engine work:** drop operator e-mail; replace footer/top strip from one data file; remove cookie bar and the analytics loader; restrict JSON-LD; copy PHP handler, `config.php` template (placeholders only), `.htaccess` rules; change `verify.mjs` forbidden-markup rules; add `.gitignore` entries.
