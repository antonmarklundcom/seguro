# 05 — Lead Engine (Backend)

The lead engine is the revenue-critical system: ingest → validate → dedupe →
score → route → deliver → track outcome → bill. It runs as `apps/api`
(Fastify, synchronous path) + `apps/worker` (BullMQ, asynchronous path).

## Data model (Prisma sketch)

```prisma
model Vertical {          // seguro-de-auto, seguro-de-moto, ...
  id        String  @id
  name      String
  fields    Json    // funnel field schema per vertical (zod-serializable)
  active    Boolean @default(true)
}

model Lead {
  id           String   @id @default(cuid())
  verticalId   String
  status       LeadStatus // NEW→VALID→ROUTED→DELIVERED→ACCEPTED→SOLD / REJECTED / DUPLICATE / INVALID / PARTIAL
  // contact
  name         String?
  phone        String    // E.164, +595…
  email        String?
  city         String?
  // vertical-specific answers (validated against Vertical.fields)
  payload      Json
  // attribution — first-class, never lost
  gclid        String?
  utmSource    String?  utmMedium  String?  utmCampaign String?  utmTerm String?
  landingPage  String?
  abVariant    String?
  referrer     String?
  device       String?
  ip           String?   // for fraud/geo checks, retention-limited
  consentAt    DateTime  // explicit consent timestamp + version
  consentText  String    // exact text agreed to (audit)
  score        Int?      // 0–100
  createdAt    DateTime @default(now())
  deliveries   LeadDelivery[]
}

model Partner {
  id            String @id
  name          String
  active        Boolean
  channels      Json     // [{type: webhook|email|whatsapp|sheet, config}]
  verticals     PartnerVertical[]
}

model PartnerVertical {   // routing config per (partner, vertical)
  partnerId     String
  verticalId    String
  cplGs         Int      // price per lead in guaraníes
  exclusive     Boolean  // exclusive vs shared lead
  maxShared     Int      @default(3)
  dailyCap      Int?
  monthlyCap    Int?
  priority      Int      // routing order
  weight        Int      // weighted round-robin within same priority
  filters       Json     // e.g. {city: ["asuncion"], minCarYear: 2015}
  active        Boolean
}

model LeadDelivery {
  id          String @id @default(cuid())
  leadId      String
  partnerId   String
  channel     String   // webhook | email | whatsapp
  status      String   // PENDING→SENT→CONFIRMED / FAILED (attempt log in Json)
  attempts    Json
  billableGs  Int      // snapshot of CPL at delivery time
  outcome     String?  // partner feedback: accepted | rejected(reason) | sold
  createdAt   DateTime @default(now())
}
```

## Pipeline

### 1. Ingest — `POST /v1/leads` (synchronous, < 100 ms)
- Zod validation from `packages/shared` (same schema the form uses — no
  drift), phone normalized to E.164 `+595`, mobile-prefix sanity check.
- Spam defenses: honeypot field, time-to-submit floor, Cloudflare Turnstile
  (invisible), IP rate limiting, disposable-email list.
- **Persist first, always** (status `NEW`), enqueue `process-lead`, return
  `201` immediately. Partial funnel steps post to `POST /v1/leads/partial`.

### 2. Validate & dedupe (worker)
- Duplicate = same phone + vertical within 30 days → status `DUPLICATE`
  (never billed to a partner — this protects lead-quality reputation, the
  most important asset the business has).
- Optional phone verification for low-trust sources: WhatsApp OTP ("Confirmá
  tu cotización") — doubles as engagement.

### 3. Score
Start with transparent rules (0–100): completeness, engaged funnel time,
high-value payload signals (new car, family plan), city match, source
quality. Store score components for explainability. ML later, if ever —
volume won't justify it for a long time.

### 4. Route
- Candidate partners = active `PartnerVertical` rows matching vertical +
  filters, under daily/monthly caps.
- Exclusive buyers (highest priority first) get the lead alone; otherwise
  share to up to `maxShared` partners by priority then weighted round-robin.
- No candidates → status `ROUTED_NONE` + Slack/WhatsApp alert to us
  (unsold inventory = money on the floor; also a signal to recruit partners).
- Every routing decision logged with the rule that fired.

### 5. Deliver (per channel, with retries)
- **Webhook:** signed payload (HMAC), 5 retries with exponential backoff,
  dead-letter queue + alert on final failure.
- **Email:** structured lead card via Resend; delivery + open tracked.
- **WhatsApp:** template message to the broker's number — in Paraguay this
  will be the *most used* channel for small brokers.
- **Google Sheets append** as a zero-integration option for tiny partners.
- Consumer simultaneously gets a confirmation (email/WhatsApp): "Tu
  cotización fue enviada a X — te contactarán hoy."

### 6. Outcome & billing
- Partner feedback via portal (phase 2), signed magic-link in the delivery
  email ("aceptar / rechazar / vendido"), or manual entry in admin.
- Rejection reasons feed back into scoring and into Google Ads OCI (doc 04).
- Monthly invoicing report per partner from `LeadDelivery` (billable rows,
  dedup/rejection credits). Manual invoices first; automate later.

## Partner API (phase 2)
`GET /v1/partner/leads`, `POST /v1/partner/leads/:id/outcome` with per-partner
API keys — needed for the bigger insurers' CRMs.

## Admin (phase 1 = Retool on Postgres; phase 2 = `apps/admin`)
Lead browser/search, partner CRUD + routing rules with dry-run simulator
("which partner would this lead go to?"), delivery monitor with manual
redeliver, CPL/outcome dashboards.

## Compliance & data protection
- Explicit consent checkbox (unticked) with versioned text: *"Acepto que mis
  datos sean compartidos con las aseguradoras/corredores seleccionados para
  recibir cotizaciones."* Store timestamp + text version per lead.
- Paraguay: Ley 6534/2020 (personal credit data) and the evolving general
  data-protection framework — get one local legal review of the consent flow
  and the privacy policy before launch (see doc 06). Design to GDPR-like
  standards anyway: data minimization, retention limits (e.g. purge raw IP
  after 90 days), deletion on request, DPAs with partners.
- Secrets never in repo; PII never in logs; DB encrypted at rest; partner
  webhooks HTTPS-only.
