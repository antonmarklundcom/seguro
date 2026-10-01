<?php
// Shared helpers for the partner/contact form (docs/PARTNER-FORM.md).
// Not reachable directly from the web (.htaccess); included by the form page and the handler.
declare(strict_types=1);

const CL_CONSENT_VERSION = 'v1.0';
const CL_MIN_SECONDS = 3;
const CL_MAX_SECONDS = 7200;
const CL_MAX_PER_HOUR = 5;
const CL_MAX_MESSAGE = 1000;

/** config.php is uploaded by hand: one level above the web root if possible, else next to this file. */
function cl_config(): ?array
{
    foreach ([dirname(__DIR__) . '/config.php', __DIR__ . '/config.php'] as $f) {
        if (is_file($f)) {
            $cfg = require $f;
            if (is_array($cfg) && !empty($cfg['vcrm_api_key']) && !empty($cfg['notify_email'])) {
                return $cfg;
            }
        }
    }
    return null;
}

/** Signed timestamp: proves the page was served by us at least CL_MIN_SECONDS ago. */
function cl_token(array $cfg, ?int $ts = null): string
{
    $ts = $ts ?? time();
    return $ts . '.' . hash_hmac('sha256', (string) $ts, 'seguro-form|' . $cfg['vcrm_api_key']);
}

/** @return int|null seconds elapsed, or null if the token is invalid */
function cl_token_age(array $cfg, string $token): ?int
{
    $parts = explode('.', $token, 2);
    if (count($parts) !== 2 || !ctype_digit($parts[0])) {
        return null;
    }
    $expected = hash_hmac('sha256', $parts[0], 'seguro-form|' . $cfg['vcrm_api_key']);
    if (!hash_equals($expected, $parts[1])) {
        return null;
    }
    return time() - (int) $parts[0];
}

function cl_redirect(string $path): never
{
    header('Location: ' . $path, true, 303);
    exit;
}

/** Remove CR/LF and control characters (header-injection safe). */
function cl_line(string $s, int $max = 200): string
{
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? '';
    return mb_substr(trim($s), 0, $max);
}

/** Multi-line text: keep newlines, drop other control characters. */
function cl_text(string $s, int $max): string
{
    $s = str_replace(["\r\n", "\r"], "\n", $s);
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $s) ?? '';
    return mb_substr(trim($s), 0, $max);
}

/** Normalise a Paraguayan phone number to +595…; null if it does not look valid. */
function cl_phone(string $raw): ?string
{
    $d = preg_replace('/\D+/', '', $raw) ?? '';
    if (str_starts_with($d, '00')) {
        $d = substr($d, 2);
    }
    if (str_starts_with($d, '595')) {
        $rest = substr($d, 3);
    } elseif (str_starts_with($d, '0')) {
        $rest = substr($d, 1);
    } else {
        $rest = $d;
    }
    return preg_match('/^\d{8,9}$/', $rest) ? '+595' . $rest : null;
}

/** At most CL_MAX_PER_HOUR submissions per IP per hour. Stores only a salted hash, for one hour. */
function cl_rate_limited(array $cfg): bool
{
    $dir = __DIR__ . '/storage/rate';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
        @file_put_contents(__DIR__ . '/storage/.htaccess', "Require all denied\n");
    }
    $key = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', 'seguro-rate|' . $cfg['vcrm_api_key']);
    $file = $dir . '/' . substr($key, 0, 40) . '.json';
    $now = time();
    // prune old files (hourly window)
    foreach (glob($dir . '/*.json') ?: [] as $old) {
        if ($now - (int) @filemtime($old) > 3600) {
            @unlink($old);
        }
    }
    $fh = @fopen($file, 'c+');
    if (!$fh) {
        return false; // fail open: never block a visitor because storage is unwritable
    }
    flock($fh, LOCK_EX);
    $times = json_decode((string) stream_get_contents($fh), true);
    $times = array_values(array_filter(is_array($times) ? $times : [], fn ($t) => is_int($t) && $now - $t < 3600));
    $limited = count($times) >= CL_MAX_PER_HOUR;
    if (!$limited) {
        $times[] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($times));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $limited;
}
