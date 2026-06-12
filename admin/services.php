<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/header.php';

requireLogin();

$db = getDB();
$error = '';
$success = '';

// Handle Delete
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    try {
        $stmt = $db->prepare('DELETE FROM services WHERE id = ?');
        $stmt->execute([$id]);
        $success = 'Service entry successfully deleted.';
    } catch (Exception $e) {
        $error = 'Error deleting service: ' . $e->getMessage();
    }
}

// Handle Add/Edit Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_service'])) {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    $title = trim($_POST['title'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $subtitle = trim($_POST['subtitle'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $icon = trim($_POST['icon'] ?? '');
    $is_active = isset($_POST['is_active']) ? 1 : 0;

    if (!$slug) {
        $slug = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $title));
    }

    // Image Upload Handling
    $image_path = $_POST['current_image'] ?? '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../src/assets/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        $filename = time() . '_' . basename($_FILES['image']['name']);
        $target_file = $upload_dir . $filename;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
            $image_path = '/src/assets/' . $filename;
        } else {
            $error = 'Failed to upload banner image.';
        }
    }

    if (empty($title)) {
        $error = 'Service title is required.';
    }

    if (empty($error)) {
        try {
            if ($id > 0) {
                // Update
                $stmt = $db->prepare('UPDATE services SET slug = ?, title = ?, subtitle = ?, description = ?, icon = ?, image_path = ?, is_active = ? WHERE id = ?');
                $stmt->execute([$slug, $title, $subtitle, $description, $icon, $image_path, $is_active, $id]);
                $success = 'Service updated successfully.';
            } else {
                // Create
                $stmt = $db->prepare('INSERT INTO services (slug, title, subtitle, description, icon, image_path, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$slug, $title, $subtitle, $description, $icon, $image_path, $is_active]);
                $success = 'Service created successfully.';
            }
        } catch (Exception $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    }
}

// Fetch single service for edit modal
$editService = null;
if (isset($_GET['edit'])) {
    $id = (int)$_GET['edit'];
    $stmt = $db->prepare('SELECT * FROM services WHERE id = ?');
    $stmt->execute([$id]);
    $editService = $stmt->fetch();
}

// Fetch all services
$services = $db->query('SELECT * FROM services ORDER BY sort_order ASC, created_at DESC')->fetchAll();

renderHeader('Services Management');
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
    <?php renderNav('services.php', [
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
    <h1>Services Management</h1>
    <div class="topbar-right">
      <a href="<?= ADMIN_BASE ?>/services.php?add=1" class="btn btn-primary">+ Add New Service</a>
    </div>
  </div>
  
  <div class="content">
    <?php if ($success): ?>
      <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
    <?php endif; ?>
    <?php if ($error): ?>
      <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <?php if (isset($_GET['add']) || isset($_GET['edit'])): 
        $s = $editService ?: [
            'id' => '', 'title' => '', 'slug' => '', 'subtitle' => '', 
            'description' => '', 'icon' => 'Cpu', 'image_path' => '', 'is_active' => 1
        ];
    ?>
      <!-- Add/Edit Form Card -->
      <div class="card">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 24px;">
          <?= $s['id'] ? 'Edit Service: ' . htmlspecialchars($s['title']) : 'Create New Service Capability' ?>
        </h2>
        <form method="POST" enctype="multipart/form-data">
          <input type="hidden" name="id" value="<?= $s['id'] ?>">
          <input type="hidden" name="current_image" value="<?= htmlspecialchars($s['image_path']) ?>">

          <div class="form-grid">
            <div class="form-group">
              <label for="title">Service Title</label>
              <input type="text" id="title" name="title" value="<?= htmlspecialchars($s['title']) ?>" placeholder="e.g., CNC Router Engraving" required>
            </div>
            
            <div class="form-group">
              <label for="slug">Slug (URL Name)</label>
              <input type="text" id="slug" name="slug" value="<?= htmlspecialchars($s['slug']) ?>" placeholder="e.g., cnc-router-engraving (Optional)">
            </div>

            <div class="form-group">
              <label for="subtitle">Short Summary / Subtitle</label>
              <input type="text" id="subtitle" name="subtitle" value="<?= htmlspecialchars($s['subtitle']) ?>" placeholder="e.g., Industrial routing on ACP, brass, steel, and wood sheets.">
            </div>

            <div class="form-group">
              <label for="icon">Icon Element (Lucide Icon Name)</label>
              <select id="icon" name="icon" required>
                <option value="Cpu" <?= $s['icon'] === 'Cpu' ? 'selected' : '' ?>>Cpu / Chip</option>
                <option value="Zap" <?= $s['icon'] === 'Zap' ? 'selected' : '' ?>>Zap / Electrical</option>
                <option value="Sparkles" <?= $s['icon'] === 'Sparkles' ? 'selected' : '' ?>>Sparkles / Fine Art</option>
                <option value="Layers" <?= $s['icon'] === 'Layers' ? 'selected' : '' ?>>Layers / Facade</option>
                <option value="Eye" <?= $s['icon'] === 'Eye' ? 'selected' : '' ?>>Eye / Render Design</option>
                <option value="Shield" <?= $s['icon'] === 'Shield' ? 'selected' : '' ?>>Shield / Protection</option>
              </select>
            </div>

            <div class="form-group">
              <label for="image">Banner / Service Showcase Image</label>
              <input type="file" id="image" name="image" accept="image/*">
              <?php if ($s['image_path']): ?>
                <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
                  <img src="<?= htmlspecialchars($s['image_path']) ?>" class="thumb" alt="">
                  <span style="font-size: 11px; color: var(--muted);">Current asset: <?= htmlspecialchars(basename($s['image_path'])) ?></span>
                </div>
              <?php endif; ?>
            </div>

            <div class="form-group" style="justify-content: center;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-top: 24px;">
                <input type="checkbox" name="is_active" <?= $s['is_active'] ? 'checked' : '' ?> style="width: auto;">
                <span>Active & Listed in Services</span>
              </label>
            </div>

            <div class="form-group full">
              <label for="description">Detailed Capability Explanation</label>
              <textarea id="description" name="description" placeholder="Provide full details of our machines, precision, speed, materials supported..."><?= htmlspecialchars($s['description']) ?></textarea>
            </div>
          </div>

          <div style="margin-top: 32px; display: flex; gap: 12px; border-top: 1px solid var(--border); padding-top: 24px;">
            <button type="submit" name="save_service" class="btn btn-primary">Save Capability</button>
            <a href="<?= ADMIN_BASE ?>/services.php" class="btn btn-ghost">Cancel</a>
          </div>
        </form>
      </div>

    <?php else: ?>
      <!-- Product List View -->
      <div class="card">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 20px;">Capabilities & Services</h2>
        <?php if (empty($services)): ?>
          <p style="font-size: 13px; color: var(--muted); text-align: center; padding: 40px 0;">No capabilities have been registered in the database yet.</p>
        <?php else: ?>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Service / Title</th>
                <th>Icon</th>
                <th>Subtitle</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($services as $srv): ?>
                <tr>
                  <td>
                    <?php if ($srv['image_path']): ?>
                      <img src="<?= htmlspecialchars($srv['image_path']) ?>" class="thumb" alt="">
                    <?php else: ?>
                      <div class="no-img">◫</div>
                    <?php endif; ?>
                  </td>
                  <td style="font-weight: 600;"><?= htmlspecialchars($srv['title']) ?></td>
                  <td style="font-family: monospace; font-size: 12px; color: var(--gold);"><?= htmlspecialchars($srv['icon']) ?></td>
                  <td style="color: var(--muted); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><?= htmlspecialchars($srv['subtitle']) ?></td>
                  <td>
                    <?php if ($srv['is_active']): ?>
                      <span class="status-active">● Active</span>
                    <?php else: ?>
                      <span class="status-inactive">● Hidden</span>
                    <?php endif; ?>
                  </td>
                  <td>
                    <div style="display: flex; gap: 8px;">
                      <a href="<?= ADMIN_BASE ?>/services.php?edit=<?= $srv['id'] ?>" class="btn btn-ghost btn-sm">Edit</a>
                      <a href="<?= ADMIN_BASE ?>/services.php?delete=<?= $srv['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this service capability?')">Delete</a>
                    </div>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        <?php endif; ?>
      </div>
    <?php endif; ?>
  </div>
</div>

<?php renderFooter(); ?>
