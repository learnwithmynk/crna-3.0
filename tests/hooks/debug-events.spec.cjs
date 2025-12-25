// @ts-check
const { test, expect } = require('@playwright/test');

test('debug events page', async ({ page }) => {
  await page.goto('/events');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'events-debug.png', fullPage: true });

  // Log page title
  console.log('Page title:', await page.title());

  // Log main content
  const bodyText = await page.locator('body').textContent();
  console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));

  // Check if there's a heading
  const headings = await page.locator('h1, h2').allTextContents();
  console.log('Headings found:', headings);
});
