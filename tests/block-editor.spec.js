/**
 * BlockEditor Integration Tests
 *
 * Verifies Editor.js integration and core functionality.
 */

import { test, expect } from '@playwright/test';

test.describe('BlockEditor', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to LMS test page
    await page.goto('/lms-test');
  });

  test('should load Editor.js without critical errors', async ({ page }) => {
    // Check page loaded without JS errors
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.waitForTimeout(2000);

    // Filter out non-critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('Non-Error')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should render BlockEditor container', async ({ page }) => {
    // Wait for the BlockEditor container to be visible
    const editorContainer = page.locator('[data-testid="block-editor-container"]');
    await expect(editorContainer).toBeVisible({ timeout: 5000 });
  });

  test('should render EditorRenderer container with content', async ({ page }) => {
    // Wait for the EditorRenderer container
    const rendererContainer = page.locator('[data-testid="editor-renderer-container"]');
    await expect(rendererContainer).toBeVisible({ timeout: 5000 });

    // Check that rendered content appears
    await expect(rendererContainer.locator('h2')).toContainText('Sample Rendered Content');
    await expect(rendererContainer.locator('ul li')).toHaveCount(3);
  });

  test('should show save status indicator', async ({ page }) => {
    // Wait for the editor to initialize and show save status
    await page.waitForTimeout(1000);

    // Look for the save status in the BlockEditor
    const statusIndicator = page.locator('.block-editor').locator('text=/Saved|Unsaved|Saving/');
    await expect(statusIndicator).toBeVisible({ timeout: 5000 });
  });
});
