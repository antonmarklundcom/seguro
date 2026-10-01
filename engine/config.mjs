/* engine/config.mjs — validate site identity, routing and feature contracts.
   Public configuration is build input, never a credential store.

   Manager scope change (2026-09-13): purely informational site. There is no
   lead capture, so the crm and lead contracts are gone and the operator
   identity is reduced to a monitored email address. */

const ALLOWED_SITE_IDS = new Set(['seguro', 'prestamo', 'fixture-a', 'fixture-b']);

const TOP_LEVEL_KEYS = new Set([
  'id', 'domain', 'origin', 'locale', 'brand', 'theme', 'operator', 'navigation',
  'footer', 'notices', 'contact', 'analytics', 'ads', 'blog', 'images', 'legal', 'seo', 'build'
]);

/* Company details stay null until the owner confirms them. No e-mail field exists on purpose:
   the site publishes no e-mail address anywhere (contact is a form only). */
export const OPERATOR_FIELDS = ['holderName', 'legalName', 'ruc', 'address'];

const PLACEHOLDER_TOKENS = ['lorem', 'placeholder', 'ejemplo.com', 'example.com', 'tbd'];

const HEX = /^#[0-9a-fA-F]{6}$/;

function fail(errors, message) { errors.push(message); }

/**
 * Validate a loaded site config. Throws on structural errors.
 * Returns { config, operatorWarnings }: an empty operator.email is a WARNING,
 * never a hard failure, so Anton can build before filling it in.
 */
export function validateConfig(raw, expectedSiteId) {
  const errors = [];
  if (!raw || typeof raw !== 'object') throw new Error('site.config.mjs must export a default object');

  for (const key of Object.keys(raw)) {
    if (!TOP_LEVEL_KEYS.has(key)) fail(errors, `Unexpected config key: ${key}`);
  }

  if (!ALLOWED_SITE_IDS.has(raw.id)) fail(errors, `config.id is not allowlisted: ${raw.id}`);
  if (expectedSiteId && raw.id !== expectedSiteId) {
    fail(errors, `config.id (${raw.id}) does not match --site=${expectedSiteId}`);
  }
  if (typeof raw.domain !== 'string' || !/^[a-z0-9.-]+\.[a-z.]{2,}$/.test(raw.domain)) {
    fail(errors, `config.domain is not a bare domain: ${raw.domain}`);
  }
  if (raw.origin !== `https://${raw.domain}`) fail(errors, `config.origin must be https://${raw.domain}`);
  if (raw.locale !== 'es-PY') fail(errors, 'config.locale must be es-PY');

  if (!raw.brand || typeof raw.brand.name !== 'string' || raw.brand.name.trim() === '') {
    fail(errors, 'config.brand.name is required');
  }

  for (const token of ['primary', 'accent', 'background', 'text']) {
    if (!HEX.test(raw.theme?.[token] || '')) fail(errors, `config.theme.${token} must be a #rrggbb color`);
  }

  if (!raw.operator || typeof raw.operator !== 'object') fail(errors, 'config.operator is required');
  else {
    for (const key of Object.keys(raw.operator)) {
      if (!OPERATOR_FIELDS.includes(key)) fail(errors, `Unexpected config.operator key: ${key} (no e-mail field is allowed)`);
    }
    for (const field of OPERATOR_FIELDS) {
      if (!(field in raw.operator)) fail(errors, `config.operator.${field} must exist (null until confirmed)`);
      else if (raw.operator[field] !== null && typeof raw.operator[field] !== 'string') fail(errors, `config.operator.${field} must be null or a string`);
    }
  }

  for (const key of ['topStrip', 'footerLead', 'footer']) {
    if (typeof raw.notices?.[key] !== 'string' || raw.notices[key].trim() === '') fail(errors, `config.notices.${key} is required`);
  }
  if (!raw.contact || typeof raw.contact.consentVersion !== 'string' || !Array.isArray(raw.contact.types) || raw.contact.types.length === 0) {
    fail(errors, 'config.contact needs consentVersion and a non-empty types list');
  }

  if (!Array.isArray(raw.navigation) || raw.navigation.length === 0) fail(errors, 'config.navigation must be a non-empty array');
  else {
    for (const item of raw.navigation) {
      if (typeof item.label !== 'string' || typeof item.href !== 'string') fail(errors, 'navigation entries need label and href');
      else if (!item.href.startsWith('/')) fail(errors, `navigation href must be internal: ${item.href}`);
      for (const child of item.children || []) {
        if (!child.href?.startsWith('/')) fail(errors, `navigation child href must be internal: ${child.href}`);
      }
    }
  }

  if (raw.analytics?.enabled === true && !raw.analytics.publicId) {
    fail(errors, 'analytics.enabled requires analytics.publicId');
  }
  if (raw.ads?.enabled === true && raw.ads.blogOnly !== true) {
    fail(errors, 'ads may only ever be enabled with blogOnly: true');
  }

  if (!Array.isArray(raw.blog?.categories) || raw.blog.categories.length === 0) {
    fail(errors, 'config.blog.categories must be a non-empty array');
  }
  if (!Number.isInteger(raw.blog?.pageSize) || raw.blog.pageSize < 1) {
    fail(errors, 'config.blog.pageSize must be a positive integer');
  }

  if (raw.build?.outputDomain !== raw.domain) fail(errors, 'build.outputDomain must equal domain');
  if (/[\\/]|\.\./.test(String(raw.build?.outputDomain || ''))) {
    fail(errors, 'build.outputDomain must not contain path separators');
  }

  if (errors.length) throw new Error(`Invalid site config:\n  - ${errors.join('\n  - ')}`);

  return { config: raw, operatorWarnings: operatorGaps(raw) };
}

/** Operator fields still null. Informational only: they are not published yet. */
export function operatorGaps(config) {
  return OPERATOR_FIELDS.filter((field) => {
    const value = config.operator?.[field];
    return typeof value !== 'string' || value.trim() === '';
  });
}
