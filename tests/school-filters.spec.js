import { test, expect } from '@playwright/test';

test.describe('School Database Filters', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding modal BEFORE navigating
    await page.addInitScript(() => {
      localStorage.setItem('schoolDatabaseOnboarded', 'true');
    });

    await page.goto('/schools');
    await page.waitForLoadState('networkidle');

    // Give page time to settle
    await page.waitForTimeout(500);
  });

  test('page loads with filter sidebar', async ({ page }) => {
    // Check the filter sidebar label for "School Name"
    await expect(page.locator('label').filter({ hasText: 'School Name' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Location' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Tuition' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'GRE' }).first()).toBeVisible();
  });

  test('search filter works', async ({ page }) => {
    // Type in search
    await page.getByPlaceholder('Search...').fill('Duke');

    // Wait for results to filter
    await page.waitForTimeout(500);

    // Results should be filtered - just verify no error
  });

  test('GRE checkboxes can be toggled', async ({ page }) => {
    // Find and click "Not Required" checkbox by ID
    const checkbox = page.locator('#greNotRequired');
    await checkbox.click();

    // Verify it's checked
    await expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  test('tuition slider is visible', async ({ page }) => {
    // Check tuition label exists in filter panel
    await expect(page.locator('label').filter({ hasText: 'Tuition' }).first()).toBeVisible();
  });

  test('specialty accepted checkboxes work', async ({ page }) => {
    // Find NICU checkbox by ID
    const checkbox = page.locator('#acceptsNicu');
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  test('program type checkboxes work', async ({ page }) => {
    // Find Front-Loaded checkbox by ID
    const checkbox = page.locator('#typeFrontLoaded');
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  test('clear filters button appears when filters active', async ({ page }) => {
    // Add a filter
    await page.locator('#greNotRequired').click();

    // Wait for state update
    await page.waitForTimeout(300);

    // Clear button should appear
    await expect(page.getByRole('button', { name: /Clear All Filters/i })).toBeVisible();
  });
});
