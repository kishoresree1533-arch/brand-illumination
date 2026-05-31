<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
require_once __DIR__ . '/../includes/db.php';
$db = getDB();

// Ensure products table exists with all columns
try {
    $db->exec('CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        title VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        price VARCHAR(100),
        image_path VARCHAR(500),
        specs JSON,
        trade JSON,
        about_data JSON,
        faqs JSON,
        is_active TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )');
} catch (Exception $e) {}

// Add new columns to existing tables if they don't exist yet
$existing_cols = [];
try {
    $cols = $db->query("SHOW COLUMNS FROM products")->fetchAll(PDO::FETCH_COLUMN);
    $existing_cols = $cols;
} catch (Exception $e) {}

foreach (['trade' => 'JSON', 'about_data' => 'JSON', 'faqs' => 'JSON'] as $col => $type) {
    if (!in_array($col, $existing_cols)) {
        try { $db->exec("ALTER TABLE products ADD COLUMN `$col` $type"); } catch (Exception $e) {}
    }
}

// Ensure admin_tokens table exists
try {
    $db->exec('CREATE TABLE IF NOT EXISTS admin_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        token VARCHAR(128) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');
} catch (Exception $e) {}

// ── GET — public, no auth required ──────────────────────────────────────────
if ($method === 'GET') {
    try {
        $stmt = $db->query('SELECT * FROM products WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC');
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($products);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// ── Auth check for POST / DELETE ────────────────────────────────────────────
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

// ── POST — create a new product ─────────────────────────────────────────────
if ($method === 'POST') {
    $title       = trim($_POST['title']       ?? '');
    $slug        = trim($_POST['slug']        ?? '');
    $category    = trim($_POST['category']    ?? '');
    $description = trim($_POST['description'] ?? '');
    $price       = trim($_POST['price']       ?? '');

    // JSON fields sent as JSON strings from the frontend
    $specs_raw = $_POST['specs'] ?? '{}';
    $trade_raw = $_POST['trade'] ?? '{}';
    $about_raw = $_POST['about'] ?? 'null';
    $faqs_raw  = $_POST['faqs']  ?? '[]';

    // Validate JSON
    $specs = json_decode($specs_raw, true) ?: [];
    $trade = json_decode($trade_raw, true) ?: [];
    $about = json_decode($about_raw, true);   // can be null
    $faqs  = json_decode($faqs_raw,  true) ?: [];

    if (empty($title)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Product title is required.']);
        exit;
    }
    if (empty($category)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Category is required.']);
        exit;
    }

    // Auto-generate slug
    if (empty($slug)) {
        $slug = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $title));
        $slug = trim($slug, '-');
    }

    // Make slug unique
    $baseSlug = $slug;
    $counter  = 1;
    while (true) {
        $check = $db->prepare('SELECT id FROM products WHERE slug = ?');
        $check->execute([$slug]);
        if (!$check->fetch()) break;
        $slug = $baseSlug . '-' . $counter++;
    }

    // Handle image upload
    $image_path = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = __DIR__ . '/../../src/assets/products/';
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);
        $ext      = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $filename = uniqid('prod_') . '.' . $ext;
        $target   = $upload_dir . $filename;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
            $image_path = '/src/assets/products/' . $filename;
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to upload image.']);
            exit;
        }
    }

    try {
        $stmt = $db->prepare(
            'INSERT INTO products (slug, title, category, description, price, image_path, specs, trade, about_data, faqs, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)'
        );
        $stmt->execute([
            $slug, $title, $category, $description, $price, $image_path,
            json_encode($specs),
            json_encode($trade),
            json_encode($about),
            json_encode($faqs),
        ]);
        echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// ── DELETE ───────────────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    $id = intval($_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid product ID.']);
        exit;
    }
    try {
        $db->prepare('DELETE FROM products WHERE id = ?')->execute([$id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
