# Partner contact form — spec

For insurers, brokers, media, agencies and other business partners who want
to contact the site owner. **Not** an insurance request form. Status: design
for build after Phase 0 and Phase 1. Nothing collects data until it is live,
and it does not go live before the owner says so.

## Purpose and limits

- Let partners reach us, create a contact in VenderCRM, and notify the owner
  by e-mail.
- Collect the minimum: business contact details and a short message.
- **Never** accept: cédula numbers, health information, vehicle or property
  details, claims, policy numbers, or any consumer insurance request.

## Consumer deflection (first thing on the page)

Radio "Soy…": *Aseguradora · Corredor o agente de seguros · Medio de
comunicación · Agencia / proveedor · Otro*, and *Persona que busca un seguro*.
The last option replaces the form with:

> "Este sitio es informativo y no tramita pedidos de seguro. Para entender
> tus opciones leé nuestras guías, y verificá siempre que la aseguradora o el
> corredor estén registrados en la Superintendencia de Seguros."

with links to `/guias`, "cómo verificar una aseguradora o un corredor" and
"cómo hacer un reclamo". No fields are rendered, so no consumer data can be
sent. The deflection works without JavaScript (the form sits in a
`<noscript>`-safe block that is only revealed for the business options; the
server also rejects a submission whose type is empty or "persona").

## Fields

| Field | Required | Notes |
|---|---|---|
| Soy… (type) | yes | one of the business options above |
| Nombre y apellido | yes | |
| Organización | yes | |
| Cargo | no | |
| Teléfono / WhatsApp | yes | normalised to `+595…`; VenderCRM uses the phone as the contact identity |
| E-mail | yes | |
| Mensaje | yes | max 1,000 characters. Helper text: "No incluyas datos personales de terceros ni datos de salud." |
| Consent checkbox | yes, unticked | see below |
| Honeypot, time check | hidden | spam control |

## Consent box (mandatory; same pattern on every form on every site)

Rules:

- **Its own bordered box directly above the send button**, light background,
  never fine print.
- **Unticked by default. Required.** The send button stays disabled until it
  is ticked. Submitting without it shows a red message next to the box: "Para
  enviar el mensaje necesitamos tu autorización." The **server rejects it
  too**.
- **One purpose only.** Never bundled with terms, newsletters or marketing. A
  newsletter, if ever, is a second, separate, optional box.
- **Plain Spanish, short sentences, 16 px or larger**, same size as the form
  labels. The whole label is clickable.
- Show the text version ("v1.0") under it. Keep every old version in the repo
  at `content/consent/v1.0.txt`, `v1.1.txt`, …

**Layout (what the visitor sees):**

```
┌──────────────────────────────────────────────────────────────┐
│ Qué hacemos con tus datos                                    │
│ • Los usamos solo para responder a este mensaje.             │
│ • Los ve [razón social o titular] y nuestro proveedor de CRM │
│   (VenderCRM) y de correo electrónico.                       │
│ • No los vendemos ni los compartimos con aseguradoras,       │
│   corredores ni bancos.                                      │
│ • Podés pedir que los borremos cuando quieras: datos@…       │
│                                                              │
│ ☐ Sí, acepto que [razón social o titular] guarde estos       │
│   datos y me contacte por teléfono, WhatsApp o e-mail solo   │
│   para responder a este mensaje.                             │
│   Leé la Política de privacidad.          (Texto v1.0)       │
└──────────────────────────────────────────────────────────────┘
```

**Exact label (v1.0):**

> ☐ "Sí, acepto que [razón social o titular] guarde estos datos y me contacte
> por teléfono, WhatsApp o e-mail **solo para responder a este mensaje**."

Until the company exists, `[razón social o titular]` is the owner's name as
confirmed by the owner. Never invent it; if it is `null`, the build must fail
`verify.sh` rather than render a blank.

**Proof of consent.** The handler adds this line to the CRM message and the
notification e-mail:

`Consentimiento v1.0 aceptado el AAAA-MM-DD HH:MM (America/Asuncion)`

**Never:** pre-tick the box, hide it behind a link, shrink it, move it to a
second page, write "al enviar aceptás…" instead of a box, or reuse it for
anything else.

**Privacy-policy section for this form (short):** who we are; purpose (reply to
the message and manage the business relationship); recipients (VenderCRM and
our e-mail provider, which may be outside Paraguay); retention (until the
relationship ends, then 24 months: **proposed, ask the lawyer**); rights
(access, rectification, deletion, objection, withdrawal of consent) through
`datos@`; and that no consumer applications are accepted. Version it and show
the version.

## Handler: `contacto-alianzas.php`

1. Accept POST only. Reject silently if the honeypot is filled or the form was
   submitted in under 3 seconds (a signed timestamp field, not a cookie).
2. Reject if consent is missing. Reject if the type is empty or "persona".
3. Validate and trim every field. Normalise the phone to `+595…`. Reject
   messages over 1,000 characters. Strip CR/LF from every value that reaches
   an e-mail header.
4. Rate-limit: at most 5 submissions per IP per hour, using a small counter
   file in `storage/` (outside the web root, git-ignored). Store a hash of the
   IP, not the raw IP, and prune entries older than 1 hour.
5. Build the CRM payload (VenderCRM contract from the owner's private
   endpoint file; do not copy it into this repo):
   ```json
   { "phone": "+595…", "name": "Nombre (Organización)", "email": "…",
     "message": "[Alianzas · tipo] Cargo: … — mensaje — Consentimiento v1.0 aceptado el … (America/Asuncion)",
     "source": "alianzas-web", "idempotency_key": "<uuid per submission>" }
   ```
6. POST to the endpoint with header `X-Api-Key` from `config.php`, 10 s
   timeout. On non-2xx, `error_log` the status and the response body's error
   field name only (no personal data).
7. Send the notification e-mail to the address in `config.php`. This is also
   the fallback if the CRM is down, so no message is lost.
8. Always redirect to `/gracias-contacto`, whatever the CRM answered.
9. Never echo the key, the endpoint or an error to the visitor.

## `config.php` (the owner uploads it by hand; never in the repo)

```php
<?php
return [
  'vcrm_endpoint' => 'PASTE_ENDPOINT_URL_HERE',
  'vcrm_api_key'  => 'PASTE_THE_SEGURO_KEY_HERE',
  'notify_email'  => 'contacto@seguro.com.py',
  'from_email'    => 'no-reply@seguro.com.py',
];
```

- This is a **template with placeholders only**. The real key and endpoint
  come from the owner's private VenderCRM file and are never pasted in chat,
  commits, docs or logs.
- Upload through the Hostinger File Manager, one level above the site folder if
  the hosting allows it; otherwise next to the handler with an `.htaccess`
  rule that denies web access.
- `.gitignore` blocks `config.php`, `storage/`, `*.log` and
  `vendercrm-lead-endpoints*.md`.
- After the first redeploy from hPanel → Advanced → Git, confirm that
  `config.php` is still there (a git deploy normally leaves untracked files
  alone; check once) and that `https://seguro.com.py/config.php` returns
  nothing.
- Before first use, the VenderCRM site record for seguro must be active, and
  its pipeline must keep partner contacts apart from anything else. Filter by
  the source `alianzas-web`.

## Test plan (before launch)

- [ ] A valid submission creates one CRM contact and sends one e-mail.
- [ ] A resubmission with the same phone updates the contact instead of
      creating a second one.
- [ ] A bad key or an unreachable CRM still shows the thank-you page, and the
      e-mail arrives.
- [ ] A filled honeypot, a fast submit and a sixth submission in an hour are
      all rejected silently.
- [ ] "Persona que busca un seguro" shows no fields, with JavaScript on and off.
- [ ] The send button is disabled until the consent box is ticked; a POST
      without consent shows the red message and is rejected by the server.
- [ ] The consent line (version + timestamp) appears in the CRM contact and in
      the e-mail.
- [ ] No consumer or health field exists in the HTML or the handler.
- [ ] Header-injection test: a name containing `\r\nBcc:` sends nothing extra.
- [ ] The key does not appear in the repo, the page source or the logs, and
      `/config.php` and `/storage/` are not reachable from the web.

## Residual risk (low, not zero)

- A consumer ignores the deflection and writes insurance or health details in
  the message. Mitigation: helper text, deflection first, and a standing rule
  to delete such a message and reply with the guides link.
- The form stores personal data of business contacts. Ley 7593/2025 applies in
  full from about Nov 2027 (see `docs/LEGAL-AUDIT.md`); a consent box, a
  privacy notice and deletion on request cover it in the meantime. Ask the
  lawyer at the optional review.
- VenderCRM and the e-mail provider may be outside Paraguay (international
  transfer): confirm with the lawyer.
