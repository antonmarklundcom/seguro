<!doctype html>
<html lang="es-PY">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Escribinos | Seguro.com.py</title>
  <meta name="description" content="Formulario de contacto: correcciones, pedidos sobre tus datos y mensajes de aseguradoras, corredores, medios y agencias." />
  <link rel="canonical" href="https://seguro.com.py/contacto/mensaje/" />
  <meta name="robots" content="noindex,follow" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Seguro.com.py" />
  <meta property="og:locale" content="es_PY" />
  <meta property="og:title" content="Escribinos | Seguro.com.py" />
  <meta property="og:description" content="Formulario de contacto: correcciones, pedidos sobre tus datos y mensajes de aseguradoras, corredores, medios y agencias." />
  <meta property="og:url" content="https://seguro.com.py/contacto/mensaje/" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preload" href="/assets/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/assets/fonts/fonts.css?v=87e4c19108" />
  <link rel="stylesheet" href="/assets/css/tokens.css?v=87e4c19108" />
  <link rel="stylesheet" href="/assets/css/site.css?v=87e4c19108" />
  <link rel="alternate" type="application/rss+xml" title="Seguro.com.py — artículos" href="/rss.xml" />
  <script type="application/ld+json">{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://seguro.com.py/#website",
      "url": "https://seguro.com.py/",
      "name": "Seguro.com.py",
      "inLanguage": "es-PY",
      "publisher": {
        "@id": "https://seguro.com.py/#organizacion"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://seguro.com.py/#organizacion",
      "name": "Seguro.com.py",
      "url": "https://seguro.com.py/"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://seguro.com.py/contacto/mensaje/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": "https://seguro.com.py/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contacto",
          "item": "https://seguro.com.py/contacto/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Formulario",
          "item": "https://seguro.com.py/contacto/mensaje/"
        }
      ]
    }
  ]
}</script>
</head>
<body class="page page--utility">
<div class="strip" role="note">Sitio informativo. No vendemos seguros ni somos una aseguradora.</div>
<a class="skip" href="#contenido">Saltar al contenido</a>
<header class="hdr" data-hdr>
  <div class="container hdr__row">
    <a class="hdr__brand" href="/">Seguro<span>.com.py</span></a>
    <nav class="hdr__nav" aria-label="Principal"><ul><li class="hdr__nav-item hdr__nav-item--has-children"><a href="/autos/">Autos</a><ul class="hdr__dropdown"><li><a href="/autos/cotizar/">Datos para una propuesta</a></li></ul></li><li class="hdr__nav-item"><a href="/salud/">Salud</a></li><li class="hdr__nav-item"><a href="/aseguradoras/">Verificar aseguradoras</a></li><li class="hdr__nav-item"><a href="/preguntas-frecuentes/">Preguntas frecuentes</a></li><li class="hdr__nav-item"><a href="/blog/">Blog</a></li></ul></nav>
    <button class="hdr__burger" type="button" data-hdr-burger aria-expanded="false" aria-controls="menu-movil" aria-label="Abrir el menú">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
  </div>
  <div class="hdr__panel" id="menu-movil" data-hdr-panel>
    <div class="container"><ul><li><a href="/autos/">Autos</a></li><li><ul class="hdr__panel-sub"><li><a href="/autos/cotizar/">Datos para una propuesta</a></li></ul></li><li><a href="/salud/">Salud</a></li><li><a href="/aseguradoras/">Verificar aseguradoras</a></li><li><a href="/preguntas-frecuentes/">Preguntas frecuentes</a></li><li><a href="/blog/">Blog</a></li></ul></div>
  </div>
</header>
<nav class="crumbs" aria-label="Ruta de navegación">
  <div class="container">
    <ol><li><a href="/">Inicio</a></li><li><a href="/contacto/">Contacto</a></li><li><span aria-current="page">Formulario</span></li></ol>
  </div>
</nav>
<main id="contenido">
<section class="hero">
  <div class="container hero__row">
    <div class="hero__text">
      <p class="eyebrow">Formulario de contacto</p>
      <h1>Escribinos</h1>
      <p class="hero__sub">Para correcciones, pedidos sobre tus datos personales y mensajes de aseguradoras, corredores, medios y agencias.</p>
      
    </div>
  </div>
</section>
<section class="section section--narrow">
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
      <option value="correccion">Quiero corregir un dato del sitio</option>
      <option value="datos">Pedido sobre mis datos personales</option>
      <option value="aseguradora">Soy una aseguradora</option>
      <option value="corredor">Soy corredor o agente de seguros</option>
      <option value="medio">Soy un medio de comunicación</option>
      <option value="agencia">Soy una agencia o proveedor</option>
      <option value="otro">Otro</option>
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
          <li>Los ve Anton Marklund y nuestros proveedores de gestión de contactos (VenderCRM) y de correo electrónico.</li>
          <li>No los vendemos ni los compartimos con aseguradoras, corredores ni bancos.</li>
          <li>Podés pedir que los borremos cuando quieras: usá este mismo formulario, tipo "Pedido sobre mis datos personales".</li>
        </ul>
        <label class="consent" for="consent"><input id="consent" type="checkbox" name="consent" value="v1.0" required> <span>Sí, acepto que Anton Marklund guarde estos datos y me contacte por teléfono, WhatsApp o e-mail <strong>solo para responder a este mensaje</strong>.</span></label>
        <p class="small">Leé la <a href="/privacidad/">Política de privacidad</a>. (Texto v1.0)</p>
        <p class="error" id="consent-msg" role="alert"<?php echo $e === 'consent' ? '' : ' hidden'; ?>>Para enviar el mensaje necesitamos tu autorización.</p>
      </fieldset>
      <p><button type="submit" id="send" class="btn btn--primary">Enviar mensaje</button></p>
    </form>
    <script src="/assets/js/form.js" defer></script>
<?php endif; ?>
  </div>
</section>

<section class="section section--notices" aria-label="Avisos legales">
  <div class="container notices"><aside class="notice notice--p" data-disclaimer="P" role="note">
  <p class="notice__label">Alcance del portal</p>
  <p>Información general: no es asesoramiento. Este portal no emite ofertas ni evalúa tu elegibilidad. Para decidir, consultá las condiciones directamente con el proveedor o con un corredor registrado.</p>
</aside></div>
</section>
</main>
<footer class="ftr">
  <div class="container">
    <div class="ftr__grid">
      <div>
        <p class="ftr__brand">Seguro.com.py</p>
        <p class="ftr__muted">Guías y criterios para entender los seguros en Paraguay.</p>
      </div>
      <div>
      <p class="ftr__label">Contenido</p>
      <ul><li><a href="/autos/">Seguro de auto</a></li><li><a href="/salud/">Medicina prepaga</a></li><li><a href="/aseguradoras/">Verificar aseguradoras</a></li><li><a href="/blog/">Blog</a></li></ul>
    </div>
    <div>
      <p class="ftr__label">El portal</p>
      <ul><li><a href="/nosotros/">Nosotros</a></li><li><a href="/como-comparamos/">Cómo comparamos</a></li><li><a href="/preguntas-frecuentes/">Preguntas frecuentes</a></li><li><a href="/contacto/">Contacto</a></li></ul>
    </div>
    <div>
      <p class="ftr__label">Legal</p>
      <ul><li><a href="/aviso-legal/">Aviso legal</a></li><li><a href="/privacidad/">Privacidad</a></li><li><a href="/terminos/">Términos de uso</a></li></ul>
    </div>
    </div>
    <p class="ftr__notice"><strong>Sitio informativo.</strong> seguro.com.py no es una aseguradora, un corredor ni un agente de seguros. No vendemos, cotizamos ni contratamos seguros, no recibimos solicitudes de seguro, no gestionamos siniestros y no manejamos dinero. La información es general y no es asesoramiento. Verificá siempre las condiciones, coberturas y exclusiones directamente con la aseguradora.</p>
    <div class="operator-block" data-operator-block>
  <p class="operator-block__label">Identidad del portal</p>
  <dl class="datalist">
    <div class="datalist__row"><dt>Portal</dt><dd>Seguro.com.py</dd></div><div class="datalist__row"><dt>Contacto</dt><dd><a href="/contacto/">Solo por formulario</a></dd></div>
  </dl>
</div>
    <div class="ftr__base">
      <p>© 2026 Seguro.com.py. Versión de textos legales: 2026-10-01-seguro.</p>
    </div>
  </div>
</footer>
<script src="/assets/js/site.js?v=87e4c19108" defer></script>
</body>
</html>
