# LEGAL-AUDIT — seguro.com.py

> Phase 1, 2026-09-30. This is research, **not legal advice**; every rule
> goes to the lawyer (`docs/LAWYER-CHECKLIST.md`). Status labels:
> **CONFIRMED (snippet)**: a search result quoted the official text, but
> nobody has read the PDF itself. **CONFIRMED (secondary)**: seen in a
> law-firm, press or authority summary. **UNVERIFIED — ask the lawyer**.
> No citation was written from memory. Where no source was seen, the item
> is marked unverified.

## 0. Limits of this audit (read first)

- **The live site could not be fetched.** This cloud session's network
  policy blocks `seguro.com.py`, and also `bcp.gov.py`, `bacn.gov.py`,
  `support.google.com` and `web.archive.org`. Web search returns no
  indexed pages for `site:seguro.com.py`. So **§1 has no live findings yet**.
- To close that gap, `tools/legal-audit.mjs` (read-only, no dependencies,
  Node 18+) fetches the sitemap and all 55 URLs. It extracts the title, meta
  description, headings, paragraphs, list items, table cells, buttons,
  links and JSON-LD, and applies the rules in §3. Output: one table
  (URL, element, exact text, rule, risk, safe rewrite) plus a
  per-page disclosure matrix. It was tested against a local fixture.
  Run it from any machine that can reach the site:
  `node tools/legal-audit.mjs > docs/LEGAL-AUDIT-live.md`
  The output is a first pass: a person still reads every page, especially
  calculators and tables, where the regexes see numbers but not context.
- Legal sources were checked through **web-search snippets only**, because
  the primary PDFs were blocked. Nothing here was read in the official PDF.
  The lawyer or the owner must read R1–R8 in the
  [BCP PDF of Ley 827/96](https://www.bcp.gov.py/documents/20117/213083/LEY_827_96_DE_SEGUROS.pdf/68f0897c-3e19-22c3-4904-367b1b2937a9?t=1741806943153).

## 1. Live-site findings

**Status: NOT RUN. The live site is unreachable from this session.** No
finding has been invented to fill this section.

What we know from the owner's brief: 55 sitemap URLs, 0 images, no form,
no WhatsApp link. That means no insurer logos, no capture, and no consent
flow exist yet. The risk sits in **copy, tables and calculators**.

Next step (the owner or any session with network access, read-only):

1. `node tools/legal-audit.mjs https://seguro.com.py/sitemap.xml > docs/LEGAL-AUDIT-live.md`
2. Read every **high** row and draft the fix from the rewrite given
   (rules in §3). Live edits wait for the owner's go-ahead: Phase 1 does
   not touch live content. Read every calculator and price table in full by hand.
3. Look at the disclosure matrix. Any **NO** in the columns "No somos
   aseguradora/corredor", "Who we are" or "/privacidad link" is a
   sitewide footer fix, made once in the footer partial.
4. Paste the table into this section and re-send this file to the lawyer.

Expected high-risk hotspots, judged from the planned copy in §4. These
are hypotheses to confirm, not findings:
- pillar pages with "cuánto cuesta" ₲ figures;
- any "mejores aseguradoras" or insurer list;
- "cotizá" CTAs;
- JSON-LD `InsuranceAgency`/`AggregateRating`;
- a missing RUC or razón social in the footer.

## 2. Rules, with sources

| # | Rule | Source (as seen) | Status | Consequence for us |
|---|---|---|---|---|
| R1 | Intermediation "sólo podrá ser ejercida por los agentes y corredores de seguros inscriptos" | Ley 827/96 **Art. 70** — [BCP PDF](https://www.bcp.gov.py/documents/20117/213083/LEY_827_96_DE_SEGUROS.pdf/68f0897c-3e19-22c3-4904-367b1b2937a9?t=1741806943153), [BACN](https://www.bacn.gov.py/leyes-paraguayas/703/ley-n-827-de-seguros) | CONFIRMED (text quoted in snippet) | We must never intermediate: no advice, no quote, no proposal, no part in the contracting |
| R2 | Definition: agente/productor/corredor = authorised person "que intermedie en la contratación de seguros" | Ley 827/96, definitions article | Text CONFIRMED; **article number unverified**. `docs/10` "≈Art. 69" is **wrong**: Art. 69 is "Secreto de las actuaciones" | Correct `docs/10` §2 |
| R3 | Agents (natural persons) and corredores (legal entities) must prove "idoneidad" to register | Ley 827/96 Arts. 71–72 (same sources) | CONFIRMED (snippet) | — |
| R4 | The agent/corredor proposes operations "por escrito, bajo su firma" | Ley 827/96 **Art. 76** (BACN, [vLex](https://py.vlex.com/vid/ley-n-827-96-641256181)) | CONFIRMED (snippet) | Proposals and quotes live on the corredor's side, never on our site |
| R5 | Persons not registered "no tendrán derecho a percibir comisión alguna" | Ley 827/96 **Art. 82** "Personas no inscriptas" ([Justia](https://paraguay.justia.com/nacionales/leyes/ley-827-feb-12-1996/gdoc), BACN) | CONFIRMED (snippet) | No commission, no % of premium, likely no per-policy fee (BUSINESS §3) |
| R6 | Sanctions on insurers: warning, fine up to 1,000 jornales mínimos, suspension up to 1 year, revocation | Ley 827/96 **Art. 109** | CONFIRMED (snippet). The range "109–116" in `docs/10` is not confirmed | — |
| R7 | Insurers are sanctioned for operating with non-registered or expired auxiliaries; the same procedure applies to agents and corredores | Ley 827/96 **Arts. 121, 122** | CONFIRMED (snippet) | Our partner carries real risk if we look like an unregistered auxiliary. Contract clause F9 |
| R8 | **Ban on false, incomplete, anonymous, misleading or ambiguous insurance information** "por medio de anuncios, circulares, folletos u otros medios" | Ley 827/96 **Art. 129** "Información al público" | CONFIRMED (snippet). **New: not in `docs/10`** | Applies directly to our copy: no anonymous site (identify the operator), no incomplete price or coverage claims |
| R9 | Offer, promotion and commercialisation of insurance only by SIS-authorised insurers, directly or via agents/corredores; promotion by unauthorised persons sanctioned | **Res. SS.SG. 102/08** (2 Dec 2008) — [baselegal](https://baselegal.com.py/docs/430801ba-0030-11f0-9450-525400343722) | Existence CONFIRMED (secondary). **Scope and sanction list UNVERIFIED — ask the lawyer (B2)**. **New** | **The biggest open risk.** "Promoción" by us may itself need to be done on behalf of, and approved by, the licensed corredor |
| R10 | Banks intermediating insurance are restricted; courts upheld the SIS | Res. SS.RG. 3/2000; Tribunal de Cuentas Ac. y Sent. 18/2019; CSJ Ac. y Sent. 1696/2020 — [BCP comunicado](https://www.bcp.gov.py/web/institucional/w/comunicado-corretaje-de-seguros-por-entidades-financieras) | CONFIRMED (secondary) | The SIS actively polices third-party distribution channels |
| R11 | Intermediation commission cap: 30% of tariff premium (vida, cuenta ajena) | Res. SS.SG. 45/13; Circular SS.SG. 84/2023 — [BCP PDF](https://www.bcp.gov.py/documents/20117/0/2013-08-08-res-sssgn-045-13-limite-de-comisiones-por-intermediacion.pdf/fc027f62-f47e-5530-fec9-7819ffdb756b?t=1744818680412) | CONFIRMED (snippet) | Commissions are regulated money. Any share passing to us is a problem |
| R12 | Digital/remote sales: web, social, messaging, phone; e-signature; free, express, unequivocal consent; IP/metadata kept 2 years after the policy ends | Res. SS.SG. 210 (25 Sep 2025) — [Vouga](https://www.vouga.com.py/la-superintendencia-de-seguros-regula-la-comercializacion-de-seguros-por-medios-electronicos-y-canales-no-presenciales/) | CONFIRMED (secondary) | Addressed to regulated entities. The sale flow stays on the corredor's systems |
| R13 | Matriculación: annual windows, quotas, 3-year validity, lapses after 1 year with no operations; non-residents ineligible | Res. SS.SG. 031/2026 ([BCP PDF](https://www.bcp.gov.py/documents/20117/753661/Resoluci%C3%B3n+SS.SG.+N%C2%B0+031_2026.pdf/3e00fd0b-9f62-b3e5-4797-da5b5218224e?t=1770118492670)), amended by Res. 117/2026 | Resolution CONFIRMED; the non-resident bar is secondary only ([100% Seguro](https://100seguro.com.py/la-sis-redefinio-por-completo-el-regimen-de-matriculacion-de-agentes-corredores-de-seguros-y-liquidadores/)) | Licensing ourselves is not a near-term option |
| R14 | Data protection: promulgated 27 Nov 2025, 24-month vacatio legis → about end of Nov 2027. Consent free, express, specific, informed, unequivocal. 72 h breach notice. Fines 20–2,500 jornales, up to 5,000 (sensitive) and 10,000 (minors). International transfer only with adequacy or safeguards. Agency inside MITIC | Ley **7593/2025** — [BACN](https://www.bacn.gov.py/leyes-paraguayas/12924/ley-n-7593-2025-de-protecci-n-de-datos-personales-en-la-rep-blica-del-paraguay); [Berke](https://www.berke.com.py/analisis-de-la-ley-n-7593-2025-de-proteccion-de-datos-personales-de-paraguay1/); [smartfense](https://smartfense.com/cumplimiento/ley-proteccion-datos-paraguay/) | CONFIRMED (secondary only; **article numbers unverified**). The reglamento was not found (unverified) | Build to it now (BUSINESS §4) |
| R15 | Credit data: consent free, express, informed, documented, revocable; burden of proof on the controller | Ley 6534/2020 ([BACN](https://www.bacn.gov.py/leyes-paraguayas/9417/)) | CONFIRMED (snippet) | Out of scope as long as we collect no credit data |
| R16 | Misleading advertising "incluso por omisión" is prohibited | Ley 1334/98 **Art. 35** — [BCP PDF](https://www.bcp.gov.py/documents/20117/213083/LEY_1334_98_DE_DEFENSA_AL_CONSUMIDOR_Y_DEL_USUARIO.pdf/8e97aae7-421f-db1a-8d0e-39fd0b58fa20?t=1741806943360) | CONFIRMED (snippet) | No price, coverage or saving claims without full conditions |
| R17 | Comparative advertising banned where "declaraciones generales e indiscriminadas" induce belief in superiority | Ley 1334/98 **Art. 36** (same) | CONFIRMED (snippet). Ley 6366/2019 does not amend it (it changed Arts. 4, 6, 10, 15, 29) | No "mejor", no rankings |
| R18 | Provider identification: denominación social, domicilio, owners' names, email, phone, privacy policy on the website | Ley 4868/2013 — **Art. 7 or Art. 28 (sources conflict)**; Decreto 1165/2014 — [ACRAIZ PDF](https://www.acraiz.gov.py/adjunt/Leyes%20y%20Decretos/ley_4868_comercio_electrnico_26-02-13.pdf) | Content CONFIRMED (snippet); **article number UNVERIFIED**. RUC not expressly required (add it anyway) | Footer + `/sobre-nosotros` |
| R19 | Commercial e-communications must be identifiable as such and name the sender; unsolicited ones must say so and offer an easy opt-out | Ley 4868/2013 **Arts. 21, 23** | CONFIRMED (snippet). **New** | WhatsApp/email replies identify us; opt-out in every message |
| R20 | Unsolicited mobile advertising prohibited; check the SEDECO "No Molestar" register; stop within 30 days; strict liability including for third parties acting for the company. **Covers WhatsApp and Telegram** | Ley 5830/2017; Decreto 8000/2017; Res. SDCU 80/2018 Art. 6 — [nomolestar.sedeco.gov.py](https://nomolestar.sedeco.gov.py/); [TEDIC](https://www.tedic.org/wp-content/uploads/2025/09/Claro-vs-Sedeco-WEB.pdf) | CONFIRMED (official site + secondary). `docs/10` Q4 is answered | No outbound WhatsApp. The corredor contacts only people who asked (lawyer E3 on registered numbers) |
| R21 | IVA 10% on services; IRE 10% (IRE SIMPLE below ₲ 2,000 M/year) | Ley 6380/2019 — [DNIT](https://www.dnit.gov.py/en/web/portal-institucional/w/d-ley-n-6380-19) | CONFIRMED (secondary) | Lead fees invoiced with IVA 10% |
| R22 | New RUC legal entities must invoice **only electronically** (SIFEN) since 1 Apr 2025 | [La Nación 2025-04-01](https://www.lanacion.com.py/negocios/2025/04/01/desde-hoy-nuevos-contribuyentes-deberan-facturar-exclusivamente-de-forma-electronica/); DNIT RG 52/2026 | CONFIRMED (secondary) | SIFEN from the first invoice |
| R23 | EAS: single shareholder allowed, legal personality on registration | Ley 6480/2020; Decreto 3998/2020 — [Vouga](https://www.vouga.com.py/en/el-poder-ejecutivo-promulgo-la-ley-6480-20-que-crea-la-empresa-por-acciones-simplificadas/) | CONFIRMED (secondary) | Entity vehicle |
| R24 | INR withholding on PY-source payments to non-residents | Ley 6380/2019; Decreto 3181/2019 — [DNIT cartilla](https://www.dnit.gov.py/documents/20123/218215/Cartilla+Informativa+sobre+el+INR.pdf/6f39e37a-cafb-57ce-7585-3d15de874514?t=1684450785972.pdf) | Existence CONFIRMED; **rate/base UNVERIFIED** | Relevant if the owner invoices from abroad before the EAS exists |
| R25 | Google Ads financial services: physical address, fees, basis of affiliation visible without a click; verification covers insurance; unlicensed advertisers verified through a licensed party | [answer/2464998](https://support.google.com/adspolicy/answer/2464998), [answer/15187149](https://support.google.com/adspolicy/answer/15187149), [answer/12390454](https://support.google.com/adspolicy/answer/12390454), [G2RS](https://g2risksolutions.com/financial-services/) | CONFIRMED (snippet). **Paraguay on the verification list: UNVERIFIED** | BUSINESS §5 |
| R26 | Google: misrepresentation / implied affiliation = egregious (suspension); unreliable claims; data collection needs clear purpose and security; health = sensitive for personalized ads | [15938071](https://support.google.com/adspolicy/answer/15938071), [15936857](https://support.google.com/adspolicy/answer/15936857), [6020956](https://support.google.com/adspolicy/answer/6020956), [143465](https://support.google.com/adspolicy/answer/143465) | CONFIRMED (snippet) | No insurer or BCP/SIS names in ads |
| R27 | Meta: insurance ads 18+; may require regulator authorisation in the target country | [Meta financial services policy](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/financial-services/) | CONFIRMED (snippet); Paraguay scope UNVERIFIED | — |

**Corrections to `docs/10`:**
- The definition is not "≈Art. 69".
- Add R8 (Art. 129), R9 (Res. 102/08), R10, R11, R19 and R20 (WhatsApp is covered).
- The Ley 4868 article number is uncertain.
- Sanctions: only Art. 109 and Arts. 121–122 are confirmed.

**Reading of the model against these rules (for the lawyer to confirm):**
- The marketing-partner model does not rest on any written carve-out. No
  SIS rule on comparators or lead generation was found.
- It rests on staying before "la contratación" (R1/R2) and on not being
  paid a commission (R5).
- R9 is the weak point. If Res. 102/08 reserves "promoción" of insurance
  to authorised entities and their auxiliaries, our pages must be framed
  as **advertising produced for, and approved by, the licensed corredor**.
  They cannot be our own independent promotion of insurers.

## 3. Copy rules applied by the audit script (and by every future edit)

| Risk | Pattern (examples) | Why | Safe rewrite |
|---|---|---|---|
| High | "el mejor seguro", "la mejor aseguradora", "la mejor cobertura" | Recommendation/advice (intermediation) + general superiority claim (Ley 1334 Art. 36) | "Información para comparar coberturas de aseguradoras habilitadas." |
| High | "te recomendamos", "te asesoramos", "nuestros expertos", "asesoramiento gratis" | Advice is the corredor's licensed work | "Un corredor matriculado ante la SIS te asesora. Nosotros no asesoramos." |
| High | "ideal para vos", "a tu medida", "elegimos por vos" | Personalized recommendation | "Consultá con un corredor habilitado qué cobertura corresponde a tu caso." |
| High | ₲/Gs./US$ amounts, "desde ₲…/mes", premium tables, calculators that output a premium | Price that can read as a binding quote. Art. 35 misleading-by-omission risk | Remove. At most a partner-issued range: "referencial, no vinculante; la prima la define la aseguradora" + source + date |
| High | "garantizado", "cobertura total", "cubre todo", "sin letra chica" | Coverage/guarantee claims we cannot back | "Coberturas, exclusiones y condiciones según la póliza de cada aseguradora." |
| High | "contratá ya", "tu póliza en minutos", "te cotizamos", "gestionamos tu siniestro" | Taking part in the sale, the proposal or claims | "Dejá tus datos y un corredor habilitado te contacta." |
| High | Insurer **logos**; insurer name + "mejor/recomendado/líder/socio oficial"; JSON-LD `InsuranceAgency`, `Offer`/price | Implied endorsement or affiliation, or self-description as an agency (also a Google Ads misrepresentation risk) | Name in plain text only, neutral, + "Marca de su titular; sin afiliación". Schema: `Organization` |
| Medium | "top 5", "ranking", "#1", "más barato", "mejor precio", "ahorrá hasta 40%" | A ranking reads as advice. Savings claims need proof | Alphabetical list of SIS-authorised insurers linking to the SIS registry. No savings claims |
| Medium | "oferta", "solo hoy", "últimos días", "no esperes" | False urgency (Art. 35; Google unreliable claims) | "Pedir contacto no tiene costo ni compromiso." |
| Medium | "cotizá", "obtené tu cotización", "compará precios" | Implies we issue the quote | "Pedí que te contacte un corredor habilitado." |
| Medium | "sin franquicia", "sin carencia", "sin exámenes", "incluye grúa" | A coverage claim without an identified source | "Algunos planes pueden incluir… según la póliza." |
| Low | "expertos", "especialistas", neutral insurer mentions, "comparar" | Fine in context. Attribute expertise to the corredor | — |

**Required on every page** (checked by the script's disclosure matrix):

1. Footer: *"seguro.com.py es un servicio de publicidad y referencia
   operado por [razón social], RUC [xxx], [dirección], [email]. No somos
   aseguradora, agente ni corredor de seguros; no intermediamos ni
   asesoramos. Los seguros los ofrecen aseguradoras autorizadas por la
   Superintendencia de Seguros del BCP, a través de corredores
   matriculados."* + links to `/sobre-nosotros`, `/privacidad`, `/terminos`.
2. On every page that names an insurer: a link to that insurer's
   **official site/channel**, plus a link to the SIS list of authorised
   insurers.
3. `/sobre-nosotros`: who we are, how we make money ("el corredor asociado
   nos paga un monto fijo por cada contacto; vos no pagás nada y eso no
   cambia el precio de tu seguro" — wording unverified, lawyer E2), and the
   name and matrícula of the partner corredor once one is signed.

## 4. Planned copy in the repo that already breaks these rules

These are in the planning docs, not (as far as we know) on the live site.
Fix before any build uses them.

| Where | Exact text | Risk | Change |
|---|---|---|---|
| docs/03 L36–38, docs/08 L47 | `/aseguradoras/mapfre/`, `/aseguradoras/la-consolidada/` brand pages "we rank + convert them to comparison" | High | Keep brand pages factual (contact, official links, SIS status). No "convert to comparison" CTA until lawyer B7 |
| docs/03 L102–103 | "`AggregateRating` … `InsuranceAgency` for partner/brand pages" | High | `Organization` only. No ratings of insurers |
| docs/07 §3 | "Reviews of insurers … Trustpilot-of-insurance-PY" | High | Drop. Reviews of insurers = ranking/endorsement |
| docs/04 L21 | `/lp/seguro-auto-barato/` "desde ₲ …/mes" | High | No price angle in LPs |
| docs/04 L23 | `/lp/seguro-moto-ya/` "moto + urgency" | Medium | No urgency |
| docs/04 L20, docs/03 L113 | "cotizá en 2 minutos", "Cotizá tu seguro →" | Medium | "Pedí que te contacte un corredor" |
| docs/04 L52 | Remarketing "terminá tu cotización" | Medium | Remarketing only with consent; no health pages |
| docs/07 §2 | "precio estimado" widget from partner rate cards | High | Only partner-issued, labelled ranges, after lawyer B4b |
| docs/07 §5 | Dealer/bank widget "on rev-share" | High | Revenue share on insurance sales = commission. Fixed fees only |
| docs/03 L124 | "revisado por" a licensed broker | Low | OK if true and the broker is named with matrícula |
| docs/05 L137 | Consent "…compartidos con las aseguradoras/corredores seleccionados…" | Medium | Name the recipient (BUSINESS §4 v1 text) |

## 5. Unverified items (ask the lawyer)

1. Official article numbers of Ley 827/96: the definitions article (not
   69); the sanctions range beyond Arts. 109, 121 and 122.
2. The scope of **Res. SS.SG. 102/08**, and whether it reaches advertising
   or promotion by a non-licensed marketing company acting for a corredor.
3. Any SIS rule on comparators, lead generation or insurance advertising
   beyond Art. 129.
4. Res. 031/2026: the non-resident bar in the primary text.
5. Ley 7593/2025: article numbers; reglamento status; DPO/registration
   duties; the rule for international transfers to VenderCRM/Hostinger.
6. Ley 4868/2013: whether provider identification is Art. 7 or Art. 28;
   whether it applies to a site with no consumer sale.
7. Ley 5830: whether a user-initiated contact request overrides a number
   being on the No Molestar register.
8. Whether per-converted-lead fixed fees count as commission (Art. 82).
9. Whether "asistencia al viajero" is an SIS-regulated insurance product;
   whether prepagas fall under another regulator (the Superintendencia de
   Salud is our assumption, not seen in any source).
10. INR rate and base; IVA treatment of insurance operations versus
    marketing fees.
11. Whether Paraguay is on Google's financial-services verification list;
    whether Google allows health-insurance ads in Paraguay; Meta's
    regulator-authorisation list.
12. The whole of §1: the live-site findings are pending a network-enabled run.
