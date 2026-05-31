<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { echo json_encode(['success' => false, 'error' => 'Method not allowed']); exit; }

require_once __DIR__ . '/../includes/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(['success' => false, 'error' => 'Please fill in all fields.']);
    exit;
}

try {
    $db = getDB();

    // Ensure admin_tokens table exists
    $db->exec('CREATE TABLE IF NOT EXISTS admin_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        token VARCHAR(128) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');

    $stmt = $db->prepare('SELECT id, name, password FROM admin_users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Generate a secure token and store in DB
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+8 hours'));

        // Clean old tokens for this user
        $db->prepare('DELETE FROM admin_tokens WHERE admin_id = ?')->execute([$user['id']]);

        // Store new token
        $db->prepare('INSERT INTO admin_tokens (admin_id, token, expires_at) VALUES (?, ?, ?)')
           ->execute([$user['id'], $token, $expires]);

        echo json_encode([
            'success' => true,
            'name'    => $user['name'],
            'token'   => $token,
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid username or password.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
