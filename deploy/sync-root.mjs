#!/usr/bin/env node
/* deploy/sync-root.mjs — hPanel → Advanced → Git deploys the repo ROOT, so the built site has to live at
   the root of the deployed branch. This copies dist/seguro.com.py into the repo root and removes whatever
   the previous run copied (tracked in .deployed-files), so deleted pages do not linger.
   Source folders stay in the repo but are blocked by the generated .htaccess (engine, sites, deploy, docs,
   tools, audit, *.md, *.mjs ...). Never copies config.php or storage/. Usage: npm run publish */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'dist', 'seguro.com.py');
const manifest = path.join(root, '.deployed-files');
if (!fs.existsSync(path.join(site, 'index.html'))) throw new Error('Build first: npm run build');

const SOURCE = new Set(['.git', 'engine', 'sites', 'deploy', 'docs', 'tools', 'audit', 'dist', 'node_modules']);
const entries = fs.readdirSync(site);
for (const e of entries) {
  if (SOURCE.has(e)) throw new Error(`Build output collides with a source folder: ${e}`);
  if (e === 'config.php' || e === 'storage') throw new Error(`Refusing to copy ${e}`);
}

if (fs.existsSync(manifest)) {
  for (const old of fs.readFileSync(manifest, 'utf8').split('\n').filter(Boolean)) {
    if (SOURCE.has(old) || old.includes('..')) continue;
    fs.rmSync(path.join(root, old), { recursive: true, force: true });
  }
}
for (const e of entries) fs.cpSync(path.join(site, e), path.join(root, e), { recursive: true });
fs.writeFileSync(manifest, entries.sort().join('\n') + '\n');
console.log(`Copied ${entries.length} top-level entries from dist/seguro.com.py to the repo root.`);
