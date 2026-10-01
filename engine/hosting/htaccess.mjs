/* engine/hosting/htaccess.mjs — config-derived Apache/LiteSpeed rules.
   Adapted from tasacion-com-py/.htaccess: the access-denial intent and the
   real 404 behaviour are kept; every tasacion-specific redirect (servicios,
   zonas, cotizador, guias) and the tasacion domain are gone. */

/** redirects.txt: one `/old/ /new/` pair per line, `#` comments allowed. */
export function parseRedirects(text) {
  const rows = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const [from, to, extra] = line.split(/\s+/);
    if (!from || !to || extra || !from.startsWith('/') || !to.startsWith('/')) throw new Error(`Bad redirects.txt line: ${raw}`);
    rows.push({ from, to });
  }
  return rows;
}

export function buildHtaccess(config, redirects = []) {
  const domain = config.domain;
  return `# ${domain} — hardening and canonical host.
# Output-only packaging is the primary protection; these rules are defence in depth.

ErrorDocument 404 /404.html
DirectoryIndex index.html index.php

Options -Indexes

RewriteEngine On

# www -> bare domain, HTTPS.
RewriteCond %{HTTP_HOST} ^www\\.${domain.replace(/\./g, '\\.')}$ [NC]
RewriteRule ^(.*)$ https://${domain}/$1 [L,R=301]

# Never serve dotfiles or version-control / tool directories.
RedirectMatch 404 ^/\\.git(/|$)
RedirectMatch 404 ^/\\.github(/|$)
RedirectMatch 404 ^/\\.claude(/|$)
RedirectMatch 404 ^/\\.codex(/|$)
RedirectMatch 404 ^/\\.agents(/|$)
RedirectMatch 404 ^/\\.gitignore$
RedirectMatch 404 ^/\\.htaccess$
RedirectMatch 404 ^/\\.env(\\..*)?$

# Keep hosting verification working.
RewriteRule ^\\.well-known/ - [L]

# Repository sources, docs and tooling are not part of the public site.
RedirectMatch 404 ^/engine(/|$)
RedirectMatch 404 ^/sites(/|$)
RedirectMatch 404 ^/deploy(/|$)
RedirectMatch 404 ^/docs(/|$)
RedirectMatch 404 ^/prompts(/|$)
RedirectMatch 404 ^/research(/|$)
RedirectMatch 404 ^/tests(/|$)
RedirectMatch 404 ^/scripts(/|$)
RedirectMatch 404 ^/node_modules(/|$)
RedirectMatch 404 ^/package(-lock)?\\.json$
RedirectMatch 404 ^/.*\\.(mjs|md|log|bak|sql|zip)$
RedirectMatch 404 ^/redirects\\.txt$

# Contact form: only the handler and the form page may run PHP. config.php (uploaded by hand),
# its example, the helper library and the rate-limit storage are never reachable from the web.
RedirectMatch 404 ^/storage(/|$)
RedirectMatch 404 ^/config(\\.example)?\\.php$
RedirectMatch 404 ^/contacto-lib\\.php$
RewriteCond %{REQUEST_URI} !^/contacto-alianzas\\.php$
RewriteCond %{REQUEST_URI} !^/contacto/mensaje/(index\\.php)?$
RewriteRule \\.php$ - [R=404,L]

# Permanent redirects (from redirects.txt). Removed pages go to the closest safe page, never to a 404.
${redirects.map((r) => `RedirectMatch 301 ^${r.from.replace(/[.*+?^$()|[\]\\]/g, '\\\\$&').replace(/\/$/, '/?')}$ ${r.to}`).join('\n')}

<IfModule mod_headers.c>
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  <FilesMatch "\\.php$">
    Header set Cache-Control "no-store"
  </FilesMatch>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"

  # Short revalidation for HTML; assets are content-hash versioned by the build.
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=300, must-revalidate"
  </FilesMatch>
  <FilesMatch "\\.(css|js)$">
    Header set Cache-Control "public, max-age=600, must-revalidate"
  </FilesMatch>
  <FilesMatch "\\.(woff2|avif|webp|jpg|png|svg)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
</IfModule>
`;
}

export function buildFavicon(config) {
  const primary = config.theme.primary;
  const accent = config.theme.accent;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${config.brand.shortName}">
  <rect width="64" height="64" rx="12" fill="${primary}"/>
  <path d="M32 12 51 20v13c0 11.5-7.8 17.9-19 21-11.2-3.1-19-9.5-19-21V20z" fill="none" stroke="${accent}" stroke-width="4" stroke-linejoin="round"/>
</svg>
`;
}

/** Per-site design tokens generated from config.theme. */
export function buildTokensCss(config) {
  const { primary, accent, background, text } = config.theme;
  return `/* assets/css/tokens.css — generated from sites/${config.id}/site.config.mjs theme.
   Do not edit by hand; change the theme in the site config and rebuild. */
:root {
  --primary: ${primary};
  --primary-deep: color-mix(in srgb, ${primary} 82%, #000000);
  --primary-tint: color-mix(in srgb, ${primary} 10%, #ffffff);
  --accent: ${accent};
  --accent-deep: color-mix(in srgb, ${accent} 78%, #000000);
  --accent-tint: color-mix(in srgb, ${accent} 12%, #ffffff);
  --base: ${background};
  --surface: #FFFFFF;
  --ink: ${text};
  --ink-muted: color-mix(in srgb, ${text} 62%, ${background});
  --hairline: color-mix(in srgb, ${text} 12%, ${background});
  --hairline-strong: color-mix(in srgb, ${text} 26%, ${background});
  --on-dark: ${background};
  --on-dark-muted: color-mix(in srgb, ${background} 74%, ${text});
  --hairline-dark: color-mix(in srgb, ${background} 18%, transparent);
}
`;
}
