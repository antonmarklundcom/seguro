#!/usr/bin/env node
/* deploy/make-deploy-branch.mjs — for Hostinger hPanel → Advanced → Git.
   dist/ is git-ignored, so Hostinger cannot deploy the repo root. This script commits ONLY the built
   site (dist/seguro.com.py) as the root of a local branch `deploy-site`, using a temporary index so
   your working tree, your index and the current branch are never touched. It never pushes.
   Usage: npm run build && npm run verify && node deploy/make-deploy-branch.mjs */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'dist', 'seguro.com.py');
if (!fs.existsSync(site)) throw new Error('dist/seguro.com.py does not exist. Run the build first.');
for (const never of ['config.php', 'storage']) {
  if (fs.existsSync(path.join(site, never))) throw new Error(`Refusing: ${never} is inside dist. Remove it first (it must only exist on the server).`);
}
const gitDir = path.join(root, '.git');
const index = path.join(gitDir, 'deploy-site.index');
fs.rmSync(index, { force: true });
const env = { ...process.env, GIT_INDEX_FILE: index };
const git = (args, opts = {}) => execFileSync('git', ['-c', 'core.autocrlf=false', '-c', 'core.safecrlf=false', '--git-dir', gitDir, ...args], { env, encoding: 'utf8', ...opts }).trim();

git(['--work-tree', site, 'add', '-A', '-f', '.']);
const tree = git(['write-tree']);
let parent = null;
try { parent = git(['rev-parse', '--verify', '--quiet', 'refs/heads/deploy-site']); } catch { /* first run */ }
const head = git(['rev-parse', '--short', 'HEAD']);
const args = ['commit-tree', tree, '-m', `Built site from ${head}`];
if (parent) args.push('-p', parent);
const commit = git(args);
git(['update-ref', 'refs/heads/deploy-site', commit]);
fs.rmSync(index, { force: true });
const files = git(['ls-tree', '-r', '--name-only', commit]).split('\n');
console.log(`Branch deploy-site -> ${commit.slice(0, 10)} (${files.length} files, index.html at the root).`);
console.log('Not pushed. Push it yourself only when you are ready:  git push <remote> deploy-site');
for (const f of files) if (/(^|\/)(config\.php|storage\/)/.test(f)) throw new Error(`Private file in branch: ${f}`);
