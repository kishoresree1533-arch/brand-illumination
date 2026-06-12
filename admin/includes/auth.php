<?php
session_start();

if (!defined('ADMIN_BASE')) {
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    $pos = strpos($script, '/admin');
    if ($pos !== false) {
        define('ADMIN_BASE', substr($script, 0, $pos + 6));
    } else {
        define('ADMIN_BASE', '/admin');
    }
}

function requireLogin(): void {
    if (empty($_SESSION['admin_id'])) {
        header('Location: ' . ADMIN_BASE . '/index.php');
        exit;
    }
}

function isLoggedIn(): bool {
    return !empty($_SESSION['admin_id']);
}

function loginAdmin(int $id, string $name): void {
    $_SESSION['admin_id'] = $id;
    $_SESSION['admin_name'] = $name;
}

function logoutAdmin(): void {
    session_destroy();
    header('Location: ' . ADMIN_BASE . '/index.php');
    exit;
}
