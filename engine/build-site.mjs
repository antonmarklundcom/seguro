#!/usr/bin/env node
/* engine/build-site.mjs — load one site config and produce one isolated site.
   Usage: node engine/build-site.mjs --site=seguro

   One normalized route writer under the selected domain output root; there
   are no per-site branches anywhere in the engine. */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { validateConfig, operatorGaps } from './config.mjs';
import { normalizeSlug, outputPathFor, breadcrumbTrail } from './routes.mjs';
import { renderPage } from './render-page.mjs';
import { renderBlock, renderPageEnd } from './components.mjs';
import { resolveDisclaimers } from './disclaimers.mjs';
import { loadPosts, paginate, formatDate } from './blog.mjs';
import { buildSitemap, buildRobots } from './sitemap.mjs';
import { buildRss } from './rss.mjs';
import { buildHtaccess, buildFavicon, buildTokensCss, parseRedirects } from './hosting/htaccess.mjs';
import { esc, attr } from './escape.mjs';
import * as schema from './schema.mjs';

const ENGINE_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(ENGINE_DIR, '..');

function arg(name, fallback) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

async function importDefault(file) {
  const mod = await import(pathToFileURL(file).href);
  return mod.default;
}

function writeFile(root, relative, contents) {
  const target = path.join(root, relative);
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(root))) throw new Error(`Refusing to write outside the output root: ${relative}`);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, contents);
}

function copyFile(from, root, relative) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(from, target);
}

function hash(...contents) {
  const h = crypto.createHash('sha256');
  for (const c of contents) h.update(c);
  return h.digest('hex').slice(0, 10);
}

/* --------------------------------------------------------- page assembly */

function collectFaqItems(page) {
  const items = [];
  for (const block of page.sections || []) {
    if (block.type === 'faq') items.push(...block.items);
  }
  return items;
}

/* ------------------------------------------------------------------ main */

async function main() {
  const siteId = arg('site');
  if (!siteId || !/^[a-z0-9-]+$/.test(siteId)) {
    console.error('Usage: node engine/build-site.mjs --site=<site-id>');
    process.exit(2);
  }

  const siteDir = path.join(REPO_ROOT, 'sites', siteId);
  if (!fs.existsSync(siteDir)) throw new Error(`No such site: sites/${siteId}`);

  const rawConfig = await importDefault(path.join(siteDir, 'site.config.mjs'));
  const { config } = validateConfig(rawConfig, siteId);

  const authorsList = await importDefault(path.join(siteDir, 'content', 'authors.mjs'));
  const authors = new Map(authorsList.map((a) => [a.id, a]));
  const pageRecords = await importDefault(path.join(siteDir, 'content', 'pages.mjs'));

  const outputRoot = path.join(REPO_ROOT, 'dist', config.build.outputDomain);
  fs.rmSync(outputRoot, { recursive: true, force: true });
  fs.mkdirSync(outputRoot, { recursive: true });

  const buildYear = new Date().getUTCFullYear();
  const todayIso = new Date().toISOString().slice(0, 10);

  /* -- assets first, so the content hash is known before any HTML is written */
  const siteCss = fs.readFileSync(path.join(ENGINE_DIR, 'assets/css/site.css'), 'utf8');
  const siteJs = fs.readFileSync(path.join(ENGINE_DIR, 'assets/js/site.js'), 'utf8');
  const formJs = fs.readFileSync(path.join(ENGINE_DIR, 'assets/js/form.js'), 'utf8');
  const fontsCss = fs.readFileSync(path.join(ENGINE_DIR, 'assets/fonts/fonts.css'), 'utf8');
  const tokensCss = buildTokensCss(config);

  const assetVersion = `?v=${hash(siteCss, siteJs, formJs, fontsCss, tokensCss)}`;

  writeFile(outputRoot, 'assets/css/site.css', siteCss);
  writeFile(outputRoot, 'assets/css/tokens.css', tokensCss);
  writeFile(outputRoot, 'assets/js/site.js', siteJs);
  writeFile(outputRoot, 'assets/js/form.js', formJs);
  /* Contact form handler (PHP). config.php is never part of the build: the owner uploads it by hand. */
  for (const php of ['contacto-alianzas.php', 'contacto-lib.php']) {
    copyFile(path.join(ENGINE_DIR, 'php', php), outputRoot, php);
  }
  writeFile(outputRoot, 'assets/fonts/fonts.css', fontsCss);
  for (const font of fs.readdirSync(path.join(ENGINE_DIR, 'assets/fonts')).filter((f) => f.endsWith('.woff2'))) {
    copyFile(path.join(ENGINE_DIR, 'assets/fonts', font), outputRoot, `assets/fonts/${font}`);
  }
  writeFile(outputRoot, 'favicon.svg', buildFavicon(config));

  /* ------------------------------------------------------------- routes */
  const pages = pageRecords.map((record) => ({
    ...record,
    slug: normalizeSlug(record.slug),
    sections: record.sections || []
  }));
  const byId = new Map(pages.map((p) => [p.id, p]));

  const posts = loadPosts(path.join(siteDir, 'blog'), config, authors);
  const routeEntries = [];
  let written = 0;

  const emit = (page, body, schemaNodes, trail) => {
    const html = renderPage({ config, page, body, schemaNodes, trail, assetVersion, buildYear });
    writeFile(outputRoot, outputPathFor(page.slug, page.output), html);
    written += 1;
    routeEntries.push({ slug: page.slug, indexable: page.indexable !== false && page.output !== 'php', updated: page.updated || null });
  };

  /* ------------------------------------------------------- static pages */
  for (const page of pages) {
    const trail = breadcrumbTrail(page, byId);
    const url = `${config.origin}${page.slug}`;
    const nodes = [schema.webSiteNode(config), schema.organizationNode(config)];
    if (trail.length > 1) nodes.push(schema.breadcrumbNode(config, trail));
    const faqItems = collectFaqItems(page);
    if (faqItems.length) nodes.push(schema.faqPageNode(url, faqItems));

    // Disclaimer IDs are resolved here too so an unknown ID fails the build.
    resolveDisclaimers(page.kind, page.disclaimers);
    emit(page, undefined, nodes, trail);
  }

  /* --------------------------------------------------------------- blog */
  const blogRoot = {
    id: 'blog',
    slug: '/blog/',
    kind: 'blogIndex',
    parent: 'home',
    breadcrumbLabel: 'Blog',
    h1: 'Guías sobre autos, salud y viajes',
    title: `Blog de seguros en Paraguay | ${config.brand.name}`,
    description: 'Artículos educativos sobre seguros de auto, medicina prepaga y asistencia al viajero en Paraguay, organizados por categoría y con la fecha de publicación visible.',
    summary: 'Publicamos guías breves y con fuentes. Cada artículo enlaza a la página canónica del tema en lugar de repetirla.',
    disclaimers: ['S', 'H', 'T'],
    updated: posts.length ? posts[0].date : null,
    sections: []
  };
  byId.set('blog', blogRoot);

  const cardFor = (post) => ({
    url: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    dateLabel: formatDate(post.date, config.locale),
    categoryLabel: post.category.label
  });

  const paginationHtml = (pagesList, current) => {
    if (pagesList.length < 2) return '';
    return `<nav aria-label="Paginación"><ol class="pagination">${pagesList.map((p) => (p.number === current
      ? `<li><span aria-current="page">${p.number}</span></li>`
      : `<li><a href="${attr(p.slug)}">${p.number}</a></li>`)).join('')}</ol></nav>`;
  };

  const emitIndex = (base, list, parentId, extra = {}) => {
    const indexPages = paginate(list, config.blog.pageSize, base.slug);
    for (const indexPage of indexPages) {
      const page = {
        ...base,
        ...extra,
        slug: indexPage.slug,
        parent: parentId,
        indexable: (base.indexable !== false) && list.length > 0,
        title: indexPage.number === 1 ? base.title : `${base.title} — página ${indexPage.number}`,
        description: indexPage.number === 1 ? base.description : `${base.description} Página ${indexPage.number}.`,
        h1: indexPage.number === 1 ? base.h1 : `${base.h1} — página ${indexPage.number}`,
        sections: [{
          type: 'postList',
          items: indexPage.posts.map(cardFor),
          pagination: paginationHtml(indexPages, indexPage.number)
        }]
      };
      const trail = breadcrumbTrail({ ...page, id: `${base.id}-${indexPage.number}` }, byId);
      const url = `${config.origin}${page.slug}`;
      const nodes = [
        schema.webSiteNode(config),
        schema.organizationNode(config),
        schema.breadcrumbNode(config, trail)
      ];
      emit(page, undefined, nodes, trail);
    }
  };

  emitIndex(blogRoot, posts, 'home');

  for (const category of config.blog.categories) {
    const list = posts.filter((p) => p.category.id === category.id);
    const base = {
      id: `blog-${category.id}`,
      slug: `/blog/${category.id}/`,
      kind: 'blogIndex',
      breadcrumbLabel: category.label,
      h1: `Guías sobre ${category.label.toLowerCase()}`,
      title: `Guías sobre ${category.label.toLowerCase()} | ${config.brand.name}`,
      description: `${category.description} Artículos publicados en ${config.brand.name}, con su fecha de publicación y sus fuentes.`,
      summary: category.description,
      disclaimers: category.id === 'salud' ? ['H'] : category.id === 'viajes' ? ['T'] : ['S'],
      updated: list.length ? list[0].date : null
    };
    byId.set(base.id, { ...base, parent: 'blog' });
    emitIndex(base, list, 'blog');
  }

  for (const post of posts) {
    const page = {
      id: `post-${post.category.id}-${post.slug}`,
      slug: post.slug,
      kind: 'blogPost',
      parent: `blog-${post.category.id}`,
      breadcrumbLabel: post.title,
      title: post.title.length > 60 ? post.title : `${post.title} | ${config.brand.name}`,
      description: post.description,
      h1: post.title,
      summary: post.description,
      eyebrow: post.category.label,
      hero: false,
      disclaimers: post.disclaimers,
      updated: post.updated || post.date
    };
    const trail = breadcrumbTrail(page, byId);
    const url = `${config.origin}${post.slug}`;
    const nodes = [
      schema.webSiteNode(config),
      schema.organizationNode(config),
      schema.breadcrumbNode(config, trail),
      schema.articleNode(config, post, url)
    ];

    const postSources = post.sources.length ? post.sources : (config.blog.defaultSources?.[post.category.id] || []);
    const sourcesHtml = postSources.length
      ? renderBlock({ type: 'sources', items: postSources }, { config, page })
      : '';

    const body = `<article class="post">
  <div class="container">
    <p class="eyebrow">${esc(post.category.label)}</p>
    <h1>${esc(post.title)}</h1>
    <p class="post__meta">
      <span>Por ${esc(post.authorRecord.name)}</span>
      <span>Publicado el <time datetime="${attr(post.date)}">${esc(formatDate(post.date, config.locale))}</time></span>
      ${post.updated ? `<span>Revisado el <time datetime="${attr(post.updated)}">${esc(formatDate(post.updated, config.locale))}</time></span>` : ''}
    </p>
    <div class="post__body">
${post.html}
    </div>
    <p class="post__nav"><a href="/blog/${esc(post.category.id)}/">Ver más guías de ${esc(post.category.label.toLowerCase())}</a></p>
  </div>
</article>
${renderPageEnd(config, { updated: post.updated || post.date })}
${sourcesHtml}`;

    emit(page, body, nodes, trail);
  }

  /* ------------------------------------------------- non-HTML artefacts */
  const sitemapEntries = routeEntries.filter((e) => e.slug !== '/404.html');
  writeFile(outputRoot, 'sitemap.xml', buildSitemap(config, sitemapEntries));
  writeFile(outputRoot, 'robots.txt', buildRobots(config));
  writeFile(outputRoot, 'rss.xml', buildRss(config, posts, todayIso));
  const redirectsFile = path.join(REPO_ROOT, 'redirects.txt');
  const redirects = fs.existsSync(redirectsFile) ? parseRedirects(fs.readFileSync(redirectsFile, 'utf8')) : [];
  writeFile(outputRoot, '.htaccess', buildHtaccess(config, redirects));

  /* ------------------------------------------------------------ summary */
  const gaps = operatorGaps(config);
  console.log(`Built ${config.domain}`);
  console.log(`  HTML pages     : ${written}`);
  console.log(`  Blog posts     : ${posts.length}`);
  console.log(`  Sitemap URLs   : ${sitemapEntries.filter((e) => e.indexable).length}`);
  console.log(`  Asset version  : ${assetVersion}`);
  console.log(`  Output root    : ${path.relative(REPO_ROOT, outputRoot)}`);
  if (gaps.length) {
    console.log(`  WARNING        : operator fields incomplete -> ${gaps.join(', ')}`);
  }
}

main().catch((error) => {
  console.error(`\nBuild failed: ${error.message}`);
  if (process.env.DEBUG) console.error(error.stack);
  process.exit(1);
});
