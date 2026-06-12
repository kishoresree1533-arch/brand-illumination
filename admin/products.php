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
        $stmt = $db->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $success = 'Product successfully deleted.';
    } catch (Exception $e) {
        $error = 'Error deleting product: ' . $e->getMessage();
    }
}

// Handle Add/Edit Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_product'])) {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    $title = trim($_POST['title'] ?? '');
    $slug = trim($_POST['slug'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $price = trim($_POST['price'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $is_active = isset($_POST['is_active']) ? 1 : 0;
    
    // Specifications handling
    $specs_keys = $_POST['spec_key'] ?? [];
    $specs_vals = $_POST['spec_val'] ?? [];
    $specs_array = [];
    for ($i = 0; $i < count($specs_keys); $i++) {
        $k = trim($specs_keys[$i]);
        $v = trim($specs_vals[$i]);
        if ($k !== '' && $v !== '') {
            $specs_array[$k] = $v;
        }
    }
    $specs_json = json_encode($specs_array);

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
            $error = 'Failed to upload image.';
        }
    }

    if (empty($title)) {
        $error = 'Product title is required.';
    }

    if (empty($error)) {
        try {
            if ($id > 0) {
                // Update
                $stmt = $db->prepare('UPDATE products SET slug = ?, title = ?, category = ?, description = ?, price = ?, image_path = ?, specs = ?, is_active = ? WHERE id = ?');
                $stmt->execute([$slug, $title, $category, $description, $price, $image_path, $specs_json, $is_active, $id]);
                $success = 'Product updated successfully.';
            } else {
                // Create
                $stmt = $db->prepare('INSERT INTO products (slug, title, category, description, price, image_path, specs, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$slug, $title, $category, $description, $price, $image_path, $specs_json, $is_active]);
                $success = 'Product created successfully.';
            }
        } catch (Exception $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    }
}

// Fetch single product for edit modal
$editProduct = null;
if (isset($_GET['edit'])) {
    $id = (int)$_GET['edit'];
    $stmt = $db->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$id]);
    $editProduct = $stmt->fetch();
}

// Fetch all products
$products = $db->query('SELECT * FROM products ORDER BY sort_order ASC, created_at DESC')->fetchAll();

renderHeader('Products Management');
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
    <?php renderNav('products.php', [
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
    <h1>Products Management</h1>
    <div class="topbar-right">
      <a href="<?= ADMIN_BASE ?>/products.php?add=1" class="btn btn-primary">+ Add New Product</a>
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
        $p = $editProduct ?: [
            'id' => '', 'title' => '', 'slug' => '', 'category' => '', 
            'price' => '', 'description' => '', 'image_path' => '', 
            'specs' => '{}', 'is_active' => 1
        ];
        $specs = json_decode($p['specs'] ?: '{}', true);
    ?>
      <!-- Add/Edit Form Card -->
      <div class="card">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 24px;">
          <?= $p['id'] ? 'Edit Product: ' . htmlspecialchars($p['title']) : 'Create New Product' ?>
        </h2>
        <form method="POST" enctype="multipart/form-data">
          <input type="hidden" name="id" value="<?= $p['id'] ?>">
          <input type="hidden" name="current_image" value="<?= htmlspecialchars($p['image_path']) ?>">

          <div class="form-grid">
            <div class="form-group">
              <label for="title">Product Title</label>
              <input type="text" id="title" name="title" value="<?= htmlspecialchars($p['title']) ?>" placeholder="e.g., Brushed Aluminium Sign" required>
            </div>
            
            <div class="form-group">
              <label for="slug">Slug (URL string)</label>
              <input type="text" id="slug" name="slug" value="<?= htmlspecialchars($p['slug']) ?>" placeholder="e.g., brushed-aluminium-sign (Optional)">
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" name="category" required>
                <option value="">Select Category</option>
                <option value="CNC & LASER CUTTING" <?= $p['category'] === 'CNC & LASER CUTTING' ? 'selected' : '' ?>>CNC & LASER CUTTING</option>
                <option value="LED & ILLUMINATION" <?= $p['category'] === 'LED & ILLUMINATION' ? 'selected' : '' ?>>LED & ILLUMINATION</option>
                <option value="CORPORATE BRANDING" <?= $p['category'] === 'CORPORATE BRANDING' ? 'selected' : '' ?>>CORPORATE BRANDING</option>
                <option value="PRINTING & SIGNBOARDS" <?= $p['category'] === 'PRINTING & SIGNBOARDS' ? 'selected' : '' ?>>PRINTING & SIGNBOARDS</option>
              </select>
            </div>

            <div class="form-group">
              <label for="price">Est. Pricing / Subtitle</label>
              <input type="text" id="price" name="price" value="<?= htmlspecialchars($p['price']) ?>" placeholder="e.g., Premium pricing on request">
            </div>

            <div class="form-group full">
              <label for="description">Detailed Description</label>
              <textarea id="description" name="description"><?= htmlspecialchars($p['description']) ?></textarea>
            </div>

            <div class="form-group">
              <label for="image">Product Image File</label>
              <input type="file" id="image" name="image" accept="image/*">
              <?php if ($p['image_path']): ?>
                <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
                  <img src="<?= htmlspecialchars($p['image_path']) ?>" class="thumb" alt="">
                  <span style="font-size: 11px; color: var(--muted);">Current asset: <?= htmlspecialchars(basename($p['image_path'])) ?></span>
                </div>
              <?php endif; ?>
            </div>

            <div class="form-group" style="justify-content: center;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-top: 24px;">
                <input type="checkbox" name="is_active" <?= $p['is_active'] ? 'checked' : '' ?> style="width: auto;">
                <span>Active & Visible on Catalogue</span>
              </label>
            </div>

            <div class="form-group full">
              <label style="margin-bottom: 4px;">Technical Specifications</label>
              <p style="font-size: 11px; color: var(--muted); margin-bottom: 12px;">Add key-value specs pairs like "Materials" : "Anodized Aluminum", "Lighting" : "24V LED", etc.</p>
              
              <div id="specs-container" style="display: flex; flex-direction: column; gap: 10px;">
                <?php 
                $spec_count = 0;
                foreach ($specs as $k => $v): 
                  $spec_count++;
                ?>
                  <div class="spec-row" style="display: flex; gap: 10px;">
                    <input type="text" name="spec_key[]" value="<?= htmlspecialchars($k) ?>" placeholder="Spec Label (e.g. Dimensions)" style="flex: 1;">
                    <input type="text" name="spec_val[]" value="<?= htmlspecialchars($v) ?>" placeholder="Spec Value (e.g. 120cm x 60cm)" style="flex: 1;">
                    <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">Remove</button>
                  </div>
                <?php endforeach; ?>

                <?php if ($spec_count === 0): ?>
                  <div class="spec-row" style="display: flex; gap: 10px;">
                    <input type="text" name="spec_key[]" placeholder="Spec Label (e.g. Material)" style="flex: 1;">
                    <input type="text" name="spec_val[]" placeholder="Spec Value (e.g. Anodized Steel)" style="flex: 1;">
                    <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">Remove</button>
                  </div>
                <?php endif; ?>
              </div>
              <button type="button" class="btn btn-ghost btn-sm" style="margin-top: 12px; width: fit-content;" onclick="addSpecRow()">+ Add Spec Row</button>
            </div>
          </div>

          <div style="margin-top: 32px; display: flex; gap: 12px; border-top: 1px solid var(--border); padding-top: 24px;">
            <button type="submit" name="save_product" class="btn btn-primary">Save Product</button>
            <a href="<?= ADMIN_BASE ?>/products.php" class="btn btn-ghost">Cancel</a>
          </div>
        </form>
      </div>

      <script>
      function addSpecRow() {
        const container = document.getElementById('specs-container');
        const row = document.createElement('div');
        row.className = 'spec-row';
        row.style.display = 'flex';
        row.style.gap = '10px';
        row.innerHTML = `
          <input type="text" name="spec_key[]" placeholder="Spec Label" style="flex: 1;">
          <input type="text" name="spec_val[]" placeholder="Spec Value" style="flex: 1;">
          <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">Remove</button>
        `;
        container.appendChild(row);
      }
      </script>

    <?php else: ?>
      <!-- Product List View -->
      <div class="card">
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 20px;">Catalogue Inventory</h2>
        <?php if (empty($products)): ?>
          <p style="font-size: 13px; color: var(--muted); text-align: center; padding: 40px 0;">No products have been added to the database catalog yet.</p>
        <?php else: ?>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($products as $p): ?>
                <tr>
                  <td>
                    <?php if ($p['image_path']): ?>
                      <img src="<?= htmlspecialchars($p['image_path']) ?>" class="thumb" alt="">
                    <?php else: ?>
                      <div class="no-img">◈</div>
                    <?php endif; ?>
                  </td>
                  <td style="font-weight: 600;"><?= htmlspecialchars($p['title']) ?></td>
                  <td><span class="badge-cat"><?= htmlspecialchars($p['category']) ?></span></td>
                  <td><?= htmlspecialchars($p['price'] ?: 'On Request') ?></td>
                  <td>
                    <?php if ($p['is_active']): ?>
                      <span class="status-active">● Active</span>
                    <?php else: ?>
                      <span class="status-inactive">● Hidden</span>
                    <?php endif; ?>
                  </td>
                  <td>
                    <div style="display: flex; gap: 8px;">
                      <a href="<?= ADMIN_BASE ?>/products.php?edit=<?= $p['id'] ?>" class="btn btn-ghost btn-sm">Edit</a>
                      <a href="<?= ADMIN_BASE ?>/products.php?delete=<?= $p['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this product?')">Delete</a>
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
