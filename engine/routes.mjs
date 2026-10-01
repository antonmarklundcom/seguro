/* engine/routes.mjs — normalize and enumerate all output paths.
   Breadcrumb parents are explicit page IDs, never guessed from slug
   segments (SHARED.md function-level reuse map). */

import path from 'node:path';

/** Absolute lowercase ASCII path with a trailing slash, except /404.html. */
export function normalizeSlug(slug) {
  if (typeof slug !== 'string' || !slug.startsWith('/')) {
    throw new Error(`Slug must start with /: ${slug}`);
  }
  if (slug === '/404.html') return slug;
  if (!/^\/[a-z0-9\-/]*$/.test(slug)) throw new Error(`Slug must be lowercase ASCII: ${slug}`);
  if (slug.includes('//') || slug.includes('..')) throw new Error(`Unsafe slug: ${slug}`);
  return slug.endsWith('/') ? slug : `${slug}/`;
}

/** Filesystem path, relative to the output root, for a slug. */
export function outputPathFor(slug, output = 'html') {
  if (slug === '/404.html') return '404.html';
  const trimmed = slug.replace(/^\/+|\/+$/g, '');
  const file = output === 'php' ? 'index.php' : 'index.html';
  return trimmed === '' ? file : path.posix.join(trimmed, file);
}

/**
 * Build the breadcrumb trail for a page from explicit parent IDs.
 * @param {Map<string, object>} byId
 */
export function breadcrumbTrail(page, byId) {
  const trail = [];
  let current = page;
  const guard = new Set();
  while (current) {
    if (guard.has(current.id)) throw new Error(`Breadcrumb cycle at ${current.id}`);
    guard.add(current.id);
    trail.unshift({ label: current.breadcrumbLabel || current.h1, path: current.slug });
    if (!current.parent) break;
    const parent = byId.get(current.parent);
    if (!parent) throw new Error(`Page ${current.id} has unknown parent ${current.parent}`);
    current = parent;
  }
  return trail;
}

/** Collect every internal href appearing in a rendered document. */
export function internalLinks(html) {
  const found = new Set();
  const re = /(?:href|src)="(\/[^"#]*)(#[^"]*)?"/g;
  let match;
  while ((match = re.exec(html)) !== null) found.add(match[1]);
  return found;
}
