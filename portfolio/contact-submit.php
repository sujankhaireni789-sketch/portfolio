<?php
declare(strict_types=1);

require __DIR__ . '/includes/session.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'message' => 'This endpoint only accepts form submissions.']);
}

$submittedToken = $_POST['csrf_token'] ?? '';
if (!is_string($submittedToken) || !isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $submittedToken)) {
    respond(403, ['success' => false, 'message' => 'Your secure form session expired. Please try again.']);
}

$honeypot = $_POST['website_url'] ?? '';
if (!is_string($honeypot) || $honeypot !== '') {
    respond(200, ['success' => true, 'message' => 'Thanks. Your message has been received.']);
}

$readField = static function (string $field): string {
    $value = $_POST[$field] ?? '';
    return is_string($value) ? trim($value) : '';
};

$name = $readField('name');
$email = $readField('email');
$subject = $readField('subject');
$message = $readField('message');

if (
    $name === '' || strlen($name) < 2 || strlen($name) > 120 ||
    $email === '' || strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false ||
    $subject === '' || strlen($subject) < 3 || strlen($subject) > 160 ||
    $message === '' || strlen($message) < 10 || strlen($message) > 1000
) {
    respond(422, ['success' => false, 'message' => 'Check the fields and try again. Keep your message under 1,000 characters.']);
}

if (isset($_SESSION['last_contact_submission']) && time() - $_SESSION['last_contact_submission'] < 10) {
    respond(429, ['success' => false, 'message' => 'Please wait a few seconds before sending another message.']);
}

try {
    require_once __DIR__ . '/includes/database.php';
    $statement = database_connection()->prepare(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)'
    );
    $statement->execute([
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
    ]);

    $_SESSION['last_contact_submission'] = time();
    unset($_SESSION['csrf_token']);
    respond(201, ['success' => true, 'message' => 'Thanks. Your message has been received.']);
} catch (Throwable $error) {
    error_log($error->getMessage());
    respond(500, ['success' => false, 'message' => 'The message could not be saved. Please try again later.']);
}