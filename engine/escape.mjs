/* engine/escape.mjs — context-specific escaping and safe URL checks.
   Lifted and hardened from tasacion-com-py/build-site.mjs (esc, attr). */

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/** Escape for HTML text nodes. */
export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);
}

/** Escape for a double-quoted attribute value. Same table; delimiter is always ". */
export function attr(value) {
  return esc(value);
}

/** Safe protocols for author-supplied links. */
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Return a safe href, or null when the URL must not be rendered.
 * Relative paths beginning with / or # are always allowed.
 */
export function safeUrl(value) {
  if (typeof value !== 'string') return null;
  const raw = value.trim();
  if (raw === '') return null;
  if (raw.startsWith('/') || raw.startsWith('#')) {
    if (raw.startsWith('//')) return null; // protocol-relative
    return raw;
  }
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;
  return parsed.href;
}

/** JSON-LD serializer that cannot terminate the containing <script> element. */
const LINE_TERMINATORS = new RegExp('[\\u2028\\u2029]', 'g');

export function jsonLd(value) {
  return JSON.stringify(value, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(LINE_TERMINATORS, (c) => (c.charCodeAt(0) === 0x2028 ? '\\u2028' : '\\u2029'));
}

/** Plain-text blocks to <p> elements. No Markdown, no raw HTML. */
export function nl2p(text, className) {
  const cls = className ? ` class="${attr(className)}"` : '';
  return String(text || '')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p${cls}>${esc(block)}</p>`)
    .join('\n');
}

/** Deterministic heading/anchor ID. */
export function slugifyId(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'seccion';
}
