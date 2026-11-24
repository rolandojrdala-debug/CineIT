<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'status' => 'ok',
    'api' => 'CineIT PHP Backend',
    'php_version' => PHP_VERSION,
    'message' => 'PHP backend is running successfully.'
]);