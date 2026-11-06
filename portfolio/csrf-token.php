<?php
declare(strict_types=1);

require __DIR__ . '/includes/session.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET');
    http_response_code(405);
    echo json_encode(['message' => 'This endpoint only accepts GET requests.']);
    exit;
}

try {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    echo json_encode(['token' => $_SESSION['csrf_token']], JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(500);
    echo json_encode(['message' => 'Could not start a secure form session.']);
}