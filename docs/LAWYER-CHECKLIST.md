# LAWYER-CHECKLIST — seguro.com.py

> Phase 1 deliverable, 2026-09-30. Bring this file, `docs/LEGAL-AUDIT.md`
> and `docs/BUSINESS.md` to the first meeting. The questions below are
> what the lawyer's **written opinion** must answer. **Nothing goes live
> (no form, no WhatsApp link, no ads, no partner outreach) until the owner
> confirms the lawyer has approved.** Firms that publish on this area:
> Vouga, Ferrere, BKM Berkemeyer, Altra Legal (from `docs/10` §9, not re-checked).

## A. Scope of the engagement (ask for a fixed-fee quote)

1. A written opinion on the operating model (section B), which we can show
   to partners.
2. Review and redlining of: footer disclosure, `/sobre-nosotros`,
   `/privacidad`, `/terminos`, consent texts v1 (form + WhatsApp), and the
   copy rules in `docs/LEGAL-AUDIT.md` §3.
3. Drafting of the lead-referral agreement with a licensed corredor
   (section F).
4. Optional: an informal consultation with the Superintendencia de Seguros
   (SIS), in writing if possible, on where the intermediation line sits.
5. Entity and tax set-up advice (section E).

## B. Insurance regulation (Ley 827/96, SIS)

1. Confirm the Ley 827/96 articles we rely on (LEGAL-AUDIT §2, R1–R8).
   Arts. 70, 76, 82, 109, 121, 122 and 129 were seen only in search
   snippets. The article that defines agente/corredor is **not** Art. 69,
   as our older draft says. Which article is it?
2. **Res. SS.SG. 102/08** (offer, promotion and commercialisation of
   insurance) is our largest open risk. Does it forbid a non-authorised
   company from *promoting* insurance? That covers our own pages, even
   when the pages are neutral and the leads go to a corredor. If it does,
   is the fix a written advertising mandate from the corredor, with the
   corredor approving all copy?
3. Ley 827/96 Art. 129 ("Información al público") bans misleading,
   incomplete or anonymous insurance information. Does it apply to us
   directly? What must every page say to be "complete"?
4. **Core question:** is the activity described in `docs/BUSINESS.md` §4
   (educational content, a form or WhatsApp message that collects interest
   and contact data with consent, and the transfer of that data to one
   matriculated corredor for a fixed fee) outside "intermediación en la
   contratación de seguros"? At what point would any of the following make
   it intermediation?
   - a) naming several insurers on a page;
   - b) showing indicative price ranges supplied by the partner;
   - c) asking risk questions (vehicle make/year, travel dates, ages);
   - d) a "cotizar" CTA;
   - e) routing a lead to a particular corredor by vertical or city.
5. Is there any other SIS resolution, circular or published sanction on
   comparators, lead generators, "canales alternativos" or third parties
   that promote insurance? Do Res. SS.SG. 210/2025 (digital channels) and
   Res. SS.SG. 031/2026 (matriculación) impose duties on the **corredor**
   that flow down to us, such as recording, identifying the channel, or
   limits on who may take part in a digital sale?
6. The SIS restricted banks acting as insurance intermediaries, and the
   courts upheld it (Res. SS.RG. 3/2000; CSJ Ac. y Sent. 1696/2020). Does
   that precedent tell us anything about lead generators?
7. Can we name insurers (as text, never logos) on neutral informational
   pages, and link to their official channels, without their consent?
   Is there any trademark or unfair-competition risk (Ley 1294/98 de
   Marcas, unverified)?
8. Can the owner, as a non-resident foreigner, ever be matriculated?
   (`docs/10` says Res. 031/2026 bars non-residents.) If not, confirm that
   partnering with a licensed corredor is the right structure.

## C. Remuneration (the most important section)

1. **Fixed fee per delivered, qualified lead** (₲ amount fixed in advance,
   independent of whether a policy is sold): confirm this is lawful for a
   non-matriculated company.
2. Confirm that each of the following **is not** lawful for us, or say
   under what conditions it could be:
   - a) a percentage of premium or of the corredor's commission;
   - b) a fixed fee paid only per issued policy;
   - c) volume bonuses tied to policies sold;
   - d) a flat monthly marketing retainer with a per-lead top-up.
3. If the commission prohibition is confirmed (≈Art. 82, unverified), can
   the corredor lawfully pay us out of its own commission income? Does
   paying us expose the corredor to SIS sanctions, for example for sharing
   commissions with a non-matriculated person?
4. Can we use "policy sold" data from the partner for Google Ads
   optimisation (offline conversions), without that data affecting what
   we are paid?

## D. Personal data (Ley 7593/2025 and current law)

1. Confirm: the promulgation date, the entry-into-force date, the status of
   the reglamento, which obligations already apply today, and the
   enforcement authority.
2. Is **explicit consent** the right legal basis for transferring a lead
   to a named corredor? Review the consent text v1 (`docs/BUSINESS.md` §4).
   Should the corredor be named at the moment of consent, or is a named
   category plus a public partner list enough?
3. Roles: are we and the corredor each "responsable" (independent
   controllers), or is the corredor our "encargado"? Which contract terms
   follow from that?
4. Retention: we propose 12 months for lead records and 24 months for
   consent proof after the last interaction. Is that acceptable, or do
   limitation periods require longer retention of consent proof?
5. Is storing IP address + timestamp + consent-text version as proof of
   consent proportionate? How long should raw IP be kept?
6. International transfer: the CRM (VenderCRM) and hosting (Hostinger)
   may process data outside Paraguay. What does the law require for that
   (consent wording, contract clauses)?
7. Do we need a DPO, a registry entry, or a breach-notification procedure
   (72 h, unverified)? Please provide a template breach log.
8. What exact procedure and response time for ARCO requests (access,
   rectification, deletion, objection)?
9. Health data: the prepaga funnel will ask **no** health questions. Are
   the age of each family member and "number of people to cover" health
   data or sensitive data?

## E. Consumer, e-commerce, anti-spam, entity, tax

1. Ley 4868/2013 + Decreto 1165/2014: our sources conflict on whether
   provider identification is Art. 7 or Art. 28. What must appear, and
   where (footer or `/sobre-nosotros`)? Does it apply to a site that sells
   nothing to consumers? Do Arts. 21/23 (identifiable commercial
   communications, opt-out) apply to our WhatsApp replies?
2. Ley 1334/98 Arts. 35–36 (misleading and comparative advertising):
   review the copy rules and the safe rewrites in `docs/LEGAL-AUDIT.md`.
   Does it help that we present ourselves as "servicio gratuito para el
   usuario"?
3. Ley 5830/2017: SEDECO says the No Molestar register covers WhatsApp
   (Res. SDCU 80/2018 Art. 6). Is a user-initiated WhatsApp chat
   (click-to-chat) consent to reply? Can the corredor call a lead whose
   number is on the register if that person asked for contact through our
   form? The company is strictly liable for third parties acting for it.
   Does that make us liable for the corredor's calls?
4. Entity: is an EAS (Ley 6480/2020) the right vehicle? Legal
   representative requirement for a non-resident owner (nominee/POA)?
   Does the corporate purpose need to exclude "intermediación de seguros"
   explicitly?
5. Tax: are the lead fees taxed at IVA 10% + IRE? What are the SIFEN
   e-invoicing obligations from the first invoice? If the owner invoices
   from abroad before the EAS exists, what withholding applies (IRE/INR,
   IVA)? Can we invoice before the EAS exists at all?
6. Google Ads: do we need a local legal entity or licence to pass Google's
   advertiser/financial-services verification for insurance ads in
   Paraguay? (See `docs/BUSINESS.md` §5; this is also a Google question.)

## F. Lead-referral agreement with a licensed corredor — clauses to draft

1. **Parties and recitals:** the corredor's SIS matrícula number and
   validity; we are a marketing/advertising provider, not an intermediary;
   the corredor alone advises, quotes, presents proposals, contracts,
   handles claims and collects premium.
2. **Service definition:** advertising + delivery of consented contact
   requests. Excluded: advice, quotes, proposals, collecting premium,
   signing anything on behalf of insurer or client.
3. **Price:** fixed ₲ fee per **valid lead**, plus IVA, invoiced monthly via
   SIFEN. No link to premium, commission, or issued policy. Credits for
   invalid leads (wrong number, duplicate within 30 days, no consent, out of
   area) claimed within 7 days with evidence.
4. **Lead definition and quality:** required fields, consent version,
   exclusivity (one corredor per lead: yes), maximum number of leads
   per month, and pause rights.
5. **Data protection:** roles (C1/D3), a warranty that consent covers the
   transfer, use limited to responding to that request, no resale or onward
   transfer, security measures, 72 h breach cooperation, handling of ARCO
   requests forwarded both ways within 5 business days, deletion at the end
   of the contract or on request, audit right, and a 5-day correction
   notice (`docs/10` §4, unverified).
6. **Contact conduct:** first contact within 1 business day, only on the
   channel the user chose, identify themselves as a corredor matriculado
   and name the source ("te contactamos porque lo pediste en
   seguro.com.py"), no contact after opt-out, compliance with Ley 5830 / No
   Molestar.
7. **Advertising content:** anything on our site that describes the partner
   or its products (names, price ranges, coverage descriptions) is
   supplied or approved **in writing** by the partner; the partner
   warrants accuracy; mutual indemnity for Ley 1334/98 claims.
8. **Brand use:** a limited licence to use the corredor's name, and the name
   of any insurer it represents, only with that insurer's written consent.
   No logos otherwise.
9. **Regulatory change:** if the SIS or a court says the model or the
   fee is intermediation, either party may suspend at once. The
   restructuring obligation must not include commission sharing.
10. **Independence:** no agency, employment, or exclusivity for the
    consumer. The corredor does not use our brand when selling.
11. **Term, termination, jurisdiction:** Paraguayan law, courts of
    Asunción, or arbitration (Centro de Arbitraje y Mediación Paraguay,
    unverified).
12. **Records:** the corredor reports the lead outcome (contacted / quoted
    / sold) for quality and ad optimisation only. It must say explicitly
    that this data never changes the fee.

## G. Documents to bring or request

- Owner: passport, proof of address, planned EAS bylaws (proforma).
- The current live site (sitemap URLs), screenshots of the home page, one
  pillar page per vertical, and the footer.
- `tools/legal-audit.mjs` output (`docs/LEGAL-AUDIT.md` §1), after it has
  been run against the live site.
- Drafts to be written after sign-off of B and C: privacy policy,
  terms of use, the consent texts, and the partner agreement.
- From the prospective corredor: SIS matrícula certificate, RUC, the
  professional-liability policy/bond required by Res. 031/2026
  (unverified), the list of insurers they are authorised to place with,
  and written consent from each insurer that will be named on our site.

## H. What the lawyer must sign off before each launch step

| Step | Needs written approval of |
|---|---|
| Fix live-site copy | copy rules + rewrites (LEGAL-AUDIT §3) |
| Footer disclosure + `/sobre-nosotros` | B3, E1 |
| Form or WhatsApp capture | B2, B4, D2–D8, E1, E3, privacy policy, terms |
| First partner call/outreach | C1–C3, F (agreement draft) |
| Google/Meta ads | B2, B3, E2, E6 + ad copy list (BUSINESS §5) |
| First invoice | E4, E5 |
