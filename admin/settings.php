<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/header.php';

requireLogin();

$db = getDB();
$error = '';
$success = '';

// Handle Settings Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_settings'])) {
    $settings = [
        'site_name' => $_POST['site_name'] ?? '',
        'site_tagline' => $_POST['site_tagline'] ?? '',
        'contact_phone' => $_POST['contact_phone'] ?? '',
        'contact_email' => $_POST['contact_email'] ?? '',
        'contact_address' => $_POST['contact_address'] ?? '',
    ];

    try {
        $db->beginTransaction();
        $stmt = $db->prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?');
        foreach ($settings as $key => $val) {
            $stmt->execute([$key, trim($val), trim($val)]);
        }
        $db->commit();
        $success = 'General site settings updated successfully.';
    } catch (Exception $e) {
        $db->rollBack();
        $error = 'Error saving settings: ' . $e->getMessage();
    }
}

// Handle Password Change
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_password'])) {
    $current_pass = $_POST['current_password'] ?? '';
    $new_pass = $_POST['new_password'] ?? '';
    $confirm_pass = $_POST['confirm_password'] ?? '';

    if ($current_pass && $new_pass && $confirm_pass) {
        if ($new_pass !== $confirm_pass) {
            $error = 'New passwords do not match.';
        } else {
            // Validate current password
            $stmt = $db->prepare('SELECT password FROM admin_users WHERE id = ?');
            $stmt->execute([$_SESSION['admin_id']]);
            $hashed = $stmt->fetchColumn();

            if ($hashed && password_verify($current_pass, $hashed)) {
                // Update password
                $new_hash = password_hash($new_pass, PASSWORD_BCRYPT);
                $stmt = $db->prepare('UPDATE admin_users SET password = ? WHERE id = ?');
                $stmt->execute([$new_hash, $_SESSION['admin_id']]);
                $success = 'Admin password updated successfully.';
            } else {
                $error = 'Current password is incorrect.';
            }
        }
    } else {
        $error = 'Please fill in all fields for changing password.';
    }
}

// Fetch all settings
$settings_raw = $db->query('SELECT setting_key, setting_value FROM site_settings')->fetchAll();
$s = [];
foreach ($settings_raw as $row) {
    $s[$row['setting_key']] = $row['setting_value'];
}
// Defaults if not set
$s = array_merge([
    'site_name' => 'RM Sign Factory',
    'site_tagline' => 'Premium Signage Solutions',
    'contact_phone' => '+91 88072 47435 / +91 63748 63533',
    'contact_email' => 'hello@rmsignfactory.com',
    'contact_address' => 'No: 14, Thanigai Valan st, Kailash Nagar, ECR Main Road, Puducherry - 605 008'
], $s);

renderHeader('Site Settings');
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
    <?php renderNav('settings.php', [
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
    <h1>Site Settings</h1>
    <div class="topbar-right">
      <span class="badge">Connected</span>
    </div>
  </div>
  
  <div class="content">
    <?php if ($success): ?>
      <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
    <?php endif; ?>
    <?php if ($error): ?>
      <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px;">
      <!-- General Settings -->
      <div class="card">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 20px;">General Configuration</h2>
        <form method="POST">
          <div class="form-grid">
            <div class="form-group">
              <label for="site_name">Site Title / Brand Name</label>
              <input type="text" id="site_name" name="site_name" value="<?= htmlspecialchars($s['site_name']) ?>" required>
            </div>
            
            <div class="form-group">
              <label for="site_tagline">Tagline / Subheading</label>
              <input type="text" id="site_tagline" name="site_tagline" value="<?= htmlspecialchars($s['site_tagline']) ?>" required>
            </div>

            <div class="form-group">
              <label for="contact_phone">Contact Phone</label>
              <input type="text" id="contact_phone" name="contact_phone" value="<?= htmlspecialchars($s['contact_phone']) ?>">
            </div>

            <div class="form-group">
              <label for="contact_email">Contact Email</label>
              <input type="text" id="contact_email" name="contact_email" value="<?= htmlspecialchars($s['contact_email']) ?>">
            </div>

            <div class="form-group full">
              <label for="contact_address">Physical Address</label>
              <textarea id="contact_address" name="contact_address"><?= htmlspecialchars($s['contact_address']) ?></textarea>
            </div>
          </div>

          <div style="margin-top: 24px; border-top: 1px solid var(--border); padding-top: 20px;">
            <button type="submit" name="save_settings" class="btn btn-primary">Save Settings</button>
          </div>
        </form>
      </div>

      <!-- Security / Change Password -->
      <div class="card">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 20px;">Change Password</h2>
        <form method="POST">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="form-group">
              <label for="current_password">Current Password</label>
              <input type="password" id="current_password" name="current_password" required autocomplete="current-password">
            </div>

            <div class="form-group">
              <label for="new_password">New Password</label>
              <input type="password" id="new_password" name="new_password" required autocomplete="new-password">
            </div>

            <div class="form-group">
              <label for="confirm_password">Confirm New Password</label>
              <input type="password" id="confirm_password" name="confirm_password" required autocomplete="new-password">
            </div>

            <div style="margin-top: 12px; border-top: 1px solid var(--border); padding-top: 20px;">
              <button type="submit" name="change_password" class="btn btn-ghost" style="width: 100%; justify-content: center;">Update Security Password</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<?php renderFooter(); ?>
