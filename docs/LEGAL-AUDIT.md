# LEGAL-AUDIT — seguro.com.py (information-site model)

Prepared 2026-10-01. **Research, not legal advice.** The site is an
information site: no consumer data, no sales, no leads, no ads (see
`MASTER_PLAN.md` §1). The earlier lead-gen audit is saved as
`LEGAL-AUDIT-LEADGEN-OLD.md`; several of its rules still apply and are
re-stated here, adapted.

Confidence: **H** several independent sources agree, or the official text was
quoted in a result · **M** one law-firm or press source · **L** thin or
conflicting · **UNVERIFIED** not seen: ask the lawyer.

## 0. What was and was not checked (read first)

| Item | Status |
|---|---|
| Live site, 55 sitemap URLs | **NOT AUDITED.** The cloud session's network policy blocks `seguro.com.py` (egress 403), and no search engine returned indexed pages for it. §1 is a pre-audit register built from the owner's brief (0 images, no form, no WhatsApp link) and from the planning docs. **§6 has a local scan script that produces the real per-URL table.** |
| Primary legal texts | **Not read directly.** `bacn.gov.py`, `bcp.gov.py`, `sedeco.gov.py`, `support.google.com` and `web.archive.org` were blocked. Every citation below comes from **web-search summaries**, which are secondary sources even when the cited URL is official. Nobody has yet read these articles in the official PDF. |
| keyword-library MCP | Not connected in the cloud session. Demand is an estimate (BUSINESS §2). |
| prestamo reference docs | Read from `antonmarklundcom/prestamo` branch `claude/awesome-ritchie-wz1ebw` (the main branch still has the old lead-gen docs). Structure and tone reused; every legal point re-derived for insurance. |

## 1. Live-site findings (pre-audit register, by known feature)

Page rows for all 55 URLs are **pending**. Until §6 is run, these are checks to
perform, not confirmed findings.

| URL / feature | Text or behaviour to look for | Risk | Safe rewrite / fix |
|---|---|---|---|
| Home, pillar pages (`/seguro-de-auto/`, etc.) | "el mejor seguro", "la mejor aseguradora", "te recomendamos" | **High** (Ley 1334 Art. 36; reads as advice) | "Información para entender y comparar coberturas." |
| Any page | "cotizá", "cotizá ya", "contratá", "pedí tu seguro", "tu póliza en minutos" | **High** (reads as selling/quoting; Ley 827/96 Art. 70) | "Leé la guía", "Qué cubre", "Verificá una aseguradora" |
| Any page | ₲ or US$ premiums, "desde ₲…/mes", price tables | **High** (Ley 1334 Art. 35 misleading by omission; Ley 827 Art. 129 incomplete info) | Delete, or "Ejemplo ilustrativo tomado de [fuente, fecha]. No es una cotización." |
| Calculator or "cotizador" | no disclaimer, default price, "contratar" button | **High** | DISCLAIMERS §3, or remove and replace with a no-price explainer |
| Insurer pages (`/aseguradoras/…`) | insurer names with praise, logos, ratings, "convertimos a comparación" | **High** | Neutral name in plain text, link to the entity's official site and the SIS register; no logo; no stars |
| Any page | "garantizado", "cobertura total", "cubre todo", "sin letra chica", "sin requisitos" | **High** | "Las coberturas y exclusiones las define cada póliza." |
| Any page | "fácil", "rápido", "al instante", "en 2 minutos" | **High** | Remove ease and speed promises |
| Any page | "últimos días", "oferta", "no esperes", fear copy ("¿y si te pasa algo?") | Medium | Remove; neutral, factual tone |
| Any page | claim that SOA/SOAT is mandatory | **High** (appears false per the sources in R-SOA) | State the verified status with source and date, or remove |
| Any page | prepaga described as a "seguro" | Medium | Say prepaga is supervised by the Superintendencia de Salud (R-PREPAGA) |
| JSON-LD | `InsuranceAgency`, `Offer`, price, `AggregateRating` | **High** | `Organization`, `WebSite`, `Article`, `FAQPage`, `BreadcrumbList` only |
| Footer / top strip | missing "Sitio informativo…" text | **High** | DISCLAIMERS §1–§2 on every page |
| Footer | company details invented or half-filled | Medium | Leave `null` until confirmed; show a contact e-mail only |
| Forms / WhatsApp | any consumer form or WhatsApp link | **High** (contradicts the model; consumer data without consent flow) | Remove; only `/contacto` partner form |
| Tracking | analytics or ad pixels firing before consent | Medium | Consent-gate analytics; no ad pixels at all |
| Guides | no update date, no sources, no end note | Medium | DISCLAIMERS §5 |
| Directory (if any) | entity not found in the SIS register; ranking order; logos | **High** (Art. 129; SIS warns about unauthorised entities, R-WARN) | Alphabetical, verified-on date and register per entry, no logos; remove what cannot be verified |

## 2. Rules, with sources

### 2.1 Insurance regulation

| # | Rule | Citation and source | Type | Conf. | Consequence for us |
|---|---|---|---|---|---|
| R-827 | Insurance is regulated by the **Superintendencia de Seguros (SIS), inside the BCP**, under **Ley 827/96 De Seguros**. A bill from the MEF/BCP to replace Ley 827/96 was before the Senate Legislation Commission on 29 Jun 2026 (study continued; not law) | [BCP PDF](https://www.bcp.gov.py/documents/20117/213083/LEY_827_96_DE_SEGUROS.pdf/68f0897c-3e19-22c3-4904-367b1b2937a9?t=1741806943153); [Senate news](https://www.senado.gov.py/index.php/menu-dircom/sub-menu-noticias-comisiones/proseguira-el-estudio-de-la-iniciativa-legislativa-sobre-seguros-2026-06-29-16-51-44.html) | official URLs; content via search summary | H (regulator, law), M (bill) | Put "revisado el [fecha]" on legal pages; re-check the bill before launch |
| R-70 | "La intermediación en la contratación de seguros, a excepción de los seguros directos, sólo podrá ser ejercida por los agentes y corredores de seguros inscriptos" | Ley 827/96 **Art. 70** (same BCP PDF; [BACN](https://www.bacn.gov.py/leyes-paraguayas/703/ley-n-827-de-seguros)) | official via snippet | H | We never intermediate: no quote, no proposal, no part in contracting |
| R-DEF | Definition: agente/productor/corredor = person authorised by the control authority "que intermedie en la contratación de seguros". The earlier doc's "≈Art. 69" is **wrong** (Art. 69 is on confidentiality); the defining article number is **unverified** | Ley 827/96 (same sources) | official via snippet | M | Cite without an article number until the lawyer confirms |
| R-76 | The agent or corredor proposes the operation "por escrito, bajo su firma" | Ley 827/96 **Art. 76** (BACN; [vLex](https://py.vlex.com/vid/ley-n-827-96-641256181)) | snippet | M | Proposals are the intermediary's work, not ours |
| R-82 | Persons not registered "no tendrán derecho a percibir comisión alguna" for intermediation | Ley 827/96 **Art. 82** ([Justia](https://paraguay.justia.com/nacionales/leyes/ley-827-feb-12-1996/gdoc)) | snippet | M | **Why a later per-policy model is dangerous** (BUSINESS §5) |
| R-129 | Prohibition of false, incomplete, anonymous, misleading or ambiguous insurance information "por medio de anuncios, circulares, folletos u otros medios" | Ley 827/96 **Art. 129** "Información al público" (BCP PDF) | official via snippet | M | **Applies directly to our copy.** No anonymous site (identify the operator), no incomplete price or coverage claims, no wording that could be misread as an offer |
| R-109 | Sanctions on insurers: warning, fine up to 1,000 jornales mínimos, suspension up to 1 year, revocation; Arts. 121–122 sanction insurers that work with unregistered auxiliaries | Ley 827/96 **Arts. 109, 121, 122** | snippet | M | Context only. Sanctions on a non-regulated site: UNVERIFIED |
| R-102 | **Res. SS.SG. 102/08 (2 Dec 2008)** regulates "la oferta, promoción, comercialización y prestación del servicio de seguros"; only authorised insurers may offer, directly or via agents or brokers; adopted after complaints about unauthorised entities. Operative articles not seen | [baselegal](https://baselegal.com.py/docs/430801ba-0030-11f0-9450-525400343722) | republished official text, summary only | M (exists), UNVERIFIED (scope) | **Biggest open legal question:** does neutral information, a directory, or premium examples count as "promoción" or "oferta"? Ask the lawyer (checklist A2) |
| R-WEBSITES | No SIS rule on comparators, neutral information sites or "canales digitales" for third parties was found. Res. SS.SG. 210/2025 sets minimum conditions for **selling** by electronic channels, binding on sellers | [Vouga](https://www.vouga.com.py/la-superintendencia-de-seguros-regula-la-comercializacion-de-seguros-por-medios-electronicos-y-canales-no-presenciales/) | law firm | M | The information model stays clear of the sale. Absence of a rule is not a safe harbour |
| R-REG | Registration of agents, corredores, liquidadores: Res. SS.SG. 031/2026 (30 Jan 2026), amended by Res. 117/2026; annual windows with quotas; the SIS publishes registers (path: BCP > Superintendencias > Superintendencia de Seguros > Registros de la SIS > Auxiliares del Seguro) and warnings naming unauthorised firms | [BCP PDF](https://www.bcp.gov.py/documents/20117/753661/Resoluci%C3%B3n+SS.SG.+N%C2%B0+031_2026.pdf/3e00fd0b-9f62-b3e5-4797-da5b5218224e?t=1770118492670); [BCP inscripciones](https://www.bcp.gov.py/en/inscripciones); [Vouga](https://www.vouga.com.py/actualizacion-del-regimen-de-matriculacion-de-auxiliares-de-seguros-en-paraguay/) | official + law firm | M | "Cómo verificar" guide links to the SIS registers. **Exact register title unverified** |
| R-WARN | The SIS issues public warnings about unauthorised firms (e.g. named in BCP communiqués and press, 2025) | [BCP communiqué](https://www.bcp.gov.py/web/institucional/w/comunicado-al-p%C3%BAblico-en-general-3); [ABC 2025-02-14](https://www.abc.com.py/negocios/2025/02/14/superintendencia-de-seguros-advierte-sobre-firma-que-no-esta-autorizada-para-operar/) | official + press | M | Never list an entity we cannot find in the register |
| R-COMPLAINT | A consumer complains first to the insurer, then to the SIS through the "Plataforma de Asistencia al Usuario"; extrajudicial, voluntary, free; also in Guaraní | [100% Seguro](https://100seguro.com.py/la-superintendencia-de-seguros-lanzo-su-plataforma-de-consultas-quejas-y-reclamos/); [BCP](https://www.bcp.gov.py/en/asistencia-al-usuario-de-la-sis) | press + official | M | Material for the "cómo reclamar" guide; verify the URL on the day of publishing |

### 2.2 Mandatory insurance and health

| # | Rule | Citation and source | Conf. | Consequence |
|---|---|---|---|---|
| R-SOA | **No SOAT/SOA is in force, per the sources seen.** Ley 4950/2013 created the SOAT; **Ley 5150/2014 repealed it** (promulgated about 20 Feb 2014). A "SOA" bill was approved by the Senate with modifications and then stalled; the insurers' association (APCS) was pushing to revive it | [BACN Ley 5150](https://www.bacn.gov.py/leyes-paraguayas/11356/ley-n-5150-deroga-la-ley-n-4950-que-crea-el-seguro-obligatorio-de-accidentes-de-transito-soat); [Última Hora](https://www.ultimahora.com/buscan-reimpulsar-el-seguro-obligatorio-los-automoviles-n3061684); [100% Seguro](https://100seguro.com.py/asociacion-paraguaya-de-companias-de-seguros-impulsa-proyecto-de-seguro-obligatorio-automotor/) | M-H | Never say a SOAT/SOA is mandatory. **Conflict:** a summary of Ley 5016/14 (Tránsito) Art. 95 mentions the SOAT after the repeal ([BACN](https://www.bacn.gov.py/leyes-paraguayas/4418/ley-n-5016-nacional-de-transito-y-seguridad-vial)); not reconciled: lawyer |
| R-CARTAVERDE | Carta Verde (RC vehicular for Mercosur travel) is the de-facto required cover for foreign trips; SIS Res. SS.RG. 2/99 appears by title only | [BCP PDF](https://www.bcp.gov.py/documents/20117/0/1999-02-05-res-ssrgn-002-99-responsabilidad-civil-vehicular-carta-verde_2.pdf/76507126-e674-1fcd-8d8f-9ea0a0a4724f?t=1744215069778); [Broker Codas](https://www.brokercodas.com.py/carta-verde) | L (content), M (practice) | State "se exige para circular en países del Mercosur" only after reading the official text |
| R-OTHERMAND | Ley 750/1961 (passenger accident insurance for public land transport) seen as a summary of a Justia document; current enforcement unknown. Workers' accident cover is through IPS (employer contribution), not a private ART | [Justia](https://docs.paraguay.justia.com/nacionales/leyes/ley-750-aug-31-1961.doc); [Deel](https://www.deel.com/es/blog/aportes-ips-en-paraguay/) | L | Do not write a "mandatory insurance" list beyond what is verified |
| R-PREPAGA | **Medicina prepaga is supervised by the Superintendencia de Salud (Ministerio de Salud), not the SIS.** Ley 1032/1996 (Sistema Nacional de Salud) created it; Ley 2319/2006 sets its functions. Do **not** cite "Ley 7421" (it appears to be an unrelated forest-fire emergency law). A dedicated prepaga law appears only as a bill | [ABC 2025](https://www.abc.com.py/edicion-impresa/suplementos/economico/2025/03/16/el-seguro-de-riesgos-y-la-medicina-prepaga/); [BACN Ley 2319](https://www.bacn.gov.py/leyes-paraguayas/1880/establece-las-funciones-y-competencias-de-la-superintendencia-de-salud-creada-por-ley-n-1032-de-fecha-30-de-diciembre-de-1996-que-crea-el-sistema-nacional-de-salud) | M-H | Do not call prepaga a "seguro"; explain who regulates which. Advertising rules for prepaga: UNVERIFIED |
| R-OTHERLINES | Regulatory status of travel assistance, pet insurance, credit life, agricultural insurance: not found (commercial pages only) | n/a | UNVERIFIED | Write only neutral, general statements; ask the lawyer before a dedicated guide |

### 2.3 Consumer protection and site disclosures

| # | Rule | Citation and source | Conf. | Consequence |
|---|---|---|---|---|
| R-35 | Misleading advertising is prohibited, "incluso por omisión" | Ley 1334/98 **Art. 35** ([BCP PDF](https://www.bcp.gov.py/documents/20117/213083/LEY_1334_98_DE_DEFENSA_AL_CONSUMIDOR_Y_DEL_USUARIO.pdf/8e97aae7-421f-db1a-8d0e-39fd0b58fa20?t=1741806943360)) | M (snippet of official text) | No figure without source and date; no omission of conditions |
| R-36 | Comparative advertising not allowed where "declaraciones generales e indiscriminadas" induce belief in a product's superiority | Ley 1334/98 **Art. 36** (same) | M | No "el mejor", no rankings |
| R-SEDECO | SEDECO is the consumer authority. Any SEDECO rule or action specific to insurance advertising: **not found**. Whether SEDECO or the SIS handles insurance complaints: unverified (SIS is the proven channel) | n/a | UNVERIFIED | |
| R-4868 | Providers must publish permanently and freely: denominación social, domicilio, owners' names, e-mail and phone. **Article number conflict:** one source says Art. 7, the decree summary says "Artículo 28". Whether a purely informational site is in scope: unverified. RUC is not expressly required | [BACN Ley 4868](https://www.bacn.gov.py/leyes-paraguayas/961/ley-n-4868-comercio-electronico); [Decreto 1165/2014](https://baselegal.com.py/docs/cb500e7b-fcd8-11e9-8e28-525400c761ca/text) | M (content), L (article) | Publish the identification block anyway once the company exists |
| R-4868B | Commercial communications must be identifiable and name the sender; unsolicited ones must say so and offer an easy opt-out (Arts. 21, 23 per a summary) | Ley 4868/2013 | L-M | Applies to our replies to partners |

### 2.4 Data protection, spam, cookies

| # | Rule | Citation and source | Conf. | Consequence |
|---|---|---|---|---|
| R-7593 | **Ley 7593/2025** de Protección de Datos Personales, promulgated **27 Nov 2025**, **24-month vacatio legis** → substantive obligations and fines from about **27 Nov 2027** (MITIC says so). No earlier transitional article found. **No reglamento and no operating Agency found as of Oct 2026**: the Agencia Nacional de Protección de Datos Personales (inside MITIC) was reportedly not in the 2026 budget | [BACN](https://www.bacn.gov.py/leyes-paraguayas/12924/ley-n-7593-2025-de-protecci-n-de-datos-personales-en-la-rep-blica-del-paraguay); [Berke](https://www.berke.com.py/analisis-de-la-ley-n-7593-2025-de-proteccion-de-datos-personales-de-paraguay1/); [MITIC](https://mitic.gov.py/mitic-informa-sobre-el-alcance-de-la-ley-de-proteccion-de-datos-personales/); [La Tribuna 2026-04-20](https://www.latribuna.com.py/nacionales/2026/04/20/mitic-informa-sobre-los-alcances-de-la-nueva-ley-de-proteccion-de-datos-personales-que-regira-desde-2027/) | M | Build the partner form to this standard now |
| R-SENSITIVE | **Health data is sensitive** (also racial/ethnic origin, religious/philosophical beliefs, union/political affiliation, sexual orientation, genetic or biometric data). Fines reported: general 20–2,500 jornales, up to 5,000 for sensitive data, 10,000 for minors' sensitive data | Berke; [Deloitte](https://www.deloitte.com/latam/es/services/legal/perspectives/nueva-ley-de-proteccion-de-datos-personales-en-paraguay.html); [smartfense](https://smartfense.com/cumplimiento/ley-proteccion-datos-paraguay/) | M (article numbers unverified) | **We never collect health data.** The partner form forbids it in helper text and the deflection |
| R-BASIS | Legal bases listed in summaries: consent; legal obligation; contract/pre-contract at the subject's request; legitimate interest with a documented balancing test. Consent must be prior, free, informed, unequivocal, by statement or clear affirmative act | law-firm summaries (Avanzia, Altra, Iruñ Villamayor) | M | For a partner contact form, **consent is the safest basis** (that mapping is our inference, not sourced) |
| R-RIGHTS | Access, rectification, deletion, opposition, portability, withdrawal of consent; response period 30 calendar days (one source: "Art. 26") | [lawwwing](https://lawwwing.com/en/paraguay-data-protection-7593-20/) | L-M | `datos@` mailbox; answer in ≤ 30 days |
| R-NOTICE | Privacy notice in plain language: controller identity, data categories, purposes and legal basis, recipients, retention, rights, transfers | law-firm summaries | M | Privacy policy section for the partner form (PARTNER-FORM) |
| R-TRANSFER | International transfer only to countries the Agency finds adequate, or with safeguards (standard contractual clauses, BCRs). No adequacy list exists yet. Processors need a written contract | law-firm summaries | M | VenderCRM and the e-mail provider may be abroad: lawyer (checklist C5) |
| R-COOKIES | **No Paraguay-specific cookie rule or guidance found.** Practice: prior consent, revocable, no pre-ticked boxes, "Aceptar" and "Rechazar" equal | n/a | UNVERIFIED | Follow 7593 principles |
| R-6534 | Ley 6534/2020 governs **credit data** (consent free, express, documented, revocable). Not touched: we hold no credit data | [BACN](https://www.bacn.gov.py/leyes-paraguayas/9417/) | M | Keep it that way |
| R-5830 | Ley 5830/2017, Decreto 8000/2017, Res. SEDECO SDCU 80/2018 Art. 6: no unsolicited advertising by mobile; check the **No Molestar** register; strict liability, including for third parties; **the register covers WhatsApp and Telegram** | [No Molestar](https://nomolestar.sedeco.gov.py/); [TEDIC](https://www.tedic.org/wp-content/uploads/2025/09/Claro-vs-Sedeco-WEB.pdf) | H | We send no marketing messages. Replies to partners only |

### 2.5 Company, tax, IP

| # | Rule | Citation and source | Conf. | Consequence |
|---|---|---|---|---|
| R-EAS | EAS (Ley 6480/2020, Decreto 3998/2020): single shareholder allowed; legal personality on registration. Legal representative needs a Paraguayan cédula (from the earlier research; unverified here) | [Vouga](https://www.vouga.com.py/en/el-poder-ejecutivo-promulgo-la-ley-6480-20-que-crea-la-empresa-por-acciones-simplificadas/) | M | Footer details wait for the company |
| R-TAX | IVA 10% on services; IRE 10% general (Ley 6380/2019); IRE SIMPLE for turnover up to ₲ 2,000 M (10% on a presumed 30% net, per two law-firm blogs). Whether an EAS can use IRE SIMPLE: unverified. **A content site with no revenue has nothing to invoice yet.** New RUCs must issue e-invoices (SIFEN) since 1 Apr 2025 | [DNIT](https://www.dnit.gov.py/en/web/portal-institucional/w/d-ley-n-6380-19); [La Nación](https://www.lanacion.com.py/negocios/2025/04/01/desde-hoy-nuevos-contribuyentes-deberan-facturar-exclusivamente-de-forma-electronica/); [Ecovis](https://ecovisparaguay.com.py/impuesto-a-la-renta-empresarial-regimen-re-simple-en-paraguay/) | M | Accountant when revenue appears |
| R-ADSENSE | IVA/INR rules found on digital services apply to **purchases** from non-residents (your own Google spend), **not** to AdSense income. Treatment of AdSense or foreign sponsorship income (export of services?): **UNVERIFIED**. Local ads, sponsored content and affiliate commissions: IVA treatment unverified | [DNIT](https://www.dnit.gov.py/documents/44828/0/SERVICIOS+DIGITALES.-.pdf/8ae189f8-d965-de75-a5b5-6f6f8e858511?t=1685034754329.pdf); [Ferrere](https://www.ferrere.com/es/novedades/newsletter-retenciones-de-impuestos-por-servicios-digitales-en-paraguay/) | L | Deferred monetisation: accountant first |
| R-MARCAS | Ley 1294/98 de Marcas gives the holder the right to act against infringing use. Nothing seen on nominative or referential use. Copyright (Ley 1328/98) on republishing insurer documents: article and scope unverified | [BACN Ley 1294](https://www.bacn.gov.py/leyes-paraguayas/862/ley-n-1294-de-marcas); [BACN Ley 1328](https://www.bacn.gov.py/leyes-paraguayas/908/ley-n-1328-derecho-de-autor-y-derechos-conexos) | L | Insurer names in plain text; **no logos**; short attributed quotes only; no copying of policy wording |
| R-HONOR | Código Penal Arts. 150 (calumnia), 151 (difamación), 152 (injuria), per a summary | [CELE](https://observatoriolegislativocele.com/paraguay-codigo-penal-delitos-contra-el-honor-y-la-reputacion-1997/) | M | Factual, sourced, dated statements about named insurers; offer a right of reply |

## 3. Corrections to the earlier planning docs (not applied here)

- `docs/10-legal-compliance-paraguay.md` (lead-gen era): the agent/corredor
  definition is not Art. 69. Add Art. 129, Res. 102/08, the Ley 7593 detail above
  and the WhatsApp finding (No Molestar covers WhatsApp). Its "lead-gen carve-out"
  analysis does not apply to this model.
- `docs/03-site-structure-seo.md`: remove `InsuranceAgency` and `AggregateRating`
  markup; `/cotizar/`, `/lp/` and `/socios/` do not belong to the info model.
- `docs/07-opportunities.md`: reviews of insurers, a "precio estimado" widget and
  dealer rev-share conflict with this model.

## 4. Advertising platforms

Not applicable now: the model runs **no ads**. Kept for the deferred plan
(`LEGAL-AUDIT-LEADGEN-OLD.md` R25–R27). Display ads on the site (AdSense) are a
later option; "Paraguay available" was seen in a search snippet, and publisher
restrictions on insurance content are unverified.

## 5. Unverified: ask the lawyer

1. Does neutral information, an alphabetical directory with links, or an
   illustrative premium example count as "promoción" or "oferta" under Res.
   SS.SG. 102/08, or as misleading information under Ley 827/96 Art. 129?
2. The exact article numbers and wording of Ley 827/96 Arts. 70, 76, 82, 129 and
   the defining article.
3. The Ley 5016 Art. 95 / Ley 5150 inconsistency on the SOAT, and whether the SOA
   bill has advanced since the sources seen.
4. Whether Carta Verde is legally required (Res. SS.RG. 2/99 content).
5. Regulatory status of travel assistance, pet insurance, credit life.
6. Ley 7593: article numbers, legal basis for a business contact form, retention
   period, international transfer to VenderCRM and the e-mail provider, any rule
   before Nov 2027.
7. Ley 4868: Art. 7 or 28, and whether an informational site is in scope.
8. Whether SEDECO has specific rules or actions on insurance advertising.
9. Exact title and URL of the SIS public register of agents and corredores.
10. Tax treatment of any later revenue (AdSense, sponsorship, affiliate, listing
    fees) and whether an EAS can use IRE SIMPLE.
11. Trademark: nominative use of insurer names in text.
12. The whole of §1: live-site findings pending a network-enabled run.

## 6. Local scan script (produces the real per-URL table)

`tools/legal-audit.mjs` (Node 18+, no dependencies, read-only). It fetches every
URL in the sitemap and, per element, flags: advice and recommendation wording,
"we sell / we quote" wording, promise and ease words, prices, rankings, urgency,
fear copy, insurer names (and endorsement words next to them), insurer logos,
insurance-type JSON-LD, forms outside `/contacto`, pre-ticked or consumer fields
in the contact form, WhatsApp links, calculators without the "Resultado
ilustrativo" disclaimer, and analytics tags (to confirm consent gating). A second
table shows, per page, whether the top strip, footer text, "no es asesoramiento",
privacy, cookies, terms and methodology links, and the guide end note are
present.

```
node tools/legal-audit.mjs https://seguro.com.py/sitemap.xml > scan.md
```

Tested only against a local sample site (four pages with known violations); it
has never run against the real site. Regex matches are leads for a person to
review. Calculators, tables and images still need a manual read. Paste the rows
into §1, mark each page keep / rewrite / redirect (Phase 0), and re-send this
file to the lawyer.
