# LAWYER-CHECKLIST — seguro.com.py (information site)

2026-10-01. **A one-hour review is optional but recommended** before launch.
It is the only judgement call left once the checklist in
`MASTER_PLAN.md` §7 is met. If only one hour is bought, spend it on **A1, A2,
B1, B2 and C1**. Bring `LEGAL-AUDIT.md`, `DISCLAIMERS.md`, `PARTNER-FORM.md`
and the live-site scan. Nothing here asks the lawyer to approve sales: the
model sells nothing. The earlier lead-gen checklist is in
`LAWYER-CHECKLIST-LEADGEN-OLD.md` for the deferred model.

## A. Insurance regulation (Ley 827/96, SIS)

1. Does a site that only publishes general insurance information, with no
   quote, no lead, no data collection and no ads, fall outside
   "intermediación en la contratación de seguros" (Ley 827/96 Art. 70)?
   What would make it cross the line (a directory, a calculator, a link to a
   broker, a premium example)?
2. **Res. SS.SG. 102/08** ("oferta, promoción, comercialización"): does it reach
   neutral information, an alphabetical directory of registered entities with
   links to their official sites, or illustrative premium examples with source
   and date? Which articles define "promoción"?
3. Ley 827/96 **Art. 129** ("Información al público"): does it apply to us? What
   makes information "incompleta" or "ambigua" on an educational page?
4. Please confirm, from the official text, the article numbers we rely on: the
   defining article for agente/corredor, Arts. 70, 76, 82, 109, 121, 122, 129.
5. Is there any other SIS rule on websites, comparators, advertising of
   insurance, or the use of insurer names? Is the exact title of the SIS
   register of agents and corredores (the one a consumer should check) correct
   in our guide?
6. The Senate is studying a new Ley de Seguros (June 2026). Any change that
   would affect an information site?

## B. Content, advertising and consumer law

1. Review `DISCLAIMERS.md`: top strip, footer, guide end note, directory text,
   calculator text. Are they sufficient and not misleading? Does the phrase
   "No vendemos seguros" need a qualifier?
2. **SOA / SOAT:** we plan to say that the SOAT was repealed by Ley 5150/2014 and
   that the SOA is a bill. A summary of Ley 5016/14 (Tránsito) Art. 95 mentions
   the SOAT. Is the SOAT repealed in practice? Is any mandatory vehicle insurance
   in force? Is Carta Verde legally required to drive to Mercosur countries
   (Res. SS.RG. 2/99)?
3. **Prepaga:** may we explain "seguro médico vs medicina prepaga" and name the
   Superintendencia de Salud as regulator (Ley 1032/96, Ley 2319/06)? Any
   advertising rule for prepaga we must respect?
4. Ley 1334/98 Arts. 35-36 (misleading and comparative advertising): is plain
   alphabetical listing of insurers, with verified registration, safe? Is naming
   insurers in guides (plain text, no logos) a trademark or unfair-competition
   risk (Ley 1294/98)?
5. Defamation: any wording rules for criticising a named insurer's claim
   practices (Código Penal Arts. 150-152, as summarised)?
6. SEDECO: any rule or enforcement on insurance advertising we should know?
7. Travel assistance, pet insurance, credit life, agricultural insurance: are
   these insurance under Ley 827/96? May we write neutral guides?

## C. Data protection and the partner form

1. Review the consent box and text v1.0 (`PARTNER-FORM.md`). Is consent the
   right legal basis for a business contact form, or is legitimate interest or a
   pre-contractual request enough? Is the retention "until the relationship
   ends, then 24 months" acceptable?
2. Ley 7593/2025: confirm promulgation (27 Nov 2025), entry into force (about
   Nov 2027) and that nothing applies earlier. Status of the reglamento and of
   the Agencia Nacional de Protección de Datos Personales.
3. Is health data sensitive as we assume (Berke/Deloitte summaries)? The form
   forbids it in helper text; is that enough if a consumer ignores the
   deflection? Our rule: delete the message and reply with the guides link.
4. Do we need a DPO, a registry entry, or a breach-notification procedure now
   (72 hours, as summarised)? Please provide a one-page breach template.
5. International transfer: VenderCRM and the e-mail provider may be outside
   Paraguay. What clause or wording is required, now and from Nov 2027?
6. ARCO requests: exact procedure and response time (30 days, as summarised).
7. Cookies and analytics: is there a Paraguayan rule? Is our banner (equal
   "Aceptar" and "Rechazar", analytics only after consent) enough?
8. Rate limiting stores a hash of the IP for one hour. Is that personal data
   needing a notice?

## D. Company, tax, identification

1. Ley 4868/2013: is the identification block required for an informational
   site (Art. 7 or Art. 28)? What must it contain: razón social, RUC, domicilio,
   e-mail, phone, owners' names?
2. EAS (Ley 6480/2020): is it the right vehicle for a content site? Legal
   representative requirement for a non-resident owner (nominee or POA)?
3. Until the company exists: may we run the site under the owner's name with
   only a contact e-mail?
4. Tax on a later revenue: AdSense, sponsored content, listing fees, affiliate
   commissions. IVA 10%, IRE or IRE SIMPLE, export-of-services treatment,
   withholding on foreign payments. (An accountant may answer this better.)

## E. Deferred (ask only if the owner revives lead-gen or monetisation)

1. Per-lead fixed fee versus per-policy or commission: Art. 82 and the risk of
   being treated as an unregistered intermediary.
2. A licensed corredor as the regulated sales party; partner contract clauses
   (`LAWYER-CHECKLIST-LEADGEN-OLD.md` §F).
3. Paid listings or sponsored placements by insurers: "promoción" under Res.
   102/08?
4. Google and Meta Ads for insurance in Paraguay.

## F. Documents to bring or request

- This repo's `docs/` (LEGAL-AUDIT, DISCLAIMERS, PARTNER-FORM, MASTER_PLAN).
- The live-site scan output (`tools/legal-audit.mjs`).
- Screenshots of home, one guide, the footer and `/contacto` (when built).
- Draft texts to review: privacy policy section for the form, cookie policy,
  terms of use, consent v1.0.
- From the owner: passport, proof of address, planned company bylaws.

## G. Sign-off needed before each launch step (if a lawyer is used)

| Step | Questions |
|---|---|
| Publish disclaimers and fix existing copy | B1, A1-A3 |
| Publish SOA, prepaga and Carta Verde guides | B2, B3 |
| Switch on the partner form | C1-C8, D1, D3 |
| Add a directory | A2, B4 |
| Any monetisation | E, D4 |
