// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Integration Test: Login Flow
 *
 * Verifies that authentication works properly with mock fallback.
 * When Supabase is not configured (as in tests), the app uses MOCK_USER
 * from useAuth.jsx, allowing access to protected routes.
 *
 * Tests:
 * 1. Login page loads correctly
 * 2. Protected routes (dashboard) are accessible with mock auth
 * 3. User can navigate between authenticated pages
 * 4. Root redirects to dashboard (not login) with mock auth
 */

test.describe('Login Flow - Authentication', () => {
  test('login page loads with all required elements', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // Verify page title/heading
    await expect(page.getByRole('heading', { name: /The CRNA Club/i })).toBeVisible();

    // Verify login form elements
    await expect(page.getByText(/Sign in to your account/i)).toBeVisible();
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Enter your password/i)).toBeVisible();

    // Verify action buttons/links
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Sign up/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Forgot password/i })).toBeVisible();
  });

  test('register page is accessible', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');

    // Should not redirect - register should be accessible
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: /The CRNA Club/i })).toBeVisible();
  });

  test('can navigate from login to register', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // Click sign up link
    await page.getByRole('link', { name: /Sign up/i }).click();

    // Should navigate to register page
    await expect(page).toHaveURL(/\/register/);
  });

  test('dashboard is accessible with mock authentication', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // With mock auth enabled (Supabase disabled in playwright.config.js),
    // should stay on dashboard, not redirect to login
    await expect(page).toHaveURL(/\/dashboard/);

    // Wait for dashboard content to load (loading spinner to disappear)
    await page.waitForTimeout(2000);

    // Should see user name "Sarah" somewhere on the page (from mock user)
    // or the sidebar navigation indicating we're logged in
    const dashboardIndicators = [
      page.getByText(/Sarah/i),
      page.locator('[data-testid="user-menu"]'),
      page.getByRole('link', { name: /My Programs/i }),
      page.getByRole('link', { name: /My Trackers/i }),
    ];

    let isLoggedIn = false;
    for (const indicator of dashboardIndicators) {
      if (await indicator.count() > 0) {
        isLoggedIn = true;
        break;
      }
    }
    expect(isLoggedIn).toBe(true);
  });

  test('root path redirects to dashboard (not login) with mock auth', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // With mock auth, root should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('can navigate between protected pages with persistent auth', async ({ page }) => {
    // Start at dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to My Stats
    await page.goto('/my-stats');
    await expect(page).toHaveURL(/\/my-stats/);

    // Navigate to Trackers
    await page.goto('/trackers');
    await expect(page).toHaveURL(/\/trackers/);

    // Navigate to Schools
    await page.goto('/schools');
    await expect(page).toHaveURL(/\/schools/);

    // Navigate to Marketplace
    await page.goto('/marketplace');
    await expect(page).toHaveURL(/\/marketplace/);

    // All navigations successful - auth persisted throughout
  });
});

test.describe('Login Flow - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('login page renders correctly on mobile', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /The CRNA Club/i })).toBeVisible();
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('dashboard loads on mobile with mock auth', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/dashboard/);

    // Wait for dashboard content to load
    await page.waitForTimeout(2000);

    // On mobile, verify we're on the dashboard by checking for key elements
    // The user name or navigation elements should be present
    const mobileIndicators = [
      page.getByText(/Sarah/i),
      page.getByText(/Dashboard/i),
      page.locator('nav'),
    ];

    let isLoggedIn = false;
    for (const indicator of mobileIndicators) {
      if (await indicator.count() > 0) {
        isLoggedIn = true;
        break;
      }
    }
    expect(isLoggedIn).toBe(true);
  });
});
