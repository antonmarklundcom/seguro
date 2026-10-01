# Prompt: make the live seguro.com.py as safe as possible for the owner (run LOCALLY)

How to run: open Claude Code **in your local site folder** (`C:\Claude 1\seguro-com-py`),
model Opus 5.5 at medium effort, and paste everything below the line. It needs internet
access (the live site, GitHub). It stops for your approval after the audit.

---

You are working in my LOCAL repo of seguro.com.py (static HTML + PHP from
`php-site-template`; no git remote). **Goal: make the site as legally safe as possible
for me, the owner, while keeping the current pages, URLs and SEO wherever they can be made
safe.** Priority order:

1. Minimise my legal exposure as owner.
2. **No e-mail address anywhere on the site. Contact is a form only.**
3. Keep existing URLs, titles and rankings.
4. Everything else (design, extras) comes last.

If 1 and 3 conflict, 1 wins, but **never leave a URL as a 404**: rewrite the page, or 301 it
to the closest safe page.

## Hard rules

- No deploy. No push. Work on a local branch `safe-rewrite`; commit in small steps.
- Never write a key, endpoint or password into the repo, a doc or the chat. `config.php` is
  uploaded by hand by me; add `config.php`, `storage/`, `*.log`,
  `vendercrm-lead-endpoints*.md` to `.gitignore`.
- Never invent a law, article, date, company name, RUC or address. Unknown = `null` or
  "unverified, ask the lawyer". Search summaries are secondary sources.
- Models: you on Opus (medium). Use Sonnet subagents for bulk page edits and review their
  output yourself. Never use Fable.
- **Stop at the checkpoint after Phase 0 and wait for my "go".**

## Reference repo (read-only)

```
git clone https://github.com/antonmarklundcom/seguro <scratch>/seguro-ref
cd <scratch>/seguro-ref && git checkout claude/dreamy-cray-w0482j   # unless main already has site/build.mjs
```

Read first: `docs/MASTER_PLAN.md`, `docs/DISCLAIMERS.md`, `docs/LEGAL-AUDIT.md`,
`docs/PARTNER-FORM.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOY-HOSTINGER.md`.
Reusable code (written for a different, generated static site: **adapt it to this repo's
template, do not copy the structure blindly**): `contacto-alianzas.php`, `contacto-lib.php`,
`site/form.mjs`, `site/form.js`, form and consent CSS in `site/style.css`, `.htaccess`,
`tools/legal-audit.mjs` (scan), `tools/test-form.mjs` (27 end-to-end form tests).

## What is already known about the live site (from its home page)

Pages: Autos, Salud (prepaga), Aseguradoras (directory with "fichas" per entity), Preguntas
frecuentes, Blog, guides ("Cuánto cuesta un seguro de auto en Paraguay", "Si chocás sin
seguro", "Franquicia o deducible"), `/autos/cotizar/` ("Cómo pedir una cotización"),
`/como-comparamos/`, nosotros, contacto, aviso-legal, privacidad, terminos.
Good already: "no emitimos pólizas, no cotizamos, no intermediamos", "la medicina prepaga no
es un seguro". Weak: the contact e-mail is shown; no top strip; no razón social or RUC;
the directory, the price guide, the quote page and "comparar" wording are unverified;
the home says "no hay formularios" (this will change).

## Safety standard (every page must pass)

- We never sell, quote, bind, recommend or advise. No "el mejor", rankings, scores, stars,
  testimonials or ratings. No insurer logos. No promise, ease, urgency or fear wording
  (fácil, rápido, al instante, garantizado, sin requisitos, "cotizá ya", "y si te pasa algo").
- **No prices or premiums** unless they carry an insurer source and a date (default: remove).
- Legal statements carry a source and a date, or are removed. Specifically: do **not** say a
  SOAT/SOA is mandatory (sources seen: SOAT repealed by Ley 5150/2014, SOA is a stalled bill;
  verify); prepaga is not a seguro and is supervised by the Superintendencia de Salud.
- Every guide: "Actualizada el [fecha]", a Sources list with consulted dates, and the end note
  from `docs/DISCLAIMERS.md`. Top strip and footer text on every page, stored once in the
  site's content data.
- No analytics, ad pixel or third-party script unless it loads after consent. **Default:
  remove all of them**, so no cookie banner is needed.
- JSON-LD only `Organization`, `WebSite`, `Article`, `FAQPage`, `BreadcrumbList`. Remove
  `InsuranceAgency`, `Offer`, price, `Review`, `AggregateRating`.
- Company details (razón social, RUC, domicilio) stay `null` until I confirm them.

## Default decisions to minimise my exposure (I can override at the checkpoint)

- **Directory (`/aseguradoras/` and entity pages):** remove named insurer and broker profiles
  (stale data, trademark, defamation and Res. SS.SG. 102/08 / Ley 827/96 Art. 129 risk).
  Keep the URL as a "Cómo verificar una aseguradora o un corredor" page that links only to
  the official BCP / Superintendencia de Seguros pages. 301 each child URL to it.
- **Price guide:** keep the URL; rewrite as "qué factores influyen en el costo", no figures.
- **`/autos/cotizar/`:** keep the URL; rewrite as "qué datos te piden y qué preguntar al
  pedir una cotización a la aseguradora". No tool, form or calculator.
- **Comparison pages:** criteria only, no ordering or scoring.
- **Salud:** keep; explain prepaga vs seguro; name no provider; no prices.
- **Blog and FAQ:** keep URLs; apply the standard. A post that cannot be fixed is 301'd to
  the nearest guide, never 404'd and never left thin.

## Contact: form only

Remove every e-mail address, `mailto:`, obfuscated address, e-mail in JSON-LD or meta, and the
footer line "Correo de contacto". Replace with: `/contacto/` (chooser) →
`/contacto/busco-un-seguro/` (deflection, no fields) → `/contacto/mensaje/` (form), handled by
`contacto-alianzas.php`, exactly per `docs/PARTNER-FORM.md`: consent box (own bordered box above
the button, unticked, button disabled until ticked, red message, version shown, server checks
it too), honeypot, signed time check, 5 per IP per hour, 1,000-character cap, VenderCRM POST
with the key from `config.php`, notification e-mail to a private address in `config.php`,
consent line with version and America/Asuncion timestamp, always the thank-you page. Types:
corrección, pedido sobre mis datos, aseguradora, corredor, medio, agencia, otro. Update
privacidad, cookies, términos and aviso legal to match (form data, VenderCRM and mail provider,
retention, rights via the form). Port `tools/test-form.mjs`; all checks must pass.

## SEO preservation

Keep each URL, H1 intent, and title/meta wherever they pass the standard. Keep the internal
link structure; fix links to removed sections. Update the sitemap, canonicals and 404.
Write `redirects.txt` and the matching `.htaccess` 301 rules. If a rewrite makes a page too
thin, merge it into a stronger page and 301 it. Produce `audit/seo-before-after.md` (URL,
action keep/rewrite/redirect, title before/after, indexable yes/no, note).

## Phases

**P0, read-only audit.** Fetch `https://seguro.com.py/sitemap.xml` and every URL. Run
`<scratch>/seguro-ref/tools/legal-audit.mjs` on the sitemap, then read by hand: calculators,
tables, images and logos, JSON-LD, scripts, cookies and analytics, forms, mailto, external
links (record their HTTP status), comments or hidden text. Compare the local repo with the
deployed pages and list differences. Write `audit/live-audit.md` (URL, exact text, risk
high/medium/low, safe rewrite) and `audit/page-plan.md` (keep / rewrite / redirect /
remove-section per URL). **STOP.** Show me: counts by risk, the 10 worst items, the
page-plan summary, and a short list of decisions for me (directory, prepaga page, FAQ/blog
items, razón social, consent holder name).

**P1, safety layer.** Top strip, footer, privacy, cookies, terms, aviso legal, quiénes somos;
remove trackers and all e-mails; install the form, handler, `.htaccess` and tests.

**P2, page rewrites** in batches (Sonnet subagents). After each batch run the scan and fix
until 0 high and 0 medium. Commit per batch.

**P3, SEO.** Redirects, sitemap, canonicals, schema cleanup, internal-link check, 404.

**P4, verification.** Scan 0 high / 0 medium; form tests pass; no `@` addresses, `mailto`,
`₲`, "mejor" or banned words left (grep); external links all return 200 or are removed; mobile
screenshots of 5 pages; `config.php` and `storage/` ignored and unreachable. Write
`RELEASE-CHECKLIST.md` for deploying through hPanel → Advanced → Git, including a test
subdomain first and what to check after.

**Final report:** what changed; the three biggest residual risks (the open questions in
`docs/LAWYER-CHECKLIST.md` A1 to A3 stay open); questions only I can answer. Do not deploy.
