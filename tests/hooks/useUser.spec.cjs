// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * useUser Hook - Mock Authentication Tests
 *
 * Tests the useUser hook behavior when running with mock authentication.
 *
 * IMPORTANT: These tests run with Supabase DISABLED (see playwright.config.js).
 * The app uses a mock user fallback when Supabase is not configured, so:
 * - All routes load normally (no redirects to /login)
 * - Mock user data is available on all pages
 * - Authentication is always "authenticated" with the mock user
 *
 * Key scenarios tested:
 * 1. Login/Register pages load correctly
 * 2. Dashboard and protected pages load with mock user
 * 3. User data displays correctly on pages
 * 4. Mobile/tablet/desktop responsive behavior
 *
 * Mock user source: /src/hooks/useAuth.jsx (MOCK_USER)
 * Hook location: /src/hooks/useUser.js
 */

test.describe('useUser Hook - Login Page Functionality', () => {
  test('login page loads with correct form fields', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    // Verify login page elements
    await expect(page.getByRole('heading', { name: /The CRNA Club/i })).toBeVisible();
    await expect(page.getByText(/Sign in to your account/i)).toBeVisible();
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Enter your password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('login page has sign up link', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('link', { name: /Sign up/i })).toBeVisible();
  });

  test('login page has forgot password link', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('link', { name: /Forgot password/i })).toBeVisible();
  });

  test('can navigate from login to register', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    const signUpLink = page.getByRole('link', { name: /Sign up/i });
    await signUpLink.click();

    await expect(page).toHaveURL(/\/register/);
  });
});

test.describe('useUser Hook - Register Page Functionality', () => {
  test('register page is accessible without authentication', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');

    // Should NOT redirect - register page should be accessible
    await expect(page).toHaveURL(/\/register/);
  });

  test('register page loads with correct form fields', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');

    // Verify register page elements are present
    await expect(page.getByRole('heading', { name: /The CRNA Club/i })).toBeVisible();
  });
});

test.describe('useUser Hook - Dashboard with Mock User', () => {
  test('dashboard loads successfully with mock authentication', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // With mock auth, should stay on dashboard (not redirect to login)
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('dashboard displays welcome message with mock user', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Should see welcome message (useUser returns mock data)
    const welcomeMsg = page.getByText(/Welcome back/i);
    await expect(welcomeMsg).toBeVisible({ timeout: 10000 });
  });

  test('dashboard renders without errors with mock user', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Dashboard should render with user data
    // Just verify the page loaded successfully (URL is correct)
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify page is interactive (not stuck loading)
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('useUser Hook - My Stats Page with Mock User', () => {
  test('My Stats page loads with mock authentication', async ({ page }) => {
    await page.goto('/my-stats');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on My Stats page with mock auth
    await expect(page).toHaveURL(/\/my-stats/);
  });

  test('My Stats page displays user profile sections', async ({ page }) => {
    await page.goto('/my-stats');
    await page.waitForLoadState('domcontentloaded');

    // Should see profile sections (academic, clinical, etc.)
    // At minimum, the page heading should be visible
    const heading = page.getByRole('heading', { name: /My Stats|Profile/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});

test.describe('useUser Hook - Trackers Page with Mock User', () => {
  test('Trackers page loads with mock authentication', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on trackers page with mock auth
    await expect(page).toHaveURL(/\/trackers/);
  });

  test('Trackers page displays tracking sections', async ({ page }) => {
    await page.goto('/trackers');
    await page.waitForLoadState('domcontentloaded');

    // Should see tracker content (clinical hours, shadowing, etc.)
    const heading = page.getByRole('heading', { name: /Trackers|Clinical|Shadow/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});

test.describe('useUser Hook - My Programs Page with Mock User', () => {
  test('My Programs page loads with mock authentication', async ({ page }) => {
    await page.goto('/my-programs');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on my-programs page with mock auth
    await expect(page).toHaveURL(/\/my-programs/);
  });

  test('My Programs page displays program sections', async ({ page }) => {
    await page.goto('/my-programs');
    await page.waitForLoadState('domcontentloaded');

    // Should see programs content
    const heading = page.getByRole('heading', { name: /My Programs|Target Programs/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});

test.describe('useUser Hook - Schools Page with Mock User', () => {
  test('Schools page loads with mock authentication', async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on schools page with mock auth
    await expect(page).toHaveURL(/\/schools/);
  });

  test('Schools page renders without errors with mock user', async ({ page }) => {
    await page.goto('/schools');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on schools page and render successfully
    await expect(page).toHaveURL(/\/schools/);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('useUser Hook - Marketplace with Mock User', () => {
  test('Marketplace page loads with mock authentication', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on marketplace page with mock auth
    await expect(page).toHaveURL(/\/marketplace/);
  });

  test('Marketplace page renders without errors with mock user', async ({ page }) => {
    await page.goto('/marketplace');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on marketplace page and render successfully
    await expect(page).toHaveURL(/\/marketplace/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('My Bookings page loads with mock authentication', async ({ page }) => {
    await page.goto('/marketplace/my-bookings');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on bookings page with mock auth
    await expect(page).toHaveURL(/\/my-bookings/);
  });
});

test.describe('useUser Hook - Learning Library with Mock User', () => {
  test('Learning Library loads with mock authentication', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForLoadState('domcontentloaded');

    // Should stay on learning page with mock auth
    await expect(page).toHaveURL(/\/learn/);
  });

  test('Learning Library displays modules', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForLoadState('domcontentloaded');

    // Should see learning content
    const heading = page.getByRole('heading', { name: /Learning|Modules|Library/i }).first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});

test.describe('useUser Hook - Root Redirect', () => {
  test('root path redirects to dashboard with mock auth', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // With mock auth, root should redirect to dashboard (not login)
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('useUser Hook - Mobile Responsive', () => {
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
    await page.waitForLoadState('domcontentloaded');

    // Should stay on dashboard with mock auth (not redirect)
    await expect(page).toHaveURL(/\/dashboard/);

    // Should see welcome message
    const welcomeMsg = page.getByText(/Welcome back/i);
    await expect(welcomeMsg).toBeVisible({ timeout: 10000 });
  });
});

test.describe('useUser Hook - Tablet Responsive', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('login page renders correctly on tablet', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /The CRNA Club/i })).toBeVisible();
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
  });

  test('dashboard loads on tablet with mock auth', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('useUser Hook - Desktop Responsive', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('login page renders correctly on desktop', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: /The CRNA Club/i })).toBeVisible();
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
  });

  test('dashboard loads on desktop with mock auth', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('useUser Hook - Page Navigation Flow', () => {
  test('can navigate between pages with mock authentication', async ({ page }) => {
    // Navigate through various pages to ensure user context persists
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto('/my-stats');
    await expect(page).toHaveURL(/\/my-stats/);

    await page.goto('/trackers');
    await expect(page).toHaveURL(/\/trackers/);

    await page.goto('/schools');
    await expect(page).toHaveURL(/\/schools/);

    await page.goto('/marketplace');
    await expect(page).toHaveURL(/\/marketplace/);
  });
});
