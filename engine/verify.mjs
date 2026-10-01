#!/usr/bin/env node
/* engine/verify.mjs — independent artefact, copy and route gate.
   Usage: node engine/verify.mjs --site=seguro

   Reads only what was actually written to dist/<domain>/. Failures accumulate
   and the process exits nonzero. Warnings are printed and do not fail: the
   operator email gap is deliberately a warning so Anton can build before
   filling it in (go-live posture decided by the manager). */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { validateConfig, operatorGaps } from './config.mjs';
import { REQUIRED_BY_KIND, DISCLAIMERS } from './disclaimers.mjs';

const ENGINE_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(ENGINE_DIR, '..');

const BANNED_COPY = [
  'cotiza con nosotros',
  'te prestamos',
  'aprobamos',
  'aprobacion inmediata',
  'sin requisitos',
  'las mejores tasas',
  'todas las aseguradoras',
  'ranking definitivo',
  'precios mas bajos',
  'garantizado',
  'el mejor', 'la mejor', 'los mejores', 'las mejores', 'mejor precio', 'mas barato', 'mas barata',
  'facil', 'facilisimo', 'rapido', 'rapida', 'al instante', 'cotiza ya', 'te cotizamos',
  'contrata ya', 'contrata ahora', 'te aseguramos', 'nuestras polizas', 'recomendamos',
  'y si te pasa algo', 'no te quedes sin', 'ultimos dias', 'solo por hoy'
];

/* Banned phrases are matched on whole words. A plain substring test produced a
   false positive on prestamo.com.py, where "independiente prestamos" (two
   unrelated words in the header) contained the banned string "te prestamos". */
const BANNED_RE = new Map(BANNED_COPY.map((phrase) => [
  phrase,
  new RegExp(`(?<![a-z0-9])${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`)
]));

/* Owner rules (2026-10-01): no e-mail address, no mailto, no guaraní or price figure anywhere in
   the output; <form> exists only on the contact form page. */
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9.-]+/;
const PRICE_RE = /₲|\bgs\.\s?\d|\bpyg\b|us\$/i;
const FORM_PAGE = 'contacto/mensaje/index.php';
const ALLOWED_PHP = new Set(['contacto-alianzas.php', 'contacto-lib.php', FORM_PAGE]);
const ALLOWED_LD = new Set(['Organization', 'WebSite', 'BreadcrumbList', 'FAQPage', 'Article']);

const fails = [];
const warns = [];
const fail = (where, message) => fails.push(`${where}: ${message}`);
const warn = (where, message) => warns.push(`${where}: ${message}`);

function arg(name) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

function walk(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' };

/** Rendered text of a document, normalized for substring checks. */
function normalizedText(html) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  // Keep attribute values that carry copy: alt, title, aria-label, content.
  const attrCopy = [...withoutScripts.matchAll(/(?:alt|title|aria-label|content)="([^"]*)"/gi)]
    .map((m) => m[1]).join(' ');
  const text = `${withoutScripts.replace(/<[^>]+>/g, ' ')} ${attrCopy}`;
  return text
    .replace(/&(#?\w+);/g, (m, e) => (ENTITIES[e] !== undefined ? ENTITIES[e] : ' '))
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function attrOf(html, re) {
  const m = re.exec(html);
  return m ? m[1] : null;
}

async function main() {
  const siteId = arg('site');
  if (!siteId) { console.error('Usage: node engine/verify.mjs --site=<site-id>'); process.exit(2); }

  const siteDir = path.join(REPO_ROOT, 'sites', siteId);
  const mod = await import(pathToFileURL(path.join(siteDir, 'site.config.mjs')).href);
  const { config } = validateConfig(mod.default, siteId);
  const root = path.join(REPO_ROOT, 'dist', config.build.outputDomain);

  if (!fs.existsSync(root)) {
    console.error(`dist/${config.build.outputDomain} does not exist. Run the build first.`);
    process.exit(1);
  }

  const pageRecords = (await import(pathToFileURL(path.join(siteDir, 'content', 'pages.mjs')).href)).default;
  const recordBySlug = new Map(pageRecords.map((r) => [r.slug.endsWith('/') || r.slug === '/404.html' ? r.slug : `${r.slug}/`, r]));

  const files = walk(root);
  const htmlFiles = files.filter((f) => f.endsWith('.html') || f === FORM_PAGE);
  const existing = new Set(files.map((f) => `/${f}`));

  /* Every required non-HTML artefact. */
  for (const required of ['sitemap.xml', 'robots.txt', 'rss.xml', '.htaccess', 'favicon.svg',
    'assets/css/site.css', 'assets/css/tokens.css', 'assets/js/site.js', 'assets/js/form.js', 'assets/fonts/fonts.css',
    'contacto-alianzas.php', 'contacto-lib.php', FORM_PAGE]) {
    if (!files.includes(required)) fail('dist', `missing required artefact ${required}`);
  }
  for (const forbidden of files) {
    if (forbidden.endsWith('.php') && !ALLOWED_PHP.has(forbidden)) fail('dist', `PHP file must not be published: ${forbidden}`);
    if (/(^|\/)(config(\.example)?\.php|storage\/)/.test(forbidden)) fail('dist', `private file must not be published: ${forbidden}`);
    if (forbidden.endsWith('.log')) fail('dist', `log file must not be published: ${forbidden}`);
  }

  const titles = new Map();
  const descriptions = new Map();
  const canonicals = new Map();
  const linkTargets = new Map();

  for (const file of htmlFiles) {
    const where = `/${file}`;
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const route = file === '404.html' ? '/404.html' : `/${file.replace(/index\.(html|php)$/, '')}`;

    /* -- identity ---------------------------------------------------- */
    const title = attrOf(html, /<title>([\s\S]*?)<\/title>/);
    if (!title || !title.trim()) fail(where, 'missing <title>');
    else {
      if (titles.has(title)) fail(where, `duplicate title, also on ${titles.get(title)}`);
      titles.set(title, where);
      if (title.length > 70) warn(where, `title is ${title.length} characters (target 45-60)`);
    }

    const description = attrOf(html, /<meta name="description" content="([^"]*)"/);
    if (!description || !description.trim()) fail(where, 'missing meta description');
    else {
      if (descriptions.has(description)) fail(where, `duplicate description, also on ${descriptions.get(description)}`);
      descriptions.set(description, where);
      if (description.length < 100 || description.length > 200) {
        warn(where, `description is ${description.length} characters (target 140-160)`);
      }
    }

    const canonical = attrOf(html, /<link rel="canonical" href="([^"]*)"/);
    const expected = `${config.origin}${route}`;
    if (!canonical) fail(where, 'missing canonical');
    else {
      if (canonical !== expected) fail(where, `canonical is ${canonical}, expected ${expected}`);
      if (canonicals.has(canonical)) fail(where, `duplicate canonical, also on ${canonicals.get(canonical)}`);
      canonicals.set(canonical, where);
    }

    const h1s = [...html.matchAll(/<h1[^>]*>/gi)];
    if (h1s.length !== 1) fail(where, `expected exactly one <h1>, found ${h1s.length}`);

    if (!/<html lang="es-PY"/.test(html)) fail(where, 'html lang must be es-PY');

    /* -- Open Graph --------------------------------------------------- */
    for (const property of ['og:title', 'og:description', 'og:url', 'og:type', 'og:locale', 'og:site_name']) {
      if (!new RegExp(`<meta property="${property}" content="[^"]+"`).test(html)) {
        fail(where, `missing ${property}`);
      }
    }
    const ogUrl = attrOf(html, /<meta property="og:url" content="([^"]*)"/);
    if (ogUrl && ogUrl !== expected) fail(where, `og:url ${ogUrl} does not match canonical`);

    /* -- JSON-LD ------------------------------------------------------ */
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (blocks.length === 0) fail(where, 'no JSON-LD block');
    for (const [, raw] of blocks) {
      if (raw.includes('</script')) fail(where, 'JSON-LD is not safely serialized');
      let parsed;
      try { parsed = JSON.parse(raw); } catch (e) { fail(where, `JSON-LD does not parse: ${e.message}`); continue; }
      const nodes = parsed['@graph'] || [parsed];
      const types = nodes.map((n) => n['@type']);
      for (const banned of ['InsuranceAgency', 'BankOrCreditUnion', 'FinancialService', 'Offer', 'AggregateRating', 'Review']) {
        if (JSON.stringify(parsed).includes(`"${banned}"`)) fail(where, `JSON-LD must never contain ${banned}`);
      }
      if (!types.includes('Organization')) fail(where, 'JSON-LD is missing the publisher Organization');
      for (const t of types) {
        if (!ALLOWED_LD.has(t)) fail(where, `JSON-LD type not allowed: ${t}`);
      }
    }

    /* -- noindex on utility routes ------------------------------------ */
    const robots = attrOf(html, /<meta name="robots" content="([^"]*)"/);
    const record = recordBySlug.get(route);
    if (record && record.indexable === false && !/noindex/.test(robots || '')) {
      fail(where, 'record is not indexable but the page is not noindex');
    }
    if (route === '/404.html' && !/noindex/.test(robots || '')) fail(where, '/404.html must be noindex');

    /* -- disclaimers --------------------------------------------------- */
    const present = new Set([...html.matchAll(/data-disclaimer="([^"]+)"/g)].map((m) => m[1]));
    let kind = record?.kind;
    if (!kind) {
      if (route === '/blog/' || /^\/blog\/[a-z0-9-]+\/$/.test(route)) kind = 'blogIndex';
      else if (/^\/blog\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(route)) kind = 'blogPost';
    }
    if (kind) {
      for (const id of REQUIRED_BY_KIND[kind] || []) {
        if (!present.has(id)) fail(where, `page kind "${kind}" requires disclaimer ${id}`);
      }
    }
    for (const id of present) {
      if (!DISCLAIMERS[id]) fail(where, `unknown disclaimer ID rendered: ${id}`);
    }

    /* -- operator identity block --------------------------------------- */
    if (!html.includes('data-operator-block')) fail(where, 'missing the operator identity block in the footer');
    if (!html.includes(config.notices.topStrip)) fail(where, 'missing the top strip');
    if (!html.includes(config.notices.footer)) fail(where, 'missing the footer notice');
    if (/cookiebar|data-cookie|googletagmanager|gtag\(|ANALYTICS_ID/.test(html)) fail(where, 'cookie banner or analytics markup present');
    if (/<script[^>]+src="https?:/i.test(html)) fail(where, 'third-party script present');

    /* -- forbidden lead-capture markup ---------------------------------- */
    const lower = html.toLowerCase();
    if (file !== FORM_PAGE && lower.includes('<form')) fail(where, 'a <form> element outside the contact form page');
    if (lower.includes('mailto:')) fail(where, 'mailto: link');
    if (EMAIL_RE.test(html)) fail(where, `e-mail address in output: ${html.match(EMAIL_RE)[0]}`);
    if (PRICE_RE.test(html)) fail(where, 'price or guaraní figure in output');
    if (lower.includes('vendercrm') && route !== '/privacidad/' && route !== '/contacto/mensaje/') fail(where, 'VenderCRM mentioned outside privacy and the form');

    /* -- banned copy ----------------------------------------------------- */
    const text = normalizedText(html);
    for (const phrase of BANNED_COPY) {
      if (BANNED_RE.get(phrase).test(text)) fail(where, `banned copy string found: "${phrase}"`);
    }

    /* -- placeholders that must never ship -------------------------------- */
    if (text.includes('lorem ipsum')) fail(where, 'lorem ipsum in published copy');
    if (/\[(dominio|nombre del operador|entidad seleccionada|xxxxxxx)\]/i.test(html)) {
      fail(where, 'an unresolved bracketed placeholder reached the output');
    }

    /* -- internal links -------------------------------------------------- */
    for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const target = m[1];
      if (!linkTargets.has(target)) linkTargets.set(target, new Set());
      linkTargets.get(target).add(where);
    }
  }

  /* -- broken internal links ------------------------------------------- */
  for (const [target, sources] of linkTargets) {
    if (target === '/') continue;
    const candidates = [target, `${target}index.html`, target.replace(/\/$/, '')];
    if (candidates.some((c) => existing.has(c) || existing.has(`${c}/index.html`) || existing.has(`${c}/index.php`))) continue;
    fail([...sources][0], `broken internal link ${target}${sources.size > 1 ? ` (and ${sources.size - 1} more pages)` : ''}`);
  }

  /* -- sitemap ---------------------------------------------------------- */
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (new Set(locs).size !== locs.length) fail('sitemap.xml', 'contains duplicate URLs');
  for (const loc of locs) {
    if (!loc.startsWith(`${config.origin}/`)) fail('sitemap.xml', `URL is not on the canonical origin: ${loc}`);
    const route = loc.slice(config.origin.length);
    if (!existing.has(`${route}index.html`) && !existing.has(route)) fail('sitemap.xml', `URL has no output file: ${loc}`);
  }
  if (locs.some((l) => l.endsWith('/404.html'))) fail('sitemap.xml', '/404.html must not be listed');
  if (!/Sitemap: https:\/\//.test(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8'))) {
    fail('robots.txt', 'missing an absolute Sitemap line');
  }
  if (/Disallow: \/\s*$/m.test(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8'))) {
    fail('robots.txt', 'a staging-style blanket Disallow reached production');
  }

  /* -- feed ------------------------------------------------------------- */
  const rss = fs.readFileSync(path.join(root, 'rss.xml'), 'utf8');
  for (const link of [...rss.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1])) {
    if (!link.startsWith('https://')) fail('rss.xml', `feed link is not absolute: ${link}`);
  }

  /* -- htaccess --------------------------------------------------------- */
  const htaccess = fs.readFileSync(path.join(root, '.htaccess'), 'utf8');
  if (htaccess.includes('tasacion')) fail('.htaccess', 'a tasacion.com.py rule survived the adaptation');
  if (!htaccess.includes('ErrorDocument 404 /404.html')) fail('.htaccess', 'missing the real 404 document');
  if (!htaccess.includes(config.domain)) fail('.htaccess', 'does not reference the canonical domain');

  /* -- contact form page -------------------------------------------------- */
  const formHtml = fs.readFileSync(path.join(root, FORM_PAGE), 'utf8');
  if (!/name="consent" value="v1\.0" required/.test(formHtml)) fail(FORM_PAGE, 'consent checkbox must be required and carry the version');
  if (/name="consent"[^>]*checked/.test(formHtml)) fail(FORM_PAGE, 'consent checkbox must be unticked');
  if (!formHtml.includes('class="consent-box"')) fail(FORM_PAGE, 'consent box missing');
  if (!/noindex/.test(formHtml)) fail(FORM_PAGE, 'form page must be noindex');
  if (formHtml.includes('value="persona"')) fail(FORM_PAGE, 'no consumer option may exist in the form');

  /* -- redirects (redirects.txt) ----------------------------------------- */
  const redirectsFile = path.join(REPO_ROOT, 'redirects.txt');
  if (fs.existsSync(redirectsFile)) {
    const { parseRedirects } = await import(pathToFileURL(path.join(ENGINE_DIR, 'hosting', 'htaccess.mjs')).href);
    const rows = parseRedirects(fs.readFileSync(redirectsFile, 'utf8'));
    const sources = new Set(rows.map((r) => r.from));
    if (sources.size !== rows.length) fail('redirects.txt', 'duplicate source');
    for (const { from, to } of rows) {
      if (existing.has(`${from}index.html`)) fail('redirects.txt', `source is still a live page: ${from}`);
      if (!existing.has(`${to}index.html`) && !existing.has(`${to}index.php`)) fail('redirects.txt', `target does not exist: ${to}`);
      if (sources.has(to)) fail('redirects.txt', `redirect chain: ${to} is also a source`);
      if (!htaccess.includes(` ${to}`)) fail('.htaccess', `rule missing for ${from}`);
    }
    console.log(`  redirects.txt: ${rows.length} rule(s) checked`);
  }
  for (const needle of ['contacto-lib', 'storage', 'config']) {
    if (!htaccess.includes(needle)) fail('.htaccess', `missing deny rule for ${needle}`);
  }

  /* -- operator gaps: warning, never a failure -------------------------- */
  for (const gap of operatorGaps(config)) {
    warn('site.config.mjs', `operator.${gap} is empty or a placeholder; fill it before uploading`);
  }

  /* -- report ------------------------------------------------------------ */
  console.log(`Verified ${htmlFiles.length} HTML pages in dist/${config.build.outputDomain}`);
  for (const w of warns) console.log(`  WARNING  ${w}`);
  if (fails.length === 0) {
    console.log(`  ${warns.length} warning(s), 0 failure(s). PASS`);
    return;
  }
  for (const f of fails) console.error(`  FAIL     ${f}`);
  console.error(`\n${fails.length} failure(s). FAIL`);
  process.exit(1);
}

main().catch((error) => {
  console.error(`\nVerify crashed: ${error.message}`);
  if (process.env.DEBUG) console.error(error.stack);
  process.exit(1);
});
