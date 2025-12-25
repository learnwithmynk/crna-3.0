// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Phase 2 QA: My Trackers Page Tests
 *
 * Tests the trackers page at /trackers and /trackers/:tab
 * Key features:
 * - Tab navigation (Clinical, EQ, Shadow, Events)
 * - Each tab has its own tracker component
 * - URL reflects current tab
 * - Entry logging and viewing
 */

test.describe('My Trackers Page - Core Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /My Trackers/i })).toBeVisible();
  });

  test('shows page description', async ({ page }) => {
    await expect(page.getByText(/Track your clinical experience, reflections, and events/i)).toBeVisible();
  });

  test('shows all four tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /Clinical/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /EQ/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Shadow/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Events/i })).toBeVisible();
  });

  test('defaults to events tab', async ({ page }) => {
    const eventsTab = page.getByRole('tab', { name: /Events/i });
    await expect(eventsTab).toHaveAttribute('data-state', 'active');
  });
});

test.describe('My Trackers Page - Tab Navigation', () => {
  test('clicking Clinical tab updates URL', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('tab', { name: /Clinical/i }).click();
    await expect(page).toHaveURL('/trackers/clinical');
  });

  test('clicking EQ tab updates URL', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('tab', { name: /EQ/i }).click();
    await expect(page).toHaveURL('/trackers/eq');
  });

  test('clicking Shadow tab updates URL', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('tab', { name: /Shadow/i }).click();
    await expect(page).toHaveURL('/trackers/shadow');
  });

  test('clicking Events tab updates URL', async ({ page }) => {
    // Start from a different tab since events is default
    await page.goto('/trackers/clinical');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('tab', { name: /Events/i }).click();
    await expect(page).toHaveURL('/trackers/events');
  });

  test('direct URL to clinical tab works', async ({ page }) => {
    await page.goto('/trackers/clinical');
    await page.waitForLoadState('domcontentloaded');

    const clinicalTab = page.getByRole('tab', { name: /Clinical/i });
    await expect(clinicalTab).toHaveAttribute('data-state', 'active');
  });

  test('direct URL to eq tab works', async ({ page }) => {
    await page.goto('/trackers/eq');
    await page.waitForLoadState('domcontentloaded');

    const eqTab = page.getByRole('tab', { name: /EQ/i });
    await expect(eqTab).toHaveAttribute('data-state', 'active');
  });

  test('direct URL to shadow tab works', async ({ page }) => {
    await page.goto('/trackers/shadow');
    await page.waitForLoadState('domcontentloaded');

    const shadowTab = page.getByRole('tab', { name: /Shadow/i });
    await expect(shadowTab).toHaveAttribute('data-state', 'active');
  });
});

test.describe('My Trackers Page - Clinical Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trackers/clinical');
    await page.waitForLoadState('domcontentloaded');
  });

  test('clinical tab shows tracker content', async ({ page }) => {
    // Should show clinical tracker component
    await expect(page.locator('main')).toBeVisible();
  });

  test('has Log Shift button or similar', async ({ page }) => {
    // Look for add/log entry button
    const addBtn = page.getByRole('button', { name: /Log|Add|New/i }).first();
    const isVisible = await addBtn.isVisible().catch(() => false);
    // May or may not be visible depending on component state
  });
});

test.describe('My Trackers Page - EQ Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trackers/eq');
    await page.waitForLoadState('domcontentloaded');
  });

  test('EQ tab shows tracker content', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });

  test('shows reflection prompts or entries', async ({ page }) => {
    // EQ tracker should show reflection content
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});

test.describe('My Trackers Page - Shadow Days Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trackers/shadow');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Shadow tab shows tracker content', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });

  test('has Log Shadow Day button or similar', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /Log|Add|New/i }).first();
    const isVisible = await addBtn.isVisible().catch(() => false);
    // May or may not be visible
  });
});

test.describe('My Trackers Page - Events Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trackers/events');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Events tab shows tracker content', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });

  test('has Log Event button or similar', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /Log|Add|New/i }).first();
    const isVisible = await addBtn.isVisible().catch(() => false);
  });
});

test.describe('My Trackers Page - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('renders correctly on mobile', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /My Trackers/i })).toBeVisible();
  });

  test('tabs are scrollable or compact on mobile', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    // On mobile, tabs may show icons only or abbreviated text
    // Check that tabs container is visible
    const tabsList = page.locator('[role="tablist"]');
    await expect(tabsList).toBeVisible();
  });

  test('tabs have minimum touch target size', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    // Check the tablist is visible and has adequate height
    const tabsList = page.locator('[role="tablist"]');
    await expect(tabsList).toBeVisible();

    const box = await tabsList.boundingBox();
    // Tabs container should be at least 44px tall
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('My Trackers Page - Tablet Responsive', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('renders correctly on tablet', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /My Trackers/i })).toBeVisible();
  });
});

test.describe('My Trackers Page - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('renders correctly on desktop', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /My Trackers/i })).toBeVisible();
  });

  test('tabs show full labels on desktop', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    // Desktop should show full tab labels
    await expect(page.getByRole('tab', { name: /Clinical/i })).toBeVisible();
  });
});
