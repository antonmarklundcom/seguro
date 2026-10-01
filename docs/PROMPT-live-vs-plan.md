# Prompt: compare the live sites with the plan (run in a LOCAL Claude Code session)

Paste everything below the line into a Claude Code session started on your PC
(Opus 5.5, medium). Start it in the folder that holds both site repos, or give
it both paths. It needs internet access to the two live domains. It must not
edit anything: the output is a report only.

---

You are auditing two live sites against their plans. **Read-only: do not edit,
commit, push, deploy, or submit any form.** Write only the report files named
at the end.

## Inputs

1. **Local site repos** (live code and content):
   - seguro.com.py → `C:\Claude 1\seguro-com-py`
   - prestamo.com.py → `<PATH TO PRESTAMO REPO>` (ask me if you cannot find it)
2. **The latest plan** is in GitHub repo `antonmarklundcom/seguro`, branch
   `main`. Clone it read-only into a scratch folder:
   `git clone https://github.com/antonmarklundcom/seguro <scratch>/seguro-plan`
   Read these first: `README.md`, `docs/MASTER_PLAN.md`, `docs/DISCLAIMERS.md`,
   `docs/LEGAL-AUDIT.md`, `docs/ARCHITECTURE.md`, `docs/PARTNER-FORM.md`,
   `docs/BUSINESS.md`, `docs/LAWYER-CHECKLIST.md`. (Since 2026-10-01 the plan is an
   information site with no consumer data; the lead-gen docs are `*-LEADGEN-OLD.md`
   and are not the target.) Also list the open and merged PRs of that repo
   and read their descriptions.
3. **The live sites**: fetch `https://seguro.com.py/sitemap.xml` and
   `https://prestamo.com.py/sitemap.xml`, then every URL in them.

## Tasks

0. **Plan vs live, in one sentence:** the target is an information site (no
   forms except `/contacto` for partners, no WhatsApp link, no prices, no ads).
   Flag every live feature that contradicts that.
1. **Run the copy audit on seguro.com.py:**
   `node <scratch>/seguro-plan/tools/legal-audit.mjs https://seguro.com.py/sitemap.xml > <scratch>/seguro-audit.md`
   Then read every row marked high or medium, and every calculator and price
   table by hand, because the script only matches wording.
2. **Run the same script on prestamo.com.py.** Its rules were written for
   insurance (Ley 827/96), so for loans also check by hand: rate or cost
   claims without the total cost (Ley 1334/98 and Ley 6366/2019: credit ads
   must show the total cost of credit), "aprobación garantizada", urgency,
   credit-data collection (Ley 6534/2020), bank names or logos used as
   endorsement, and whether the site presents itself as a lender or
   intermediary. Mark anything about loan regulation as UNVERIFIED if you
   cannot cite a source you actually opened.
3. **Plan vs. live, per site.** For every page type, feature and rule in the
   plan, say: built / partly built / not built / built differently, and
   whether the live version is consistent with the legal rules in
   `docs/LEGAL-AUDIT.md` §2 and §3. Cover at least: footer disclosure, who we
   are page, privacy and terms pages, forms, WhatsApp links, consent text,
   JSON-LD, prices and calculators, insurer or bank names and logos, schema
   `AggregateRating`, and tracking scripts.
4. **Local repo vs. live.** Say whether the local repo matches what is
   deployed (compare a sample of pages). List anything live that is not in the
   repo, and vice versa.
5. **Fix list.** Write a prioritised list of copy and structure changes,
   each with the exact current text, the file in the local repo that produces
   it, and the safe rewrite. Do not apply any of them.

## Output

Write to `<scratch>/reports/` (not into either repo):
- `seguro-live-vs-plan.md`
- `prestamo-live-vs-plan.md`
- `fix-list.md`

Each finding needs: URL, exact text, risk (high/medium/low), rule or source
(cite only what you opened; otherwise write "unverified, ask the lawyer"),
and the suggested rewrite. Finish with a short summary of the ten most
urgent items and anything you could not check.
