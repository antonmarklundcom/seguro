#!/usr/bin/env node
// Static site builder for seguro.com.py (information-only).
// Usage: node site/build.mjs        (Node 18+, no dependencies)
// Reads site/site.json + site/content.mjs, writes plain HTML to the repo root
// (index.html, guias/…, etc.) so Hostinger's Git deploy can serve the root as-is.
// No PHP, no JavaScript, no forms, no cookies, no third-party requests.
// The build FAILS if banned wording, missing sources or broken internal links are found.

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { guides, glossary, pages } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(join(ROOT, 'site/site.json'), 'utf8'));
const out = new Map(); // path -> content

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('es-PY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// ---- company block: rendered only with confirmed data, never invented ----
const c = site.company;
const companyHtml = c.razonSocial && c.ruc && c.domicilio
  ? `<h2>Datos del titular</h2><p>${esc(c.razonSocial)} · RUC ${esc(c.ruc)} · ${esc(c.domicilio)}</p>`
  : '';
const companyLine = c.razonSocial && c.ruc && c.domicilio ? `<p>${esc(c.razonSocial)} · RUC ${esc(c.ruc)} · ${esc(c.domicilio)}</p>\n` : '';
const fill = (html) => html.replaceAll('__EMAIL__', site.contactEmail).replaceAll('__PRIVACY__', site.privacyEmail).replaceAll('__COMPANY__', companyHtml);

// ---- layout ----
function layout({ path, title, description, body, jsonld = null, noindex = false, home = false }) {
  const url = site.origin + path;
  const fullTitle = home ? `${site.name}: ${title}` : `${title} | ${site.name}`;
  const nav = site.nav.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join('');
  const flinks = site.footerLinks.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join(' · ');
  const ld = jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : '';
  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}">
<link rel="canonical" href="${url}">
<link rel="stylesheet" href="/assets/style.css">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="es_PY">
${ld}
</head>
<body>
<div class="strip" role="note">${esc(site.topStrip)}</div>
<header class="site-header">
<div class="wrap">
<a class="brand" href="/">${esc(site.name)}</a>
<nav aria-label="Principal">${nav}</nav>
</div>
</header>
<main class="wrap" id="contenido">
${body}
</main>
<footer class="site-footer">
<div class="wrap">
<p>${esc(site.footer)}</p>
${companyLine}<p>Contacto: <a href="mailto:${site.contactEmail}">${site.contactEmail}</a></p>
<p>${flinks}</p>
<p class="small">Última revisión del sitio: ${fmtDate(site.updated)}.</p>
</div>
</footer>
</body>
</html>
`;
}

function add(path, html) { out.set(path, html); }
const dirPath = (p) => (p === '/' ? 'index.html' : p.replace(/^\//, '') + 'index.html');

// ---- guides ----
const bySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));
for (const g of guides) {
  if (!g.sources?.length) throw new Error(`guide ${g.slug}: no sources`);
  const path = `/guias/${g.slug}/`;
  const src = g.sources.map((s) => `<li>${s.url ? `<a href="${s.url}" rel="noopener" target="_blank">${esc(s.label)}</a>` : esc(s.label)}, consultado el ${fmtDate(site.updated)}</li>`).join('');
  const rel = g.related.map((r) => { if (!bySlug[r]) throw new Error(`guide ${g.slug}: unknown related ${r}`); return `<li><a href="/guias/${r}/">${esc(bySlug[r].title)}</a></li>`; }).join('');
  const body = `
<nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a> › <a href="/guias/">Guías</a></nav>
<article>
<h1>${esc(g.title)}</h1>
<p class="meta">Actualizada el ${fmtDate(site.updated)}</p>
<p class="lead">${esc(g.intro)}</p>
${g.body}
<aside class="todo"><h2>Qué hacer ahora</h2><ul>${g.todo}</ul></aside>
<section class="sources"><h2>Fuentes</h2><ul>${src}</ul></section>
<section><h2>Guías relacionadas</h2><ul>${rel}</ul></section>
<p class="endnote">${esc(site.guideEndNote)} Actualizada el ${fmtDate(site.updated)}. ¿Encontraste un error? Escribinos a <a href="mailto:${site.contactEmail}">${site.contactEmail}</a>.</p>
</article>`;
  const jsonld = { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, inLanguage: site.lang, dateModified: site.updated, datePublished: site.updated, author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name }, mainEntityOfPage: site.origin + path };
  add(dirPath(path), layout({ path, title: g.title, description: g.description, body, jsonld }));
}

// ---- guides hub ----
{
  const cards = guides.map((g) => `<li><a href="/guias/${g.slug}/">${esc(g.title)}</a><span>${esc(g.description)}</span></li>`).join('');
  const body = `<h1>Guías</h1><p class="lead">Explicaciones generales sobre seguros en Paraguay. Cada guía muestra su fecha de actualización y sus fuentes.</p><ul class="cards">${cards}</ul>`;
  add(dirPath('/guias/'), layout({ path: '/guias/', title: 'Guías sobre seguros', description: 'Guías informativas: cómo leer una póliza, franquicia, contra terceros y todo riesgo, verificar una aseguradora y reclamar.', body }));
}

// ---- glossary ----
{
  const items = glossary.map(([t, d]) => `<dt id="${t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}">${esc(t)}</dt><dd>${esc(d)}</dd>`).join('');
  const body = `<h1>Glosario de seguros</h1><p class="meta">Actualizado el ${fmtDate(site.updated)}</p><p class="lead">Definiciones generales. La póliza de cada aseguradora prevalece.</p><dl class="glossary">${items}</dl><p class="endnote">${esc(site.guideEndNote)} Actualizado el ${fmtDate(site.updated)}.</p>`;
  add(dirPath('/glosario/'), layout({ path: '/glosario/', title: 'Glosario de seguros', description: 'Qué significan prima, póliza, franquicia, siniestro, carencia y otros términos de los seguros.', body }));
}

// ---- trust pages ----
for (const key of ['quienes', 'contacto', 'privacidad', 'cookies', 'terminos', 'metodologia']) {
  const p = pages[key];
  const path = `/${p.slug}/`;
  add(dirPath(path), layout({ path, title: p.title, description: p.description, body: `<h1>${esc(p.title)}</h1>${fill(p.body)}` }));
}

// ---- home ----
{
  const h = pages.home;
  const cards = guides.map((g) => `<li><a href="/guias/${g.slug}/">${esc(g.title)}</a><span>${esc(g.description)}</span></li>`).join('');
  const body = `
<section class="hero">
<h1>Entendé tu seguro antes de firmar</h1>
<p class="lead">seguro.com.py es un sitio informativo independiente sobre seguros en Paraguay. Explicamos qué significan los términos, qué mirar en una póliza, cómo verificar que una aseguradora o un corredor estén registrados y cómo hacer un reclamo.</p>
</section>
<section class="box">
<h2>Qué hacemos y qué no</h2>
<ul>
<li><strong>Hacemos:</strong> explicar, con fuentes y fechas.</li>
<li><strong>No hacemos:</strong> vender, cotizar, recomendar aseguradoras ni pedirte tus datos.</li>
</ul>
</section>
<section>
<h2>Guías</h2>
<ul class="cards">${cards}</ul>
<p><a href="/glosario/">Ver el glosario de seguros</a></p>
</section>`;
  const jsonld = { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.origin + '/', inLanguage: site.lang };
  add('index.html', layout({ path: '/', title: h.title, description: h.description, body, jsonld, home: true }));
}

// ---- 404 ----
add('404.html', layout({ path: '/404.html', title: 'Página no encontrada', description: 'La página que buscás no existe.', noindex: true, body: `<h1>No encontramos esa página</h1><p>Puede haberse movido o no existir más. Probá con las <a href="/guias/">guías</a>, el <a href="/glosario/">glosario</a> o volvé al <a href="/">inicio</a>.</p>` }));

// ---- robots + sitemap ----
const urls = ['/', '/guias/', ...guides.map((g) => `/guias/${g.slug}/`), '/glosario/', ...['quienes', 'contacto', 'privacidad', 'cookies', 'terminos', 'metodologia'].map((k) => `/${pages[k].slug}/`)];
add('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${site.origin}${u}</loc><lastmod>${site.updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
add('robots.txt', `User-agent: *\nAllow: /\nDisallow: /docs/\nDisallow: /site/\nDisallow: /tools/\n\nSitemap: ${site.origin}/sitemap.xml\n`);

// ---- checks ----
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const BANNED = /\b(facil|facilisimo|rapido|rapida|al instante|instantane|garantiz|sin requisitos|aprobad|pre-?aprobad|el mejor|la mejor|los mejores|mas barat|te aseguramos|nuestras? polizas?|cotiza ya|cotizar|cotiza gratis|contrata ya|ultimos dias|solo por hoy|oferta|no esperes|top \d|ranking|ahorra)/;
const problems = [];
if (!site.topStrip || !site.footer || !site.guideEndNote) problems.push('site.json: a disclaimer text is empty');
const known = new Set(['/', ...out.keys()].map((k) => (k === 'index.html' ? '/' : '/' + k.replace(/index\.html$/, ''))));
for (const [path, html] of out) {
  if (path.endsWith('.html')) {
    const text = norm(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' '));
    // Sentences that state what we do NOT do may name the banned word ("No hacemos: vender, cotizar…").
    const kept = text.split(/(?<=[.!?])\s+/).filter((sn) => !/\bno (hacemos|publicamos|vendemos|somos|cotizamos|recibimos|tramitamos)\b/.test(sn)).join(' ');
    const m = kept.match(BANNED);
    if (m) problems.push(`${path}: banned wording "${m[0]}"`);
    if (/<form\b|wa\.me|api\.whatsapp|<img\b|<iframe\b|<script(?![^>]*ld\+json)/i.test(html)) problems.push(`${path}: form/whatsapp/img/iframe/script found`);
    for (const l of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      if (l[1].startsWith('/assets/')) continue;
      if (!known.has(l[1])) problems.push(`${path}: broken internal link ${l[1]}`);
    }
  }
}
if (problems.length) { console.error('BUILD FAILED:\n- ' + problems.join('\n- ')); process.exit(1); }

// ---- write (remove only what a previous build created) ----
const manifestPath = join(ROOT, 'site/.generated.json');
if (existsSync(manifestPath)) for (const f of JSON.parse(readFileSync(manifestPath, 'utf8'))) rmSync(join(ROOT, f), { force: true });
for (const [p, content] of out) { const file = join(ROOT, p); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, content); }
mkdirSync(join(ROOT, 'assets'), { recursive: true });
copyFileSync(join(ROOT, 'site/style.css'), join(ROOT, 'assets/style.css'));
writeFileSync(manifestPath, JSON.stringify([...out.keys(), 'assets/style.css'], null, 1));
console.log(`Built ${out.size} files. ${urls.length} URLs in sitemap.`);
