/**
 * Modules List Page Tests
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5176';

test.describe('Modules List Page', () => {
  test('shows mock modules in development', async ({ page }) => {
    // Listen to console for debug
    page.on('console', msg => {
      if (msg.text().includes('[Mock Mode]')) {
        console.log('CONSOLE:', msg.text());
      }
    });

    await page.goto(`${BASE_URL}/admin/modules`);
    await page.waitForLoadState('networkidle');

    // Should show modules list
    await page.waitForTimeout(3000);

    // Take screenshot first
    await page.screenshot({ path: 'test-results/modules-list-debug.png', fullPage: true });

    // Print visible text
    const bodyText = await page.locator('body').textContent();
    console.log('=== Page Text (first 500 chars) ===');
    console.log(bodyText.substring(0, 500));

    // Should have stats cards
    const totalModules = page.getByText('Total Modules');
    await expect(totalModules).toBeVisible();

    // Check what number is shown
    const statsText = await page.locator('body').textContent();
    const totalMatch = statsText.match(/Total Modules\s*(\d+)/);
    console.log('Total Modules count:', totalMatch?.[1] || 'not found');
  });
});
