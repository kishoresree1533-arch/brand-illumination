<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($db->query('SELECT * FROM site_settings ORDER BY setting_key ASC')->fetchAll()); exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input=json_decode(file_get_contents('php://input'),true);
    $settings=$input['settings']??[];
    if(empty($settings)){echo json_encode(['success'=>false,'error'=>'No settings provided.']);exit;}
    $stmt=$db->prepare('UPDATE site_settings SET setting_value=? WHERE setting_key=?');
    foreach($settings as $key=>$value) $stmt->execute([trim($value),trim($key)]);
    echo json_encode(['success'=>true]); exit;
}
echo json_encode(['error'=>'Method not allowed']);
