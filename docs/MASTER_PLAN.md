# seguro.com.py — Master Plan (info-first, no consumer data, no sales)

Active from 2026-10-01. The earlier lead-gen plan is saved in
`docs/MASTER_PLAN-LEADGEN-OLD.md` (the old root `PLAN.md`) for when you want to
sell leads. Legal background: `docs/LEGAL-AUDIT.md`. Business view:
`docs/BUSINESS.md`. Texts: `docs/DISCLAIMERS.md`. Form: `docs/PARTNER-FORM.md`.
Architecture: `docs/ARCHITECTURE.md`. Questions for a lawyer:
`docs/LAWYER-CHECKLIST.md`.

**Status of this plan: planning only.** Nothing here has been built, deployed or
changed on the live site. Phase 0 needs the site source or network access (the
cloud session could not reach seguro.com.py).

## 1. Goal and the one rule

**Goal:** become the clear, trustworthy Paraguayan reference on insurance: what
each type covers and does not cover, what the law requires, how to read a
policy, how to check that an insurer or broker is registered, and how to make a
claim. Build organic traffic first. Decide on money later.

**The one rule: this site collects no personal data from consumers, sells no
policy and sends no lead to anyone.**

- No consumer quote or request form, no lead log, no WhatsApp "cotizar" button,
  no e-mail capture, no insurer or broker contracts, no paid ads.
- **One exception:** a small **partner contact form** (`/contacto`) for
  insurers, brokers, media and agencies, sent to VenderCRM and e-mail. It
  deflects consumers before any field is shown (`docs/PARTNER-FORM.md`).
- This removes the biggest exposures of the old plan: the Ley 827/96
  intermediation line, paid per-lead or per-policy remuneration, health-data
  handling and No Molestar liability (Ley 5830).
- Anything that adds data collection or a sales channel goes back to the old
  plan and the lawyer checklist first.

**Targets for six months (to adjust, not forecasts):** 60+ indexed pages; the
"seguro obligatorio", "terceros vs todo riesgo", "cómo reclamar" and "cómo
verificar una aseguradora" guides ranking on page 1–2 for their exact queries;
steady organic growth month over month.

## 2. Who it is for

People in Paraguay who are confused by insurance: first-time car and moto
owners, families deciding about life or health cover, small business owners,
people with an open claim. Paraguay's insurance penetration is low (about 1.3%
of GDP against about 3.2% for LatAm, per an SIS-based yearbook summary seen in
search snippets, unverified), so the need is explanation, not persuasion.

**Positioning:** *"Entendé tu seguro antes de firmar."* Competitors push
quotes and speed. We explain coverage, exclusions, the law and how to check a
provider, and we never sell. Calm, not scary.

## 3. Site structure

```
/                                  home: what insurance is, top guides, "cómo verificar"
/guias/                            guide hub
/guias/[slug]                      guides (wave 1 list in §5)
/que-cubre/                        explainer "qué cubre / qué no cubre" (no prices)
/glosario/ , /glosario/[termino]   glossary
/aseguradoras-y-corredores/        informational directory: WAVE 2, only after the
                                   lawyer answers LAWYER-CHECKLIST A2 (see §8 Phase 6)
/quienes-somos                     who we are; company details (when confirmed)
/contacto, /gracias-contacto       partner form (deflects consumers)
/politica-de-privacidad, /politica-de-cookies, /terminos, /metodologia
```

`/metodologia` explains how we compile and verify information, our sources and
how we earn money (today: we don't). It is a trust page and an E-E-A-T signal.

**Existing URLs:** keep any URL that already ranks; redirect (301) rather than
delete. The old plan named `/seguro-de-auto/cotizar/`, `/cotizar/[vertical]/`,
`/lp/*` and `/socios/`. If any exist live, Phase 0 sorts them: `cotizar` and
`/lp/` pages are rewritten into explainers or redirected to the matching guide;
`/socios/` becomes `/contacto`.

## 4. Design brief

- **Feel:** calm, trustworthy, official-adjacent but never pretending to be
  official. Light background, one restrained accent colour, high contrast,
  large readable type (body ≥ 17 px).
- **Always visible:** a slim top strip, "Sitio informativo. No vendemos seguros
  ni somos una aseguradora." (DISCLAIMERS §1) and the footer text (§2).
- **Components:** "Qué cubre / qué no cubre" blocks, a "Cómo verificar una
  aseguradora o un corredor" checklist, a "Qué hacer ahora" box at the end of
  each guide, a dated "Actualizado el…" stamp, a sources list, a glossary
  tooltip that is also a plain link (works without JS).
- **Avoid:** insurer logos, stock photos of smiling families, hand-in-hand or
  umbrella clichés, countdowns, "ahora" buttons, red/green approval styling,
  stars or "top" badges, fear imagery (crashes, hospitals), urgency.
- **Images:** a few honest diagrams and simple icons (franquicia explained,
  cobertura vs exclusión, who-is-who: aseguradora / corredor / agente). Alt
  text on all. No generated images unless the owner asks.
- **Mobile-first, fast:** target Core Web Vitals "good"; most traffic will be on
  phones.
- **Calls to action:** "Leé la guía", "Verificá una aseguradora", "Qué cubre".
  Never "Cotizá", "Contratá", "Pedí tu seguro".

## 5. Content plan

Informational intent first. Every page: one clear question answered; dated;
sources cited and dated; a short "Qué hacer ahora"; 3 internal links; the guide
end note (DISCLAIMERS §5). **No prices** unless an insurer or official source and
date are shown (DISCLAIMERS §9).

**Wave 1 (first ~15 pages, the trust core).** Topic list is an editorial
hypothesis from market proxies, not measured search volume: confirm with the
keyword-library MCP (geo = PY) before writing.

1. ¿Existe un seguro obligatorio de autos en Paraguay? Per press and official
   titles seen in search results, the SOAT (Ley 4950/2013) was repealed by Ley
   5150/2014 and the SOA is a stalled bill; Carta Verde applies for Mercosur
   trips. **Re-verify the status in the official texts before writing**, and
   never state that a SOAT/SOA is mandatory (LEGAL-AUDIT R-SOA).
2. Seguro de auto: contra terceros vs todo riesgo, explicado
3. Qué es la franquicia (deducible) y cómo cambia lo que pagás
4. Cómo leer una póliza: condiciones generales, particulares, exclusiones
5. Exclusiones más comunes (auto, vida, salud, hogar)
6. Aseguradora, corredor y agente: qué hace cada uno y cómo verificar que
   estén registrados en la Superintendencia de Seguros
7. Cómo hacer un reclamo a la aseguradora, paso a paso, y dónde presentar una
   queja (SIS, SEDECO: verify channels)
8. Seguro de moto: lo básico y qué mirar
9. Seguro de vida: beneficiarios, qué cubre, cómo se cobra
10. Seguro médico vs medicina prepaga: diferencias. Prepaga is supervised by
    the Superintendencia de Salud, not the SIS (press sources, LEGAL-AUDIT
    R-PREPAGA); do not call prepaga a "seguro"
11. Seguro de hogar: qué cubre y qué no
12. Seguro de viaje y asistencia al viajero: qué mirar antes de salir
13. Seguros para pymes: tipos básicos (incendio, responsabilidad civil,
    transporte), sin precios
14. Qué factores influyen en el costo de un seguro (sin cifras)
15. Glosario ampliado: prima, póliza, suma asegurada, siniestro, franquicia,
    carencia, preexistencia, subrogación, tomador, asegurado, beneficiario

**Wave 2:** mascotas, seguros por ciudad only with real local facts,
"qué hacer después de un choque" (information only), seasonal topics (viajes
de verano, cosechas), the informational directory (if the lawyer clears it),
news explainers when a law or resolution changes.

**Rules for writing (from LEGAL-AUDIT §6 and DISCLAIMERS §11):** no "fácil",
"rápido", "al instante", "aprobado", "garantizado", "sin requisitos", "el
mejor", "la más barata", "te aseguramos", "nuestras pólizas", "cotizá ya",
urgency or fear copy; no insurer rankings or logos; no figure without source
and date; every example labelled illustrative; never say we sell, quote,
advise or recommend.

**Refresh calendar:** legal-status guides (SOA, mandatory insurance) every
quarter and whenever a bill moves (a new Ley de Seguros bill to replace Ley
827/96 was before a Senate commission in June 2026, per an official Senate
news page seen in search results; re-check before launch); any page citing a figure every quarter;
the verify-a-provider guide when the SIS changes its register; Ley 7593 pages
around Nov 2027.

## 6. SEO plan

- **Keywords:** run the keyword-library MCP (geo = PY) locally for auto, moto,
  SOA, vida, salud, hogar, pyme, viaje, mascotas terms. Choose pages by
  measured volume. Treat §5 as a seed list, not proof of demand.
- **Technical:** static fast HTML; unique title and meta per page; canonicals;
  XML sitemap updated on every addition; `robots.txt`; clean URLs; JSON-LD
  `Organization`, `WebSite`, `Article`, `FAQPage`, `BreadcrumbList`. **No**
  `InsuranceAgency`, `Offer`, price or `AggregateRating` markup.
- **Internal links:** hub-and-spoke from `/guias` and `/que-cubre`; each guide
  links to "cómo verificar" and to the glossary.
- **E-E-A-T:** author and reviewer line (a named reviewer only if real), a
  sources section, a visible update date, `/metodologia`, company details in
  the footer once confirmed.
- **Links:** earn them with useful, citable assets: a dated "estado del seguro
  obligatorio" page, a "cómo verificar una aseguradora" checklist, a
  "cómo reclamar" guide. No paid links or comment spam.
- **Measure:** Google Search Console and a consent-gated analytics tag. Review
  queries monthly and promote pages with impressions but few clicks.
- **Baseline to fix first:** audit scores SEO 7, Design 3.5, Copy 7,
  Conversion 2.5, Technical 5.5. Design and technical are the biggest gaps;
  conversion is not a goal now.

## 7. Legal-minimum launch checklist (must be true at launch)

- [ ] Top strip and footer on every page, as written in `docs/DISCLAIMERS.md`,
      stored once in `content/site.php`.
- [ ] No consumer form, no WhatsApp link, no ad pixel, no insurer logo, no price
      without source and date, no ranking (scan with `tools/legal-audit.mjs`).
- [ ] Every guide ends with the guide note, an update date and sources.
- [ ] Any calculator has the "Resultado ilustrativo…" disclaimer directly under
      the result (preferred: no calculator at all).
- [ ] Risky and promise phrases removed (DISCLAIMERS §11; LEGAL-AUDIT §6).
- [ ] Privacy policy (covers the partner form: purpose, recipients, retention,
      rights, no consumer requests) and cookie policy; analytics only after
      consent; "Aceptar" and "Rechazar" equal in size.
- [ ] Company name, RUC and address in the footer **only once the company
      exists and the data is confirmed**; until then, a contact e-mail only
      (Ley 4868 identification: article number unverified, LEGAL-AUDIT R-4868).
- [ ] `contacto@` and `datos@` mailboxes exist and are read.
- [ ] Partner form: consent box exactly per `PARTNER-FORM.md`, deflection works
      without JavaScript, test plan passed, `config.php` uploaded by hand and
      unreachable from the web.
- [ ] `.gitignore` blocks `config.php`, `storage/`, `*.log`,
      `vendercrm-lead-endpoints*.md`; no key anywhere in the repo or history.
- [ ] Every legal-status statement (SOA, who regulates what) has an official or
      clearly labelled secondary source and a date.

**Still recommended, not blocking:** a one-hour lawyer review of the
disclaimers, the "SOA" and "verificá un corredor" guides and the form's privacy
text (`LAWYER-CHECKLIST.md`). It is the one item that is a judgement call.

## 8. Build phases

Static HTML + PHP from the `php-site-template`. Each phase is one PR, opened
only when the owner asks.

| Phase | What | Needs |
|---|---|---|
| **0** | Put the site source in a repo or give network access; scan the 55 URLs (`tools/legal-audit.mjs`); sort every page into **keep / rewrite / redirect** | Source in GitHub or network access |
| **1** | **Safety fixes and disclaimers** on existing pages (§7): top strip, footer, phrases, any calculator, directory, schema, privacy and cookie pages | Phase 0 |
| **2** | **Design refresh:** layout, components (§4), mobile and speed pass | Phase 1 |
| **3** | **Technical SEO:** sitemap, schema (no insurance types), titles and metas, canonicals, redirects, Search Console, consent-gated analytics | Phase 2 |
| **3b** | **Partner contact form** per `PARTNER-FORM.md`: `/contacto`, `contacto-alianzas.php`, `/gracias-contacto`, tests. The owner uploads `config.php` and redeploys via hPanel → Advanced → Git | Phase 1; `config.php` from the owner |
| **4** | **Wave 1 content:** ~15 pages in batches, each checked against the risk-phrase register and the scan | Phase 3 |
| **5** | **Monthly routine:** refresh dated pages, check Search Console, publish 4–6 pages a month | Ongoing |
| **6** | **Wave 2** content from Search Console and keyword data; directory only if cleared | After about 8 weeks of data |

Models: Phases 0–3b on Opus at medium effort; content batches on Sonnet with a
review pass by the director. No Fable. Nothing is deployed without the owner's
explicit go-ahead.

## 9. Money and timing (honest)

- Costs: domain and hosting (already paid), the owner's time, optional images and
  an optional one-hour legal review. No ad spend.
- Revenue: none until traffic exists. That is the point of this phase.
- **Later options (not now, each needs its own legal check):**
  - display ads (AdSense lists Paraguay as available per a search snippet;
    insurance-content publisher restrictions unverified);
  - sponsored content from insurers or brokers, labelled (DISCLAIMERS §10);
  - affiliate links: no programme open to content sites in Paraguay was found;
    whether affiliate referral of insurance counts as intermediation under
    Ley 827/96 is unverified, ask the lawyer;
  - the old lead-gen plan.
- Decide on monetisation after about 6 months of real traffic. Triggers (to
  adjust): 5,000+ organic sessions per month; two or more insurers or brokers
  asking to work with you; a company, an accountant and a lawyer budget in
  place.

## 10. Deferred (kept in the old plan)

Consumer quote or lead form, persist-first consent log, `/baja-de-datos` flow,
delivery to corredores, per-lead or per-policy deals, WhatsApp flow, Google and
Meta Ads, insurer price comparator. See `docs/MASTER_PLAN-LEADGEN-OLD.md`,
`docs/BUSINESS-LEADGEN-OLD.md`, `docs/LEGAL-AUDIT-LEADGEN-OLD.md`,
`docs/LAWYER-CHECKLIST-LEADGEN-OLD.md`, and `docs/05-lead-engine.md`. The
numbered docs `01`, `03`–`10` come from the lead-gen era: `03` (URL and SEO
structure) and `10` (legal background) are partly reusable; `04`, `05`, `07`
and `09` describe the deferred model.

**Revisit triggers:** a lawyer's written opinion on A1/A2 of the checklist; a
signed corredor willing to hold the regulated role; real traffic (see §9); the
owner confirming a company, accountant and legal budget.

## 11. Open items (only the owner can answer)

1. Site source in a repo (or network access) so Phase 0 can start.
2. Keyword data (run the keyword-library MCP locally, geo = PY).
3. Company (EAS) status and the name/RUC/address that may appear in the footer.
4. `config.php` for the partner form, prepared by the owner (key from the
   private VenderCRM file; never committed or pasted in chat), plus the
   `contacto@` and `datos@` mailboxes.
5. Whether to buy the one-hour legal review.
6. Whether the informational directory (Wave 2) is wanted at all.
