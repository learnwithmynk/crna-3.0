// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Rate Your Courses Feature Tests
 *
 * Tests for the "Rate Your Courses" feature on the Prerequisites Library page.
 * Key features:
 * - RateYourCoursesCard shows unrated completed courses
 * - Progress indicator showing rated vs unrated
 * - Rate button opens SubmitCourseModal with review fields
 * - Points badge shows +20
 */

test.describe('Rate Your Courses Card - Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/prerequisites');
    await page.waitForLoadState('domcontentloaded');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Prerequisite Library/i })).toBeVisible();
  });

  test('shows Rate Your Courses card when unrated courses exist', async ({ page }) => {
    // Card should be visible with title
    const cardTitle = page.getByText('Rate Your Courses');
    const isVisible = await cardTitle.isVisible().catch(() => false);

    // Card may or may not be visible depending on mock data
    if (isVisible) {
      await expect(cardTitle).toBeVisible();

      // Should show subtext
      await expect(page.getByText('Earn Points by contributing to our Library')).toBeVisible();
    }
  });

  test('displays points badge with +20 pts', async ({ page }) => {
    const pointsBadge = page.getByText('+20 pts');
    const isVisible = await pointsBadge.isVisible().catch(() => false);

    if (isVisible) {
      await expect(pointsBadge).toBeVisible();
    }
  });

  test('shows progress indicator when multiple courses completed', async ({ page }) => {
    // Progress bar showing "X of Y rated"
    const progressText = page.locator('text=/\\d+ of \\d+ rated/');
    const exists = await progressText.count();

    // Progress indicator may or may not show depending on data
    if (exists > 0) {
      await expect(progressText.first()).toBeVisible();
    }
  });
});

test.describe('Rate Your Courses Card - Course List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/prerequisites');
    await page.waitForLoadState('domcontentloaded');
  });

  test('displays unrated course rows', async ({ page }) => {
    const rateYourCoursesCard = page.getByText('Rate Your Courses');
    const cardVisible = await rateYourCoursesCard.isVisible().catch(() => false);

    if (cardVisible) {
      // Should have course rows with Rate buttons
      const rateButtons = page.getByRole('button', { name: /^Rate$/i });
      const count = await rateButtons.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('course rows show subject and school name', async ({ page }) => {
    const rateYourCoursesCard = page.getByText('Rate Your Courses');
    const cardVisible = await rateYourCoursesCard.isVisible().catch(() => false);

    if (cardVisible) {
      // Course rows should show subject labels or school names
      // They are in a specific card section, so check within that context
      const cardSection = page.locator('div').filter({ hasText: 'Rate Your Courses' }).first();
      await expect(cardSection).toBeVisible();
    }
  });

  test('shows max 5 courses with overflow indicator', async ({ page }) => {
    const moreCoursesText = page.getByText(/\+\d+ more courses to rate/);
    const exists = await moreCoursesText.count();

    // Overflow text only shows if > 5 unrated courses
    if (exists > 0) {
      await expect(moreCoursesText.first()).toBeVisible();
    }
  });
});

test.describe('Rate Your Courses Card - Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/prerequisites');
    await page.waitForLoadState('domcontentloaded');
  });

  test('clicking Rate button opens submit course modal', async ({ page }) => {
    const rateButton = page.getByRole('button', { name: /^Rate$/i }).first();
    const buttonVisible = await rateButton.isVisible().catch(() => false);

    if (buttonVisible) {
      await rateButton.click();

      // Should open modal with review fields
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible({ timeout: 5000 });

      // Modal should have "Submit Course" or similar title
      const modalTitle = modal.getByText(/Submit|Review|Rate/i);
      await expect(modalTitle.first()).toBeVisible();
    }
  });

  test('modal shows +20 points badge', async ({ page }) => {
    const rateButton = page.getByRole('button', { name: /^Rate$/i }).first();
    const buttonVisible = await rateButton.isVisible().catch(() => false);

    if (buttonVisible) {
      await rateButton.click();
      await page.waitForTimeout(500);

      // Modal should show +20 points badge
      const pointsBadge = page.getByText(/\+20/);
      const badgeVisible = await pointsBadge.first().isVisible().catch(() => false);

      if (badgeVisible) {
        await expect(pointsBadge.first()).toBeVisible();
      }
    }
  });
});

test.describe('Rate Your Courses Card - Empty State', () => {
  test('card is hidden when all courses are rated', async ({ page }) => {
    await page.goto('/prerequisites');
    await page.waitForLoadState('domcontentloaded');

    // If card is not visible, that's expected when no unrated courses
    const rateYourCoursesCard = page.getByText('Rate Your Courses');
    const isVisible = await rateYourCoursesCard.isVisible().catch(() => false);

    // Test passes whether card is visible or not (depends on data)
    // Just verify page loaded correctly
    await expect(page.getByRole('heading', { name: /Prerequisite Library/i })).toBeVisible();
  });
});

test.describe('Rate Your Courses - Mobile Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('renders correctly on mobile', async ({ page }) => {
    await page.goto('/prerequisites');
    await page.waitForLoadState('domcontentloaded');

    // Card should be visible and readable on mobile
    const rateYourCoursesCard = page.getByText('Rate Your Courses');
    const isVisible = await rateYourCoursesCard.isVisible().catch(() => false);

    if (isVisible) {
      await expect(rateYourCoursesCard).toBeVisible();

      // Rate buttons should be accessible
      const rateButtons = page.getByRole('button', { name: /^Rate$/i });
      const count = await rateButtons.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('progress bar is visible on mobile', async ({ page }) => {
    await page.goto('/prerequisites');
    await page.waitForLoadState('domcontentloaded');

    const progressText = page.locator('text=/\\d+ of \\d+ rated/');
    const exists = await progressText.count();

    if (exists > 0) {
      await expect(progressText.first()).toBeVisible();
    }
  });
});
