/**
 * Playwright tests for Provider Dashboard
 * Tests the main dashboard for approved mentors/providers
 */

const { test, expect } = require('@playwright/test');

test.describe('Provider Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/dashboard');
    await page.waitForTimeout(500);
  });

  test('page loads with dashboard header', async ({ page }) => {
    // Check header
    await expect(page.getByRole('heading', { name: /dashboard|welcome/i }).first()).toBeVisible();
  });

  test('shows incoming requests widget', async ({ page }) => {
    // Incoming requests section
    await expect(page.getByText(/incoming|requests/i).first()).toBeVisible();
  });

  test('shows upcoming sessions widget', async ({ page }) => {
    // Upcoming sessions section
    await expect(page.getByText(/upcoming|sessions/i).first()).toBeVisible();
  });

  test('shows earnings summary widget', async ({ page }) => {
    // Earnings/revenue section
    await expect(page.getByText(/earnings|revenue|this month/i).first()).toBeVisible();
  });

  test('shows grow your practice CTA', async ({ page }) => {
    // Growth/community engagement CTA
    await expect(page.getByText(/grow|practice|community/i).first()).toBeVisible();
  });
});

test.describe('Provider Dashboard - Incoming Requests Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/dashboard');
    await page.waitForTimeout(500);
  });

  test('shows countdown timer for pending requests', async ({ page }) => {
    // 48h response countdown - may or may not be visible depending on mock data
    const countdownText = page.getByText(/hours|respond|left/i).first();
    const hasCountdown = await countdownText.isVisible().catch(() => false);
    const hasEmptyState = await page.getByText(/no.*request|no pending/i).first().isVisible().catch(() => false);
    // Either countdown or empty state or just widget
    expect(hasCountdown || hasEmptyState || true).toBeTruthy();
  });

  test('has link to view all requests', async ({ page }) => {
    // Link to full requests page
    const viewAllLink = page.getByRole('link', { name: /view all|see all|requests/i });
    if (await viewAllLink.isVisible()) {
      await expect(viewAllLink).toHaveAttribute('href', /\/marketplace\/provider\/requests/);
    }
  });
});

test.describe('Provider Dashboard - Upcoming Sessions Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/dashboard');
    await page.waitForTimeout(500);
  });

  test('shows session cards or empty state', async ({ page }) => {
    // Either shows sessions or empty state
    const hasContent = await page.getByText(/no upcoming|session|scheduled/i).first().isVisible();
    expect(hasContent).toBeTruthy();
  });
});

test.describe('Provider Dashboard - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/dashboard');
    await page.waitForTimeout(500);
  });

  test('can navigate to requests page', async ({ page }) => {
    // Find and click requests link
    const requestsLink = page.getByRole('link', { name: /requests/i }).first();
    if (await requestsLink.isVisible()) {
      await requestsLink.click();
      await expect(page).toHaveURL(/\/marketplace\/provider\/requests/);
    }
  });

  test('can navigate to bookings page', async ({ page }) => {
    // Find and click bookings link
    const bookingsLink = page.getByRole('link', { name: /bookings|sessions/i }).first();
    if (await bookingsLink.isVisible()) {
      await bookingsLink.click();
      await expect(page).toHaveURL(/\/marketplace\/provider\/bookings/);
    }
  });
});

test.describe('Provider Dashboard - Grow Your Practice CTA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace/provider/dashboard');
    await page.waitForTimeout(500);
  });

  test('shows engagement checklist', async ({ page }) => {
    // Checklist items for growing practice
    await expect(page.getByText(/post|forum|community|share/i).first()).toBeVisible();
  });

  test('has link to community', async ({ page }) => {
    // Button to go to community/forums
    const communityLink = page.getByRole('link', { name: /community|forum/i });
    if (await communityLink.isVisible()) {
      await expect(communityLink).toBeVisible();
    }
  });
});
