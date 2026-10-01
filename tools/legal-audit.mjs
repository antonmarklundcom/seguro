#!/usr/bin/env node
// Read-only copy audit for seguro.com.py (information-site model; docs/LEGAL-AUDIT.md §6).
// Fetches every URL in the sitemap and flags wording that could read as selling,
// quoting, recommending or intermediating insurance (Ley 827/96), misleading or
// comparative advertising (Ley 1334/98), promise words, forms or WhatsApp links
// that collect consumer data, missing site disclaimers and missing calculator
// disclaimers. It never writes to the site.
//
// Usage (Node 18+, no dependencies):
//   node tools/legal-audit.mjs [sitemapUrl] > scan.md
// Default sitemap: https://seguro.com.py/sitemap.xml
// Also works on a local server: node tools/legal-audit.mjs http://localhost:8080/sitemap.xml
// Regex matches are leads for a human to review, not verdicts.

const SITEMAP = process.argv[2] || 'https://seguro.com.py/sitemap.xml';
const UA = 'seguro-legal-audit/2.0 (read-only)';

// Matching runs on lowercased, accent-stripped text: write patterns without accents.
const RULES = [
  // HIGH: reads as selling, advice, recommendation or intermediation
  { id: 'best', risk: 'high', re: /\b(el|la|los|las) mejor(es)? (seguro|aseguradora|cobertura|opcion|plan|prepaga|poliza|precio|corredor)s?\b/, fix: 'Remove the superlative. "Información para entender y comparar coberturas."' },
  { id: 'advice', risk: 'high', re: /\b(te |le )?(recomendamos|aconsejamos|asesoramos|sugerimos)\b|\bnuestra recomendacion\b|\bnuestros? (expertos?|asesores?)\b|\basesoramiento (gratis|gratuito|personal)/, fix: '"Información general, no es asesoramiento. Un corredor registrado puede asesorarte."' },
  { id: 'personalized', risk: 'high', re: /\b(ideal|perfecto|justo|indicado) para (vos|ti|usted|tu familia)\b|\b(elegimos|encontramos|buscamos) (por vos|el seguro|tu seguro)\b|\bel que (mas )?te conviene\b|\ba tu medida\b/, fix: '"Qué mirar al elegir un seguro de auto" (a checklist, not a pick).' },
  { id: 'we-sell', risk: 'high', re: /\bte aseguramos\b|\bnuestras? (polizas?|seguros?|coberturas?|planes?)\b|\bcontrata(lo|la)? (ya|ahora|aqui|aca|online|en linea|hoy)\b|\bcontrata tu\b|\bcompra (tu|el) seguro\b|\bemitimos (tu |la |su )?poliza\b|\btu poliza en (minutos|el dia|\d+)\b|\bte cotizamos\b|\bcotizamos\b|\bcotiza ya\b|\bcotiza (gratis|ahora|en \d)|\bobtene tu cotizacion\b|\bcotizacion (oficial|exacta|final|vinculante)\b|\bgestionamos (tu|el) (siniestro|reclamo|seguro)\b/, fix: 'Remove. We do not sell, quote or manage claims. "Qué cubre, qué no cubre y cómo reclamar."' },
  { id: 'promise', risk: 'high', re: /\bgarantiz(a|amos|ado|ada|ados|adas)\b|\bcobertura (total|completa)\b|\bcubre todo\b|\b100 ?% cubierto\b|\bsin letra chica\b|\baprobacion (segura|inmediata)\b|\bsin requisitos\b|\baprobad[oa]s?\b/, fix: '"Las coberturas, exclusiones y condiciones las define cada aseguradora en su póliza."' },
  { id: 'ease', risk: 'high', re: /\b(facil|facilisimo|rapido|rapida|al instante|instantane[oa]|en minutos|en segundos|en 2 minutos|en 3 minutos|sin vueltas|sin tramites|sin papeleo)\b/, fix: 'Remove ease/speed promises. Describe the process neutrally.' },
  { id: 'price', risk: 'high', re: /(₲|\bgs\.?|\bpyg|\bus\$|\busd)\s?[\d.,]{3,}|\bdesde\s+(₲|gs|us\$|usd)|\bprima (de|desde|mensual)\b|\b\d[\d.,]*\s?(por mes|\/mes|mensuales)\b/, fix: 'Delete the figure unless it has an insurer source and a date: "Ejemplo ilustrativo tomado de [fuente, fecha]. No es una cotización."' },
  // MEDIUM: rankings, urgency, savings, fear, coverage claims
  { id: 'ranking', risk: 'medium', re: /\btop ?\d+\b|\branking\b|\b(numero|#) ?1\b|\blas \d+ mejores\b|\bmas (barato|barata|economico|economica|confiable|recomendad)|\bprecio mas bajo\b|\bmejor precio\b|\blider(es)? (del|en el) (mercado|sector)\b/, fix: 'Alphabetical list, "no es un ranking ni una recomendación", verification date per entry.' },
  { id: 'saving', risk: 'medium', re: /\bahorr(a|as|e) (hasta )?\d+ ?%|\bahorr(a|as|e) hasta\b|\bpaga menos\b|\bel mas barato\b/, fix: 'Remove unless backed by a dated, sourced calculation.' },
  { id: 'urgency', risk: 'medium', re: /\bhoy mismo\b|\bultimos? (dias|cupos|lugares)\b|\bpor tiempo limitado\b|\boferta\b|\bno esperes\b|\bya mismo\b|\bantes de que (sea tarde|suba)\b|\bsolo por hoy\b|\burgente\b/, fix: 'Drop the urgency.' },
  { id: 'fear', risk: 'medium', re: /\b(y si te pasa|no te quedes sin|podrias perderlo todo|tu familia (queda|quedaria)|sin proteccion alguna|riesgo de perder)\b/, fix: 'Neutral, factual wording: what the law requires, what a policy covers, what it excludes.' },
  { id: 'coverage-claim', risk: 'medium', re: /\bsin (examenes medicos|carencia|franquicia|deducible)\b|\bcubre (desde el primer dia|preexistencias)\b|\bincluye (grua|auxilio)\b/, fix: 'Say which insurer/plan the statement comes from and the date, or "algunos planes pueden incluir… según la póliza".' },
  { id: 'cta-sell', risk: 'medium', re: /\bsolicita(lo|la)? (ya|ahora|tu)\b|\bpedi tu (seguro|cotizacion|poliza)\b|\bquiero (mi )?(seguro|cotizacion)\b|\bcotizar\b/, fix: 'Information CTAs only: "Leé la guía", "Verificá una aseguradora", "Qué cubre".' },
  { id: 'whatsapp-cta', risk: 'medium', re: /\b(escribinos|hablanos|contactanos|consultanos) por whatsapp\b|\bcotiza por whatsapp\b/, fix: 'No consumer WhatsApp channel in the information model.' },
  // LOW: acceptable with context, review
  { id: 'expert', risk: 'low', re: /\bexpert(o|os|a|as)\b|\bespecialistas?\b/, fix: 'Do not present seguro.com.py as an expert adviser; cite the sources.' },
  { id: 'compare', risk: 'low', re: /\bcompara(r|dor)?\b/, fix: 'OK for objective, sourced facts; no price or merit comparison of insurers.' },
];

// Distinctive names only (generic words like "garantia" or "patria" would flag normal sentences).
// Extend from the SIS register of authorised insurers.
const INSURERS = ['mapfre', 'sancor', 'la consolidada', 'aseguradora del este', 'aesa', 'yacyreta', 'tajy', 'seguros patria', 'royal seguros', 'itau seguros', 'alianza garantia', 'aseguradora paraguaya', 'asepasa', 'fenix seguros', 'cenit seguros', 'la rural', 'la independencia', 'intercontinental', 'rumbos', 'panal', 'mundo seguros', 'la meridional', 'seguridad seguros', 'santa clara', 'migone', 'asismed', 'mediplus', 'proteccion medica', 'assist card', 'universal assistance', 'travel ace', 'coris'];
const ENDORSE = /\b(mejor|recomend|confiable|lider|top|numero 1|preferid|elegid|socio oficial|partner oficial|aliado oficial|oficial)/;

// Site-level disclaimers (docs/DISCLAIMERS.md). Matched on normalised text.
const CHECKS = {
  topStrip: /sitio informativo\.? no vendemos seguros ni somos una aseguradora/,
  footer: /no es una aseguradora,? un corredor ni un agente de seguros/,
  footerNoSell: /no vendemos,? cotizamos ni contratamos seguros/,
  notAdvice: /no es asesoramiento/,
  privacyLink: /href=["'][^"']*privacidad/i,
  cookiesLink: /href=["'][^"']*cookies/i,
  termsLink: /href=["'][^"']*terminos/i,
  methodLink: /href=["'][^"']*metodologia/i,
};

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const clean = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function sitemapUrls(url) {
  const xml = await get(url);
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => decode(m[1]));
  if (/<sitemapindex/i.test(xml)) return (await Promise.all(locs.map(sitemapUrls))).flat();
  return locs;
}

function blocks(html) {
  const out = [];
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) out.push(['title', clean(title[1])]);
  for (const m of html.matchAll(/<meta[^>]+name=["']description["'][^>]*>/gi)) {
    const c = m[0].match(/content=["']([^"']*)["']/i);
    if (c) out.push(['meta description', decode(c[1])]);
  }
  const body = html
    .replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  for (const m of body.matchAll(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) out.push(['json-ld', m[1].replace(/\s+/g, ' ').trim()]);
  for (const m of body.matchAll(/<(h[1-6]|p|li|td|th|caption|figcaption|summary|dt|dd|button|label|a|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = clean(m[2]);
    if (t) out.push([m[1].toLowerCase(), t]);
  }
  for (const m of body.matchAll(/<input[^>]+type=["']?(submit|button)["']?[^>]*>/gi)) {
    const v = m[0].match(/value=["']([^"']*)["']/i);
    if (v) out.push(['input', decode(v[1])]);
  }
  return out;
}

// Split only before a capital letter so "Gs. 150.000" stays in one sentence.
const sentences = (text) => text.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/).filter(Boolean);

function audit(url, html) {
  const path = new URL(url).pathname;
  const findings = [];
  const seen = new Set();
  const add = (el, text, rule, risk, fix) => {
    const key = `${rule}|${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    findings.push({ url, el, text, rule, risk, fix });
  };
  for (const [el, text] of blocks(html)) {
    for (const s of el === 'json-ld' ? [text] : sentences(text)) {
      const n = norm(s);
      // Sentences that say what we do NOT do (the disclaimers) may contain the flagged verbs.
      const negated = /\bno (vendemos|cotizamos|asesoramos|recomendamos|gestionamos|somos|ofrecemos|brindamos|hacemos|recibimos|tramitamos)\b/.test(n);
      for (const r of RULES) {
        if (negated && (r.id === 'we-sell' || r.id === 'advice' || r.id === 'cta-sell')) continue;
        if (r.re.test(n)) add(el, s.slice(0, 300), r.id, r.risk, r.fix);
      }
      const named = INSURERS.filter((i) => new RegExp(`\\b${i}\\b`).test(n));
      if (named.length) {
        const endorsed = ENDORSE.test(n);
        add(el, s.slice(0, 300), `insurer-name:${named.join(',')}`, endorsed ? 'high' : 'low',
          endorsed ? 'Remove endorsement wording next to an insurer name; neutral factual mention with a link to its official site.' : 'Nominative use only: factual, neutral, link to the entity\'s official site, no logo.');
      }
    }
    if (el === 'json-ld') {
      if (/InsuranceAgency|InsuranceAgent|"Insurance/.test(text)) add(el, 'JSON-LD insurance @type', 'schema-agency', 'high', 'Use Organization/WebSite/Article. Insurance types say we are an agency.');
      if (/AggregateRating|"Review"/.test(text)) add(el, 'JSON-LD AggregateRating/Review', 'schema-rating', 'medium', 'Remove ratings of insurers; only genuine reviews of this site, if ever.');
      if (/"(Offer|price|priceRange|lowPrice)"/.test(text)) add(el, 'JSON-LD Offer/price', 'schema-price', 'high', 'Remove price markup; we sell nothing.');
    }
  }
  // Structure checks
  const forms = html.match(/<form\b[\s\S]*?<\/form>/gi) || [];
  const isContact = /^\/(contacto|gracias-contacto)\/?$/.test(path);
  if (forms.length && !isContact) add('form', `${forms.length} <form> outside /contacto`, 'form-outside-contact', 'high', 'No consumer forms. Remove, or confirm it is a search box or similar with no personal data.');
  if (isContact) {
    const f = forms.join(' ');
    if (forms.length && !/consent|consentimiento|acepto/i.test(f)) add('form', 'contact form without a consent checkbox', 'consent-missing', 'high', 'Add the consent box exactly as in docs/PARTNER-FORM.md.');
    if (/type=["']checkbox["'][^>]*\bchecked\b/i.test(f)) add('form', 'pre-ticked checkbox', 'consent-preticked', 'high', 'Consent must be unticked by default.');
    if (/(cedula|c\.i\.|salud|enfermedad|patente|chapa|chasis|poliza n)/.test(norm(f))) add('form', 'consumer/health/vehicle field in the contact form', 'consumer-field', 'high', 'Remove: the partner form must not collect consumer or health data.');
  }
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']*(?:wa\.me|api\.whatsapp\.com|whatsapp:\/\/)[^"']*)["'][^>]*>/gi)) add('a', m[1].slice(0, 200), 'whatsapp-link', 'high', 'No consumer WhatsApp link in the information model.');
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const t = norm(m[0]);
    if (INSURERS.some((i) => t.includes(i.replace(/ /g, '')) || t.includes(i.replace(/ /g, '-')))) add('img', m[0].slice(0, 200), 'insurer-logo', 'high', 'Remove insurer logos (implied endorsement).');
  }
  const n = norm(clean(html));
  // Calculator / cotizador detection → needs the "Resultado ilustrativo" disclaimer under the result.
  const looksCalc = /<input[^>]+type=["']?(number|range)["']?/i.test(html) || /\bcalculad|\bcotizador|\bcuotero|\bsimulador/.test(n);
  if (looksCalc && !/resultado ilustrativo/.test(n)) add('calculator', `calculator/cotizador-like page (${path})`, 'calc-no-disclaimer', 'high', 'Add "Resultado ilustrativo. No es una cotización ni una oferta…" directly under the result, or remove the tool.');
  if (looksCalc) add('calculator', `calculator/cotizador-like page (${path})`, 'calc-review', 'medium', 'Review by hand: sourced/dated inputs, no insurer price, no "contratar" button. Preferred: replace with a no-price explainer.');
  // Analytics before consent (can't prove consent gating by regex: flag for manual check)
  if (/googletagmanager\.com|google-analytics\.com|gtag\(|fbq\(|connect\.facebook\.net/.test(html)) add('script', 'analytics/marketing tag in page HTML', 'tracking-tag', 'medium', 'Confirm the tag loads only after cookie consent; no ad pixels at all (no ads).');
  const disclosure = {};
  disclosure.topStrip = CHECKS.topStrip.test(n);
  disclosure.footer = CHECKS.footer.test(n) && CHECKS.footerNoSell.test(n);
  disclosure.notAdvice = CHECKS.notAdvice.test(n);
  disclosure.privacy = CHECKS.privacyLink.test(html);
  disclosure.cookies = CHECKS.cookiesLink.test(html);
  disclosure.terms = CHECKS.termsLink.test(html);
  disclosure.method = CHECKS.methodLink.test(html);
  const isGuide = /\/guias?\//.test(path) && !/\/guias?\/?$/.test(path);
  disclosure.guideNote = isGuide ? /esta guia es informativa/.test(n) && /actualizada el/.test(n) : null;
  const meta = { images: (html.match(/<img\b/gi) || []).length, forms: forms.length, whatsapp: /wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(html) };
  return { findings, disclosure, meta };
}

const RISK_ORDER = { high: 0, medium: 1, low: 2 };

async function main() {
  let urls = [...new Set(await sitemapUrls(SITEMAP))];
  // Testing a local build: the sitemap lists https://seguro.com.py/… but we fetch from the local server.
  const base = new URL(SITEMAP);
  if (/^(localhost|127\.0\.0\.1)$/.test(base.hostname)) urls = urls.map((u) => base.origin + new URL(u).pathname);
  const results = [];
  for (const url of urls) {
    try {
      results.push({ url, ...audit(url, await get(url)) });
    } catch (e) {
      results.push({ url, error: e.message, findings: [], disclosure: {}, meta: {} });
    }
  }
  const all = results.flatMap((r) => r.findings).sort((a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk] || a.url.localeCompare(b.url));
  const count = (k) => all.filter((f) => f.risk === k).length;
  const out = [];
  out.push(`# Live-site copy scan, generated ${new Date().toISOString()}`, '');
  out.push(`Sitemap: ${SITEMAP} · URLs: ${urls.length} · findings: ${all.length} (high ${count('high')}, medium ${count('medium')}, low ${count('low')})`, '');
  out.push('Automated first pass: regex matches are leads for a person to review, not verdicts. Calculators, tables and images need a manual read. Rules and rewrites: docs/LEGAL-AUDIT.md and docs/DISCLAIMERS.md.', '');
  out.push('## Findings', '', '| URL | Element | Exact text | Rule | Risk | Suggested safe rewrite |', '|---|---|---|---|---|---|');
  for (const f of all) out.push(`| ${cell(new URL(f.url).pathname)} | ${f.el} | ${cell(f.text)} | ${f.rule} | ${f.risk} | ${cell(f.fix)} |`);
  out.push('', '## Disclosure check per page (**NO** = missing)', '', '| URL | Top strip | Footer text | "No es asesoramiento" | Privacidad | Cookies | Términos | Metodología | Guide end note | imgs | forms | WhatsApp |', '|---|---|---|---|---|---|---|---|---|---|---|---|');
  const yn = (b) => (b === null ? 'n/a' : b ? 'yes' : '**NO**');
  for (const r of results) {
    if (r.error) { out.push(`| ${cell(r.url)} | fetch error: ${cell(r.error)} |||||||||| |`); continue; }
    const d = r.disclosure, m = r.meta;
    out.push(`| ${cell(new URL(r.url).pathname)} | ${yn(d.topStrip)} | ${yn(d.footer)} | ${yn(d.notAdvice)} | ${yn(d.privacy)} | ${yn(d.cookies)} | ${yn(d.terms)} | ${yn(d.method)} | ${yn(d.guideNote)} | ${m.images} | ${m.forms} | ${m.whatsapp ? '**YES**' : 'no'} |`);
  }
  process.stdout.write(out.join('\n') + '\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
