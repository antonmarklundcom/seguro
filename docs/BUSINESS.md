# BUSINESS — seguro.com.py, Phase 1

> 2026-09-30. A decision memo, not legal advice. Sources and gaps:
> `docs/LEGAL-AUDIT.md`. Lawyer questions: `docs/LAWYER-CHECKLIST.md`.
> **⛔ = BLOCKED until the owner confirms lawyer approval. No form, WhatsApp
> link, ad or partner outreach goes live before that.**

## 1. Model

This is an advertising and referral service. We publish neutral
information and collect a consented request for contact. The request goes
to **one licensed corredor** (matriculado ante la SIS). The corredor
advises, quotes, signs the proposal (Ley 827/96 Art. 76) and sells. We are
paid a **fixed ₲ fee per valid lead**. We never take a share of premium or
commission: Art. 82 denies any commission to non-registered persons
(confirmed via search snippet; the article numbers still need the official
PDF).

## 2. Demand ranking

No keyword-library MCP was connected to this session, so the table uses
market-size proxies, not search volume. Replace them with Keyword Planner
data before building pages.

| # | Vertical | Proxy evidence |
|---|---|---|
| 1 | **Auto (+moto)** | 41.4% of all premiums, the largest line (SIS yearbook 2025, via ASSAL); about 3.1M registered vehicles (Poder Judicial) |
| 2 | Prepaga | About 500–550k covered, beneficiaries up 8–10% in 2025. Regulated **outside** the SIS; health-data and Google health-ad restrictions |
| 3 | Vida | 16.7% of premiums, up 24% in 9M 2025. Much of it is probably bank credit-life, which people don't search for |
| 4 | Viaje | 538k departures Nov 2025–Jan 2026. Mostly sold as "asistencia al viajero" (whether that is SIS-regulated is unverified) |
| 5 | Empresas | Riesgos varios 10.7% and the fastest growing, but B2B and low search volume |
| 6 | Hogar | Incendio as a whole is about 6.9%, including commercial risks |

## 3. Competitors and buyers

| Competitor | Model | Note |
|---|---|---|
| quieromiseguro.com.py / Broker Codas | **Licensed corredor** (SIS No. 135) with a comparator front end, WhatsApp | The closest analogue. It shows that the compliant version of this business is run *by* a corredor |
| covering.com.py | Licensed corredor (SIS No. 023), digital quote + WhatsApp | Also a partner prospect |
| comparaencasa.com/py | Regional comparator, "20 aseguradoras" | PY licence unverified |
| comparalatam.com/py | Affiliate content comparator (auto, salud) | No licence seen; contains factual errors |
| seguroparaviaje.com.py | Travel-assistance seller, online form | Regulatory status unverified |

Insurers AESA, La Consolidada and Sancor also quote online themselves.
**Buyers:** licensed corredores first. The market has about 34 insurers
(APCS); the top three are Mapfre 11.2%, Aseguradora del Este 10.6% and
Yacyretá 7.9%. AESA publishes its corredor list. AASP has 200+ agents.
Capamed represents 19 prepagas. We found **no evidence of paid lead-buying
in Paraguay**. Price anchor: HelloSafe Mexico lists exclusive auto leads
at MXN 130 (about US$7). The PY price is a hypothesis to test.

**Payment structures, safest first**

| Structure | Risk |
|---|---|
| Flat monthly advertising fee from one corredor | Lowest. Plain media buying (lawyer C2d) |
| **Fixed ₲ per valid lead, the same whether or not a policy is sold** | Low: **recommended**. It pays for a marketing deliverable, with credits for bad leads |
| Fixed ₲ only per converted lead or issued policy | Medium–high. Payment tied to the contract reads as a commission (C2b) |
| % of premium or commission; bonus per policy; dealer rev-share | **High, never.** Art. 82 bars it, it is likely unenforceable, and it exposes the corredor too (Art. 121 sanctions insurers that work with non-registered auxiliaries, snippet) |

**Why one licensed corredor is the regulated party:** it holds the
matrícula (non-residents appear to be barred from registering under Res.
SS.SG. 031/2026, secondary source), it signs every proposal, and it owns
the Res. 210/2025 digital-sale duties: e-signature, pre-contract
information, and 2-year records. Because it places with several insurers,
users get real choice and we never rank insurers.

## 4. Lead flow (design only) ⛔

- **Fields.** Auto: nombre, WhatsApp/teléfono, ciudad, marca + año.
  Viaje: nombre, WhatsApp, destino (región), fecha de salida. The vertical
  and the consent checkbox are required. **Never** collect cédula, health,
  income or credit data, and there is no free-text box.
- **Consent v1** (unticked; text for the lawyer): *"Acepto que seguro.com.py
  (servicio de publicidad; no es aseguradora ni corredor) envíe mis datos a
  [Corredor], corredor matriculado ante la Superintendencia de Seguros N°
  [xxx], para que me contacte por WhatsApp o teléfono sobre este pedido. No
  recibiré otros mensajes. Puedo retirar mi consentimiento y pedir la
  eliminación de mis datos en privacidad@seguro.com.py."* Button: "Pedir que
  me contacten" (never "Contratar" or "Ver mi precio").
- **Recipient:** only the named corredor. There is no resale and no reuse for
  another vertical. **The user is told** on the thank-you page who will write
  to them, that the corredor advises and quotes, and that we take no part in
  the sale and charge the user nothing. The corredor's first message names
  seguro.com.py as the source and gives its matrícula.
- **Persist-first log:** an append-only line written before any CRM call:
  `id, created_at, vertical, fields, consent{text_version, text_sha256, ip,
  user_agent, page_url}, delivered_to, delivered_at, status`. The consent
  texts live in versioned files.
- **Retention (proposed):** raw IP 90 days, then hashed. Lead data 12 months
  after the last contact. Consent proof 24 months. Leads never delivered
  are deleted after 30 days.
- **Opt-out and deletion:** the user emails us or sends "BAJA" on WhatsApp.
  We delete the lead from our log and the CRM within 5 business days,
  forward the request to the corredor, and confirm to the user. A
  salted-hash suppression list stops the person being re-sent.
- **Gate:** no capture without the lawyer approving `/privacidad`,
  `/terminos`, the footer disclosure and a signed corredor agreement.
  Hosting and CRM outside Paraguay count as international transfers under
  7593/2025 (lawyer D6).

## 5. Advertising ⛔

**Google.** Landing pages must show, without a click, our physical
address, our fees ("sin costo para vos"), and the basis of any affiliation
claim. Financial-services verification covers insurance. Unlicensed firms
must be verified through a licensed party. Whether Paraguay is on that
list is **unverified**: check answer/12390454 by hand. Health-insurance
ads may be barred in uncertified countries (another reason to skip
prepaga). Implying endorsement by an insurer, the BCP or the SIS gets the
account suspended. No remarketing on health pages. Advertiser verification
needs the RUC, so the EAS comes first.

**Meta.** Insurance ads target 18+ only. Meta may require regulator
authorisation. Lead ads need a privacy-policy URL.

| Never | Safe draft |
|---|---|
| "El seguro más barato", "el mejor seguro" | "Seguro de auto en Paraguay: te contacta un corredor matriculado" |
| "Cotizá y contratá en 2 minutos" | "Dejá tus datos, sin costo ni compromiso" |
| "Desde ₲ 150.000/mes", "ahorrá 40%" | (no prices, no savings claims) |
| "Oferta solo hoy" | (no urgency) |
| Insurer names or logos, "BCP"/"Superintendencia" | "Opciones de varias aseguradoras, a través de un corredor habilitado" |

## 6. Recommendation ⛔ BLOCKED until lawyer approval

1. **Launch vertical: Auto (including moto).** It has the largest demand,
   the data needed is non-sensitive, and it is the corredores' core
   product.
2. **Second, about 60 days later: Viaje.** The travel data is simple and
   visa-driven intent is strong. Launch it only after the lawyer confirms
   how "asistencia al viajero" is regulated. Prepaga, vida and hogar wait.
3. **Minimum form:** the auto fields in §4, one step, consent v1, the
   thank-you text, and the persist-first log. No calculator, no prices, no
   insurer names.
4. **Minimum WhatsApp flow:** a click-to-chat button with a prefilled
   message: "Hola, quiero que un corredor me contacte por seguro de auto
   (vía seguro.com.py)". The first auto-reply carries the short disclosure
   plus the privacy link and asks for explicit "SÍ" consent before any
   data goes to the corredor. SEDECO says WhatsApp is covered by the No
   Molestar rules, so there are no outbound messages, ever.
5. **Order of work:** fix the live copy (LEGAL-AUDIT) → lawyer opinion →
   incorporate the EAS (RUC, SIFEN from the first invoice, IVA 10% + IRE) →
   sign one corredor (Broker Codas and Covering are prospects; outreach is
   ⛔) → switch on the form and WhatsApp → ads.
