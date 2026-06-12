<?php
function renderHeader(string $pageTitle = 'Dashboard'): void {
    $adminName = htmlspecialchars($_SESSION['admin_name'] ?? 'Admin');
    $currentPage = basename($_SERVER['PHP_SELF']);
    $nav = [
        ['file' => 'dashboard.php', 'label' => 'Dashboard', 'icon' => '⊞'],
        ['file' => 'products.php',  'label' => 'Products',  'icon' => '◈'],
        ['file' => 'portfolio.php', 'label' => 'Portfolio', 'icon' => '◉'],
        ['file' => 'services.php',  'label' => 'Services',  'icon' => '◫'],
        ['file' => 'settings.php',  'label' => 'Settings',  'icon' => '◎'],
    ];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= htmlspecialchars($pageTitle) ?> — RM Sign Factory Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0d1b2a; --gold: #c9a84c; --gold-light: #e8c56d;
    --bg: #09121c; --sidebar: #0d1725; --card: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08); --text: #e8edf3; --muted: rgba(255,255,255,0.45);
    --success: #22c55e; --danger: #ef4444; --warn: #f59e0b;
    --sidebar-w: 240px;
  }
  body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); display: flex; min-height: 100vh; }
  
  /* Sidebar */
  .sidebar {
    width: var(--sidebar-w); background: var(--sidebar);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
  }
  .sidebar-logo {
    padding: 24px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .logo-mark {
    width: 38px; height: 38px; background: linear-gradient(135deg, var(--gold), #a07830);
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700; color: #0d1b2a;
    flex-shrink: 0;
  }
  .logo-text h2 { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: #fff; }
  .logo-text p { font-size: 10px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
  .nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
  .nav a {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 10px; font-size: 13px; font-weight: 500; color: var(--muted);
    text-decoration: none; transition: all 0.15s;
  }
  .nav a:hover { background: rgba(255,255,255,0.05); color: var(--text); }
  .nav a.active { background: rgba(201,168,76,0.12); color: var(--gold); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-user {
    padding: 16px 20px; border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .user-info p { font-size: 13px; font-weight: 600; color: var(--text); }
  .user-info span { font-size: 11px; color: var(--muted); }
  .btn-logout {
    font-size: 11px; color: var(--danger); text-decoration: none;
    padding: 6px 10px; border-radius: 8px; background: rgba(239,68,68,0.1);
    transition: background 0.15s; border: none; cursor: pointer; font-family: inherit;
  }
  .btn-logout:hover { background: rgba(239,68,68,0.2); }

  /* Main */
  .main { margin-left: var(--sidebar-w); flex: 1; display: flex; flex-direction: column; }
  .topbar {
    padding: 18px 32px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(13,23,37,0.8); backdrop-filter: blur(8px);
    position: sticky; top: 0; z-index: 50;
  }
  .topbar h1 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25); border-radius: 20px; font-size: 11px; font-weight: 600; color: var(--success); }
  .badge::before { content: ''; width: 6px; height: 6px; background: var(--success); border-radius: 50%; }
  .content { padding: 32px; flex: 1; }

  /* Shared UI */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600;
    font-family: 'Inter', sans-serif; cursor: pointer; text-decoration: none;
    transition: all 0.15s; border: none;
  }
  .btn-primary { background: linear-gradient(135deg, var(--gold), #a07830); color: #0d1b2a; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.3); }
  .btn-danger:hover { background: rgba(239,68,68,0.25); }
  .btn-ghost { background: rgba(255,255,255,0.06); color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { background: rgba(255,255,255,0.1); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }

  table { width: 100%; border-collapse: collapse; }
  thead th { text-align: left; padding: 10px 16px; font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid var(--border); }
  tbody td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
  tbody tr:hover td { background: rgba(255,255,255,0.02); }
  tbody tr:last-child td { border-bottom: none; }

  .badge-cat { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: rgba(201,168,76,0.12); color: var(--gold); border: 1px solid rgba(201,168,76,0.2); }
  .status-active { color: var(--success); font-size: 12px; font-weight: 600; }
  .status-inactive { color: var(--muted); font-size: 12px; }

  /* Forms */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-group.full { grid-column: 1 / -1; }
  label { font-size: 12px; font-weight: 600; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; }
  input[type=text], input[type=number], input[type=url], select, textarea {
    width: 100%; padding: 10px 14px;
    background: rgba(255,255,255,0.05); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-size: 13px; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.15s;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--gold); }
  input::placeholder, textarea::placeholder { color: var(--muted); }
  select option { background: #0d1725; }
  textarea { resize: vertical; min-height: 100px; }

  /* Alert */
  .alert { padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 500; margin-bottom: 20px; }
  .alert-success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); color: var(--success); }
  .alert-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: var(--danger); }

  /* Stat cards */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; }
  .stat-label { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }
  .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: var(--gold); }

  .thumb { width: 44px; height: 44px; object-fit: cover; border-radius: 8px; background: rgba(255,255,255,0.06); }
  .no-img { width: 44px; height: 44px; border-radius: 8px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  
  @media(max-width:900px){.stat-grid{grid-template-columns:1fr 1fr;}.form-grid{grid-template-columns:1fr;}}
</style>
<?php
}

function renderFooter(): void {
    echo '</div></div></body></html>';
}

function renderNav(string $currentPage, array $nav): void {
    foreach ($nav as $item) {
        $active = $currentPage === $item['file'] ? ' active' : '';
        echo "<a href='" . ADMIN_BASE . "/{$item['file']}' class='$active'><span class='nav-icon'>{$item['icon']}</span>{$item['label']}</a>";
    }
}
