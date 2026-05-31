<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
require_once __DIR__ . '/../includes/db.php';
$db = getDB();

// Ensure admin_tokens table exists (create if missing)
try {
    $db->exec('CREATE TABLE IF NOT EXISTS admin_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        token VARCHAR(128) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');
} catch (Exception $e) {}

// Validate token
$token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
if (empty($token)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}
try {
    $stmt = $db->prepare('SELECT id FROM admin_tokens WHERE token = ? AND expires_at > NOW()');
    $stmt->execute([$token]);
    if (!$stmt->fetch()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    echo json_encode($db->query('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC')->fetchAll()); exit;
}
if ($method === 'POST') {
    $title=$_POST['title']??''; $slug=$_POST['slug']??''; $subtitle=$_POST['subtitle']??''; $description=$_POST['description']??''; $icon=$_POST['icon']??'';
    if (!trim($title)) { echo json_encode(['success'=>false,'error'=>'Title is required.']); exit; }
    if (!trim($slug)) $slug=strtolower(preg_replace('/[^a-z0-9]+/i','-',trim($title)));
    $image_path='';
    if (isset($_FILES['image'])&&$_FILES['image']['error']===UPLOAD_ERR_OK) {
        $dir=__DIR__.'/../../uploads/services/'; if(!is_dir($dir)) mkdir($dir,0755,true);
        $fn=uniqid('svc_').'.'.pathinfo($_FILES['image']['name'],PATHINFO_EXTENSION);
        if(move_uploaded_file($_FILES['image']['tmp_name'],$dir.$fn)) $image_path='/uploads/services/'.$fn;
    }
    try {
        $s=$db->prepare('INSERT INTO services (slug,title,subtitle,description,icon,image_path) VALUES (?,?,?,?,?,?)');
        $s->execute([$slug,trim($title),trim($subtitle),trim($description),trim($icon),$image_path]);
        echo json_encode(['success'=>true,'id'=>$db->lastInsertId()]);
    } catch(Exception $e){ echo json_encode(['success'=>false,'error'=>$e->getMessage()]); }
    exit;
}
if ($method === 'DELETE') {
    $id=intval($_GET['id']??0); if(!$id){echo json_encode(['success'=>false,'error'=>'Invalid ID']);exit;}
    $db->prepare('DELETE FROM services WHERE id=?')->execute([$id]);
    echo json_encode(['success'=>true]); exit;
}
echo json_encode(['error'=>'Method not allowed']);
