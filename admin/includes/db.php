<?php
// Detect if running locally (localhost/127.0.0.1 or local CLI)
$isLocal = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1']) 
    || (php_sapi_name() === 'cli' && empty(getenv('PRODUCTION')));

if ($isLocal) {
    define('DB_HOST', '127.0.0.1');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'brand_illumination');
} else {
    define('DB_HOST', 'localhost');
    define('DB_USER', 'u891495087_Rm_sign_db');
    define('DB_PASS', 'Techinta@2026');
    define('DB_NAME', 'u891495087_Rm_sign_db');
}

function getDB(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
            );

            // Auto-setup database tables if they do not exist
            try {
                $pdo->query("SELECT 1 FROM admin_users LIMIT 1");
            } catch (PDOException $e) {
                $sqlFile = dirname(__DIR__) . '/setup.sql';
                if (file_exists($sqlFile)) {
                    $sql = file_get_contents($sqlFile);
                    // Clean and strip comments line-by-line
                    $lines = explode("\n", $sql);
                    $cleanSql = '';
                    foreach ($lines as $line) {
                        $trimmed = trim($line);
                        if ($trimmed === '' || strpos($trimmed, '--') === 0 || strpos($trimmed, '#') === 0) {
                            continue;
                        }
                        $cleanSql .= $line . "\n";
                    }
                    
                    // Execute queries sequentially
                    $queries = array_filter(array_map('trim', explode(';', $cleanSql)));
                    foreach ($queries as $query) {
                        if (!empty($query)) {
                            // Skip database creation/use statements to prevent permission errors on live shared hosts
                            if (stripos($query, 'CREATE DATABASE') !== false || stripos($query, 'USE ') !== false) {
                                continue;
                            }
                            $pdo->exec($query);
                        }
                    }
                }
            }
        } catch (PDOException $e) {
            die(json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]));
        }
    }
    return $pdo;
}

