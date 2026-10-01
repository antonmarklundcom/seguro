# seguro.com.py — Architecture (information site + partner contact form)

Active from 2026-10-01. The earlier lead-gen architecture is saved in
`docs/ARCHITECTURE-LEADGEN-OLD.md`. Plan: `docs/MASTER_PLAN.md`.

## What this system is

An **information site** about insurance in Paraguay, built for SEO and organic
traffic. It publishes guides, a "qué cubre / qué no cubre" explainer, a
glossary and an informational directory of registered insurers and brokers.
It never sells, quotes, binds or recommends a policy, never sends leads to
insurers, runs no ads, and **collects no personal data from consumers**. The
only form is a **partner contact form** for insurers, brokers, media and
agencies.

## Stack

- Static HTML + PHP from `antonmarklundcom/php-site-template`, on Hostinger
  shared hosting (PHP 8.2).
- Deploy: hPanel → Advanced → Git (pulls this repo into the site folder).
  Nothing is deployed from this planning phase.
- No database, no logins, no admin, no Node runtime.
- Content as data in `content/*.php`; shared templates and partials; the
  Paraguay market module for `fmt_money()`, dates and tables.
- Client-side JS only for small UI behaviour (cookie banner, consent button
  state, the form's "Soy…" switch).
- One server script: `contacto-alianzas.php` (spec in `docs/PARTNER-FORM.md`).

## Data the site handles

| Data | Where | Notes |
|---|---|---|
| Page views and search queries | Search Console; analytics only after cookie consent | We store no personal identifiers |
| Partner contact (name, org, phone, e-mail, message) | VenderCRM, plus a notification e-mail | Business contacts only; consent line on the form; deletion on request |
| Rate-limit counters | `storage/` (hashed IP, 1 hour) | Not committed |
| Consumer personal data | **Not collected** | The form deflects consumers before any field is shown |
| Health data | **Never collected** | Sensitive under Ley 7593/2025 (see LEGAL-AUDIT) |

## Secrets and config

- `config.php` holds the VenderCRM endpoint, the site key and the notification
  address. It is **uploaded by hand** through the Hostinger File Manager and
  never committed (`.gitignore` blocks `config.php`, `storage/`, `*.log` and
  `vendercrm-lead-endpoints*.md`).
- It sits one level above the web root if the hosting allows it; otherwise next
  to the handler with an `.htaccess` deny rule.
- Only the PHP handler reads it. The key never appears in HTML, JS, the repo,
  docs or chat.
- The VenderCRM endpoint file lists keys for many sites. Keep it private. Only
  the `seguro` key is needed here.

## Content model (`content/*.php`)

| Record | Holds |
|---|---|
| `site.php` | name, tagline, **all disclaimer texts** (DISCLAIMERS.md), company details (`null` until confirmed), contact e-mails, nav |
| `guide.php` records | slug, title, answer, body blocks, `updated` date, `sources[]` (name, URL, date consulted), `reviewed_by` (nullable) |
| `entity.php` records (if the directory is built) | name, type, official URL, `verified_on`, `register`, notes. No logos, no prices |
| `glossary.php` | term, plain definition, related guides |
| `consent/v1.0.txt` | exact consent text; old versions stay |

`verify.sh` should fail the build when: a guide has no `updated` or `sources`;
a record contains a banned word (DISCLAIMERS §11); a disclaimer key is empty;
company details render as blank; a page outside `/contacto` contains a `<form>`.

## Page types (full tree in MASTER_PLAN §3)

Home, guides, glossary, explainer ("qué cubre"), informational directory (if
kept), trust pages (quiénes somos, metodología, privacidad, cookies,
términos), `/contacto` with the partner form, `/gracias-contacto`.

## Partner form flow

```
visitor → /contacto → picks "Soy…"
   ├─ "Persona que busca un seguro" → message + links to guides; NO form shown
   └─ aseguradora / corredor / medio / agencia / otro → short form
        (honeypot, time check, consent box)
        → POST /contacto-alianzas.php (server)
             1. reject: no consent, bad type, honeypot, < 3 s, > 5 per IP/hour
             2. validate, normalise phone to +595…
             3. POST to VenderCRM /api/v1/leads (10 s timeout, key from config.php)
             4. e-mail notification to the owner (also the fallback)
             5. never block the visitor → redirect /gracias-contacto
```

## Security

- TLS everywhere; PHP error display off; errors logged outside the web root.
- Honeypot, minimum-time check, per-IP rate limit, message cap, header-injection-safe
  e-mail, `.htaccess` deny for `config.php`, `storage/`, `*.log`.
- No sensitive consumer or health fields exist, so there is nothing sensitive
  to leak.
- Analytics and any other tag load only after cookie consent, with "Aceptar"
  and "Rechazar" equal in prominence.

## Not built (deferred; see MASTER_PLAN §10)

Consumer lead form, persist-first lead log, `/baja-de-datos` flow, delivery to
insurers or brokers, WhatsApp flow, ads, broker partnerships, price comparator
or cotizador.
