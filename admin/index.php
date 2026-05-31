<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';

if (isLoggedIn()) {
    header('Location: /brand-illumination/admin/dashboard.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    if ($username && $password) {
        $db = getDB();
        $stmt = $db->prepare('SELECT id, name, password FROM admin_users WHERE username = ?');
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password'])) {
            loginAdmin($user['id'], $user['name']);
            header('Location: /brand-illumination/admin/dashboard.php');
            exit;
        } else {
            $error = 'Invalid username or password.';
        }
    } else {
        $error = 'Please fill in all fields.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RM Sign Factory — Admin Login</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0d1b2a; --gold: #c9a84c; --gold-light: #e8c56d;
    --bg: #08111c; --card: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
  }
  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    display: grid;
    place-items: center;
    background-image: radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(13,27,42,0.8) 0%, transparent 60%);
  }
  .login-card {
    width: 100%; max-width: 420px; padding: 48px 40px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 24px;
    backdrop-filter: blur(20px);
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  }
  .logo { text-align: center; margin-bottom: 40px; }
  .logo-mark {
    display: inline-flex; align-items: center; justify-content: center;
    width: 56px; height: 56px; background: linear-gradient(135deg, var(--gold), #a07830);
    border-radius: 16px; font-family: 'Space Grotesk', sans-serif;
    font-size: 22px; font-weight: 700; color: #0d1b2a; margin-bottom: 16px;
  }
  .logo h1 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: #fff; }
  .logo p { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; letter-spacing: 0.1em; text-transform: uppercase; }
  .form-group { margin-bottom: 20px; }
  label { display: block; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
  input {
    width: 100%; padding: 13px 16px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    border-radius: 12px; color: #fff; font-size: 14px; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.2s, background 0.2s;
  }
  input:focus { border-color: var(--gold); background: rgba(201,168,76,0.05); }
  input::placeholder { color: rgba(255,255,255,0.25); }
  .btn-login {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--gold), #a07830);
    border: none; border-radius: 12px;
    color: #0d1b2a; font-size: 14px; font-weight: 700;
    font-family: 'Inter', sans-serif; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s; margin-top: 8px;
    letter-spacing: 0.04em;
  }
  .btn-login:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-login:active { transform: translateY(0); }
  .error {
    background: rgba(220,50,50,0.12); border: 1px solid rgba(220,50,50,0.3);
    border-radius: 10px; padding: 12px 16px;
    color: #ff7070; font-size: 13px; margin-bottom: 20px;
  }
  .divider { border: none; border-top: 1px solid var(--border); margin: 28px 0; }
  .hint { text-align: center; font-size: 12px; color: rgba(255,255,255,0.25); }
</style>
</head>
<body>
<div class="login-card">
  <div class="logo">
    <div class="logo-mark">RM</div>
    <h1>RM Sign Factory</h1>
    <p>Admin Control Panel</p>
  </div>
  <?php if ($error): ?>
    <div class="error"><?= htmlspecialchars($error) ?></div>
  <?php endif; ?>
  <form method="POST">
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" placeholder="Enter your username" required autocomplete="username">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="Enter your password" required autocomplete="current-password">
    </div>
    <button type="submit" class="btn-login">Sign In →</button>
  </form>
  <hr class="divider">
  <p class="hint">Default: admin / admin123</p>
</div>
</body>
</html>
