<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once __DIR__ . '/../includes/db.php';
$db = getDB();

try {
    $db->exec('CREATE TABLE IF NOT EXISTS admin_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        token VARCHAR(128) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');
} catch (Exception $e) {}

$token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
if (empty($token)) { http_response_code(401); echo json_encode(['error' => 'Unauthorized']); exit; }
try {
    $stmt = $db->prepare('SELECT id FROM admin_tokens WHERE token = ? AND expires_at > NOW()');
    $stmt->execute([$token]);
    if (!$stmt->fetch()) { http_response_code(401); echo json_encode(['error' => 'Unauthorized']); exit; }
} catch (Exception $e) { http_response_code(401); echo json_encode(['error' => 'Unauthorized']); exit; }

$prodCount      = $db->query('SELECT COUNT(*) FROM products')->fetchColumn();
$portfolioCount = $db->query('SELECT COUNT(*) FROM portfolio')->fetchColumn();
$serviceCount   = $db->query('SELECT COUNT(*) FROM services')->fetchColumn();
$recentProducts = $db->query('SELECT * FROM products ORDER BY created_at DESC LIMIT 5')->fetchAll();
$recentPortfolio= $db->query('SELECT * FROM portfolio ORDER BY created_at DESC LIMIT 5')->fetchAll();

echo json_encode([
    'stats'           => ['products'=>$prodCount,'portfolio'=>$portfolioCount,'services'=>$serviceCount],
    'recentProducts'  => $recentProducts,
    'recentPortfolio' => $recentPortfolio,
]);
