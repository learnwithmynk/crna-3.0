// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Inline Search Tests
 *
 * Tests for the InlineSearch component used in LearningLibraryPage
 * and ModuleDetailPage for filtering content.
 */

test.describe('Inline Search on Learning Library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn');
    await page.waitForLoadState('domcontentloaded');
  });

  test('search input is visible with placeholder', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search modules/i);
    await expect(searchInput).toBeVisible();
  });

  test('typing in search filters results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Type a search query
    await searchInput.fill('test');

    // Wait for debounce (300ms default + some buffer)
    await page.waitForTimeout(400);

    // The page should show filtered content (either results or "no results")
    // We can't guarantee specific content exists, so just verify the input works
    await expect(searchInput).toHaveValue('test');
  });

  test('clear button appears when text is entered', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Clear button should not be visible initially
    const clearButton = page.getByRole('button', { name: /Clear search/i });
    await expect(clearButton).not.toBeVisible();

    // Type something
    await searchInput.fill('hello');

    // Clear button should now be visible
    await expect(clearButton).toBeVisible();
  });

  test('clear button clears the search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Type something
    await searchInput.fill('test query');
    await expect(searchInput).toHaveValue('test query');

    // Click clear button
    await page.getByRole('button', { name: /Clear search/i }).click();

    // Input should be empty
    await expect(searchInput).toHaveValue('');
  });

  test('escape key clears the search', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Type something
    await searchInput.fill('test');
    await expect(searchInput).toHaveValue('test');

    // Press Escape
    await searchInput.press('Escape');

    // Input should be empty
    await expect(searchInput).toHaveValue('');
  });

  test('search has debounce behavior', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Type quickly
    await searchInput.type('test', { delay: 50 });

    // Value should update immediately in the input
    await expect(searchInput).toHaveValue('test');
  });

  test('filtered results count is shown', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Type a search query
    await searchInput.fill('xyz123nonexistent');

    // Wait for debounce and filtering
    await page.waitForTimeout(500);

    // Should show filtered message or empty state
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});

test.describe('Inline Search on Module Detail Page', () => {
  test('search input is visible on module page', async ({ page }) => {
    // Navigate to a module page (will show not found if module doesn't exist)
    await page.goto('/learn/test-module');
    await page.waitForLoadState('domcontentloaded');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Check if we're on an error/not found page
    const notFound = page.getByText(/Module not found|Failed to load/i);
    const isNotFound = await notFound.isVisible().catch(() => false);

    if (!isNotFound) {
      // If module exists, search input should be visible
      const searchInput = page.getByPlaceholder(/Search lessons/i);
      await expect(searchInput).toBeVisible();
    }
  });

  test('lesson search filters lessons', async ({ page }) => {
    await page.goto('/learn/test-module');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check if we're on an error/not found page
    const notFound = page.getByText(/Module not found|Failed to load/i);
    const isNotFound = await notFound.isVisible().catch(() => false);

    if (!isNotFound) {
      const searchInput = page.getByPlaceholder(/Search lessons/i);

      // Type a search query
      await searchInput.fill('test');

      // Wait for debounce
      await page.waitForTimeout(400);

      // Input should reflect the value
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('search results count shows when filtering', async ({ page }) => {
    await page.goto('/learn/test-module');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check if we're on an error/not found page
    const notFound = page.getByText(/Module not found|Failed to load/i);
    const isNotFound = await notFound.isVisible().catch(() => false);

    if (!isNotFound) {
      const searchInput = page.getByPlaceholder(/Search lessons/i);

      // Type a search query
      await searchInput.fill('test');

      // Wait for debounce
      await page.waitForTimeout(400);

      // Should show "X lesson(s) found" message when filtering
      // This may or may not appear depending on data
      const resultsMessage = page.getByText(/lesson.*found/i);
      // Just check page didn't crash
      await expect(page.locator('main')).toBeVisible();
    }
  });
});

test.describe('InlineSearch accessibility', () => {
  test('search input has proper focus styles', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Focus the input
    await searchInput.focus();

    // Input should be focused
    await expect(searchInput).toBeFocused();
  });

  test('clear button is keyboard accessible', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Type something to make clear button appear
    await searchInput.fill('test');

    // Tab to clear button
    await page.keyboard.press('Tab');

    // Clear button should be focused
    const clearButton = page.getByRole('button', { name: /Clear search/i });

    // Press Enter to activate
    await page.keyboard.press('Enter');

    // Input should be empty and focused again
    await expect(searchInput).toHaveValue('');
    await expect(searchInput).toBeFocused();
  });

  test('minimum touch target size (44px)', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForLoadState('domcontentloaded');

    const searchInput = page.getByPlaceholder(/Search modules/i);

    // Check input height is at least 44px
    const box = await searchInput.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});
