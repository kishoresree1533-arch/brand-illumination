<?php
function getDB_and_validateToken(): bool {
    $token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
    if (empty($token)) return false;
    try {
        require_once __DIR__ . '/db.php';
        $db = getDB();
        $stmt = $db->prepare('SELECT id FROM admin_tokens WHERE token = ? AND expires_at > NOW()');
        $stmt->execute([$token]);
        return $stmt->fetch() !== false;
    } catch (Exception $e) {
        return false;
    }
}

function apiAuth(): void {
    if (!getDB_and_validateToken()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}
