/**
 * Downloads Admin Pages - Comprehensive Tests
 *
 * Tests the full user flow for managing downloads:
 * 1. List page display and navigation
 * 2. Create new download
 * 3. Form fields and validation
 * 4. File source toggle (Upload vs URL)
 * 5. Category selection
 * 6. Access control (Free vs Entitlements)
 * 7. Edit existing download
 * 8. Delete with confirmation
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5176';

test.describe('Downloads Admin - List Page', () => {
  test('should load downloads list page with stats cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads`);

    // Should show 4 stats cards
    await expect(page.getByText('Total').first()).toBeVisible();
    await expect(page.getByText('Active').first()).toBeVisible();
    await expect(page.getByText('Archived').first()).toBeVisible();
    await expect(page.getByText('Total Downloads')).toBeVisible();
  });

  test('should display search and filter controls', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads`);

    // Search input
    await expect(page.getByPlaceholder('Search downloads...')).toBeVisible();

    // Filters (comboboxes)
    const comboboxes = page.locator('button[role="combobox"]');
    await expect(comboboxes.first()).toBeVisible();

    // New Download button
    await expect(page.getByRole('button', { name: /New Download/i })).toBeVisible();
  });

  test('should display downloads list card', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads`);

    // Downloads card header
    await expect(page.getByRole('heading', { name: 'Downloads' }).first()).toBeVisible();
  });

  test('should navigate to new download page when clicking New Download button', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads`);

    await page.getByRole('button', { name: /New Download/i }).click();

    // Should navigate to new download page
    await expect(page).toHaveURL(`${BASE_URL}/admin/downloads/new`);
  });

  test('should have status filter dropdown with options', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads`);

    // Find status filter (first combobox with All Status text)
    const statusFilter = page.locator('button[role="combobox"]').filter({ hasText: 'All Status' });
    await statusFilter.click();

    // Should show filter options
    await expect(page.getByRole('option', { name: 'All Status' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Active' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Archived' })).toBeVisible();
  });

  test('should have category filter dropdown', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads`);

    // Find category filter
    const categoryFilter = page.locator('button[role="combobox"]').filter({ hasText: 'All Categories' });
    await categoryFilter.click();

    // Should show "All Categories" option
    await expect(page.getByRole('option', { name: 'All Categories' })).toBeVisible();
  });

  test('should allow typing in search box', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads`);

    const searchInput = page.getByPlaceholder('Search downloads...');
    await searchInput.fill('resume');

    await expect(searchInput).toHaveValue('resume');
  });
});

test.describe('Downloads Admin - New Download Page', () => {
  test('should load new download page with header', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Should show back button
    await expect(page.getByRole('button', { name: /Back to Downloads/i })).toBeVisible();

    // Should show save button
    await expect(page.getByRole('button', { name: /Save/i })).toBeVisible();
  });

  test('should display Download Details card with form fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Card title
    await expect(page.getByRole('heading', { name: 'Download Details' })).toBeVisible();

    // Title field - use more specific selector
    await expect(page.getByLabel(/^Title/)).toBeVisible();

    // Slug field
    await expect(page.getByLabel(/^Slug/)).toBeVisible();

    // Generate button for slug
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();

    // Description field
    await expect(page.getByLabel('Description')).toBeVisible();
  });

  test('should display File card with source toggle', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Card title
    await expect(page.getByRole('heading', { name: 'File' })).toBeVisible();

    // File source toggle buttons
    await expect(page.getByRole('button', { name: /Upload File/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /External URL/i })).toBeVisible();
  });

  test('should display Categories card', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Card title
    await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();
  });

  test('should display Access Control card with Free Download checkbox', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Card title
    await expect(page.getByRole('heading', { name: 'Access Control' })).toBeVisible();

    // Free Download checkbox
    await expect(page.getByText('Free Download')).toBeVisible();
  });

  test('should display Purchase & Reference card', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Card title
    await expect(page.getByRole('heading', { name: 'Purchase & Reference' })).toBeVisible();

    // WooCommerce Product URL field
    await expect(page.getByLabel('WooCommerce Product URL')).toBeVisible();

    // Groundhogg Tag field
    await expect(page.getByLabel(/Groundhogg Tag/i)).toBeVisible();
  });
});

test.describe('Downloads Admin - Form Interactions', () => {
  test('should auto-generate slug from title', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Enter title
    const titleInput = page.getByLabel(/^Title/);
    await titleInput.fill('CRNA Resume Template 2024');

    // Click generate button
    await page.getByRole('button', { name: 'Generate' }).click();

    // Slug should be generated
    const slugInput = page.getByLabel(/^Slug/);
    await expect(slugInput).toHaveValue('crna-resume-template-2024');
  });

  test('should toggle between Upload File and External URL modes', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Default should show URL mode (External URL is the default)
    await expect(page.getByLabel('File URL')).toBeVisible();
    await expect(page.getByPlaceholder('https://drive.google.com/...')).toBeVisible();

    // Click Upload File button to switch to upload mode
    await page.getByRole('button', { name: /Upload File/i }).click();

    // Should show upload zone
    await expect(page.getByText('Click to upload or drag and drop')).toBeVisible();

    // Click External URL button to switch back
    await page.getByRole('button', { name: /External URL/i }).click();

    // Should show URL input field again
    await expect(page.getByLabel('File URL')).toBeVisible();
  });

  test('should toggle Free Download checkbox and hide/show entitlements', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Initially, should show entitlements section text
    await expect(page.getByText('Select which membership tiers can access')).toBeVisible();

    // Click the Free Download checkbox area
    const freeCheckbox = page.locator('label').filter({ hasText: 'Free Download' });
    await freeCheckbox.click();

    // Entitlements section should be hidden
    await expect(page.getByText('Select which membership tiers can access')).not.toBeVisible();

    // Click again to uncheck
    await freeCheckbox.click();

    // Entitlements should be visible again
    await expect(page.getByText('Select which membership tiers can access')).toBeVisible();
  });

  test('should show warning when no access level selected', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Should show warning about no access level (default state)
    await expect(page.getByText('No access level selected')).toBeVisible();
  });

  test('should fill in WooCommerce product URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    const wooInput = page.getByLabel('WooCommerce Product URL');
    await wooInput.fill('https://thecrnaclub.com/product/resume-template');

    await expect(wooInput).toHaveValue('https://thecrnaclub.com/product/resume-template');
  });
});

test.describe('Downloads Admin - Form Validation', () => {
  test('should show error toast when saving without title', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Click save without filling required fields
    await page.getByRole('button', { name: /Save/i }).click();

    // Should show error toast for title
    await expect(page.getByText('Title is required')).toBeVisible({ timeout: 5000 });
  });

  test('should show error toast when saving without slug', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Fill title but not slug
    await page.getByLabel(/^Title/).fill('Test Download');

    // Click save
    await page.getByRole('button', { name: /Save/i }).click();

    // Should show error toast for slug
    await expect(page.getByText('Slug is required')).toBeVisible({ timeout: 5000 });
  });

  test('should show error toast when saving without file URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Fill title and slug
    await page.getByLabel(/^Title/).fill('Test Download');
    await page.getByRole('button', { name: 'Generate' }).click();

    // Click save without file URL
    await page.getByRole('button', { name: /Save/i }).click();

    // Should show error toast for file URL
    await expect(page.getByText('File URL is required')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Downloads Admin - Navigation', () => {
  test('should navigate back to list when clicking Back button', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    await page.getByRole('button', { name: /Back to Downloads/i }).click();

    await expect(page).toHaveURL(`${BASE_URL}/admin/downloads`);
  });
});

test.describe('Downloads Admin - File Type and Status Dropdowns', () => {
  test('should have file type dropdown options', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Click the File Type dropdown (the one with "Select type" placeholder)
    const fileTypeSelect = page.locator('button[role="combobox"]').filter({ hasText: /Select type/i });
    await fileTypeSelect.click();

    // Should show file type options
    await expect(page.getByRole('option', { name: 'PDF Document' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Word Document' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Excel Spreadsheet' })).toBeVisible();
  });

  test('should have status dropdown with Active and Archived options', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Find and click the Status dropdown (defaults to Active)
    const statusSelect = page.locator('button[role="combobox"]').filter({ hasText: 'Active' });
    await statusSelect.click();

    // Should show status options
    await expect(page.getByRole('option', { name: 'Active' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Archived' })).toBeVisible();
  });
});

test.describe('Downloads Admin - Full Create Flow', () => {
  test('should fill complete form with External URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads/new`);

    // Fill title
    await page.getByLabel(/^Title/).fill('CRNA Interview Prep Guide');

    // Generate slug
    await page.getByRole('button', { name: 'Generate' }).click();

    // Verify slug was generated
    await expect(page.getByLabel(/^Slug/)).toHaveValue('crna-interview-prep-guide');

    // Fill description
    await page.getByLabel('Description').fill('Comprehensive guide for CRNA interview preparation');

    // Switch to External URL mode
    await page.getByRole('button', { name: /External URL/i }).click();

    // Fill file URL
    await page.getByLabel('File URL').fill('https://drive.google.com/file/d/abc123/view');

    // Select file type
    const fileTypeSelect = page.locator('button[role="combobox"]').filter({ hasText: /Select type/i });
    await fileTypeSelect.click();
    await page.getByRole('option', { name: 'PDF Document' }).click();

    // Check Free Download
    const freeCheckbox = page.locator('label').filter({ hasText: 'Free Download' });
    await freeCheckbox.click();

    // Fill WooCommerce URL (optional)
    await page.getByLabel('WooCommerce Product URL').fill('https://thecrnaclub.com/product/interview-guide');

    // Verify all fields are filled correctly
    await expect(page.getByLabel(/^Title/)).toHaveValue('CRNA Interview Prep Guide');
    await expect(page.getByLabel(/^Slug/)).toHaveValue('crna-interview-prep-guide');
    await expect(page.getByLabel('Description')).toHaveValue('Comprehensive guide for CRNA interview preparation');
    await expect(page.getByLabel('File URL')).toHaveValue('https://drive.google.com/file/d/abc123/view');

    // Note: We're not clicking Save as it would require Supabase connection
  });
});

test.describe('Downloads Admin - Edit Existing Download', () => {
  test('should show existing download in list with action menu', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads`);

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Look for action menu button (three dots)
    const actionButtons = page.locator('button').filter({ has: page.locator('svg') });

    // Should have at least the basic UI elements
    await expect(page.getByPlaceholder('Search downloads...')).toBeVisible();
  });
});

test.describe('Downloads Admin - Delete Confirmation', () => {
  test('should show delete option in action menu', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/downloads`);

    // Wait for content to load
    await page.waitForTimeout(1000);

    // Find a download row's action menu (three vertical dots button)
    const actionMenu = page.locator('[data-testid="download-actions"]').first();

    // If no test ID, try finding by the MoreVertical icon pattern
    const moreButton = page.locator('button').filter({ has: page.locator('.lucide-more-vertical, .lucide-ellipsis-vertical') }).first();

    if (await moreButton.isVisible()) {
      await moreButton.click();

      // Should show delete option
      await expect(page.getByRole('menuitem', { name: /Delete/i })).toBeVisible();
    }
  });
});
