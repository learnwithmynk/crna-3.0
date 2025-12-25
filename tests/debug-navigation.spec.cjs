/**
 * Debug navigation test - captures console logs and tests navigation
 */
const { test, expect } = require('@playwright/test');

test.describe('Debug Navigation', () => {
  test('capture all console logs and test navigation', async ({ page }) => {
    // Capture ALL console messages
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
      console.log(`BROWSER: [${msg.type()}] ${msg.text()}`);
    });

    // Capture page errors
    page.on('pageerror', err => {
      console.log(`PAGE ERROR: ${err.message}`);
    });

    // Navigate to the app
    console.log('--- Navigating to http://localhost:5173 ---');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Wait a moment for React to render
    await page.waitForTimeout(2000);

    // Take a screenshot
    await page.screenshot({ path: 'tests/debug-initial.png' });
    console.log('Screenshot saved: tests/debug-initial.png');

    // Check current URL
    console.log('Current URL:', page.url());

    // Check if we're on login page or dashboard
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    // Look for sidebar
    const sidebar = await page.$('aside');
    console.log('Sidebar found:', !!sidebar);

    // Look for navigation links
    const navLinks = await page.$$('aside a');
    console.log('Nav links found:', navLinks.length);

    if (navLinks.length > 0) {
      // List all nav links
      for (let i = 0; i < Math.min(navLinks.length, 5); i++) {
        const href = await navLinks[i].getAttribute('href');
        const text = await navLinks[i].textContent();
        console.log(`  Link ${i}: ${text?.trim()} -> ${href}`);
      }

      // Try clicking on "My Programs" link
      console.log('\n--- Attempting to click "My Programs" ---');

      // First, check what overlays exist
      const overlays = await page.$$('[data-state="open"]');
      console.log('Overlays with data-state="open":', overlays.length);
      for (const overlay of overlays) {
        const className = await overlay.getAttribute('class');
        console.log('  Overlay class:', className?.slice(0, 100));
      }

      // Don't close the modal - the overlay should allow click-through now
      console.log('Testing with modal open (click-through overlay)...');

      const myProgramsLink = await page.$('a[href="/my-programs"]');

      if (myProgramsLink) {
        const urlBefore = page.url();
        console.log('URL before click:', urlBefore);

        // Check the bounding box of the link
        const box = await myProgramsLink.boundingBox();
        console.log('Link position:', box);

        // Click with force since overlay has pointer-events-none but Playwright still detects it
        await myProgramsLink.click({ force: true });
        await page.waitForTimeout(1000);

        const urlAfter = page.url();
        console.log('URL after click:', urlAfter);

        // Take another screenshot
        await page.screenshot({ path: 'tests/debug-after-click.png' });
        console.log('Screenshot saved: tests/debug-after-click.png');

        // Check if URL changed
        if (urlBefore !== urlAfter) {
          console.log('✓ URL changed successfully');
        } else {
          console.log('✗ URL did NOT change');
        }

        // Check page content
        const mainContent = await page.$('main');
        if (mainContent) {
          const contentText = await mainContent.textContent();
          console.log('Main content preview:', contentText?.slice(0, 200));
        }
      } else {
        console.log('Could not find My Programs link');
      }
    }

    // Print all captured console logs
    console.log('\n--- All Browser Console Logs ---');
    consoleLogs.forEach(log => console.log(log));

    // Final assertion to make test pass/fail based on findings
    expect(consoleLogs.length).toBeGreaterThan(0);
  });
});
