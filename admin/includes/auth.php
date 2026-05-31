<?php
session_start();

function requireLogin(): void {
    if (empty($_SESSION['admin_id'])) {
        header('Location: /brand-illumination/admin/index.php');
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
    header('Location: /brand-illumination/admin/index.php');
    exit;
}
