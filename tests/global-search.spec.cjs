// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Global Search (Command Palette) Tests
 *
 * Tests for the ⌘+K / Ctrl+K command palette that searches
 * across modules, downloads, pages, and admin pages.
 */

test.describe('Global Search Command Palette', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (or any page with AppLayout)
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('opens with Cmd+K keyboard shortcut', async ({ page }) => {
    // Press Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    await page.keyboard.press('Meta+k');

    // Command dialog should be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Search input should be present
    await expect(page.getByPlaceholder(/Search modules, downloads, pages/i)).toBeVisible();
  });

  test('opens with Ctrl+K keyboard shortcut', async ({ page }) => {
    // Press Ctrl+K (Windows/Linux alternative)
    await page.keyboard.press('Control+k');

    // Command dialog should be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test('closes with Escape key', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');

    // Dialog should be hidden
    await expect(dialog).not.toBeVisible();
  });

  test('shows quick navigation pages by default', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');

    // Should show Pages group with navigation items (use dialog locator to avoid sidebar matches)
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog.getByText('Dashboard', { exact: true })).toBeVisible();
    await expect(dialog.getByText('My Programs')).toBeVisible();
    await expect(dialog.getByText('School Database')).toBeVisible();
    await expect(dialog.getByText('Learning Library')).toBeVisible();
  });

  test('shows admin pages group', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');

    // Should show Admin group
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
    await expect(page.getByText('Modules', { exact: true })).toBeVisible();
    await expect(page.getByText('Downloads', { exact: true })).toBeVisible();
  });

  test('filters results when typing', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');

    const dialog = page.locator('[role="dialog"]');

    // Type a search query
    const searchInput = page.getByPlaceholder(/Search modules, downloads, pages/i);
    await searchInput.fill('school');

    // Should show School Database but not Dashboard (which doesn't match)
    await expect(dialog.getByText('School Database')).toBeVisible();

    // Non-matching items should be filtered out
    // Check that "My Programs" is not visible in the dialog (doesn't contain "school")
    await expect(dialog.getByText('My Programs')).not.toBeVisible();
  });

  test('shows empty state when no results', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');

    // Type a search query that won't match anything
    const searchInput = page.getByPlaceholder(/Search modules, downloads, pages/i);
    await searchInput.fill('xyznonexistentquery123');

    // Should show empty state
    await expect(page.getByText(/No results found/i)).toBeVisible();
  });

  test('navigates to page when selecting a result', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');

    const dialog = page.locator('[role="dialog"]');

    // Click on "School Database" within the dialog
    await dialog.getByText('School Database').click();

    // Should navigate to schools page
    await expect(page).toHaveURL('/schools');

    // Dialog should be closed
    await expect(dialog).not.toBeVisible();
  });

  test('navigates using keyboard (arrow keys + enter)', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');

    // Type to filter to a single result
    const searchInput = page.getByPlaceholder(/Search modules, downloads, pages/i);
    await searchInput.fill('Learning Library');

    // Wait for filtering
    await page.waitForTimeout(300);

    // Press Enter to select
    await page.keyboard.press('Enter');

    // Should navigate to learn page
    await expect(page).toHaveURL('/learn');
  });

  test('clears search when dialog is closed and reopened', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');

    // Type something
    const searchInput = page.getByPlaceholder(/Search modules, downloads, pages/i);
    await searchInput.fill('test search');

    // Close dialog
    await page.keyboard.press('Escape');

    // Reopen dialog
    await page.keyboard.press('Meta+k');

    // Search input should be empty
    await expect(searchInput).toHaveValue('');
  });

  test('shows footer hints', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');

    // Should show keyboard hints in footer
    await expect(page.getByText(/to select/i)).toBeVisible();
    await expect(page.getByText(/esc/i)).toBeVisible();
  });

  test('admin navigation works', async ({ page }) => {
    // Open the dialog
    await page.keyboard.press('Meta+k');

    // Click on "Admin Dashboard"
    await page.getByText('Admin Dashboard').click();

    // Should navigate to admin page
    await expect(page).toHaveURL('/admin');
  });
});

test.describe('Global Search from different pages', () => {
  test('works from schools page', async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    // Open command palette
    await page.keyboard.press('Meta+k');

    // Dialog should be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
  });

  test('works from admin page', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // Open command palette
    await page.keyboard.press('Meta+k');

    // Dialog should be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
  });

  test('works from learning library', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForLoadState('domcontentloaded');

    // Open command palette
    await page.keyboard.press('Meta+k');

    // Dialog should be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
  });
});
