/* engine/markdown.mjs — small, safe Markdown renderer. No dependencies.
   Supported: ATX headings h2-h4, paragraphs, unordered/ordered lists,
   bold, italic, inline code, links with a protocol allowlist, blockquotes,
   horizontal rules. Raw HTML is never passed through: every source
   character is escaped before inline formatting is applied. */

import { esc, safeUrl, slugifyId } from './escape.mjs';

function inline(text) {
  // Escape first; every construct below only re-introduces markup we control.
  let out = esc(text);

  // Links: [label](url). Label may already contain escaped entities.
  out = out.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
    // href was escaped, so &amp; must be restored before URL parsing.
    const rawHref = href.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    const safe = safeUrl(rawHref);
    if (!safe) return label;
    const external = /^https?:\/\//i.test(safe);
    const rel = external ? ' rel="noopener" target="_blank"' : '';
    return `<a href="${esc(safe)}"${rel}>${label}</a>`;
  });

  out = out.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return out;
}

/**
 * Render Markdown to HTML.
 * @param {string} source
 * @param {{minHeadingLevel?: number}} [options]
 * @returns {{html: string, headings: {id: string, level: number, text: string}[]}}
 */
export function renderMarkdown(source, options = {}) {
  const minHeadingLevel = options.minHeadingLevel || 2;
  const lines = String(source || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  const headings = [];
  const usedIds = new Set();

  let i = 0;
  const flushList = (ordered, items) => {
    const tag = ordered ? 'ol' : 'ul';
    out.push(`<${tag} class="md-list">`);
    for (const item of items) out.push(`<li>${inline(item)}</li>`);
    out.push(`</${tag}>`);
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i += 1; continue; }

    if (/^\s{0,3}(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      out.push('<hr />');
      i += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      let level = heading[1].length;
      if (level < minHeadingLevel) level = minHeadingLevel;
      if (level > 6) level = 6;
      const text = heading[2].trim();
      let id = slugifyId(text);
      let n = 2;
      while (usedIds.has(id)) { id = `${slugifyId(text)}-${n}`; n += 1; }
      usedIds.add(id);
      headings.push({ id, level, text });
      out.push(`<h${level} id="${esc(id)}">${inline(text)}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^\s{0,3}>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s{0,3}>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s{0,3}>\s?/, ''));
        i += 1;
      }
      out.push(`<blockquote><p>${inline(buf.join(' ').trim())}</p></blockquote>`);
      continue;
    }

    const bullet = /^\s{0,3}[-*+]\s+(.*)$/.exec(line);
    if (bullet) {
      const items = [];
      while (i < lines.length) {
        const m = /^\s{0,3}[-*+]\s+(.*)$/.exec(lines[i]);
        if (!m) break;
        items.push(m[1].trim());
        i += 1;
      }
      flushList(false, items);
      continue;
    }

    const numbered = /^\s{0,3}\d+[.)]\s+(.*)$/.exec(line);
    if (numbered) {
      const items = [];
      while (i < lines.length) {
        const m = /^\s{0,3}\d+[.)]\s+(.*)$/.exec(lines[i]);
        if (!m) break;
        items.push(m[1].trim());
        i += 1;
      }
      flushList(true, items);
      continue;
    }

    // Paragraph: consume until blank line or a new block construct.
    const para = [];
    while (i < lines.length && lines[i].trim() !== '') {
      if (/^(#{1,6})\s+/.test(lines[i])) break;
      if (/^\s{0,3}[-*+]\s+/.test(lines[i])) break;
      if (/^\s{0,3}\d+[.)]\s+/.test(lines[i])) break;
      if (/^\s{0,3}>\s?/.test(lines[i])) break;
      if (/^\s{0,3}(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])) break;
      para.push(lines[i].trim());
      i += 1;
    }
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
  }

  return { html: out.join('\n'), headings };
}

/** Parse `---` YAML-ish front matter. Scalars, and `a, b` inline lists only. */
export function parseFrontMatter(raw) {
  const text = String(raw).replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: {}, body: text };
  const data = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1).split(',').map((v) => v.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      continue;
    }
    if (value === 'true') { data[key] = true; continue; }
    if (value === 'false') { data[key] = false; continue; }
    data[key] = value;
  }
  return { data, body: text.slice(match[0].length) };
}

/** Plain-text excerpt for RSS, derived from rendered HTML. */
export function excerptFromMarkdown(source, maxChars = 280) {
  const { html } = renderMarkdown(source);
  const firstParagraph = /<p>([\s\S]*?)<\/p>/.exec(html);
  const text = (firstParagraph ? firstParagraph[1] : '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1).replace(/\s+\S*$/, '')}…`;
}
