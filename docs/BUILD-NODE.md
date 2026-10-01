# Building the site (Node generator)

The public site is generated from `sites/seguro/` by the dependency-free generator in `engine/` (Node 24).
Output goes to `dist/seguro.com.py/` (git-ignored). Contact form: `engine/php/` (handler) and the form block in `engine/components.mjs`.

```bash
npm run build        # dist/seguro.com.py
npm run verify       # structural + legal-wording gate, must end PASS
npm run test:form    # end-to-end form tests (needs php with curl; set PHP_BIN if not on PATH)
npm run publish      # build + verify + copy the site to the repo root (hPanel Git deploys main)
npm run zip          # alternative: package for upload
```

Redirects live in `redirects.txt` and are generated into `.htaccess`. `config.php` (VenderCRM key, notification address) is
uploaded by hand and is never in the repo; `config.example.php` is the template. Release steps: `RELEASE-CHECKLIST.md`.
Audit trail of the safe rewrite: `audit/`. Legal background: `docs/LEGAL-AUDIT.md`, `docs/DISCLAIMERS.md`, `docs/PARTNER-FORM.md`.
