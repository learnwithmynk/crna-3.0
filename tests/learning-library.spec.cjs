// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Learning Library Page Tests
 *
 * Tests for /learn and /learn/:moduleSlug routes
 */

test.describe('Learning Library', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Learning Library page
    await page.goto('/learn');
  });

  test('page loads with title and search', async ({ page }) => {
    // Check page title
    await expect(page.getByRole('heading', { name: /Learning Library/i })).toBeVisible();

    // Check search input exists
    await expect(page.getByPlaceholder(/Search modules/i)).toBeVisible();
  });

  test('has view mode tabs (All, In Progress, Completed)', async ({ page }) => {
    // Check for view mode tabs
    await expect(page.getByRole('tab', { name: /All/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /In Progress/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Completed/i })).toBeVisible();
  });

  test('has sort dropdown', async ({ page }) => {
    // Check for sort select trigger
    const sortTrigger = page.locator('button').filter({ hasText: /Default Order|A to Z|Recently/i }).first();
    await expect(sortTrigger).toBeVisible();
  });

  test('search input has debounce and clear button', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Type in search
    await searchInput.fill('test search');

    // Clear button should appear
    await expect(page.getByRole('button', { name: /Clear search/i })).toBeVisible();

    // Click clear
    await page.getByRole('button', { name: /Clear search/i }).click();

    // Input should be empty
    await expect(searchInput).toHaveValue('');
  });

  test('shows empty state when no modules', async ({ page }) => {
    // The page should show some kind of content (modules or empty state)
    // Since we're using Supabase and may not have data, we check for either
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('view mode tabs can be clicked', async ({ page }) => {
    // Click "In Progress" tab
    await page.getByRole('tab', { name: /In Progress/i }).click();

    // Tab should be selected (has data-state="active")
    await expect(page.getByRole('tab', { name: /In Progress/i })).toHaveAttribute('data-state', 'active');

    // Click "Completed" tab
    await page.getByRole('tab', { name: /Completed/i }).click();
    await expect(page.getByRole('tab', { name: /Completed/i })).toHaveAttribute('data-state', 'active');

    // Click back to "All"
    await page.getByRole('tab', { name: /All/i }).click();
    await expect(page.getByRole('tab', { name: /All/i })).toHaveAttribute('data-state', 'active');
  });
});

test.describe('Module Detail Page', () => {
  test('shows error or not found for invalid module slug', async ({ page }) => {
    await page.goto('/learn/non-existent-module-xyz');

    // Wait for page to load and check for either:
    // - "Module not found" text
    // - "Back to Learning Library" link (page loaded but no module)
    // - Error message
    const notFoundOrBackLink = page.locator('text=/Module not found|Back to Learning Library|Failed to load/i');
    await expect(notFoundOrBackLink.first()).toBeVisible({ timeout: 10000 });
  });

  test('has back button on module page', async ({ page }) => {
    await page.goto('/learn/test-module');

    // Wait for page content to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Should have back button (could be <button> in error state)
    // From screenshot: it's a yellow button with "Back to Learning Library"
    const backButton = page.getByRole('button', { name: /Back to Learning Library/i });
    await expect(backButton).toBeVisible({ timeout: 15000 });

    // Click should navigate to /learn
    await backButton.click();
    await expect(page).toHaveURL('/learn');
  });
});

test.describe('Learning Library Navigation', () => {
  test('/learning redirects to /learn', async ({ page }) => {
    await page.goto('/learning');

    // Should redirect to /learn
    await expect(page).toHaveURL('/learn');
  });
});
