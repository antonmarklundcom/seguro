#!/usr/bin/env node
// End-to-end test of the contact form handler (docs/PARTNER-FORM.md test plan).
// Needs: node 18+, php (CLI) and curl extension. Starts a mock CRM and `php -S`, writes a
// temporary config.php (git-ignored) and storage/ and removes them afterwards.
// Usage: node tools/test-form.mjs
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CFG = join(ROOT, 'config.php');
const PHP_PORT = 8791, CRM_PORT = 8792;
const BASE = `http://127.0.0.1:${PHP_PORT}`;
if (existsSync(CFG)) { console.error('config.php already exists in the repo root: refusing to overwrite it.'); process.exit(2); }

const crm = [];
let crmStatus = 201;
const crmServer = createServer((req, res) => {
  let b = ''; req.on('data', (d) => (b += d));
  req.on('end', () => { crm.push({ headers: req.headers, body: b }); res.writeHead(crmStatus, { 'content-type': 'application/json' }); res.end('{}'); });
}).listen(CRM_PORT);

writeFileSync(CFG, `<?php return ['vcrm_endpoint'=>'http://127.0.0.1:${CRM_PORT}/api/v1/leads','vcrm_api_key'=>'TEST-KEY-NOT-REAL','notify_email'=>'owner@example.test','from_email'=>'no-reply@example.test'];\n`);
const php = spawn('php', ['-d', 'sendmail_path=/bin/true', '-d', 'error_log=/dev/null', '-S', `127.0.0.1:${PHP_PORT}`, '-t', ROOT], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = 0;
const check = (name, ok, extra = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  ' + extra}`); if (!ok) failed++; };

async function token() {
  const html = await (await fetch(`${BASE}/contacto/mensaje/`)).text();
  return { html, t: html.match(/name="t" value="([^"]+)"/)?.[1] };
}
async function post(fields) {
  const res = await fetch(`${BASE}/contacto-alianzas.php`, { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fields) });
  return { status: res.status, loc: res.headers.get('location') };
}
const valid = (t, extra = {}) => ({ tipo: 'corredor', nombre: 'Ana Pérez', organizacion: 'Corredora SA', cargo: 'Gerente', telefono: '0981 123 456', email: 'ana@example.com', mensaje: 'Hola, quiero conversar.', consent: 'v1.0', website: '', t, ...extra });

try {
  for (let i = 0; i < 40; i++) { try { await fetch(`${BASE}/contacto/mensaje/`); break; } catch { await sleep(150); } }
  const { html, t } = await token();
  check('form page renders one form, consent unticked + required', (html.match(/<form\b/g) || []).length === 1 && /name="consent" value="v1\.0" required/.test(html) && !/checked/.test(html.split('<fieldset')[1] || ''));
  check('form page has no e-mail address', !/@|mailto:/.test(html.replace(/ana@example\.com/g, '')));
  check('signed token present', !!t && /^\d+\.[0-9a-f]{64}$/.test(t));
  check('GET on handler → 405', (await fetch(`${BASE}/contacto-alianzas.php`)).status === 405);

  await sleep(3200);
  let r = await post(valid(t, { consent: '' }));
  check('missing consent → rejected with message', r.status === 303 && r.loc.includes('e=consent'), JSON.stringify(r));
  check('…and nothing sent to the CRM', crm.length === 0);
  const page = await (await fetch(`${BASE}/contacto/mensaje/?e=consent`)).text();
  check('consent error message visible on the form page', /id="consent-msg" role="alert">Para enviar el mensaje necesitamos tu autorización\./.test(page));

  r = await post(valid(t));
  check('valid submission → thank-you', r.status === 303 && r.loc === '/contacto/gracias/', JSON.stringify(r));
  check('CRM got exactly one contact', crm.length === 1);
  const p = crm[0] && JSON.parse(crm[0].body);
  check('CRM header X-Api-Key sent', crm[0]?.headers['x-api-key'] === 'TEST-KEY-NOT-REAL');
  check('phone normalised to +595…', p?.phone === '+595981123456', p?.phone);
  check('consent line with version + timestamp in CRM message', /Consentimiento v1\.0 aceptado el \d{4}-\d\d-\d\d \d\d:\d\d \(America\/Asuncion\)/.test(p?.message || ''), p?.message);
  check('source + idempotency key', p?.source === 'alianzas-web' && /^[0-9a-f]{32}$/.test(p?.idempotency_key || ''));

  const before = crm.length;
  r = await post(valid(t, { website: 'http://spam' }));
  check('honeypot filled → silent thank-you, no CRM', r.loc === '/contacto/gracias/' && crm.length === before);
  const fresh = (await token()).t;
  r = await post(valid(fresh));
  check('submitted in < 3 s → silent thank-you, no CRM', r.loc === '/contacto/gracias/' && crm.length === before);
  r = await post(valid('1.' + 'a'.repeat(64)));
  check('forged token → silent, no CRM', r.loc === '/contacto/gracias/' && crm.length === before);
  r = await post(valid(t, { tipo: 'persona' }));
  check('type "persona" (consumer) → rejected', r.loc.includes('e=campos'));
  r = await post(valid(t, { tipo: 'aseguradora', organizacion: '' }));
  check('company type without organisation → rejected', r.loc.includes('e=campos'));
  r = await post(valid(t, { telefono: '123' }));
  check('bad phone → rejected', r.loc.includes('e=campos'));
  r = await post(valid(t, { email: 'no-es-un-correo' }));
  check('bad e-mail → rejected', r.loc.includes('e=campos'));
  r = await post(valid(t, { mensaje: 'x'.repeat(1300) }));
  check('message over the cap → rejected', r.loc.includes('e=campos'));
  check('no rejected case reached the CRM', crm.length === before);

  // rate limit: 5 per IP per hour (the first valid one counted already, plus the rejects that got past it)
  let delivered = 0;
  for (let i = 0; i < 8; i++) { const n = crm.length; await post(valid(t, { nombre: 'Rate ' + i })); if (crm.length > n) delivered++; }
  check('rate limit: exactly 5 delivered per hour (1 earlier + 4 here)', delivered === 4, `delivered after first: ${delivered}`);

  // CRM down → still thank-you
  rmSync(join(ROOT, 'storage'), { recursive: true, force: true });
  crmStatus = 500;
  r = await post(valid(t, { nombre: 'CRM down' }));
  check('CRM error → visitor still sees thank-you', r.status === 303 && r.loc === '/contacto/gracias/');
  crmStatus = 201;

  // header-injection helper
  const inj = await new Promise((res) => { const c = spawn('php', ['-r', 'require "contacto-lib.php"; echo cl_line("a\\r\\nBcc: x@y.z");'], { cwd: ROOT }); let o = ''; c.stdout.on('data', (d) => (o += d)); c.on('close', () => res(o)); });
  check('CR/LF stripped from header-bound values', !/[\r\n]/.test(inj), JSON.stringify(inj));

  // no config → form unavailable, no form shown
  rmSync(CFG);
  const nocfg = await (await fetch(`${BASE}/contacto/mensaje/`)).text();
  check('no config.php → form hidden with a neutral message', !/<form\b/.test(nocfg) && /no está disponible/.test(nocfg));
  r = await post(valid(t));
  check('no config.php → handler redirects with server error, no crash', r.status === 303 && r.loc.includes('e=server'));
} finally {
  php.kill(); crmServer.close();
  rmSync(CFG, { force: true });
  rmSync(join(ROOT, 'storage'), { recursive: true, force: true });
}
console.log(failed ? `\n${failed} FAILED` : '\nALL PASSED');
process.exit(failed ? 1 : 0);
