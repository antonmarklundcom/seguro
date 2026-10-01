/* engine/sitemap.mjs — emit indexable canonical routes with honest lastmod.
   Derived from the route registry; there is no hand-maintained URL list.
   lastmod is omitted when the record has no substantive revision date; it is
   never refreshed on every build. */

import { esc } from './escape.mjs';

export function buildSitemap(config, entries) {
  const urls = entries
    .filter((entry) => entry.indexable !== false)
    .map((entry) => {
      const loc = `${config.origin}${entry.slug}`;
      const lastmod = entry.updated ? `\n    <lastmod>${esc(entry.updated)}</lastmod>` : '';
      return `  <url>\n    <loc>${esc(loc)}</loc>${lastmod}\n  </url>`;
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

export function buildRobots(config) {
  return `User-agent: *
Allow: /

Sitemap: ${config.origin}/sitemap.xml
`;
}
