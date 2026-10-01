// Contact form page body (rendered to contacto/mensaje/index.php).
// Spec: docs/PARTNER-FORM.md. Consent box rules: its own bordered box directly above the
// button, unticked, required, one purpose, plain Spanish, >= 16 px, version shown.

export function formBody({ holder, version }) {
  return `
<h1>Escribinos</h1>
<p class="box-note"><strong>Este formulario es solo para corregir información del sitio, hacer pedidos sobre tus datos personales y para aseguradoras, corredores, medios, agencias y socios comerciales.</strong> No tramitamos pedidos de seguro ni recibimos datos de personas que buscan un seguro. Si buscás un seguro, mirá <a href="/contacto/busco-un-seguro/">qué hacer</a>.</p>
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
<li>Los ve ${holder.text} y nuestros proveedores de gestión de contactos (VenderCRM) y de correo electrónico.</li>
<li>No los vendemos ni los compartimos con aseguradoras, corredores ni bancos.</li>
<li>Podés pedir que los borremos cuando quieras: usá este mismo formulario, tipo "Pedido sobre mis datos personales".</li>
</ul>
<label class="consent" for="consent"><input id="consent" type="checkbox" name="consent" value="${version}" required> <span>Sí, acepto que ${holder.text} guarde estos datos y me contacte por teléfono, WhatsApp o e-mail <strong>solo para responder a este mensaje</strong>.</span></label>
<p class="small">Leé la <a href="/politica-de-privacidad/">Política de privacidad</a>. (Texto ${version})</p>
<p class="error" id="consent-msg" role="alert"<?php echo $e === 'consent' ? '' : ' hidden'; ?>>Para enviar el mensaje necesitamos tu autorización.</p>
</fieldset>
<p><button type="submit" id="send">Enviar mensaje</button></p>
</form>
<script src="/assets/form.js" defer></script>
<?php endif; ?>`;
}

export const consentLabel = (holder, version) =>
  `Sí, acepto que ${holder.text} guarde estos datos y me contacte por teléfono, WhatsApp o e-mail solo para responder a este mensaje. (Texto ${version})`;
