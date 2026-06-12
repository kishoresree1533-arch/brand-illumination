<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/header.php';

requireLogin();

$db = getDB();

// Fetch counts
$prodCount = $db->query('SELECT COUNT(*) FROM products')->fetchColumn();
$portfolioCount = $db->query('SELECT COUNT(*) FROM portfolio')->fetchColumn();
$serviceCount = $db->query('SELECT COUNT(*) FROM services')->fetchColumn();

// Fetch recent products
$recentProducts = $db->query('SELECT * FROM products ORDER BY created_at DESC LIMIT 5')->fetchAll();
// Fetch recent portfolio items
$recentPortfolio = $db->query('SELECT * FROM portfolio ORDER BY created_at DESC LIMIT 5')->fetchAll();

renderHeader('Dashboard');
?>

<div class="sidebar">
  <div class="sidebar-logo">
    <div class="logo-mark">RM</div>
    <div class="logo-text">
      <h2>RM Factory</h2>
      <p>Admin Studio</p>
    </div>
  </div>
  <div class="nav">
    <?php renderNav('dashboard.php', [
        ['file' => 'dashboard.php', 'label' => 'Dashboard', 'icon' => '⊞'],
        ['file' => 'products.php',  'label' => 'Products',  'icon' => '◈'],
        ['file' => 'portfolio.php', 'label' => 'Portfolio', 'icon' => '◉'],
        ['file' => 'services.php',  'label' => 'Services',  'icon' => '◫'],
        ['file' => 'settings.php',  'label' => 'Settings',  'icon' => '◎'],
    ]); ?>
  </div>
  <div class="sidebar-user">
    <div class="user-info">
      <p><?= htmlspecialchars($_SESSION['admin_name']) ?></p>
      <span>Administrator</span>
    </div>
    <a href="<?= ADMIN_BASE ?>/logout.php" class="btn-logout">Logout</a>
  </div>
</div>

<div class="main">
  <div class="topbar">
    <h1>Dashboard</h1>
    <div class="topbar-right">
      <span class="badge">System Online</span>
    </div>
  </div>
  
  <div class="content">
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Total Products</div>
        <div class="stat-value"><?= $prodCount ?></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Portfolio Items</div>
        <div class="stat-value"><?= $portfolioCount ?></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Services</div>
        <div class="stat-value"><?= $serviceCount ?></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">User Settings</div>
        <div class="stat-value">Active</div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;">
      <!-- Recent Products -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700;">Recently Added Products</h2>
          <a href="<?= ADMIN_BASE ?>/products.php" class="btn btn-ghost btn-sm">View All</a>
        </div>
        <?php if (empty($recentProducts)): ?>
          <p style="font-size: 13px; color: var(--muted); text-align: center; padding: 20px 0;">No products added yet.</p>
        <?php else: ?>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($recentProducts as $p): ?>
                <tr>
                  <td>
                    <?php if ($p['image_path']): ?>
                      <img src="<?= htmlspecialchars($p['image_path']) ?>" class="thumb" alt="">
                    <?php else: ?>
                      <div class="no-img">◈</div>
                    <?php endif; ?>
                  </td>
                  <td style="font-weight: 500;"><?= htmlspecialchars($p['title']) ?></td>
                  <td><span class="badge-cat"><?= htmlspecialchars($p['category']) ?></span></td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        <?php endif; ?>
      </div>

      <!-- Recent Portfolio Works -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700;">Recent Portfolio Works</h2>
          <a href="<?= ADMIN_BASE ?>/portfolio.php" class="btn btn-ghost btn-sm">View All</a>
        </div>
        <?php if (empty($recentPortfolio)): ?>
          <p style="font-size: 13px; color: var(--muted); text-align: center; padding: 20px 0;">No portfolio items added yet.</p>
        <?php else: ?>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Client / Work</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($recentPortfolio as $port): ?>
                <tr>
                  <td>
                    <?php if ($port['image_path']): ?>
                      <img src="<?= htmlspecialchars($port['image_path']) ?>" class="thumb" alt="">
                    <?php else: ?>
                      <div class="no-img">◉</div>
                    <?php endif; ?>
                  </td>
                  <td style="font-weight: 500;">
                    <?= htmlspecialchars($port['title']) ?>
                    <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">Client: <?= htmlspecialchars($port['client'] ?: 'N/A') ?></div>
                  </td>
                  <td><span class="badge-cat"><?= htmlspecialchars($port['category']) ?></span></td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>

<?php renderFooter(); ?>
