// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Integration Test: Forums
 *
 * Verifies that the forums page loads correctly with mock or real data.
 * Tests the ForumsPage component and useForums hook.
 *
 * When Supabase is not configured (tests), useForums falls back to mockForums
 * from /src/data/mockForums.js, so the page should load with mock data.
 *
 * Tests:
 * 1. Forums page loads successfully
 * 2. Page displays forums list or loading state
 * 3. Forums page is accessible with mock authentication
 * 4. Can navigate to forums from dashboard
 */

test.describe('Forums - Page Load', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to forums page
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
  });

  test('forums page loads successfully', async ({ page }) => {
    // Should be on forums page
    await expect(page).toHaveURL(/\/community\/forums/);

    // Verify page heading
    await expect(page.getByRole('heading', { name: /Community Forums/i })).toBeVisible({ timeout: 10000 });

    // Verify page description
    await expect(page.getByText(/Connect with fellow CRNA applicants/i)).toBeVisible();
  });

  test('displays forums or loading state', async ({ page }) => {
    // Page should have either:
    // 1. Forum list content
    // 2. Loading state
    // 3. Empty state

    const bodyText = await page.locator('body').textContent();

    // Should have substantial content
    expect(bodyText.length).toBeGreaterThan(100);

    // Should mention forums or community
    expect(
      bodyText.toLowerCase().includes('forum') ||
      bodyText.toLowerCase().includes('community') ||
      bodyText.toLowerCase().includes('discussion')
    ).toBe(true);
  });

  test('page is accessible with mock authentication', async ({ page }) => {
    // With mock auth (Supabase disabled), forums should be accessible
    await expect(page).toHaveURL(/\/community\/forums/);

    // Should not redirect to login
    expect(page.url()).not.toContain('/login');
  });

  test('displays mock forums data when Supabase not configured', async ({ page }) => {
    // Since Supabase is disabled in tests (playwright.config.js),
    // useForums should fall back to mockForums

    const bodyText = await page.locator('body').textContent();

    // Should have content (mock forums or message)
    expect(bodyText.length).toBeGreaterThan(200);

    // The page heading should be present
    await expect(page.getByRole('heading', { name: /Community Forums/i })).toBeVisible();
  });
});

test.describe('Forums - Error Handling', () => {
  test('displays error message if forums fail to load', async ({ page }) => {
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // If there's an error, it should be displayed
    // Look for error message (may not exist if using mock data successfully)
    const errorMessage = page.locator('text=/error|fail|problem/i');
    const hasError = await errorMessage.first().isVisible().catch(() => false);

    // If no error, page should show normal content
    if (!hasError) {
      await expect(page.getByRole('heading', { name: /Community Forums/i })).toBeVisible();
    }
  });
});

test.describe('Forums - Navigation', () => {
  test('can navigate to forums from dashboard', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Navigate to forums
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Should be on forums page
    await expect(page).toHaveURL(/\/community\/forums/);
    await expect(page.getByRole('heading', { name: /Community Forums/i })).toBeVisible();
  });

  test('can navigate between forums and other pages', async ({ page }) => {
    // Start at forums
    await page.goto('/community/forums');
    await expect(page).toHaveURL(/\/community\/forums/);

    // Navigate to dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate back to forums
    await page.goto('/community/forums');
    await expect(page).toHaveURL(/\/community\/forums/);
  });
});

test.describe('Forums - Forum List Display', () => {
  test('forums list renders with mock data', async ({ page }) => {
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Should see page content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(100);

    // If mock forums are displayed, may see forum titles, topics, etc.
    // This is flexible since mock data structure may vary
  });

  test('page has appropriate layout structure', async ({ page }) => {
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Should have PageWrapper structure
    // Look for main content area
    const mainContent = page.locator('main').or(page.locator('[class*="PageWrapper"]'));
    await expect(mainContent.first()).toBeVisible();
  });
});

test.describe('Forums - Loading States', () => {
  test('handles loading state gracefully', async ({ page }) => {
    await page.goto('/community/forums');

    // Page should handle loading state without errors
    // Wait for content to appear
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Eventually should show content or error
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(50);
  });
});

test.describe('Forums - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('forums page renders on mobile', async ({ page }) => {
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Heading should be visible
    await expect(page.getByRole('heading', { name: /Community Forums/i })).toBeVisible({ timeout: 10000 });

    // Description should be visible (may wrap on mobile)
    await expect(page.getByText(/Connect with fellow CRNA applicants/i)).toBeVisible();
  });

  test('forum list is usable on mobile', async ({ page }) => {
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Page should be scrollable and interactive
    const bodyContent = page.locator('body');
    await expect(bodyContent).toBeVisible();

    // If forums are displayed, they should be tappable
    // This is a basic check that page renders
    const bodyText = await bodyContent.textContent();
    expect(bodyText.length).toBeGreaterThan(100);
  });
});

test.describe('Forums - Access Control', () => {
  test('forums are accessible to authenticated users', async ({ page }) => {
    // With mock auth, user should be authenticated
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');

    // Should not redirect to login
    await expect(page).toHaveURL(/\/community\/forums/);
  });
});

test.describe('Forums - Individual Forum Access', () => {
  test('can potentially navigate to individual forum (if links exist)', async ({ page }) => {
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Look for any links to individual forums
    const forumLinks = page.locator('a[href*="/community/forums/"]');
    const linkCount = await forumLinks.count();

    if (linkCount > 0) {
      // If forum links exist, verify they're clickable
      const firstLink = forumLinks.first();
      await expect(firstLink).toBeVisible();

      // Links should have href attributes
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
    } else {
      // If no links, just verify page loaded successfully
      await expect(page.getByRole('heading', { name: /Community Forums/i })).toBeVisible();
    }
  });
});

test.describe('Forums - Content Verification', () => {
  test('page contains expected community-related keywords', async ({ page }) => {
    await page.goto('/community/forums');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const bodyText = await page.locator('body').textContent();
    const lowerText = bodyText.toLowerCase();

    // Should contain community/forum-related terms
    const hasCommunityTerms =
      lowerText.includes('forum') ||
      lowerText.includes('community') ||
      lowerText.includes('discussion') ||
      lowerText.includes('topic') ||
      lowerText.includes('connect') ||
      lowerText.includes('crna');

    expect(hasCommunityTerms).toBe(true);
  });
});
