/* engine/components.mjs — reusable, domain-neutral presentation blocks.
   Every string arrives escaped; no block accepts raw HTML. An unknown block
   type throws (SHARED.md: it must not silently return an empty string).

   Manager scope change (2026-09-13): purely informational site. No contact
   form, consent control, age declaration, recipient block or paid-CTA
   disclosure exists anywhere in this engine. */

import { esc, attr, safeUrl, nl2p, slugifyId } from './escape.mjs';
import { DISCLAIMERS } from './disclaimers.mjs';
import { formatDate } from './blog.mjs';

const PENDING = '(pendiente de completar)';

/** Consent holder shown in the form: the confirmed legal name, else a neutral fallback. */
export function consentHolder(config) {
  const name = config.operator?.holderName || config.operator?.legalName;
  return typeof name === 'string' && name.trim() !== '' ? name.trim() : 'el titular de seguro.com.py';
}

/* ------------------------------------------------------------------ links */

function anchor(href, label, extra = '') {
  const safe = safeUrl(href);
  if (!safe) return esc(label);
  const external = /^https?:\/\//i.test(safe);
  const rel = external ? ' rel="noopener nofollow" target="_blank"' : '';
  return `<a href="${attr(safe)}"${rel}${extra}>${esc(label)}</a>`;
}

/* ----------------------------------------------------------------- header */

export function renderHeader(config, currentPath) {
  const isActive = (href) => href === currentPath;
  const isParentActive = (item) =>
    isActive(item.href) || (item.children || []).some((c) => isActive(c.href));

  const desktop = config.navigation.map((item) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const current = isParentActive(item) ? ' aria-current="page"' : '';
    const children = hasChildren
      ? `<ul class="hdr__dropdown">${item.children
          .map((c) => `<li><a href="${attr(c.href)}"${isActive(c.href) ? ' aria-current="page"' : ''}>${esc(c.label)}</a></li>`)
          .join('')}</ul>`
      : '';
    return `<li class="hdr__nav-item${hasChildren ? ' hdr__nav-item--has-children' : ''}"><a href="${attr(item.href)}"${current}>${esc(item.label)}</a>${children}</li>`;
  }).join('');

  const panel = config.navigation.map((item) => {
    const sub = (item.children || [])
      .map((c) => `<li><a href="${attr(c.href)}"${isActive(c.href) ? ' aria-current="page"' : ''}>${esc(c.label)}</a></li>`)
      .join('');
    return `<li><a href="${attr(item.href)}"${isParentActive(item) ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>${
      sub ? `<li><ul class="hdr__panel-sub">${sub}</ul></li>` : ''}`;
  }).join('');

  const brandParts = config.brand.name.split('.');
  const brandHtml = brandParts.length > 1
    ? `${esc(brandParts[0])}<span>.${esc(brandParts.slice(1).join('.'))}</span>`
    : esc(config.brand.name);

  return `<a class="skip" href="#contenido">Saltar al contenido</a>
<header class="hdr" data-hdr>
  <div class="container hdr__row">
    <a class="hdr__brand" href="/">${brandHtml}</a>
    <nav class="hdr__nav" aria-label="Principal"><ul>${desktop}</ul></nav>
    <button class="hdr__burger" type="button" data-hdr-burger aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir el menú">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
  </div>
  <div class="hdr__panel" id="menu-movil" data-hdr-panel>
    <div class="container"><ul>${panel}</ul></div>
  </div>
</header>`;
}

/* ----------------------------------------------------------------- footer */

/** Identity block: portal name, plus the razón social only once the owner has confirmed it.
    RUC and domicilio are deliberately never rendered (owner decision, 2026-10-01). */
export function renderOperatorBlock(config) {
  const rows = [['Portal', config.brand.name]];
  const legal = config.operator?.legalName;
  if (typeof legal === 'string' && legal.trim() !== '') rows.push(['Razón social', legal.trim()]);
  rows.push(['Contacto', 'Solo por formulario']);
  return `<div class="operator-block" data-operator-block>
  <p class="operator-block__label">Identidad del portal</p>
  <dl class="datalist">
    ${rows.map(([k, v]) => `<div class="datalist__row"><dt>${esc(k)}</dt><dd>${k === 'Contacto' ? `<a href="/contacto/">${esc(v)}</a>` : esc(v)}</dd></div>`).join('')}
  </dl>
</div>`;
}

export function renderTopStrip(config) {
  return `<div class="strip" role="note">${esc(config.notices.topStrip)}</div>`;
}

export function renderFooter(config, buildYear) {
  const groups = config.footer.linkGroups.map((group) => `<div>
      <p class="ftr__label">${esc(group.label)}</p>
      <ul>${group.links.map((l) => `<li><a href="${attr(l.href)}">${esc(l.label)}</a></li>`).join('')}</ul>
    </div>`).join('\n    ');

  return `<footer class="ftr">
  <div class="container">
    <div class="ftr__grid">
      <div>
        <p class="ftr__brand">${esc(config.brand.name)}</p>
        <p class="ftr__muted">${esc(config.footer.tagline)}</p>
      </div>
      ${groups}
    </div>
    <p class="ftr__notice"><strong>${esc(config.notices.footerLead)}</strong> ${esc(config.notices.footer)}</p>
    ${renderOperatorBlock(config)}
    <div class="ftr__base">
      <p>© ${buildYear} ${esc(config.brand.name)}. Versión de textos legales: ${esc(config.footer.legalCopyVersion)}.</p>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------ disclaimers */

export function renderDisclaimer(id) {
  const d = DISCLAIMERS[id];
  if (!d) throw new Error(`Unknown disclaimer ID: ${id}`);
  return `<aside class="notice notice--${attr(id.toLowerCase())}" data-disclaimer="${attr(id)}" role="note">
  <p class="notice__label">${esc(d.label)}</p>
  <p>${esc(d.text)}</p>
</aside>`;
}

export function renderDisclaimerSet(ids) {
  if (!ids.length) return '';
  return `<section class="section section--notices" aria-label="Avisos legales">
  <div class="container notices">${ids.map(renderDisclaimer).join('\n')}</div>
</section>`;
}

/* ---------------------------------------------------------------- blocks */

function prose(block) {
  return `<section class="section${block.narrow === false ? '' : ' section--narrow'}"${block.id ? ` id="${attr(block.id)}"` : ''}>
  <div class="container">
    ${block.eyebrow ? `<p class="eyebrow">${esc(block.eyebrow)}</p>` : ''}
    ${block.heading ? `<h2>${esc(block.heading)}</h2>` : ''}
    ${block.lede ? `<p class="lede">${esc(block.lede)}</p>` : ''}
    ${(block.body || []).map((p) => `<p>${esc(p)}</p>`).join('\n    ')}
  </div>
</section>`;
}

function listBlock(block) {
  return `<section class="section section--narrow">
  <div class="container">
    ${block.heading ? `<h2>${esc(block.heading)}</h2>` : ''}
    ${block.lede ? `<p class="lede">${esc(block.lede)}</p>` : ''}
    <ul class="list">${(block.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
  </div>
</section>`;
}

function linksBlock(block) {
  return `<section class="section section--narrow">
  <div class="container">
    ${block.heading ? `<h2>${esc(block.heading)}</h2>` : ''}
    ${block.lede ? `<p class="lede">${esc(block.lede)}</p>` : ''}
    <ul class="list list--links">${(block.items || [])
      .map((i) => `<li>${anchor(i.href, i.label)}${i.note ? ` — <span class="muted">${esc(i.note)}</span>` : ''}</li>`)
      .join('')}</ul>
  </div>
</section>`;
}

function cardsBlock(block) {
  const cols = block.columns === 2 ? 'grid--2' : 'grid--3';
  const cards = (block.items || []).map((item) => {
    const inner = `${item.eyebrow ? `<p class="eyebrow">${esc(item.eyebrow)}</p>` : ''}
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.text)}</p>
      ${item.href ? `<span class="link">${esc(item.linkLabel || 'Ver más')}</span>` : ''}`;
    const safe = item.href ? safeUrl(item.href) : null;
    return safe ? `<a class="card" href="${attr(safe)}">${inner}</a>` : `<div class="card">${inner}</div>`;
  }).join('\n      ');

  return `<section class="section"${block.id ? ` id="${attr(block.id)}"` : ''}>
  <div class="container">
    ${block.eyebrow ? `<p class="eyebrow">${esc(block.eyebrow)}</p>` : ''}
    ${block.heading ? `<h2>${esc(block.heading)}</h2>` : ''}
    ${block.lede ? `<p class="lede">${esc(block.lede)}</p>` : ''}
    <div class="grid ${cols}">
      ${cards}
    </div>
  </div>
</section>`;
}

function stepsBlock(block) {
  return `<section class="section">
  <div class="container">
    ${block.heading ? `<h2>${esc(block.heading)}</h2>` : ''}
    ${block.lede ? `<p class="lede">${esc(block.lede)}</p>` : ''}
    <ol class="steps">${(block.items || []).map((item, index) => `<li>
      <span class="steps__n">${index + 1}</span>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.text)}</p>
    </li>`).join('')}</ol>
  </div>
</section>`;
}

function compareBlock(block) {
  const head = block.columns.map((c) => `<th scope="col">${esc(c)}</th>`).join('');
  const rows = block.rows.map((row) => `<tr>${row
    .map((cell, index) => (index === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`))
    .join('')}</tr>`).join('\n        ');

  return `<section class="section"${block.id ? ` id="${attr(block.id)}"` : ''}>
  <div class="container">
    ${block.heading ? `<h2>${esc(block.heading)}</h2>` : ''}
    ${block.lede ? `<p class="lede">${esc(block.lede)}</p>` : ''}
    ${renderDisclaimer('M')}
    <div class="table-scroll" tabindex="0" role="region" aria-label="${attr(block.caption || 'Tabla comparativa')}">
      <table class="compare">
        <caption>${esc(block.caption || '')}</caption>
        <thead><tr>${head}</tr></thead>
        <tbody>
        ${rows}
        </tbody>
      </table>
    </div>
    ${block.methodology ? `<p class="table-note">${esc(block.methodology)}</p>` : ''}
    ${block.reviewed ? `<p class="table-note">Fecha de revisión de esta tabla: ${esc(block.reviewed)}.</p>` : ''}
  </div>
</section>`;
}

function faqBlock(block) {
  return `<section class="section section--narrow"${block.id ? ` id="${attr(block.id)}"` : ''}>
  <div class="container">
    <h2>${esc(block.heading || 'Preguntas frecuentes')}</h2>
    <div class="faq">
      ${(block.items || []).map((item) => `<details id="${attr(slugifyId(item.q))}">
        <summary>${esc(item.q)}</summary>
        <p>${esc(item.a)}</p>
      </details>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function sourcesBlock(block) {
  return `<section class="section section--narrow" id="fuentes">
  <div class="container">
    <h2>${esc(block.heading || 'Fuentes')}</h2>
    <ul class="sources">${(block.items || []).map((item) => `<li>
      <span class="sources__claim">${esc(item.claim)}</span>
      ${anchor(item.url, item.label || item.url)}
      <span class="muted">· consultado el ${esc(item.checked)}${item.published ? ` · publicado ${esc(item.published)}` : ''}</span>
    </li>`).join('')}</ul>
  </div>
</section>`;
}

function ctaBandBlock(block) {
  const safe = safeUrl(block.cta.href);
  return `<section class="cta-band">
  <div class="container">
    <div>
      <h2>${esc(block.heading)}</h2>
      <p>${esc(block.text)}</p>
    </div>
    <div class="cta-band__actions">
      ${safe ? `<a class="btn btn--onlight" href="${attr(safe)}">${esc(block.cta.label)}</a>` : ''}
      ${block.secondary ? `<a class="link" href="${attr(safeUrl(block.secondary.href) || '/')}">${esc(block.secondary.label)}</a>` : ''}
    </div>
  </div>
</section>`;
}

/* Contact form. Rendered into a .php page (page.output === 'php'); the handler is
   contacto-alianzas.php (engine/php). Consent box rules (docs/PARTNER-FORM.md): its own
   bordered box directly above the button, unticked, required, one purpose, >= 16 px,
   version shown. */
function contactFormBlock(block, ctx) {
  const { config } = ctx;
  const holder = esc(consentHolder(config));
  const version = attr(config.contact.consentVersion);
  const options = config.contact.types
    .map((t) => `<option value="${attr(t.id)}">${esc(t.label)}</option>`)
    .join('\n      ');
  return `<section class="section section--narrow">
  <div class="container">
<?php
require __DIR__ . '/../../contacto-lib.php';
$cfg = cl_config();
$e = isset($_GET['e']) && is_string($_GET['e']) ? $_GET['e'] : '';
$errors = [
    'campos' => 'Revisá los campos obligatorios: tipo de consulta, nombre, teléfono, correo y mensaje (y organización si sos una empresa o un medio).',
    'expired' => 'La página estuvo abierta demasiado tiempo. Volvé a enviar el mensaje.',
    'server' => 'El formulario no está disponible por el momento. Probá de nuevo más tarde.',
];
if (isset($errors[$e])) { echo '<p class="error" role="alert">' . htmlspecialchars($errors[$e], ENT_QUOTES, 'UTF-8') . '</p>'; }
if ($cfg === null) { echo '<p class="error" role="alert">' . htmlspecialchars($errors['server'], ENT_QUOTES, 'UTF-8') . '</p>'; }
?>
    <p class="box-note"><strong>Este formulario es solo para corregir información del sitio, hacer pedidos sobre tus datos personales y para aseguradoras, corredores, medios, agencias y otros contactos de negocio.</strong> No tramitamos pedidos de seguro ni recibimos datos de personas que buscan un seguro. Si buscás un seguro, mirá <a href="/contacto/busco-un-seguro/">qué hacer</a>.</p>
<?php if ($cfg !== null): ?>
    <form class="form" method="post" action="/contacto-alianzas.php" id="contact-form">
      <p><label for="tipo">Tipo de consulta</label>
      <select id="tipo" name="tipo" required>
      <option value="">Elegí una opción</option>
      ${options}
      </select></p>
      <p><label for="nombre">Nombre y apellido</label>
      <input id="nombre" name="nombre" type="text" required maxlength="120" autocomplete="name"></p>
      <p><label for="organizacion">Organización (obligatoria si sos aseguradora, corredor, medio o agencia)</label>
      <input id="organizacion" name="organizacion" type="text" maxlength="120" autocomplete="organization"></p>
      <p><label for="cargo">Cargo (opcional)</label>
      <input id="cargo" name="cargo" type="text" maxlength="120" autocomplete="organization-title"></p>
      <p><label for="telefono">Teléfono o WhatsApp</label>
      <input id="telefono" name="telefono" type="tel" required maxlength="30" autocomplete="tel" placeholder="0981 123 456"></p>
      <p><label for="email">Correo electrónico</label>
      <input id="email" name="email" type="email" required maxlength="160" autocomplete="email"></p>
      <p><label for="mensaje">Mensaje</label>
      <textarea id="mensaje" name="mensaje" required maxlength="1000" rows="6"></textarea>
      <span class="help">Máximo 1.000 caracteres. No incluyas datos de salud, cédula, datos de tu póliza ni datos personales de otras personas.</span></p>
      <div class="hp" aria-hidden="true"><label>No completar este campo <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
      <input type="hidden" name="t" value="<?php echo htmlspecialchars(cl_token($cfg), ENT_QUOTES, 'UTF-8'); ?>">
      <fieldset class="consent-box">
        <legend>Qué hacemos con tus datos</legend>
        <ul>
          <li>Los usamos solo para responder a este mensaje.</li>
          <li>Los ve ${holder} y nuestros proveedores de gestión de contactos (VenderCRM) y de correo electrónico.</li>
          <li>No los vendemos ni los compartimos con aseguradoras, corredores ni bancos.</li>
          <li>Podés pedir que los borremos cuando quieras: usá este mismo formulario, tipo "Pedido sobre mis datos personales".</li>
        </ul>
        <label class="consent" for="consent"><input id="consent" type="checkbox" name="consent" value="${version}" required> <span>Sí, acepto que ${holder} guarde estos datos y me contacte por teléfono, WhatsApp o e-mail <strong>solo para responder a este mensaje</strong>.</span></label>
        <p class="small">Leé la <a href="/privacidad/">Política de privacidad</a>. (Texto ${version})</p>
        <p class="error" id="consent-msg" role="alert"<?php echo $e === 'consent' ? '' : ' hidden'; ?>>Para enviar el mensaje necesitamos tu autorización.</p>
      </fieldset>
      <p><button type="submit" id="send" class="btn btn--primary">Enviar mensaje</button></p>
    </form>
    <script src="/assets/js/form.js" defer></script>
<?php endif; ?>
  </div>
</section>`;
}

function postListBlock(block) {
  return `<section class="section">
  <div class="container">
    ${block.heading ? `<h2>${esc(block.heading)}</h2>` : ''}
    ${block.lede ? `<p class="lede">${esc(block.lede)}</p>` : ''}
    ${block.items.length === 0 ? '<p>Todavía no hay artículos publicados en esta categoría.</p>' : ''}
    <div class="grid grid--3">
      ${block.items.map((post) => `<a class="card card--post" href="${attr(post.url)}">
        <p class="eyebrow">${esc(post.categoryLabel)}</p>
        <h3>${esc(post.title)}</h3>
        <p>${esc(post.description)}</p>
        <p class="card__meta"><time datetime="${attr(post.date)}">${esc(post.dateLabel)}</time></p>
      </a>`).join('\n      ')}
    </div>
    ${block.pagination || ''}
  </div>
</section>`;
}

function glossaryBlock(block) {
  return `<section class="section section--narrow">
  <div class="container">
    ${block.heading ? `<h2>${esc(block.heading)}</h2>` : ''}
    <dl class="glossary">
      ${block.items.map((t) => `<div class="glossary__row" id="${attr(slugifyId(t.term))}">
        <dt>${esc(t.term)}</dt><dd>${esc(t.definition)}</dd>
      </div>`).join('\n      ')}
    </dl>
  </div>
</section>`;
}

function noteBlock(block) {
  return `<section class="section section--narrow">
  <div class="container">
    <aside class="notice notice--info" role="note">
      ${block.heading ? `<p class="notice__label">${esc(block.heading)}</p>` : ''}
      ${nl2p(block.body)}
    </aside>
  </div>
</section>`;
}

const BLOCKS = {
  prose,
  list: listBlock,
  links: linksBlock,
  cards: cardsBlock,
  steps: stepsBlock,
  compare: compareBlock,
  faq: faqBlock,
  sources: sourcesBlock,
  ctaBand: ctaBandBlock,
  contactForm: contactFormBlock,
  postList: postListBlock,
  glossary: glossaryBlock,
  note: noteBlock
};

export function renderBlock(block, ctx) {
  const fn = BLOCKS[block.type];
  if (!fn) throw new Error(`Unknown block type: ${block.type} on ${ctx.page?.slug}`);
  return fn(block, ctx);
}

/* -------------------------------------------------------------- hero + crumbs */

export function renderHero(page) {
  const cta = page.cta;
  const safe = cta ? safeUrl(cta.href) : null;
  return `<section class="hero">
  <div class="container hero__row">
    <div class="hero__text">
      ${page.eyebrow ? `<p class="eyebrow">${esc(page.eyebrow)}</p>` : ''}
      <h1>${esc(page.h1)}</h1>
      <p class="hero__sub">${esc(page.summary)}</p>
      ${safe ? `<div class="hero__actions"><a class="btn btn--primary" href="${attr(safe)}">${esc(cta.label)}</a>
        ${page.secondaryCta ? `<a class="btn btn--ghost" href="${attr(safeUrl(page.secondaryCta.href) || '/')}">${esc(page.secondaryCta.label)}</a>` : ''}</div>` : ''}
    </div>
  </div>
</section>`;
}

export function renderBreadcrumbs(trail) {
  if (trail.length < 2) return '';
  return `<nav class="crumbs" aria-label="Ruta de navegación">
  <div class="container">
    <ol>${trail.map((entry, index) => (index === trail.length - 1
      ? `<li><span aria-current="page">${esc(entry.label)}</span></li>`
      : `<li><a href="${attr(entry.path)}">${esc(entry.label)}</a></li>`)).join('')}</ol>
  </div>
</nav>`;
}

/* ------------------------------------------------------------- page end */

/** "Actualizada el [fecha]" + the standard end note (docs/DISCLAIMERS.md §5). The note text lives
    once in site.config.mjs (notices.guideEnd). The correction channel is the contact form. */
export function renderPageEnd(config, page) {
  if (!page.updated) return '';
  return `<section class="section section--narrow page-end">
  <div class="container">
    <p class="page-end__date">Actualizada el <time datetime="${attr(page.updated)}">${esc(formatDate(page.updated, config.locale))}</time>.</p>
    <p>${esc(config.notices.guideEnd)} <a href="/contacto/mensaje/">Escribinos desde el formulario de contacto</a>.</p>
  </div>
</section>`;
}
