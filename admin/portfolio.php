<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/header.php';

requireLogin();

$db = getDB();
$error = '';
$success = '';

// Ensure additional portfolio columns exist for year, URL, and order
try {
    $db->exec("ALTER TABLE portfolio
        ADD COLUMN IF NOT EXISTS project_year VARCHAR(10) DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS project_url VARCHAR(500) DEFAULT NULL");
} catch (Exception $e) {}

// Handle Delete
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    try {
        $stmt = $db->prepare('DELETE FROM portfolio WHERE id = ?');
        $stmt->execute([$id]);
        $success = 'Portfolio item successfully deleted.';
    } catch (Exception $e) {
        $error = 'Error deleting item: ' . $e->getMessage();
    }
}

// Handle Add/Edit Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_portfolio'])) {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    $title = trim($_POST['title'] ?? '');
    $client = trim($_POST['client'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $project_year = trim($_POST['project_year'] ?? '');
    $project_url = trim($_POST['project_url'] ?? '');
    $sort_order = isset($_POST['sort_order']) ? intval($_POST['sort_order']) : 0;
    $description = trim($_POST['description'] ?? '');
    $is_active = isset($_POST['is_active']) ? 1 : 0;

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
            $error = 'Failed to upload image.';
        }
    }

    if (empty($title)) {
        $error = 'Portfolio title is required.';
    }

    if (empty($error)) {
        try {
            if ($id > 0) {
                // Update
                $stmt = $db->prepare('UPDATE portfolio SET title = ?, client = ?, category = ?, project_year = ?, project_url = ?, description = ?, image_path = ?, sort_order = ?, is_active = ? WHERE id = ?');
                $stmt->execute([$title, $client, $category, $project_year, $project_url, $description, $image_path, $sort_order, $is_active, $id]);
                $success = 'Portfolio item updated successfully.';
            } else {
                // Create
                $stmt = $db->prepare('INSERT INTO portfolio (title, client, category, project_year, project_url, description, image_path, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$title, $client, $category, $project_year, $project_url, $description, $image_path, $sort_order, $is_active]);
                $success = 'Portfolio item created successfully.';
            }
        } catch (Exception $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    }
}

// Fetch single item for edit modal
$editItem = null;
if (isset($_GET['edit'])) {
    $id = (int)$_GET['edit'];
    $stmt = $db->prepare('SELECT * FROM portfolio WHERE id = ?');
    $stmt->execute([$id]);
    $editItem = $stmt->fetch();
}

// Fetch all portfolio items
$items = $db->query('SELECT * FROM portfolio ORDER BY sort_order ASC, created_at DESC')->fetchAll();

renderHeader('Portfolio Works Management');
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
    <?php renderNav('portfolio.php', [
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
    <h1>Portfolio Works</h1>
    <div class="topbar-right">
      <a href="<?= ADMIN_BASE ?>/portfolio.php?add=1" class="btn btn-primary">+ Add New Work</a>
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
        $p = $editItem ?: [
            'id' => '', 'title' => '', 'client' => '', 'category' => '',
            'project_year' => '', 'project_url' => '', 'sort_order' => 0,
            'description' => '', 'image_path' => '', 'is_active' => 1
        ];
    ?>
      <!-- Add/Edit Form Card -->
      <div class="card">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 24px;">
          <?= $p['id'] ? 'Edit Work: ' . htmlspecialchars($p['title']) : 'Create New Work Entry' ?>
        </h2>
        <form method="POST" enctype="multipart/form-data">
          <input type="hidden" name="id" value="<?= $p['id'] ?>">
          <input type="hidden" name="current_image" value="<?= htmlspecialchars($p['image_path']) ?>">

          <div class="form-grid">
            <div class="form-group">
              <label for="title">Project / Signage Name</label>
              <input type="text" id="title" name="title" value="<?= htmlspecialchars($p['title']) ?>" placeholder="e.g., Nexus Mall ACP Frontage" required>
            </div>
            
            <div class="form-group">
              <label for="client">Client Name</label>
              <input type="text" id="client" name="client" value="<?= htmlspecialchars($p['client']) ?>" placeholder="e.g., Nexus Retail Group Ltd.">
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" name="category" required>
                <option value="">Select Category</option>
                <option value="Commercial ACP Facades" <?= $p['category'] === 'Commercial ACP Facades' ? 'selected' : '' ?>>Commercial ACP Facades</option>
                <option value="Premium Neon Letters" <?= $p['category'] === 'Premium Neon Letters' ? 'selected' : '' ?>>Premium Neon Letters</option>
                <option value="Stainless Steel Signs" <?= $p['category'] === 'Stainless Steel Signs' ? 'selected' : '' ?>>Stainless Steel Signs</option>
                <option value="High-Rise LED Boards" <?= $p['category'] === 'High-Rise LED Boards' ? 'selected' : '' ?>>High-Rise LED Boards</option>
                <option value="Retail & Storefronts" <?= $p['category'] === 'Retail & Storefronts' ? 'selected' : '' ?>>Retail & Storefronts</option>
                <option value="Hospitality & Hospitality" <?= $p['category'] === 'Hospitality & Hospitality' ? 'selected' : '' ?>>Hospitality & Hospitality</option>
              </select>
            </div>

            <div class="form-group">
              <label for="project_year">Project Year</label>
              <input type="text" id="project_year" name="project_year" value="<?= htmlspecialchars($p['project_year']) ?>" placeholder="e.g., 2025">
            </div>

            <div class="form-group">
              <label for="project_url">Project Link (optional)</label>
              <input type="url" id="project_url" name="project_url" value="<?= htmlspecialchars($p['project_url']) ?>" placeholder="https://example.com/project-page">
            </div>

            <div class="form-group">
              <label for="sort_order">Sort Order</label>
              <input type="number" id="sort_order" name="sort_order" value="<?= htmlspecialchars($p['sort_order']) ?>" min="0" placeholder="0">
            </div>

            <div class="form-group">
              <label for="image">Work Showcase Image</label>
              <input type="file" id="image" name="image" accept="image/*">
              <?php if ($p['image_path']): ?>
                <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
                  <img src="<?= htmlspecialchars($p['image_path']) ?>" class="thumb" alt="">
                  <span style="font-size: 11px; color: var(--muted);">Current asset: <?= htmlspecialchars(basename($p['image_path'])) ?></span>
                </div>
              <?php endif; ?>
            </div>

            <div class="form-group full">
              <label for="description">Project Brief / Details</label>
              <textarea id="description" name="description" placeholder="Describe the crafting, materials used, size, and design details..."><?= htmlspecialchars($p['description']) ?></textarea>
            </div>

            <div class="form-group" style="justify-content: center;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-top: 12px;">
                <input type="checkbox" name="is_active" <?= $p['is_active'] ? 'checked' : '' ?> style="width: auto;">
                <span>Active & Live in Showcase Portfolio</span>
              </label>
            </div>
          </div>

          <div style="margin-top: 32px; display: flex; gap: 12px; border-top: 1px solid var(--border); padding-top: 24px;">
            <button type="submit" name="save_portfolio" class="btn btn-primary">Save Showcase</button>
            <a href="<?= ADMIN_BASE ?>/portfolio.php" class="btn btn-ghost">Cancel</a>
          </div>
        </form>
      </div>

    <?php else: ?>
      <!-- Product List View -->
      <div class="card">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 20px;">Portfolio Showcase Work</h2>
        <?php if (empty($items)): ?>
          <p style="font-size: 13px; color: var(--muted); text-align: center; padding: 40px 0;">No portfolio entries have been added yet.</p>
        <?php else: ?>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Project Name</th>
                <th>Client</th>
                <th>Category</th>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($items as $item): ?>
                <tr>
                  <td>
                    <?php if ($item['image_path']): ?>
                      <img src="<?= htmlspecialchars($item['image_path']) ?>" class="thumb" alt="">
                    <?php else: ?>
                      <div class="no-img">◉</div>
                    <?php endif; ?>
                  </td>
                  <td style="font-weight: 600;"><?= htmlspecialchars($item['title']) ?></td>
                  <td><?= htmlspecialchars($item['client'] ?: 'General client') ?></td>
                  <td><span class="badge-cat"><?= htmlspecialchars($item['category']) ?></span></td>
                  <td>
                    <?php if ($item['is_active']): ?>
                      <span class="status-active">● Active</span>
                    <?php else: ?>
                      <span class="status-inactive">● Hidden</span>
                    <?php endif; ?>
                  </td>
                  <td>
                    <div style="display: flex; gap: 8px;">
                      <a href="<?= ADMIN_BASE ?>/portfolio.php?edit=<?= $item['id'] ?>" class="btn btn-ghost btn-sm">Edit</a>
                      <a href="<?= ADMIN_BASE ?>/portfolio.php?delete=<?= $item['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this portfolio entry?')">Delete</a>
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
