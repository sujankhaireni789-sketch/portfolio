<?php
declare(strict_types=1);

function database_connection(): PDO
{
    $configurationPath = __DIR__ . '/../config/database.php';
    if (!is_file($configurationPath)) {
        throw new RuntimeException('Database configuration is missing.');
    }

    $configuration = require $configurationPath;
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $configuration['host'],
        $configuration['port'],
        $configuration['database']
    );

    return new PDO($dsn, $configuration['username'], $configuration['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}