<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';

if (isLoggedIn()) {
    header('Location: ' . ADMIN_BASE . '/dashboard.php');
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
            header('Location: ' . ADMIN_BASE . '/dashboard.php');
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
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:       #0a1628;
    --navy-mid:   #111f38;
    --gold:       #c9a84c;
    --gold-light: #e8c56d;
    --gold-dim:   rgba(201,168,76,0.15);
    --white:      #ffffff;
    --muted:      rgba(255,255,255,0.45);
    --border:     rgba(255,255,255,0.08);
    --card-bg:    rgba(255,255,255,0.03);
    --input-bg:   rgba(255,255,255,0.05);
  }

  html, body {
    height: 100%;
    font-family: 'Inter', sans-serif;
    background: var(--navy);
    color: var(--white);
    overflow: hidden;
  }

  /* ── Animated canvas background ── */
  .bg-canvas {
    position: fixed; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 80% 60% at 15% 40%, rgba(201,168,76,0.12) 0%, transparent 65%),
      radial-gradient(ellipse 60% 80% at 85% 70%, rgba(10,22,40,0.9) 0%, transparent 60%),
      linear-gradient(135deg, #060e1a 0%, #0d1e35 40%, #091525 100%);
  }

  /* Floating orbs */
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: float 8s ease-in-out infinite;
    pointer-events: none;
  }
  .orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%);
    top: -100px; left: -100px;
    animation-delay: 0s;
  }
  .orb-2 {
    width: 350px; height: 350px;
    background: radial-gradient(circle, rgba(14,40,80,0.6) 0%, transparent 70%);
    bottom: -80px; right: 5%;
    animation-delay: -3s;
  }
  .orb-3 {
    width: 250px; height: 250px;
    background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
    top: 40%; right: 20%;
    animation-delay: -5s;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50%       { transform: translateY(-30px) scale(1.05); }
  }

  /* Grid dots overlay */
  .grid-overlay {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ── Layout ── */
  .page {
    position: relative; z-index: 1;
    display: flex;
    min-height: 100vh;
  }

  /* Left hero panel */
  .hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 72px;
    position: relative;
    overflow: hidden;
  }

  .hero::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.3) 30%, rgba(201,168,76,0.3) 70%, transparent);
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--gold-dim);
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 100px;
    padding: 6px 16px 6px 10px;
    margin-bottom: 40px;
    width: fit-content;
  }
  .hero-badge .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 10px var(--gold);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--gold); }
    50%       { opacity: 0.6; box-shadow: 0 0 20px var(--gold); }
  }
  .hero-badge span {
    font-size: 11px; font-weight: 600;
    color: var(--gold-light);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .hero-logo {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 36px;
  }
  .logo-mark {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 50%, #a07830 100%);
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px; font-weight: 700;
    color: var(--navy);
    box-shadow: 0 8px 32px rgba(201,168,76,0.35), 0 0 0 1px rgba(201,168,76,0.2);
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }
  .logo-mark::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.25), transparent);
    border-radius: 20px 20px 0 0;
  }
  .logo-text h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px; font-weight: 700;
    color: var(--white);
    line-height: 1.1;
  }
  .logo-text p {
    font-size: 12px;
    color: var(--gold);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 3px;
    font-weight: 500;
  }

  .hero-heading {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(32px, 3vw, 48px);
    font-weight: 700;
    line-height: 1.15;
    color: var(--white);
    margin-bottom: 20px;
    letter-spacing: -0.02em;
  }
  .hero-heading .accent {
    background: linear-gradient(135deg, var(--gold-light), var(--gold));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-desc {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 380px;
    margin-bottom: 52px;
  }

  /* Stats row */
  .stats {
    display: flex;
    gap: 32px;
  }
  .stat-item { }
  .stat-value {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--white);
    line-height: 1;
  }
  .stat-value .unit {
    font-size: 16px;
    color: var(--gold);
  }
  .stat-label {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .stat-divider {
    width: 1px;
    background: var(--border);
    align-self: stretch;
  }

  /* ── Right login panel ── */
  .login-panel {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .login-card {
    width: 100%;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 48px 44px;
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04),
      0 40px 100px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.08);
    position: relative;
    overflow: hidden;
  }
  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent);
  }

  /* Card mobile logo (hidden on desktop) */
  .card-logo {
    display: none;
    text-align: center;
    margin-bottom: 36px;
  }
  .card-logo .logo-mark-sm {
    width: 52px; height: 52px;
    background: linear-gradient(135deg, var(--gold-light), var(--gold) 60%, #a07830);
    border-radius: 16px;
    display: inline-flex; align-items: center; justify-content: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 18px; font-weight: 700;
    color: var(--navy);
    box-shadow: 0 8px 24px rgba(201,168,76,0.3);
    margin-bottom: 12px;
  }
  .card-logo h2 { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: var(--white); }
  .card-logo p { font-size: 11px; color: var(--gold); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 2px; }

  /* Greeting */
  .card-greeting {
    margin-bottom: 36px;
  }
  .card-greeting h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 6px;
    letter-spacing: -0.01em;
  }
  .card-greeting p {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
  }

  /* Error */
  .error-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 24px;
    color: #fc8181;
    font-size: 13px;
    line-height: 1.5;
    animation: shake 0.4s ease;
  }
  .error-icon {
    width: 18px; height: 18px; flex-shrink: 0;
    background: rgba(239,68,68,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fc8181;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }

  /* Form fields */
  .form-group { margin-bottom: 22px; position: relative; }

  .field-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .field-label .field-icon {
    opacity: 0.5;
  }

  .input-wrap { position: relative; }
  .input-wrap .input-icon {
    position: absolute;
    left: 16px; top: 50%; transform: translateY(-50%);
    color: rgba(255,255,255,0.25);
    width: 16px; height: 16px;
    pointer-events: none;
    transition: color 0.2s;
  }

  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 14px 16px 14px 46px;
    background: var(--input-bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    color: var(--white);
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    -webkit-appearance: none;
  }
  input:focus {
    border-color: rgba(201,168,76,0.5);
    background: rgba(201,168,76,0.04);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
  }
  input:focus ~ .input-icon,
  .input-wrap:focus-within .input-icon { color: var(--gold); }
  input::placeholder { color: rgba(255,255,255,0.2); }

  /* Password toggle */
  .toggle-pw {
    position: absolute;
    right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.25);
    padding: 4px;
    transition: color 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .toggle-pw:hover { color: var(--gold); }
  .toggle-pw svg { width: 16px; height: 16px; }

  /* Sign in button */
  .btn-signin {
    width: 100%;
    padding: 15px 24px;
    background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 50%, #b08830 100%);
    border: none;
    border-radius: 14px;
    color: var(--navy);
    font-size: 14px;
    font-weight: 700;
    font-family: 'Space Grotesk', sans-serif;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.25s;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(201,168,76,0.3);
  }
  .btn-signin::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.2), transparent);
    border-radius: 14px 14px 0 0;
    pointer-events: none;
  }
  .btn-signin:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 36px rgba(201,168,76,0.45);
    filter: brightness(1.05);
  }
  .btn-signin:active { transform: translateY(0); box-shadow: 0 4px 12px rgba(201,168,76,0.2); }

  .btn-signin .btn-content {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; z-index: 1;
  }
  .btn-signin .arrow {
    transition: transform 0.25s;
  }
  .btn-signin:hover .arrow { transform: translateX(4px); }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0 22px;
  }
  .divider-line { flex: 1; height: 1px; background: var(--border); }
  .divider-text { font-size: 11px; color: rgba(255,255,255,0.2); white-space: nowrap; letter-spacing: 0.06em; }

  /* Credentials hint */
  .credentials-hint {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cred-icon {
    width: 32px; height: 32px;
    background: var(--gold-dim);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cred-icon svg { width: 15px; height: 15px; color: var(--gold); }
  .cred-text { flex: 1; }
  .cred-label { font-size: 10px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 5px; }
  .cred-values { display: flex; gap: 8px; }
  .cred-tag {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gold-light);
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 6px;
    padding: 3px 9px;
  }

  /* Footer note */
  .card-footer {
    text-align: center;
    margin-top: 28px;
    font-size: 11px;
    color: rgba(255,255,255,0.18);
  }
  .card-footer a { color: rgba(201,168,76,0.5); text-decoration: none; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    html, body { overflow: auto; }
    .page { flex-direction: column; min-height: 100vh; }
    .hero { display: none; }
    .login-panel { width: 100%; padding: 32px 20px; }
    .login-card { padding: 36px 28px; }
    .card-logo { display: block; }
  }
</style>
</head>
<body>

<!-- Background -->
<div class="bg-canvas">
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
</div>
<div class="grid-overlay"></div>

<div class="page">

  <!-- ── Hero Left Panel ── -->
  <div class="hero">
    <div class="hero-badge">
      <span class="dot"></span>
      <span>Secure Control Panel</span>
    </div>

    <div class="hero-logo">
      <div class="logo-mark">RM</div>
      <div class="logo-text">
        <h1>RM Sign Factory</h1>
        <p>Brand Illumination</p>
      </div>
    </div>

    <h2 class="hero-heading">
      Craft Extraordinary<br>
      <span class="accent">Signage Experiences</span>
    </h2>

    <p class="hero-desc">
      Manage your products, portfolio, and services from one powerful dashboard. Precision craftsmanship meets intelligent administration.
    </p>

    <div class="stats">
      <div class="stat-item">
        <div class="stat-value">20<span class="unit">+</span></div>
        <div class="stat-label">Products</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">500<span class="unit">+</span></div>
        <div class="stat-label">Projects Done</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">10<span class="unit">yr</span></div>
        <div class="stat-label">Experience</div>
      </div>
    </div>
  </div>

  <!-- ── Login Right Panel ── -->
  <div class="login-panel">
    <div class="login-card">

      <!-- Mobile-only logo -->
      <div class="card-logo">
        <div class="logo-mark-sm">RM</div>
        <h2>RM Sign Factory</h2>
        <p>Admin Control Panel</p>
      </div>

      <div class="card-greeting">
        <h2>Welcome back 👋</h2>
        <p>Sign in to access your admin dashboard and manage your business.</p>
      </div>

      <?php if ($error): ?>
      <div class="error-box">
        <div class="error-icon">!</div>
        <?= htmlspecialchars($error) ?>
      </div>
      <?php endif; ?>

      <form method="POST" autocomplete="on">
        <!-- Username -->
        <div class="form-group">
          <div class="field-label">
            <svg class="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Username
          </div>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              autocomplete="username"
              value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
            >
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <div class="field-label">
            <svg class="field-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Password
          </div>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
            >
            <button type="button" class="toggle-pw" onclick="togglePassword()" aria-label="Toggle password visibility">
              <svg id="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-signin">
          <div class="btn-content">
            <span>Sign In to Dashboard</span>
            <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </button>
      </form>

      <div class="divider">
        <div class="divider-line"></div>
        <span class="divider-text">Default Credentials</span>
        <div class="divider-line"></div>
      </div>

      <div class="credentials-hint">
        <div class="cred-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="cred-text">
          <div class="cred-label">Login credentials</div>
          <div class="cred-values">
            <span class="cred-tag">admin</span>
            <span class="cred-tag">admin123</span>
          </div>
        </div>
      </div>

      <div class="card-footer">
        RM Sign Factory &copy; <?= date('Y') ?> &nbsp;·&nbsp; <a href="#">Privacy Policy</a>
      </div>

    </div>
  </div>

</div>

<script>
function togglePassword() {
  const input = document.getElementById('password');
  const icon  = document.getElementById('eye-icon');
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  icon.innerHTML = isHidden
    ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
}

// Autofocus username on load
document.addEventListener('DOMContentLoaded', () => {
  const u = document.getElementById('username');
  if (u && !u.value) u.focus();
});
</script>
</body>
</html>
