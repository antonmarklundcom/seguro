/* engine/blog.mjs — Markdown posts, categories, pagination, metadata. */

import fs from 'node:fs';
import path from 'node:path';
import { parseFrontMatter, renderMarkdown, excerptFromMarkdown } from './markdown.mjs';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function loadPosts(blogDir, config, authors) {
  if (!fs.existsSync(blogDir)) return [];
  const categoryIds = new Set(config.blog.categories.map((c) => c.id));
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md')).sort();
  const posts = [];
  const seen = new Set();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const { data, body } = parseFrontMatter(raw);
    const where = `blog/${file}`;

    for (const field of ['title', 'slug', 'description', 'date', 'category', 'author', 'status']) {
      if (!data[field]) throw new Error(`${where}: front matter field "${field}" is required`);
    }
    if (!ISO_DATE.test(data.date)) throw new Error(`${where}: date must be YYYY-MM-DD`);
    if (data.updated && !ISO_DATE.test(data.updated)) throw new Error(`${where}: updated must be YYYY-MM-DD`);
    if (data.updated && data.updated < data.date) throw new Error(`${where}: updated is before date`);
    if (!categoryIds.has(data.category)) throw new Error(`${where}: unknown category "${data.category}"`);
    if (!/^[a-z0-9-]+$/.test(data.slug)) throw new Error(`${where}: slug must be lowercase ASCII`);
    if (data.disclaimer !== true) throw new Error(`${where}: disclaimer: true is mandatory for the launch blog`);
    if (!authors.has(data.author)) throw new Error(`${where}: unknown author "${data.author}"`);
    if (!['draft', 'published'].includes(data.status)) throw new Error(`${where}: status must be draft or published`);
    if (data.status !== 'published') continue;

    const key = `${data.category}/${data.slug}`;
    if (seen.has(key)) throw new Error(`${where}: duplicate route ${key}`);
    seen.add(key);

    const rendered = renderMarkdown(body, { minHeadingLevel: 2 });
    const category = config.blog.categories.find((c) => c.id === data.category);

    posts.push({
      file,
      title: data.title,
      slug: `/blog/${data.category}/${data.slug}/`,
      description: data.description,
      date: data.date,
      updated: data.updated || null,
      category,
      authorRecord: authors.get(data.author),
      disclaimers: Array.isArray(data.disclaimers) ? data.disclaimers : [],
      sources: Array.isArray(data.sources) ? data.sources : [],
      html: rendered.html,
      headings: rendered.headings,
      excerpt: excerptFromMarkdown(body)
    });
  }

  posts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));
  return posts;
}

/** Split posts into index pages; page 2 exists only when it holds articles. */
export function paginate(posts, pageSize, basePath) {
  const pages = [];
  for (let i = 0; i < Math.max(posts.length, 1); i += pageSize) {
    const slice = posts.slice(i, i + pageSize);
    if (i > 0 && slice.length === 0) break;
    const number = Math.floor(i / pageSize) + 1;
    pages.push({
      number,
      posts: slice,
      slug: number === 1 ? basePath : `${basePath}pagina/${number}/`
    });
    if (posts.length === 0) break;
  }
  return pages;
}

export function formatDate(iso, locale = 'es-PY') {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(y, m - 1, d)));
}
