<?php
/* =========================================================
   BAGNI LIDO LIVORNO — Handler form (contatti + newsletter)
   Funziona su qualsiasi hosting Apache con PHP.
   Riceve POST JSON o form-encoded, valida, invia email.
   ---------------------------------------------------------
   CONFIGURAZIONE: modifica i valori qui sotto.
   ========================================================= */

// --- Destinatario delle richieste dal sito ---
const MAIL_TO       = 'info@bagnilidolivorno.com';
const MAIL_FROM     = 'no-reply@bagnilidolivorno.com';   // deve essere del tuo dominio
const SITE_NAME     = 'Bagni Lido Livorno';

// --- Newsletter (opzionale) ---
// Lascia vuoto BREVO_API_KEY per gestire la newsletter solo via email.
// Se inserisci la chiave Brevo (Sendinblue), gli iscritti vanno nella lista indicata.
const BREVO_API_KEY = '';          // es. 'xkeysib-xxxxxxxx'
const BREVO_LIST_ID = 1;           // ID lista Brevo

// =========================================================
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond($ok, $msg, $code = 200) {
  http_response_code($code);
  echo json_encode(['ok' => $ok, 'message' => $msg]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(false, 'Method not allowed', 405);

// Accetta sia JSON sia form-encoded
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) $data = $_POST;

$clean = fn($v) => trim(filter_var((string)($v ?? ''), FILTER_UNSAFE_RAW));

// Honeypot anti-spam: il campo "website" deve restare vuoto
if (!empty($clean($data['website'] ?? ''))) respond(true, 'ok'); // finge successo ai bot

$action = $clean($data['action'] ?? 'contact');

/* ---------- NEWSLETTER ---------- */
if ($action === 'newsletter') {
  $email = filter_var($clean($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
  if (!$email) respond(false, 'Email non valida', 422);

  if (BREVO_API_KEY !== '') {
    $ch = curl_init('https://api.brevo.com/v3/contacts');
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_HTTPHEADER => ['accept: application/json', 'content-type: application/json', 'api-key: ' . BREVO_API_KEY],
      CURLOPT_POSTFIELDS => json_encode(['email' => $email, 'listIds' => [BREVO_LIST_ID], 'updateEnabled' => true]),
    ]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http >= 200 && $http < 300) respond(true, 'Iscrizione completata');
    // se Brevo fallisce, ripieghiamo sull'email sotto
  }

  $sent = mail(MAIL_TO, '[Newsletter] Nuova iscrizione', "Nuovo iscritto: $email\n", build_headers($email));
  respond($sent, $sent ? 'Iscrizione completata' : 'Errore invio, riprova', $sent ? 200 : 500);
}

/* ---------- CONTATTI ---------- */
$name    = $clean($data['name'] ?? '');
$email   = filter_var($clean($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone   = $clean($data['phone'] ?? '');
$topic   = $clean($data['topic'] ?? 'Informazioni');
$message = $clean($data['message'] ?? '');

if ($name === '' || !$email || $message === '') respond(false, 'Compila i campi obbligatori', 422);

// Previene header injection
if (preg_match('/[\r\n]/', $name . $email)) respond(false, 'Dati non validi', 422);

$subject = "[Sito] $topic — $name";
$body  = "Nuova richiesta dal sito $SITE_NAME\n\n";
$body .= "Nome: $name\nEmail: $email\nTelefono: $phone\nMotivo: $topic\n\nMessaggio:\n$message\n";

$sent = mail(MAIL_TO, $subject, $body, build_headers($email, $name));
respond($sent, $sent ? 'Messaggio inviato' : 'Errore invio, riprova', $sent ? 200 : 500);

/* ---------- helper ---------- */
function build_headers($replyEmail, $replyName = '') {
  $from = SITE_NAME . ' <' . MAIL_FROM . '>';
  $reply = $replyName ? "$replyName <$replyEmail>" : $replyEmail;
  return implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    "From: $from",
    "Reply-To: $reply",
  ]);
}
