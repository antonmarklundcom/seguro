/* engine/rss.mjs — published posts, absolute links, stable GUIDs.
   Drafts, private metadata and tracking parameters never reach the feed. */

import { esc } from './escape.mjs';

function rfc822(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).toUTCString();
}

export function buildRss(config, posts, buildDateIso) {
  const items = posts.map((post) => {
    const link = `${config.origin}${post.slug}`;
    return `    <item>
      <title>${esc(post.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${esc(rfc822(post.date))}</pubDate>
      <category>${esc(post.category.label)}</category>
      <description>${esc(post.excerpt || post.description)}</description>
    </item>`;
  }).join('\n');

  const lastBuild = posts.length ? rfc822(posts[0].date) : rfc822(buildDateIso);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(config.blog.feedTitle)}</title>
    <link>${esc(`${config.origin}/blog/`)}</link>
    <atom:link href="${esc(`${config.origin}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <description>${esc(config.blog.feedDescription)}</description>
    <language>${esc(config.locale)}</language>
    <lastBuildDate>${esc(lastBuild)}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}
