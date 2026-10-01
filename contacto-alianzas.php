<?php
// Contact / partner form handler (docs/PARTNER-FORM.md). POST only.
// 1) validate + reject spam silently  2) POST to VenderCRM  3) e-mail the owner (also the fallback)
// 4) always redirect to the thank-you page. Never shows keys, endpoints or errors to the visitor.
declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(E_ALL);
require __DIR__ . '/contacto-lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}

const THANKS = '/contacto/gracias/';
const FORM = '/contacto/mensaje/';
const TIPOS = [
    'correccion' => 'Corrección de un dato del sitio',
    'datos' => 'Pedido sobre mis datos personales',
    'aseguradora' => 'Aseguradora',
    'corredor' => 'Corredor o agente de seguros',
    'medio' => 'Medio de comunicación',
    'agencia' => 'Agencia o proveedor',
    'otro' => 'Otro',
];
const EMPRESA = ['aseguradora', 'corredor', 'medio', 'agencia'];

$cfg = cl_config();
if ($cfg === null) {
    error_log('seguro-form: config.php missing or incomplete');
    cl_redirect(FORM . '?e=server');
}

$post = fn (string $k): string => is_string($_POST[$k] ?? null) ? $_POST[$k] : '';

// --- silent rejections (spam): honeypot, forged or too-fast token -------------------------------
if (trim($post('website')) !== '') {
    cl_redirect(THANKS);
}
$age = cl_token_age($cfg, $post('t'));
if ($age === null || $age < CL_MIN_SECONDS) {
    cl_redirect(THANKS);
}
if ($age > CL_MAX_SECONDS) {
    cl_redirect(FORM . '?e=expired');
}
// --- consent is mandatory and checked on the server too --------------------------------------
if ($post('consent') !== CL_CONSENT_VERSION) {
    cl_redirect(FORM . '?e=consent');
}

// --- fields -----------------------------------------------------------------------------------
$tipo = $post('tipo');
$nombre = cl_line($post('nombre'), 120);
$org = cl_line($post('organizacion'), 120);
$cargo = cl_line($post('cargo'), 120);
$email = cl_line($post('email'), 160);
$phone = cl_phone($post('telefono'));
$mensaje = cl_text($post('mensaje'), CL_MAX_MESSAGE);

if (!isset(TIPOS[$tipo]) || $nombre === '' || $mensaje === '' || $phone === null
    || !filter_var($email, FILTER_VALIDATE_EMAIL) || (in_array($tipo, EMPRESA, true) && $org === '')) {
    cl_redirect(FORM . '?e=campos');
}
if (mb_strlen($post('mensaje')) > CL_MAX_MESSAGE + 200) {
    cl_redirect(FORM . '?e=campos');
}

// --- rate limit: counts only submissions that passed validation (typos do not lock anyone out) ---
if (cl_rate_limited($cfg)) {
    cl_redirect(THANKS);
}

// --- consent proof ----------------------------------------------------------------------------
$when = (new DateTimeImmutable('now', new DateTimeZone('America/Asuncion')))->format('Y-m-d H:i');
$consentLine = 'Consentimiento ' . CL_CONSENT_VERSION . ' aceptado el ' . $when . ' (America/Asuncion)';

// --- VenderCRM --------------------------------------------------------------------------------
$crmMessage = '[Contacto web · ' . TIPOS[$tipo] . ']'
    . ($cargo !== '' ? ' Cargo: ' . $cargo . '.' : '')
    . ' ' . str_replace("\n", ' ', $mensaje)
    . ' — ' . $consentLine;
$payload = [
    'phone' => $phone,
    'name' => $org !== '' ? $nombre . ' (' . $org . ')' : $nombre,
    'email' => $email,
    'message' => $crmMessage,
    'source' => 'alianzas-web',
    'idempotency_key' => bin2hex(random_bytes(16)),
];
$crmOk = false;
if (!empty($cfg['vcrm_endpoint']) && function_exists('curl_init')) {
    $ch = curl_init((string) $cfg['vcrm_endpoint']);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'X-Api-Key: ' . $cfg['vcrm_api_key']],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $crmOk = $status >= 200 && $status < 300;
    if (!$crmOk) {
        // status only: never log the visitor's data or the key
        $field = is_string($body) && preg_match('/"(?:field|error)"\s*:\s*"([^"]{1,60})"/', $body, $m) ? $m[1] : '-';
        error_log('seguro-form: CRM answered ' . $status . ' (' . $field . ')');
    }
} else {
    error_log('seguro-form: CRM endpoint missing or curl unavailable');
}

// --- notification e-mail (also the fallback when the CRM is down) -----------------------------
$subject = '[seguro.com.py] ' . TIPOS[$tipo] . ' - ' . $nombre;
$lines = [
    'Tipo: ' . TIPOS[$tipo],
    'Nombre: ' . $nombre,
    'Organización: ' . ($org !== '' ? $org : '-'),
    'Cargo: ' . ($cargo !== '' ? $cargo : '-'),
    'Teléfono: ' . $phone,
    'Correo: ' . $email,
    'CRM: ' . ($crmOk ? 'enviado' : 'NO enviado (revisar el log)'),
    '',
    $mensaje,
    '',
    $consentLine,
];
$from = $cfg['from_email'] ?? $cfg['notify_email'];
$headers = [
    'From: ' . cl_line((string) $from, 160),
    'Reply-To: ' . $email, // already validated and stripped of CR/LF
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];
$sent = @mail(
    cl_line((string) $cfg['notify_email'], 160),
    mb_encode_mimeheader(cl_line($subject, 200), 'UTF-8'),
    implode("\r\n", $lines),
    implode("\r\n", $headers)
);
if (!$sent) {
    error_log('seguro-form: mail() failed' . ($crmOk ? '' : ' and CRM failed: a message may be lost'));
}

cl_redirect(THANKS);
