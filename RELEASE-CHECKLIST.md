# Release checklist: safe-rewrite → seguro.com.py

Nothing here has been done. The branch `safe-rewrite` is local only: no push, no deploy.
Work through it top to bottom. Do the test subdomain first; only then the real domain.

## 0. Things only the owner can supply (the site works without them, with the stated fallback)

| Item | Where | Fallback if left empty |
|---|---|---|
| Titular name (set: Anton Marklund) / razón social | `operator.holderName` / `operator.legalName` in `sites/seguro/site.config.mjs` | Change the name there if a company is formed; rebuild |
| RUC, domicilio | `operator.ruc`, `operator.address` | Stay `null`. **Never rendered** (owner decision 2026-10-01) |
| Private notification address | `notify_email` in `config.php` (server only) | Form shows "no está disponible" |
| Sender address on the domain | `from_email` in `config.php` | Same |
| VenderCRM endpoint + key for the `seguro` site | `config.php` (server only) | Same |

Never paste the key, endpoint or password into the repo, a commit, a doc or a chat.

## 1. Build and check locally

```bash
npm run build
npm run verify          # must end "0 failure(s). PASS"
PHP_BIN=/c/php/php.exe node tools/test-form.mjs   # 30 checks, must end ALL PASSED (needs php + curl ext)
```

`verify` fails the build on: any e-mail address, `mailto:`, ₲/Gs./US$ figure, banned wording, a `<form>` outside
`/contacto/mensaje/`, cookie banner or third-party script, JSON-LD types outside
Organization/WebSite/BreadcrumbList/FAQPage/Article, a redirect whose target does not exist, a missing top strip or footer notice.

Optional second opinion: serve the build (`npm run serve`) and run
`node <seguro-ref>/tools/legal-audit.mjs http://localhost:8080/sitemap.xml` (expect 0 high; the one medium is the word
"cotizar" inside the kept URL `/autos/cotizar/`).

## 2. Package (two ways; pick one)

**A. Zip upload (the way this project has always been deployed).**
`npm run zip` → `dist/seguro-com-py-<date>.zip` (flat; contains the 3 PHP files, never `config.php`/`storage/`).
Unzip into the domain's `public_html`.

**B. hPanel → Advanced → Git, branch `main` (default).** `main` carries the built site at its root, next to the
source. The generated `.htaccess` returns 404 for `engine/`, `sites/`, `deploy/`, `docs/`, `tools/`, `audit/`, `*.md`, `*.mjs`,
`package.json`, `redirects.txt`, `config.example.php` and `.git`: check that after the first deploy (section 4).

To release a change: `npm run publish` (build + verify + copy the site to the repo root), commit, merge to `main`, press Deploy.
In hPanel: repository `https://github.com/antonmarklundcom/seguro.git`, branch `main`, install directory = the site folder.

## 3. Test subdomain first (e.g. a Hostinger subdomain or temporary domain)

1. Deploy there (A or B).
2. Upload `config.php` by hand (File Manager), built from `config.example.php`, **one level above** the web root if the
   hosting allows it, otherwise next to `contacto-alianzas.php`. The code looks in both places.
3. The test-site canonical URLs still say `https://seguro.com.py/...` (the build is for the real domain): that is expected.
4. Run the checks in section 4 against the test host.

## 4. What to check after each deploy

```bash
H=https://TEST-OR-REAL-HOST
for p in /config.php /config.example.php /contacto-lib.php /storage/ /docs/ /engine/package.json /sites/seguro/site.config.mjs /package.json /audit/live-audit.md /tools/test-form.mjs /RELEASE-CHECKLIST.md /redirects.txt /.git/config; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' $H$p)"; done            # all 404
curl -sI $H/aseguradoras/tajy/ | head -3                                          # 301 → /aseguradoras/
curl -sI $H/calculadoras/deducible/ | head -3                                     # 301 → franquicia guide
curl -s $H/ $H/contacto/ $H/privacidad/ | grep -c '@'                             # expect only JSON-LD "@context"-style keys, no address
curl -s $H/sitemap.xml | grep -c '<loc>'                                          # 41
curl -s $H/contacto/mensaje/ | grep -c 'noindex'                                  # 1
curl -sI $H/contacto-alianzas.php | head -1                                       # 405 (POST only)
```

Then by hand, from a phone:

- [ ] The top strip and footer notice show on the home page, a guide, a blog post and the 404 page.
- [ ] `/contacto/` → both cards work; `/contacto/busco-un-seguro/` has no fields.
- [ ] `/contacto/mensaje/`: the button is disabled until the consent box is ticked; submitting without it (JS off) shows the red message.
- [ ] Send one message of **each** type. Each must (a) create one VenderCRM contact (filter source `alianzas-web`), with the consent line "Consentimiento v1.0 aceptado el … (America/Asuncion)", and (b) arrive in the private inbox. Check spam: PHP `mail()` on shared hosting can be filtered; if so use an SMTP mailbox on the domain.
- [ ] Re-send with the same phone: the contact is updated, not duplicated.
- [ ] Open every external link (3 URLs): `superintendenciadesalud.gov.py` (apex, valid certificate; the `www.` form has a certificate error), and the two `bcp.gov.py/web/institucional/...` pages. The BCP site answers 403 to scripts but opened fine in a normal browser on 2026-10-01; confirm once more.
- [ ] View source on 3 pages: no analytics, no third-party script, no `mailto:`.
- [ ] `/config.php` and `/storage/` return 404 (command block above).
- [ ] After the first Git deploy, confirm `config.php` is still on the server (Git deploys normally leave untracked files alone; check once).

## 5. Real domain

1. Take a copy of the current live files (File Manager download) so you can roll back.
2. Deploy; repeat section 4 on `https://seguro.com.py`.
3. Search Console: resubmit `sitemap.xml`; use URL inspection on `/`, `/aseguradoras/`, `/autos/cotizar/`; watch the Coverage / Pages report for "Page with redirect" (expected: 15) and any "Not found".
4. Keep `redirects.txt` forever; it is the SEO safety net.

## 6. Roll back

Restore the downloaded copy of the old files. The old site had the e-mail address and the directory pages, so rolling back
re-introduces those risks: prefer fixing forward.

## Open items that block nothing technical but matter legally (see the final report)

- Whether a form-only contact satisfies the identification duties in Ley 4868 (summary sources said an e-mail address may be required; unverified).
- Retention period (24 months, proposed), international transfer to VenderCRM / mail provider, and the consent text v1.0: ask the lawyer.
- Company identification (razón social, RUC, domicilio) when the company exists.
- `docs/LAWYER-CHECKLIST.md` A1 to A3 stay open.
