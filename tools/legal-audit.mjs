#!/usr/bin/env node
// Read-only legal copy audit for seguro.com.py (docs/LEGAL-AUDIT.md §1).
// Fetches every URL in the sitemap, extracts visible text per element and
// flags wording that could read as insurance intermediation or advice
// (Ley 827/96), misleading/comparative advertising (Ley 1334/98) or missing
// provider disclosure (Ley 4868/2013). It never writes to the site.
//
// Usage (Node 18+, no dependencies):
//   node tools/legal-audit.mjs [sitemapUrl] > docs/LEGAL-AUDIT-live.md
// Default sitemap: https://seguro.com.py/sitemap.xml
// Also works against a local build: node tools/legal-audit.mjs http://localhost:8080/sitemap.xml

const SITEMAP = process.argv[2] || 'https://seguro.com.py/sitemap.xml';
const UA = 'seguro-legal-audit/1.0 (read-only)';

// Matching runs on lowercased, accent-stripped text, so write patterns without accents.
const RULES = [
  // HIGH — reads as advice, recommendation, intermediation or a binding price
  { id: 'best', risk: 'high', re: /\b(el|la|los|las) mejor(es)? (seguro|aseguradora|cobertura|opcion|plan|prepaga|poliza|precio)s?\b/, fix: 'Remove the superlative. "Información para comparar coberturas de aseguradoras habilitadas."' },
  { id: 'advice', risk: 'high', re: /\b(te |le )?(recomendamos|aconsejamos|asesoramos|sugerimos)\b|\bnuestra recomendacion\b|\bnuestros? (expertos?|asesores?)\b|\basesoramiento\b|\basesor(a|es)? (gratis|gratuito|personal)/, fix: '"Un corredor matriculado ante la Superintendencia de Seguros puede asesorarte. Nosotros no asesoramos."' },
  { id: 'personalized', risk: 'high', re: /\b(ideal|perfecto|justo|indicado) para (vos|ti|usted|tu familia)\b|\b(elegimos|encontramos|buscamos) (por vos|el seguro|tu seguro|la mejor)\b|\bel que (mas )?te conviene\b|\ba tu medida\b/, fix: '"Conocé los tipos de cobertura y consultá con un corredor habilitado cuál corresponde a tu caso."' },
  { id: 'price', risk: 'high', re: /(₲|\bgs\.?|\bpyg|\bus\$|\busd)\s?[\d.,]{3,}|\bdesde\s+(₲|gs|us\$|usd)|\bprima (de|desde|mensual)\b|\b\d[\d.,]*\s?(por mes|\/mes|mensuales)\b/, fix: 'Delete the figure, or show only a partner-issued range labelled "referencial, no vinculante; la prima la define la aseguradora" with source and date.' },
  { id: 'guarantee', risk: 'high', re: /\bgarantiz(a|amos|ado|ada)\b|\bcobertura (total|completa|garantizada)\b|\bcubre todo\b|\b100 ?% cubierto\b|\bsin letra chica\b|\baprobacion (segura|garantizada|inmediata)\b/, fix: '"Las coberturas, exclusiones y condiciones las define cada aseguradora en su póliza."' },
  { id: 'sale', risk: 'high', re: /\bcontrata(lo|la)? (ya|ahora|aqui|aca|online|en linea|hoy)\b|\bcompra (tu|el) seguro\b|\bemit(imos|e) (tu |la |su )?poliza\b|\btu poliza en (minutos|el dia|\d+)\b|\bte cotizamos\b|\bcotizamos (tu|el|por vos)\b|\bcotizacion (oficial|exacta|final|vinculante)\b|\bgestionamos (tu|el) (siniestro|reclamo|seguro)\b/, fix: '"Dejá tus datos y un corredor habilitado te contacta con cotizaciones de las aseguradoras."' },
  // MEDIUM — rankings, urgency, savings claims, implied quoting by us
  { id: 'ranking', risk: 'medium', re: /\btop ?\d+\b|\branking\b|\b(numero|#) ?1\b|\blas \d+ mejores\b|\bmas (barato|economico|confiable|recomendad)|\bprecio mas bajo\b|\bmejor precio\b/, fix: 'Neutral, alphabetical list of SIS-authorised insurers with a link to the SIS registry; no order implying merit.' },
  { id: 'saving', risk: 'medium', re: /\bahorr(a|as|e) (hasta )?\d+ ?%|\bahorr(a|as|e) hasta\b|\bpaga menos\b|\bel mas barato\b/, fix: 'Remove unless backed by a dated, sourced calculation approved by the partner.' },
  { id: 'urgency', risk: 'medium', re: /\bhoy mismo\b|\bultimos? (dias|cupos|lugares)\b|\bpor tiempo limitado\b|\boferta\b|\bno esperes\b|\bya mismo\b|\bantes de que (sea tarde|suba)\b|\bsolo por hoy\b/, fix: 'Drop the urgency. "Consultá cuando quieras; no hay costo por pedir contacto."' },
  { id: 'quote-cta', risk: 'medium', re: /\bcotiza(r|lo|la)?\b(?! con)|\bcotiza (gratis|ahora|en \d)|\bobtene tu cotizacion\b|\bcompara precios\b/, fix: '"Pedí que te contacte un corredor habilitado" / "Recibí cotizaciones de corredores habilitados".' },
  { id: 'coverage-claim', risk: 'medium', re: /\bsin (examenes medicos|carencia|requisitos|franquicia|deducible)\b|\bcubre (desde el primer dia|preexistencias)\b|\bincluye (grua|auxilio|cobertura)\b/, fix: 'Say which insurer/plan the statement comes from, or rephrase as "algunos planes pueden incluir… según la póliza".' },
  { id: 'free-advice', risk: 'medium', re: /\bconsulta gratis\b|\basesoria gratis\b|\bayuda gratis\b/, fix: '"Pedir contacto no tiene costo. El asesoramiento lo brinda el corredor habilitado."' },
  // LOW — acceptable with context, but review
  { id: 'expert', risk: 'low', re: /\bexpert(o|os|a|as)\b|\bespecialistas?\b/, fix: 'Attribute expertise to the licensed partner, not seguro.com.py.' },
  { id: 'compare', risk: 'low', re: /\bcompara(r|dor)?\b/, fix: 'OK if what is compared is objective public information; do not compare prices we generated.' },
];

// Multi-word or distinctive names only: generic words ("garantia", "patria", "regional")
// would flag ordinary sentences. Extend from the SIS list of authorised insurers.
const INSURERS = ['mapfre', 'sancor', 'la consolidada', 'aseguradora del este', 'aesa', 'yacyreta', 'tajy', 'seguros patria', 'royal seguros', 'itau seguros', 'alianza garantia', 'aseguradora paraguaya', 'asepasa', 'fenix seguros', 'cenit seguros', 'la rural', 'la independencia', 'intercontinental', 'rumbos', 'panal', 'mundo seguros', 'la meridional', 'seguridad seguros', 'santa clara', 'migone', 'asismed', 'mediplus', 'proteccion medica', 'assist card', 'universal assistance', 'travel ace', 'coris'];
const ENDORSE = /\b(mejor|recomend|confiable|lider|top|numero 1|preferid|elegid|socio oficial|partner oficial|aliado oficial)/;

const DISCLOSURE = {
  whoWeAre: /\bruc\b|razon social|sobre nosotros|quienes somos/,
  notBroker: /no somos (una |un )?(aseguradora|agentes?|corredor|intermediari)|no intermediamos|no (brindamos|damos|ofrecemos) asesoramiento|servicio de publicidad/,
  sis: /superintendencia de seguros/,
  officialChannels: /canales? oficial|sitio oficial|contacto oficial|registro de (aseguradoras|auxiliares)/,
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

// Visible text blocks with the element they came from.
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

function sentences(text) {
  // Split only before a capital letter so 'Gs. 150.000' stays in one sentence.
  return text.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/).filter(Boolean);
}

function audit(url, html) {
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
      for (const r of RULES) if (r.re.test(n)) add(el, s.slice(0, 300), r.id, r.risk, r.fix);
      const named = INSURERS.filter((i) => new RegExp(`\\b${i}\\b`).test(n));
      if (named.length) {
        const endorsed = ENDORSE.test(n);
        add(el, s.slice(0, 300), `insurer-name:${named.join(',')}`, endorsed ? 'high' : 'low',
          endorsed ? 'Remove endorsement wording next to an insurer name; neutral factual mention only, plus "Marca de su titular. seguro.com.py no está afiliado ni habla en nombre de la aseguradora."' : 'Nominative use only: factual, neutral, link to the insurer\'s official site, trademark notice.');
      }
    }
    if (el === 'json-ld') {
      if (/InsuranceAgency/.test(text)) add(el, 'JSON-LD @type InsuranceAgency', 'schema-agency', 'high', 'Use Organization/WebSite. InsuranceAgency tells Google we are an insurance agency.');
      if (/AggregateRating|"Review"/.test(text)) add(el, 'JSON-LD AggregateRating/Review', 'schema-rating', 'medium', 'Only with genuine, verifiable reviews of seguro.com.py itself — never of insurers.');
      if (/"(Offer|price|priceRange|lowPrice)"/.test(text)) add(el, 'JSON-LD Offer/price', 'schema-price', 'high', 'Remove price markup; we do not sell or price policies.');
    }
  }
  const n = norm(clean(html));
  const imgs = html.match(/<img\b/gi) || [];
  const logoImgs = [...html.matchAll(/<img\b[^>]*>/gi)].filter((m) => INSURERS.some((i) => norm(m[0]).includes(i.replace(/ /g, '')) || norm(m[0]).includes(i.replace(/ /g, '-'))));
  for (const m of logoImgs) add('img', m[0].slice(0, 200), 'insurer-logo', 'high', 'Remove insurer logos unless a written brand-use licence exists (lawyer Q).');
  const disclosure = Object.fromEntries(Object.entries(DISCLOSURE).map(([k, re]) => [k, re.test(n)]));
  disclosure.privacyLink = /href=["'][^"']*privacidad/i.test(html);
  disclosure.termsLink = /href=["'][^"']*(terminos|condiciones)/i.test(html);
  const meta = {
    images: imgs.length,
    forms: (html.match(/<form\b/gi) || []).length,
    whatsapp: /wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(html),
    tel: /href=["']tel:/i.test(html),
  };
  return { findings, disclosure, meta };
}

const RISK_ORDER = { high: 0, medium: 1, low: 2 };

async function main() {
  const urls = [...new Set(await sitemapUrls(SITEMAP))];
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
  out.push(`# Live-site legal copy audit — generated ${new Date().toISOString()}`, '');
  out.push(`Sitemap: ${SITEMAP} · URLs: ${urls.length} · findings: ${all.length} (high ${count('high')}, medium ${count('medium')}, low ${count('low')})`, '');
  out.push('Automated first pass. A person still reads every page: regexes miss meaning and context. Rules and rewrites: docs/LEGAL-AUDIT.md.', '');
  out.push('## Findings', '', '| URL | Element | Exact text | Rule | Risk | Suggested safe rewrite |', '|---|---|---|---|---|---|');
  for (const f of all) out.push(`| ${cell(new URL(f.url).pathname)} | ${f.el} | ${cell(f.text)} | ${f.rule} | ${f.risk} | ${cell(f.fix)} |`);
  out.push('', '## Disclosure check per page', '', '| URL | Who we are (RUC/razón social) | "No somos aseguradora/corredor" | Mentions SIS | Official channels | /privacidad link | /terminos link | imgs | forms | WhatsApp | tel |', '|---|---|---|---|---|---|---|---|---|---|---|');
  const yn = (b) => (b ? 'yes' : '**NO**');
  for (const r of results) {
    if (r.error) { out.push(`| ${cell(r.url)} | fetch error: ${cell(r.error)} ||||||||||`); continue; }
    const d = r.disclosure, m = r.meta;
    out.push(`| ${cell(new URL(r.url).pathname)} | ${yn(d.whoWeAre)} | ${yn(d.notBroker)} | ${yn(d.sis)} | ${yn(d.officialChannels)} | ${yn(d.privacyLink)} | ${yn(d.termsLink)} | ${m.images} | ${m.forms} | ${m.whatsapp ? 'yes' : 'no'} | ${m.tel ? 'yes' : 'no'} |`);
  }
  process.stdout.write(out.join('\n') + '\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
