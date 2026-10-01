# Deploying the safe static site (Hostinger → Advanced → Git)

The repo root **is** the website. `node site/build.mjs` regenerates the HTML
from `site/site.json` and `site/content.mjs`; the generated files are committed,
so Hostinger needs no build step, no PHP and no Node. The site has no forms, no
scripts, no images, no cookies and no third-party requests.

`.htaccess` returns 404 for `docs/`, `site/`, `tools/`, `.git`, `*.md`,
`*.mjs`, `*.json`, `*.log`, `*.sh` and `*.php`, so repo internals are not served.
Check this after the first deploy (step 5).

## Before you deploy: things only you can confirm

1. **Mailboxes exist** and are read: `contacto@seguro.com.py` and
   `datos@seguro.com.py` (shown on the site). If you want other addresses, edit
   `site/site.json`, run the build and commit.
2. **The statement "hoy no recibimos dinero de aseguradoras, corredores ni
   anunciantes y no tenemos relación comercial con ninguno"** (Quiénes somos,
   Metodología) is true today. If you sign a broker, change it first.
3. **Company details.** `site/site.json` → `company` is `null`. The footer and
   Quiénes somos show a contact e-mail only. When the EAS or titular is
   confirmed, fill `razonSocial`, `ruc`, `domicilio` (all three), rebuild.
   Ley 4868 identification wording and scope are unverified (LEGAL-AUDIT R-4868).
4. **External links not opened.** The cloud session could not open
   bcp.gov.py or the news links. Click every link in the six guides once. If one
   is dead, fix it in `site/content.mjs` and rebuild.
5. **Old live pages disappear.** This replaces the current 55-page site. Any old
   URL that is not in the new sitemap will show the 404 page and lose its
   Google ranking. If old pages rank, add `Redirect 301 /old/ /guias/…` lines in
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
```

Aim for 0 high and 0 medium findings. The two "compare" lows are fine.

## What this site deliberately does not have

Forms, WhatsApp links, analytics, cookies, images, prices, insurer names,
rankings, calculators, SOA / SOAT / prepaga claims beyond one sourced sentence on
prepaga, ads. Adding any of them is a legal decision: see
`docs/MASTER_PLAN.md` §7 and `docs/LAWYER-CHECKLIST.md`.

## Still not lawyer-reviewed

The privacy policy, cookie policy and terms are drafts written from the research
in `docs/LEGAL-AUDIT.md`. The risk that Res. SS.SG. 102/08 or Ley 827/96 Art. 129
reaches even a neutral information site is **not closed** (checklist A1-A3).
