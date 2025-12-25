/**
 * LMS Hooks Integration Tests
 *
 * Verifies that all LMS hooks correctly fetch data from Supabase.
 */

import { test, expect } from '@playwright/test';

test.describe('LMS Hooks', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the LMS test page
    await page.goto('/lms-test');
    // Wait for page to load
    await page.waitForSelector('[data-testid="test-summary"]');
  });

  test('should load all hooks without errors', async ({ page }) => {
    // Wait for all tests to complete (no more loading states)
    await page.waitForFunction(() => {
      const loadingElements = document.querySelectorAll('[data-status="loading"]');
      return loadingElements.length === 0;
    }, { timeout: 15000 });

    // Check that we have test results
    const summary = page.locator('[data-testid="test-summary"]');
    await expect(summary).toBeVisible();

    // Get passed count
    const passedBadge = page.locator('[data-testid="passed-count"]');
    const passedText = await passedBadge.textContent();
    const passedCount = parseInt(passedText.match(/\d+/)?.[0] || '0');

    // Should have at least 4 passing tests
    expect(passedCount).toBeGreaterThanOrEqual(4);
  });

  test('useCategories should return seeded categories', async ({ page }) => {
    // Wait for categories to load
    await page.waitForSelector('[data-testid="test-useCategories"][data-status="success"]', { timeout: 10000 });

    // Check categories data
    const categoriesData = page.locator('[data-testid="categories-data"]');
    const text = await categoriesData.textContent();

    // Should contain our seeded categories
    expect(text).toContain('pharmacology');
    expect(text).toContain('interview-prep');
  });

  test('useEntitlements should return seeded entitlements', async ({ page }) => {
    // Wait for entitlements to load
    await page.waitForSelector('[data-testid="test-useEntitlements"][data-status="success"]', { timeout: 10000 });

    // Check entitlements data
    const entitlementsData = page.locator('[data-testid="entitlements-data"]');
    const text = await entitlementsData.textContent();

    // Should contain our seeded entitlements
    expect(text).toContain('active_membership');
    expect(text).toContain('plan_apply_toolkit');
    expect(text).toContain('interviewing_toolkit');
  });

  test('useModules should load without error', async ({ page }) => {
    // Wait for modules hook to complete
    await page.waitForSelector('[data-testid="test-useModules"][data-status="success"]', { timeout: 10000 });

    // Verify it loaded (even if empty)
    const modulesTest = page.locator('[data-testid="test-useModules"]');
    await expect(modulesTest).toHaveAttribute('data-status', 'success');
  });

  test('useDownloads should load without error', async ({ page }) => {
    // Wait for downloads hook to complete
    await page.waitForSelector('[data-testid="test-useDownloads"][data-status="success"]', { timeout: 10000 });

    // Verify it loaded (even if empty)
    const downloadsTest = page.locator('[data-testid="test-useDownloads"]');
    await expect(downloadsTest).toHaveAttribute('data-status', 'success');
  });

  test('useImageUpload should initialize correctly', async ({ page }) => {
    // Wait for image upload hook test
    await page.waitForSelector('[data-testid="test-useImageUpload"][data-status="success"]', { timeout: 10000 });

    // Verify it initialized
    const imageUploadTest = page.locator('[data-testid="test-useImageUpload"]');
    await expect(imageUploadTest).toHaveAttribute('data-status', 'success');
  });
});
