# Deploying the safe site (Hostinger → Advanced → Git)

The repo root **is** the website. `node site/build.mjs` regenerates the HTML from
`site/site.json`, `site/content.mjs` and `site/form.mjs`; the generated files are
committed, so Hostinger needs no build step and no Node. The site has no
scripts except a 25-line form helper, no images, no cookies, no analytics, no
third-party requests and **no e-mail address shown anywhere**.

The only dynamic parts are two PHP files for the contact form
(`contacto/mensaje/index.php` and `contacto-alianzas.php`, plus the helper
`contacto-lib.php`). Everything else is static HTML.

`.htaccess` returns 404 for `docs/`, `site/`, `tools/`, `.git`, `storage/`,
`*.md`, `*.mjs`, `*.json`, `*.log`, `*.sh` and for every `.php` file except the
two form files. Check this after the first deploy (step 5).

## The contact form (the only form)

It replaces the e-mail address. Spec and test plan: `docs/PARTNER-FORM.md`.
Visitors who are looking for a seguro are sent to a page with no fields; the form
is for corrections, data requests (access, correction, deletion) and
aseguradoras, corredores, medios and agencias. It needs the consent box ticked,
checks it again on the server, and stores nothing on the site itself: it sends the
message to VenderCRM and e-mails it to **your private address in `config.php`**.

### `config.php` (you upload it by hand; it is never in the repo)

1. Create a file `config.php` on your PC with this content, filling in the values
   **from your private VenderCRM endpoint file** (never paste the key in chat, a
   commit or a doc):
   ```php
   <?php
   return [
     'vcrm_endpoint' => 'PASTE_ENDPOINT_URL_HERE',
     'vcrm_api_key'  => 'PASTE_THE_SEGURO_KEY_HERE',
     'notify_email'  => 'YOUR_PRIVATE_ADDRESS',   // where messages arrive; never shown on the site
     'from_email'    => 'no-reply@seguro.com.py', // must be an address on your domain, for deliverability
   ];
   ```
2. Upload it with the Hostinger **File Manager**, **one level above** `public_html`
   (the domain folder) if possible; otherwise next to `contacto-alianzas.php`. The
   form code looks in both places.
3. After the first Git deploy, check that `config.php` is still there (Git deploys
   normally leave untracked files alone; confirm once) and that
   `https://seguro.com.py/config.php` returns **404**.
4. Without `config.php` the form page shows "El formulario no está disponible" and
   no fields; nothing breaks.
5. In VenderCRM, make sure the site `seguro` is active and filter its contacts by
   the source `alianzas-web`.

Test it before announcing: send one message of each type from your phone and check
that it reaches VenderCRM **and** your inbox (PHP `mail()` can land in spam on
shared hosting; if so, ask Hostinger about SMTP or use a mailbox on the domain).

## Before you deploy: things only you can confirm

1. **Consent text names "el titular de seguro.com.py".** The law wants the
   controller identified. When the company or your legal name is confirmed, fill
   `company.razonSocial` (and `ruc`, `domicilio`) in `site/site.json`, run the
   build and commit. Until then the text uses the generic wording. Lawyer
   question: C1 in `LAWYER-CHECKLIST.md`.
2. **The statement "hoy no recibimos dinero de aseguradoras, corredores ni
   anunciantes y no tenemos relación comercial con ninguno"** (Quiénes somos,
   Metodología) is true today. If you sign a broker, change it first.
3. **Company details.** `site/site.json` → `company` is `null`; the footer and
   Quiénes somos show no identification block. Ley 4868 asks providers to publish
   their identification, **including an e-mail address** according to the
   summaries we saw; whether a form satisfies that is unverified (article number
   and scope too). Ask the lawyer (D1), or add an address once the company exists.
4. **External links not opened.** The cloud session could not open bcp.gov.py or
   the news links. Click every link in the six guides once. If one is dead, fix it
   in `site/content.mjs` and rebuild.
5. **Old live pages disappear.** This replaces the current 55-page site. Any old URL
   that is not in the new sitemap will show the 404 page and lose its Google
   ranking. If old pages rank, add `Redirect 301 /old/ /guias/…` lines in
   `.htaccess` (there is a marked spot) before switching, or deploy to a
   subdomain first.

## Deploy

1. Merge this branch into `main` (or point Hostinger at this branch).
2. hPanel → **Advanced → Git**: repository `antonmarklundcom/seguro`, the branch,
   and the install directory. **Try a test subdomain first.** Hostinger may refuse
   to clone into a folder that already has files (the current site): in that case
   back up the folder, empty it, then deploy (I could not verify this behaviour
   from here).
3. Enable auto-deploy (webhook) only after the first manual deploy looks right.
4. Open the site over HTTPS. If the browser shows a redirect loop, delete the
   "HTTPS only" block (three lines) in `.htaccess` and rely on Hostinger's SSL
   setting.
5. Check that these return **404**, not content: `/docs/LEGAL-AUDIT.md`,
   `/site/build.mjs`, `/site/site.json`, `/README.md`, `/.git/config`.
6. Check `/sitemap.xml` and `/robots.txt`, then submit the sitemap in Google
   Search Console (verify the property with a DNS record: no tag is needed on the
   site).

## Rebuild after editing content

```
node site/build.mjs        # fails on banned words, missing sources, broken links
python3 -m http.server 8766 &   # then, in another terminal:
node tools/legal-audit.mjs http://127.0.0.1:8766/sitemap.xml
node tools/test-form.mjs   # form end-to-end test (needs php); uses a temporary config.php
```

Aim for 0 high and 0 medium findings. The two "compare" lows are fine.

## What this site deliberately does not have

Consumer forms, e-mail addresses, WhatsApp links, analytics, cookies, images, prices, insurer names,
rankings, calculators, SOA / SOAT / prepaga claims beyond one sourced sentence on
prepaga, ads. Adding any of them is a legal decision: see
`docs/MASTER_PLAN.md` §7 and `docs/LAWYER-CHECKLIST.md`.

## Still not lawyer-reviewed

The privacy policy, cookie policy and terms are drafts written from the research
in `docs/LEGAL-AUDIT.md`. The risk that Res. SS.SG. 102/08 or Ley 827/96 Art. 129
reaches even a neutral information site is **not closed** (checklist A1-A3).
