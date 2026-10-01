/* engine/render-page.mjs — compose head, layout, body, footer and schema.
   All domain identity is injected; there are no module-level site globals. */

import { esc, attr, jsonLd, safeUrl } from './escape.mjs';
import {
  renderHeader, renderFooter, renderHero, renderBreadcrumbs, renderTopStrip,
  renderBlock, renderDisclaimerSet, renderPageEnd
} from './components.mjs';
import { resolveDisclaimers } from './disclaimers.mjs';

function metaTags(config, page, canonical) {
  const ogImage = page.ogImage || config.seo.defaultImage;
  const robots = page.indexable === false
    ? 'noindex,follow'
    : (config.seo.robotsPolicy || 'index,follow,max-image-preview:large');

  return [
    `<meta name="description" content="${attr(page.description)}" />`,
    `<link rel="canonical" href="${attr(canonical)}" />`,
    `<meta name="robots" content="${attr(robots)}" />`,
    `<meta property="og:type" content="${attr(page.kind === 'blogPost' ? 'article' : 'website')}" />`,
    `<meta property="og:site_name" content="${attr(config.brand.name)}" />`,
    `<meta property="og:locale" content="es_PY" />`,
    `<meta property="og:title" content="${attr(page.title)}" />`,
    `<meta property="og:description" content="${attr(page.description)}" />`,
    `<meta property="og:url" content="${attr(canonical)}" />`,
    ogImage ? `<meta property="og:image" content="${attr(`${config.origin}${ogImage}`)}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`
  ].filter(Boolean).join('\n  ');
}

/**
 * @param {object} args
 * @param {object} args.config      validated site config
 * @param {object} args.page        normalized page record
 * @param {string} args.body        pre-rendered main content (blog posts)
 * @param {object[]} args.schemaNodes JSON-LD @graph members
 * @param {object[]} args.trail      breadcrumb trail
 * @param {string} args.assetVersion content hash query string
 */
export function renderPage({ config, page, body, schemaNodes, trail, assetVersion, buildYear }) {
  const canonical = `${config.origin}${page.slug === '/404.html' ? '/404.html' : page.slug}`;
  const disclaimerIds = resolveDisclaimers(page.kind, page.disclaimers);
  const ctx = { config, page };

  const main = body !== undefined
    ? body
    : (page.sections || []).map((block) => renderBlock(block, ctx)).join('\n');

  /* Guide-like pages end with the update date, the standard note and a sources list. */
  const WITH_END = new Set(['guide', 'hub', 'comparison', 'glossary', 'faq']);
  const end = body === undefined && WITH_END.has(page.kind)
    ? `${renderPageEnd(config, page)}
${page.sources && page.sources.length ? renderBlock({ type: 'sources', items: page.sources }, ctx) : ''}`
    : '';

  return `<!doctype html>
<html lang="${attr(config.locale)}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(page.title)}</title>
  ${metaTags(config, page, canonical)}
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preload" href="/assets/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/assets/fonts/fonts.css${assetVersion}" />
  <link rel="stylesheet" href="/assets/css/tokens.css${assetVersion}" />
  <link rel="stylesheet" href="/assets/css/site.css${assetVersion}" />
  <link rel="alternate" type="application/rss+xml" title="${attr(`${config.brand.name} — artículos`)}" href="/rss.xml" />
  <script type="application/ld+json">${jsonLd({ '@context': 'https://schema.org', '@graph': schemaNodes })}</script>
</head>
<body class="page page--${attr(page.kind)}">
${renderTopStrip(config)}
${renderHeader(config, page.slug)}
${renderBreadcrumbs(trail)}
<main id="contenido">
${page.hero === false ? '' : renderHero(page)}
${main}
${end}
${renderDisclaimerSet(disclaimerIds)}
</main>
${renderFooter(config, buildYear)}
<script src="/assets/js/site.js${assetVersion}" defer></script>
</body>
</html>
`;
}
