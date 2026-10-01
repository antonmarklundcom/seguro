#!/usr/bin/env node
/* engine/serve.mjs — local preview of the built output.
   Usage: node engine/serve.mjs --site=seguro [--port=8080]

   Local preview cannot prove Apache/LiteSpeed behaviour on Hostinger; it
   only mirrors the trailing-slash routing and the real 404 document. */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ENGINE_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(ENGINE_DIR, '..');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png'
};

function arg(name, fallback) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

const siteId = arg('site', 'seguro');
const port = Number(arg('port', '8080'));

const mod = await import(pathToFileURL(path.join(REPO_ROOT, 'sites', siteId, 'site.config.mjs')).href);
const root = path.join(REPO_ROOT, 'dist', mod.default.build.outputDomain);

if (!fs.existsSync(root)) {
  console.error(`Nothing to serve: ${path.relative(REPO_ROOT, root)} does not exist. Run the build first.`);
  process.exit(1);
}

function resolveTarget(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const clean = path.posix.normalize(decoded);
  if (clean.includes('..')) return null;
  const candidates = clean.endsWith('/')
    ? [path.join(root, clean, 'index.html')]
    : [path.join(root, clean), path.join(root, clean, 'index.html')];
  for (const candidate of candidates) {
    if (!path.resolve(candidate).startsWith(path.resolve(root))) continue;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

http.createServer((req, res) => {
  const target = resolveTarget(req.url || '/');
  if (!target) {
    const notFound = path.join(root, '404.html');
    const body = fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found';
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(body);
    return;
  }
  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(fs.readFileSync(target));
}).listen(port, () => {
  console.log(`Preview of ${mod.default.domain} on http://localhost:${port}/  (Ctrl+C to stop)`);
});
